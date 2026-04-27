# SceneCraft Studio

AI-powered screenwriting suite for feature films, TV, documentaries, and 9 other formats. Vanilla HTML/CSS/JS frontend, Firebase Auth + Firestore for accounts and drafts, a Vercel serverless function as a proxy to the Anthropic API.

```
scenecraft/
  index.html              static UI
  style.css               styles
  app.js                  app logic
  firebase-config.js      ← edit this with your Firebase web config
  firebase-init.js        Firebase Auth + Firestore wiring (window.SC API)
  firestore.rules         security rules — deploy to Firebase
  api/
    chat.js               Vercel function: verifies Firebase ID token,
                          checks per-user monthly token quota,
                          proxies streaming requests to Anthropic
  vercel.json             Vercel routing + security headers
  package.json            firebase-admin dependency for the proxy
  favicon.svg, og-image.svg, robots.txt
```

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
vercel env add DEFAULT_MONTHLY_QUOTA production    # optional, defaults to 500000 tokens
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

1. The browser loads `firebase-config.js` (public values), then `firebase-init.js` (ES module) which exposes `window.SC` with `signInGoogle`, `signInEmail`, `getIdToken`, `saveDraftRemote`, `loadDraftRemote`, `onAuth`, etc.
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
| `DEFAULT_MONTHLY_QUOTA` | Vercel (server) | Tokens/month for new users. Defaults to 500000. Override per user by editing `monthlyQuota` on their `users/{uid}` doc. |

The Firebase web config in `firebase-config.js` is intentionally committed — those values are public identifiers for the Firebase project. Security comes from the Firestore rules in `firestore.rules` and Auth provider configuration.

## License

All rights reserved.
