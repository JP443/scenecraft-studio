// SceneCraft — Stripe billing webhook (groundwork stub).
// Verifies the Stripe signature, then maps subscription state changes onto
// users/{uid}.tier in Firestore. The proxy reads tier on every request so a
// successful payment immediately raises the user's monthly token quota.
//
// NOT YET ACTIVE. Wire up on Stripe by:
//   1. Setting up Products + Prices in Stripe (e.g. "Pro $X/month").
//   2. Adding the webhook endpoint to your Stripe dashboard:
//        URL:    https://<your-domain>/api/billing/webhook
//        Events: checkout.session.completed, customer.subscription.updated,
//                customer.subscription.deleted, invoice.payment_failed
//   3. Setting env vars on Vercel:
//        STRIPE_SECRET_KEY            sk_live_...
//        STRIPE_WEBHOOK_SECRET        whsec_...
//   4. When creating the Checkout Session client-side, pass
//      `client_reference_id` = Firebase uid so we can map it back here.
//   5. `npm i stripe` (uncomment the import below).

import admin from 'firebase-admin';
// import Stripe from 'stripe';

export const config = {
  runtime: 'nodejs',
  api: { bodyParser: false }, // we need the raw body for signature verification
};

let adminApp;
function getAdmin() {
  if (adminApp) return adminApp;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT env var is missing');
  const creds = JSON.parse(raw);
  if (typeof creds.private_key === 'string') creds.private_key = creds.private_key.replace(/\\n/g, '\n');
  adminApp = admin.initializeApp({ credential: admin.credential.cert(creds) }, 'billing');
  return adminApp;
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    res.status(501).json({ error: 'Billing not configured. Set STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET.' });
    return;
  }

  // Uncomment after `npm i stripe`:
  //
  // const stripe = new Stripe(stripeKey);
  // const sig = req.headers['stripe-signature'];
  // const raw = await readRawBody(req);
  // let event;
  // try { event = stripe.webhooks.constructEvent(raw, sig, webhookSecret); }
  // catch (e) { res.status(400).json({ error: 'Bad signature: ' + e.message }); return; }
  //
  // try { getAdmin(); } catch (e) { res.status(500).json({ error: e.message }); return; }
  // const db = admin.firestore(adminApp);
  //
  // async function setTier(uid, tier, extra = {}) {
  //   if (!uid) return;
  //   await db.collection('users').doc(uid).set({ tier, ...extra }, { merge: true });
  // }
  //
  // switch (event.type) {
  //   case 'checkout.session.completed': {
  //     const s = event.data.object;
  //     await setTier(s.client_reference_id, 'pro', {
  //       stripeCustomerId: s.customer,
  //       stripeSubscriptionId: s.subscription,
  //     });
  //     break;
  //   }
  //   case 'customer.subscription.updated': {
  //     const sub = event.data.object;
  //     const uid = sub.metadata?.uid;
  //     await setTier(uid, sub.status === 'active' ? 'pro' : 'free');
  //     break;
  //   }
  //   case 'customer.subscription.deleted':
  //   case 'invoice.payment_failed': {
  //     const sub = event.data.object;
  //     const uid = sub.metadata?.uid;
  //     await setTier(uid, 'free');
  //     break;
  //   }
  // }

  res.status(200).json({ received: true, note: 'Billing stub — uncomment Stripe code in api/billing/webhook.js once your Stripe account is set up.' });
}
