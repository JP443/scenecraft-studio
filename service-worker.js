// SceneCraft Studio — service worker.
// Caches the static app shell so the editor loads offline. AI calls (POST /api/claude)
// always go to the network; Firebase auth/Firestore are also network-only (gstatic.com origin).

const VERSION = 'sc-shell-v2';

// Files we precache for offline boot. firebase-config.js is intentionally excluded:
// it changes whenever the Firebase project values are updated, and a stale copy
// makes the app think Firebase is unconfigured.
const SHELL = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/firebase-init.js',
  '/favicon.svg',
  '/og-image.svg',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never cache the API or third-party origins.
  if (url.pathname.startsWith('/api/')) return;
  if (url.origin !== self.location.origin) return;

  // Network-first: always prefer fresh content; fall back to cache only when offline.
  // This avoids serving stale index.html or firebase-config.js after an update.
  event.respondWith(
    fetch(req).then((res) => {
      if (res && res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match(req))
  );
});
