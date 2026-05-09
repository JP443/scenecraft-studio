import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(__dirname));

// ── FIREBASE ADMIN ──
// Initialized lazily so the server still boots if you haven't pasted the
// service account yet. Auth-protected routes will return a clear 503.
let adminApp = null;
let adminInitError = null;
function getAdmin() {
  if (adminApp) return adminApp;
  if (adminInitError) throw adminInitError;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    adminInitError = new Error('FIREBASE_SERVICE_ACCOUNT env var is missing. Paste the service account JSON into .env to enable auth.');
    throw adminInitError;
  }
  try {
    const creds = JSON.parse(raw);
    if (typeof creds.private_key === 'string') {
      creds.private_key = creds.private_key.replace(/\\n/g, '\n');
    }
    adminApp = admin.initializeApp({ credential: admin.credential.cert(creds) });
    return adminApp;
  } catch (err) {
    adminInitError = new Error('FIREBASE_SERVICE_ACCOUNT is not valid JSON: ' + err.message);
    throw adminInitError;
  }
}

const TIER_QUOTAS = {
  free: parseInt(process.env.FREE_TIER_QUOTA || '50000', 10),
  pro: parseInt(process.env.PRO_TIER_QUOTA || '2000000', 10),
  unlimited: 1e12,
};
const RATE_LIMIT_PER_MIN = parseInt(process.env.RATE_LIMIT_PER_MIN || '20', 10);

function periodKey(now = new Date()) {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}
function minuteKey(now = new Date()) {
  return Math.floor(now.getTime() / 60000);
}
function quotaForTier(tier, explicit) {
  if (typeof explicit === 'number' && explicit > 0) return explicit;
  return TIER_QUOTAS[tier] ?? TIER_QUOTAS.free;
}

async function verifyAuth(req) {
  const header = req.headers['authorization'] || req.headers['Authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return { error: 'Sign in required.', status: 401 };
  }
  const idToken = header.slice('Bearer '.length).trim();
  try {
    getAdmin();
    const decoded = await admin.auth().verifyIdToken(idToken);
    return { uid: decoded.uid, email: decoded.email || null };
  } catch (err) {
    return { error: 'Invalid or expired session: ' + err.message, status: 401 };
  }
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

// ── HEALTH CHECK ──
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    apiKeyConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
    authConfigured: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT),
    time: new Date().toISOString(),
  });
});

// ── ANTHROPIC API PROXY (auth + quota + streaming) ──
app.post('/api/claude', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on the server. Set ANTHROPIC_API_KEY in your environment.' });
  }

  const auth = await verifyAuth(req);
  if (auth.error) {
    return res.status(auth.status).json({ error: auth.error });
  }

  let quotaCheck;
  try {
    quotaCheck = await checkAndReserveQuota(auth.uid);
  } catch (err) {
    return res.status(500).json({ error: 'Quota lookup failed: ' + err.message });
  }
  if (!quotaCheck.allowed) {
    if (quotaCheck.reason === 'rate') {
      return res.status(429).json({
        error: `Slow down — ${quotaCheck.rateLimit} requests/minute is the cap. Try again in a few seconds.`,
        retryAfterSeconds: 30,
      });
    }
    return res.status(429).json({
      error: `Monthly quota reached (${quotaCheck.used.toLocaleString()} / ${quotaCheck.quota.toLocaleString()} tokens on the ${quotaCheck.tier} tier). Resets next month.`,
      quota: quotaCheck,
    });
  }

  const body = req.body || {};
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return res.status(400).json({ error: 'messages[] is required.' });
  }
  if (!body.model) body.model = 'claude-sonnet-4-5';
  if (typeof body.max_tokens !== 'number') body.max_tokens = 2000;
  body.stream = true;

  let upstream;
  try {
    upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error('Proxy fetch error:', err);
    return res.status(502).json({ error: 'Failed to reach Anthropic API: ' + err.message });
  }

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => '');
    let parsed = null;
    try { parsed = JSON.parse(text); } catch {}
    const message = parsed?.error?.message || parsed?.error || text || ('Upstream error ' + upstream.status);
    return res.status(upstream.status).json({ error: typeof message === 'string' ? message : JSON.stringify(message) });
  }

  res.status(200);
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  if (typeof res.flushHeaders === 'function') res.flushHeaders();

  // Tap the stream to count actual tokens used so we can debit the user.
  let leftover = '';
  let inputTokens = 0;
  let outputTokens = 0;
  const decoder = new TextDecoder();

  upstream.body.on('data', (chunk) => {
    res.write(chunk);
    leftover += decoder.decode(chunk, { stream: true });
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
  });
  upstream.body.on('end', () => {
    res.end();
    const total = (inputTokens || 0) + (outputTokens || 0);
    if (total > 0) {
      debitUsage(auth.uid, quotaCheck.period, total).catch((e) => console.error('Debit failed:', e));
    }
  });
  upstream.body.on('error', (err) => {
    console.error('Upstream stream error:', err);
    try { res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`); } catch {}
    res.end();
  });

  req.on('close', () => { try { upstream.body.destroy(); } catch {} });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Vercel runs this file as a serverless function and uses the exported handler;
// only bind a port when running locally (`npm start`).
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`SceneCraft Studio running on http://localhost:${PORT}`);
  });
}

export default app;
