// SceneCraft — Firebase client init.
// Initializes Firebase Auth + Firestore and exposes a small global API as window.SC
// so app.js (a classic script) can call it without becoming a module itself.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged,
  GoogleAuthProvider, signInWithPopup,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, signOut,
  setPersistence, browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const cfg = window.__FIREBASE_CONFIG__;
const isConfigured = cfg && cfg.apiKey && !String(cfg.apiKey).startsWith("REPLACE_ME");

let app, auth, db, googleProvider;
if (isConfigured) {
  app = initializeApp(cfg);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  setPersistence(auth, browserLocalPersistence).catch(() => {});
}

// ── Subscribers ──
const authListeners = new Set();
let currentUser = null;
let currentQuota = null;
let quotaUnsub = null;
let resolved = false;

function notifyAuth() {
  for (const cb of authListeners) {
    try { cb(currentUser, currentQuota); } catch {}
  }
}

if (isConfigured) {
  onAuthStateChanged(auth, (user) => {
    currentUser = user || null;
    if (quotaUnsub) { try { quotaUnsub(); } catch {} quotaUnsub = null; }
    if (user) {
      const ref = doc(db, "users", user.uid);
      quotaUnsub = onSnapshot(ref, (snap) => {
        const data = snap.exists() ? snap.data() : null;
        currentQuota = data ? {
          used: data.usedThisMonth || 0,
          quota: data.monthlyQuota || 500000,
          period: data.periodKey || null,
        } : { used: 0, quota: 500000, period: null };
        notifyAuth();
      }, () => { currentQuota = null; notifyAuth(); });
    } else {
      currentQuota = null;
    }
    resolved = true;
    notifyAuth();
  });
} else {
  // Not configured: resolve immediately so callers don't wait forever.
  resolved = true;
}

// ── Auth API ──
async function signInGoogle() {
  if (!isConfigured) throw new Error("Firebase is not configured.");
  await signInWithPopup(auth, googleProvider);
}
async function signInEmail(email, password) {
  if (!isConfigured) throw new Error("Firebase is not configured.");
  await signInWithEmailAndPassword(auth, email, password);
}
async function signUpEmail(email, password) {
  if (!isConfigured) throw new Error("Firebase is not configured.");
  await createUserWithEmailAndPassword(auth, email, password);
}
async function resetPassword(email) {
  if (!isConfigured) throw new Error("Firebase is not configured.");
  await sendPasswordResetEmail(auth, email);
}
async function signOutUser() {
  if (!isConfigured) return;
  await signOut(auth);
}
async function getIdToken() {
  if (!currentUser) return null;
  return currentUser.getIdToken();
}

// ── Firestore-backed drafts ──
// Per-user single active draft at users/{uid}/state/draft.
// (Multi-draft support can layer on top later.)
function draftRef() {
  if (!currentUser) return null;
  return doc(db, "users", currentUser.uid, "state", "draft");
}
async function saveDraftRemote(payload) {
  const ref = draftRef();
  if (!ref) return;
  await setDoc(ref, { ...payload, updatedAt: serverTimestamp() }, { merge: true });
}
async function loadDraftRemote() {
  const ref = draftRef();
  if (!ref) return null;
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// ── Public API ──
window.SC = {
  configured: isConfigured,
  // auth
  signInGoogle, signInEmail, signUpEmail, resetPassword, signOut: signOutUser,
  getIdToken,
  getCurrentUser: () => currentUser,
  getQuota: () => currentQuota,
  onAuth: (cb) => {
    authListeners.add(cb);
    // Only fire immediately if we already know the auth state. Otherwise wait
    // for the first onAuthStateChanged event so subscribers don't act on a
    // premature null when the user actually has a restored session.
    if (resolved) cb(currentUser, currentQuota);
    return () => authListeners.delete(cb);
  },
  // drafts
  saveDraftRemote, loadDraftRemote,
};

window.dispatchEvent(new Event("sc:ready"));
