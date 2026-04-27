// SceneCraft — Firebase client init.
// Initializes Firebase Auth + Firestore and exposes a small global API as window.SC
// so app.js (a classic script) can call it without becoming a module itself.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged,
  GoogleAuthProvider, signInWithPopup,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, sendEmailVerification, signOut,
  setPersistence, browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, deleteDoc, onSnapshot, serverTimestamp,
  collection, getDocs, query, orderBy
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
let currentTier = null;
let quotaUnsub = null;
let resolved = false;

function notifyAuth() {
  for (const cb of authListeners) {
    try { cb(currentUser, currentQuota, currentTier); } catch {}
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
        currentTier = data?.tier || 'free';
        currentQuota = data ? {
          used: data.usedThisMonth || 0,
          quota: data.monthlyQuota || 50000,
          period: data.periodKey || null,
          tier: currentTier,
          emailVerified: user.emailVerified,
        } : { used: 0, quota: 50000, period: null, tier: 'free', emailVerified: user.emailVerified };
        notifyAuth();
      }, () => { currentQuota = null; notifyAuth(); });
    } else {
      currentQuota = null;
      currentTier = null;
    }
    resolved = true;
    notifyAuth();
  });
} else {
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
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  try { await sendEmailVerification(cred.user); } catch {}
}
async function resetPassword(email) {
  if (!isConfigured) throw new Error("Firebase is not configured.");
  await sendPasswordResetEmail(auth, email);
}
async function signOutUser() {
  if (!isConfigured) return;
  await signOut(auth);
}
async function resendVerification() {
  if (!isConfigured || !currentUser) throw new Error("Not signed in.");
  await sendEmailVerification(currentUser);
}
async function reloadUser() {
  if (!currentUser) return;
  await currentUser.reload();
  // reload mutates the existing user object; nudge subscribers.
  notifyAuth();
}
async function getIdToken(forceRefresh = false) {
  if (!currentUser) return null;
  return currentUser.getIdToken(forceRefresh);
}

// ── Multi-draft Firestore API ──
function draftsCol() {
  if (!currentUser) return null;
  return collection(db, "users", currentUser.uid, "drafts");
}
function draftDoc(id) {
  if (!currentUser) return null;
  return doc(db, "users", currentUser.uid, "drafts", id);
}
function activeRef() {
  if (!currentUser) return null;
  return doc(db, "users", currentUser.uid, "state", "active");
}
function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
async function listDrafts() {
  const c = draftsCol(); if (!c) return [];
  const snap = await getDocs(query(c, orderBy("updatedAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
async function getDraft(id) {
  const ref = draftDoc(id); if (!ref) return null;
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
async function saveDraft(id, payload) {
  const ref = draftDoc(id); if (!ref) return;
  await setDoc(ref, { ...payload, updatedAt: serverTimestamp() }, { merge: true });
}
async function createDraft(payload) {
  const id = newId();
  const ref = draftDoc(id); if (!ref) return null;
  await setDoc(ref, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return id;
}
async function renameDraft(id, title) {
  const ref = draftDoc(id); if (!ref) return;
  await setDoc(ref, { title, updatedAt: serverTimestamp() }, { merge: true });
}
async function deleteDraft(id) {
  const ref = draftDoc(id); if (!ref) return;
  await deleteDoc(ref);
}
async function setActiveDraft(id) {
  const ref = activeRef(); if (!ref) return;
  await setDoc(ref, { id, updatedAt: serverTimestamp() }, { merge: true });
}
async function getActiveDraft() {
  const ref = activeRef(); if (!ref) return null;
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().id || null : null;
}

// ── Public API ──
window.SC = {
  configured: isConfigured,
  // auth
  signInGoogle, signInEmail, signUpEmail, resetPassword, signOut: signOutUser,
  resendVerification, reloadUser,
  getIdToken,
  getCurrentUser: () => currentUser,
  getQuota: () => currentQuota,
  getTier: () => currentTier,
  isResolved: () => resolved,
  onAuth: (cb) => {
    authListeners.add(cb);
    if (resolved) cb(currentUser, currentQuota, currentTier);
    return () => authListeners.delete(cb);
  },
  // drafts
  drafts: {
    list: listDrafts,
    get: getDraft,
    save: saveDraft,
    create: createDraft,
    rename: renameDraft,
    delete: deleteDraft,
    setActive: setActiveDraft,
    getActive: getActiveDraft,
  },
};

window.dispatchEvent(new Event("sc:ready"));
