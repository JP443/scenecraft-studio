// SceneCraft — Anthropic API proxy with Firebase auth, tier-based quota, rate limit.
// Verifies the caller's Firebase ID token, checks their monthly token quota and
// per-minute request rate, streams Anthropic SSE back to the browser, then debits
// actual usage on completion.

import admin from 'firebase-admin';

export const config = { runtime: 'nodejs' };

// Tier → monthly token allowance. Override per-user by setting
// users/{uid}.monthlyQuota explicitly, or change tier via the billing webhook.
const TIER_QUOTAS = {
  free: parseInt(process.env.FREE_TIER_QUOTA || '50000', 10),
  pro: parseInt(process.env.PRO_TIER_QUOTA || '2000000', 10),
  unlimited: 1e12,
};

// Per-minute request rate limit per user. Stops a single user from issuing
// hundreds of calls/minute even if they have quota left.
const RATE_LIMIT_PER_MIN = parseInt(process.env.RATE_LIMIT_PER_MIN || '20', 10);

const REQUIRE_VERIFIED_EMAIL = String(process.env.REQUIRE_VERIFIED_EMAIL || 'true') !== 'false';

let adminApp;
function getAdmin() {
  if (adminApp) return adminApp;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT env var is missing');
  const creds = JSON.parse(raw);
  if (typeof creds.private_key === 'string') creds.private_key = creds.private_key.replace(/\\n/g, '\n');
  adminApp = admin.initializeApp({ credential: admin.credential.cert(creds) });
  return adminApp;
}

function periodKey(now = new Date()) {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}
function minuteKey(now = new Date()) {
  return Math.floor(now.getTime() / 60000);
}

async function verifyAuth(req) {
  const header = req.headers['authorization'] || req.headers['Authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return { error: 'Sign in required', status: 401 };
  }
  const idToken = header.slice('Bearer '.length).trim();
  try {
    getAdmin();
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (REQUIRE_VERIFIED_EMAIL && decoded.firebase?.sign_in_provider === 'password' && !decoded.email_verified) {
      return { error: 'Please verify your email address before using AI features. Check your inbox for the verification link.', status: 403 };
    }
    return { uid: decoded.uid, email: decoded.email || null, providers: decoded.firebase?.identities || {} };
  } catch (err) {
    return { error: 'Invalid or expired session: ' + err.message, status: 401 };
  }
}

function quotaForTier(tier, explicit) {
  if (typeof explicit === 'number' && explicit > 0) return explicit;
  return TIER_QUOTAS[tier] ?? TIER_QUOTAS.free;
}

async function checkAndReserveQuota(uid) {
  const db = admin.firestore();
  const userRef = db.collection('users').doc(uid);
  const period = periodKey();
  const minute = minuteKey();

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const data = snap.exists ? snap.data() : {};
    const tier = data.tier || 'free';
    const quota = quotaForTier(tier, data.monthlyQuota);
    const used = data.periodKey === period && typeof data.usedThisMonth === 'number' ? data.usedThisMonth : 0;

    if (used >= quota) {
      return { allowed: false, reason: 'quota', used, quota, tier, period };
    }

    // Per-minute rate limit (sliding window approximation by tracking the
    // current minute bucket and a count). Resets when the minute key changes.
    const rateMinute = data.rateMinute === minute ? (data.rateCount || 0) : 0;
    if (rateMinute >= RATE_LIMIT_PER_MIN) {
      return { allowed: false, reason: 'rate', used, quota, tier, period, rateLimit: RATE_LIMIT_PER_MIN };
    }

    const update = {
      tier,
      monthlyQuota: data.monthlyQuota || quota,
      periodKey: period,
      usedThisMonth: used,
      rateMinute: minute,
      rateCount: rateMinute + 1,
      lastSeenAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (!snap.exists) update.createdAt = admin.firestore.FieldValue.serverTimestamp();
    tx.set(userRef, update, { merge: true });
    return { allowed: true, used, quota, tier, period };
  });
}

async function debitUsage(uid, period, tokens) {
  if (!tokens || tokens <= 0) return;
  const db = admin.firestore();
  const userRef = db.collection('users').doc(uid);
  await userRef.set({
    periodKey: period,
    usedThisMonth: admin.firestore.FieldValue.increment(tokens),
    lastUsageAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY' });
    return;
  }

  const auth = await verifyAuth(req);
  if (auth.error) {
    res.status(auth.status).json({ error: auth.error });
    return;
  }

  let quotaCheck;
  try {
    quotaCheck = await checkAndReserveQuota(auth.uid);
  } catch (err) {
    res.status(500).json({ error: 'Quota lookup failed: ' + err.message });
    return;
  }
  if (!quotaCheck.allowed) {
    if (quotaCheck.reason === 'rate') {
      res.status(429).json({
        error: `Slow down — ${quotaCheck.rateLimit} requests/minute is the cap. Try again in a few seconds.`,
        retryAfterSeconds: 30,
      });
    } else {
      res.status(429).json({
        error: `Monthly quota reached (${quotaCheck.used.toLocaleString()} / ${quotaCheck.quota.toLocaleString()} tokens on the ${quotaCheck.tier} tier). Resets next month.`,
        quota: quotaCheck,
      });
    }
    return;
  }

  const body = req.body || {};
  const {
    system,
    messages,
    max_tokens = 2000,
    model = 'claude-sonnet-4-20250514',
  } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages[] required' });
    return;
  }

  let upstream;
  try {
    upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model, max_tokens, stream: true, system, messages }),
    });
  } catch (err) {
    res.status(502).json({ error: 'Upstream fetch failed: ' + err.message });
    return;
  }

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => '');
    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = null; }
    const msg = parsed?.error?.message || text || `Upstream error ${upstream.status}`;
    res.status(upstream.status).json({ error: msg });
    return;
  }

  res.status(200);
  res.setHeader('content-type', upstream.headers.get('content-type') || 'text/event-stream');
  res.setHeader('cache-control', 'no-cache, no-transform');
  res.setHeader('x-accel-buffering', 'no');

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let leftover = '';
  let inputTokens = 0;
  let outputTokens = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));

      leftover += decoder.decode(value, { stream: true });
      const lines = leftover.split('\n');
      leftover = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;
        try {
          const evt = JSON.parse(payload);
          if (evt.type === 'message_start' && evt.message?.usage?.input_tokens) {
            inputTokens = evt.message.usage.input_tokens;
          }
          if (evt.type === 'message_delta' && evt.usage?.output_tokens) {
            outputTokens = evt.usage.output_tokens;
          }
        } catch { /* tolerate partial events */ }
      }
    }
  } catch (err) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
  } finally {
    res.end();
    const total = (inputTokens || 0) + (outputTokens || 0);
    if (total > 0) {
      debitUsage(auth.uid, quotaCheck.period, total).catch(() => { /* best-effort */ });
    }
  }
}
