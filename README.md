# SceneCraft Studio

AI-powered screenwriting suite for feature films, TV, documentaries, and 9 other formats. Vanilla HTML/CSS/JS frontend, Firebase Auth + Firestore for accounts and per-user drafts, a Vercel serverless function as the Anthropic API proxy with tier-based monthly token quotas and per-minute rate limiting.

```
scenecraft/
  index.html              static UI (auth modal, picker, panels, error/verify banners)
  style.css               styles
  app.js                  app logic (multi-draft, AI streaming, exports, onboarding)
  firebase-config.js      ← edit this with your Firebase web config
  firebase-init.js        Firebase Auth + Firestore + multi-draft API (window.SC)
  firestore.rules         security rules — deploy to Firebase
  manifest.webmanifest    PWA manifest
  service-worker.js       app-shell cache for offline editor
  api/
    chat.js               Vercel function: verifies Firebase ID token,
                          enforces per-minute rate limit + monthly token quota
                          (tier-based), proxies streaming requests to Anthropic,
                          debits actual usage on completion.
    billing/
      webhook.js          Stripe webhook stub — wire up to flip user tier on
                          subscription events.
  vercel.json             Vercel routing + security headers
  package.json            firebase-admin dependency for the proxy
  favicon.svg, og-image.svg, robots.txt, sitemap.xml
```

## Features

- **Auth gated for AI**: anyone can browse, but AI generation requires a signed-in account (Google or email/password). Email/password users must verify their email before generating.
- **Multi-draft cloud sync**: every signed-in user gets a `Continue working` picker on the project select screen. Drafts live at `users/{uid}/drafts/{id}` in Firestore; the active draft auto-saves to localStorage as an offline cache.
- **Tier-based quota**: free tier defaults to 50,000 tokens/month, pro to 2,000,000. Configurable via env vars. Per-user override by editing `monthlyQuota` on their user doc.
- **Per-minute rate limit**: 20 requests/minute per user (default), enforced server-side with a Firestore-backed sliding window.
- **Token cost preview**: before each AI call the client shows an estimate ("Generating · ~3,400 tokens").
- **Beforeunload guard**: warns before closing the tab during a stream or when changes haven't synced.
- **Exports**: plain `.txt`, PDF (browser print dialog → "Save as PDF" using the existing screenplay print CSS), Final Draft `.fdx` XML.
- **PWA**: installable on iOS/Android/desktop; offline editor shell.
- **Onboarding**: first-run 3-step coach marks on the project select screen.
- **Stripe groundwork**: webhook stub already mapped to `users/{uid}.tier`; uncomment + `npm i stripe` to activate.

## Setup

### 1. Firebase

1. Create a project at <https://console.firebase.google.com>.
2. **Authentication → Get started** → enable **Google** and **Email/Password** providers.
3. **Firestore Database → Create database** → start in production mode (the rules below lock it down).
4. **Project settings → General → Your apps → Add web app**. Copy the config object.
5. Open `firebase-config.js` and replace the `REPLACE_ME` values with your config.
6. Install the Firebase CLI and deploy the security rules:
   ```bash
   npm i -g firebase-tools
   firebase login
   firebase use --add        # pick your project
   firebase deploy --only firestore:rules
   ```
7. **Project settings → Service accounts → Generate new private key**. You'll paste the contents into Vercel as `FIREBASE_SERVICE_ACCOUNT` in step 3.

### 2. Anthropic API key

Get one from <https://console.anthropic.com/settings/keys>.

### 3. Vercel

```bash
npm i -g vercel
vercel link
vercel env add ANTHROPIC_API_KEY production       # paste your sk-ant-... key
vercel env add FIREBASE_SERVICE_ACCOUNT production # paste the JSON from step 1.7 (the whole object, on one line)
vercel env add FREE_TIER_QUOTA production         # optional, default 50000
vercel env add PRO_TIER_QUOTA production          # optional, default 2000000
vercel env add RATE_LIMIT_PER_MIN production      # optional, default 20
```

For local development, also add to `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

Then:
```bash
vercel dev          # http://localhost:3000
```

Deploy to production:
```bash
vercel --prod
```

In the Firebase console, add your Vercel preview and production domains under **Authentication → Settings → Authorized domains**.

## How it works

1. The browser loads `firebase-config.js` (public values), then `firebase-init.js` (ES module) which exposes `window.SC` with `signInGoogle`, `signInEmail`, `getIdToken`, `onAuth`, and a `drafts` API (`list`, `get`, `save`, `create`, `rename`, `delete`, `setActive`, `getActive`).
2. `app.js` wires every AI button through `stream()`, which:
   - Confirms a signed-in user (else opens the auth modal).
   - Fetches a fresh Firebase ID token.
   - POSTs to `/api/chat` with `Authorization: Bearer <token>`.
3. `api/chat.js` (Vercel Node function):
   - Verifies the token with `firebase-admin`.
   - Reads/creates `users/{uid}` in Firestore, checks `usedThisMonth < monthlyQuota` for the current month.
   - Streams the Anthropic SSE response back unchanged.
   - Sniffs `message_start` and `message_delta` events to tally input + output tokens.
   - Debits the user's monthly counter on stream completion.
4. Drafts auto-save to localStorage (debounced 250 ms) and to Firestore at `users/{uid}/state/draft` (debounced 800 ms). On startup, the cloud draft wins; localStorage is the offline fallback.

## Smoke test

After `vercel dev` is running and `firebase-config.js` has real values:

1. Splash dismisses; project select renders; **no console errors**.
2. Click the "Sign in" pill → modal opens → sign in with Google → modal closes, user pill shows your name.
3. Pick Feature Film → Drama → Start Writing.
4. Type a title + logline → click "Develop with AI" → text streams in.
5. Generate cast → "+ Import" → paste `<img onerror=alert(1)>` into a description → renders as text, not HTML.
6. Generate outline → click "Write" on scene 1 → script streams.
7. Refresh the page → toast offers to restore last draft → accept → state is back.
8. Sign out → click an AI button → auth modal opens, AI is gated.
9. In the Firebase console under **Firestore**, open `users/<your uid>` and confirm `usedThisMonth` is incrementing.
10. Hit `/api/chat` directly with `curl -X POST` (no token) → 401 with `{"error":"Sign in required"}`.
11. Resize the window to 360px wide → screenplay fits; no horizontal scroll; hamburger works.
12. Disconnect network → click "Develop with AI" → red error banner with Retry; textarea isn't corrupted.

Lighthouse mobile preset on the deployed URL: aim for Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

## Environment variables

| Name | Where | Purpose |
|------|-------|---------|
| `ANTHROPIC_API_KEY` | Vercel (server) | Used by `api/chat.js` to call Anthropic. Never reaches the browser. |
| `FIREBASE_SERVICE_ACCOUNT` | Vercel (server) | JSON for `firebase-admin` to verify ID tokens and read/write Firestore. |
| `FREE_TIER_QUOTA` | Vercel (server) | Tokens/month for users on the free tier. Defaults to `50000`. |
| `PRO_TIER_QUOTA` | Vercel (server) | Tokens/month for users on the pro tier. Defaults to `2000000`. |
| `RATE_LIMIT_PER_MIN` | Vercel (server) | Requests per minute per user. Defaults to `20`. |
| `REQUIRE_VERIFIED_EMAIL` | Vercel (server) | If `true` (default), email/password users must verify their email before AI calls succeed. |
| `STRIPE_SECRET_KEY` | Vercel (server) | Optional. Required only when activating the Stripe billing webhook. |
| `STRIPE_WEBHOOK_SECRET` | Vercel (server) | Optional. Stripe webhook signing secret for `/api/billing/webhook`. |

## Activating billing (when ready)

The `users/{uid}.tier` field is already read by the proxy, and `api/billing/webhook.js` is wired to flip it on Stripe events. To turn it on:

1. Create your Products + Prices in Stripe (e.g. "SceneCraft Pro $19/month").
2. `npm i stripe` and uncomment the Stripe code in `api/billing/webhook.js`.
3. Add the webhook on Stripe → URL: `https://<your-domain>/api/billing/webhook`, events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.
4. Set `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` on Vercel.
5. Build a checkout button on the client that creates a Checkout Session with `client_reference_id` = the Firebase uid so the webhook can map payments back to users.

## Other auth providers

To add Apple sign-in: register an Apple Developer account ($99/yr), create a Service ID, configure it in Firebase Console → Authentication → Sign-in method → Apple, and add `OAuthProvider('apple.com')` to `firebase-init.js`. Skipped by default.

The Firebase web config in `firebase-config.js` is intentionally committed — those values are public identifiers for the Firebase project. Security comes from the Firestore rules in `firestore.rules` and Auth provider configuration.

## License

All rights reserved.
