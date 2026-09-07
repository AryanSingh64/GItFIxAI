import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword as fbUpdatePassword,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "gitfixai.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gitfixai",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gitfixai.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

const isConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "demo-api-key"
);

// Initialize Firebase safely for SSR/Edge
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('repo');
githubProvider.addScope('workflow');

// ─── Authentication Helpers ──────────────────────────────────

export const signInWithGoogle = async () => {
  if (!isConfigured) {
    console.warn("Firebase not configured. Using demo session.");
    return {
      user: {
        uid: "demo-user-123",
        displayName: "Demo Developer",
        email: "developer@gitfixai.com",
        photoURL: "https://avatars.githubusercontent.com/u/583231?v=4"
      }
    };
  }
  return await signInWithPopup(auth, googleProvider);
};

export const signInWithGithub = async () => {
  if (!isConfigured) {
    return {
      user: {
        uid: "demo-gh-user",
        displayName: "GitHub Developer",
        email: "gh-dev@gitfixai.com",
        photoURL: "https://avatars.githubusercontent.com/u/583231?v=4"
      },
      token: null
    };
  }
  const result = await signInWithPopup(auth, githubProvider);
  const credential = GithubAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken || null;
  return { ...result, token };
};

export const signInWithEmail = async (email, password) => {
  if (!isConfigured) {
    return {
      user: {
        uid: "demo-email-user",
        displayName: email.split('@')[0],
        email
      }
    };
  }
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async (email, password, fullName) => {
  if (!isConfigured) {
    return {
      user: {
        uid: "demo-email-user",
        displayName: fullName,
        email
      }
    };
  }
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (fullName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName: fullName });
  }
  return userCredential;
};

export const resetPassword = async (email) => {
  if (!isConfigured) return true;
  return await sendPasswordResetEmail(auth, email);
};

export const updatePassword = async (newPassword) => {
  if (!isConfigured || !auth.currentUser) return true;
  return await fbUpdatePassword(auth.currentUser, newPassword);
};

export const signOut = async () => {
  if (!isConfigured) return true;
  return await fbSignOut(auth);
};

export const onAuthStateChanged = (callback) => {
  if (!isConfigured) {
    // Return stored demo user or null
    const stored = typeof window !== 'undefined' ? localStorage.getItem('demo_user') : null;
    callback(stored ? JSON.parse(stored) : null);
    return () => {};
  }
  return fbOnAuthStateChanged(auth, callback);
};

export { isConfigured };
