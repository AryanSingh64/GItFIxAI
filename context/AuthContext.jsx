'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  isConfigured,
  onAuthStateChanged,
  signInWithGoogle as fbSignInWithGoogle,
  signInWithGithub as fbSignInWithGithub,
  signOut as fbSignOut
} from '@/lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const res = await fbSignInWithGoogle();
    if (res.user) setUser(res.user);
    return res;
  };

  const signInWithGithub = async () => {
    const res = await fbSignInWithGithub();
    if (res.user) setUser(res.user);
    if (res.token) {
      localStorage.setItem('github_access_token', res.token);
    }
    return res;
  };

  const signOut = async () => {
    await fbSignOut();
    setUser(null);
    localStorage.removeItem('github_access_token');
    localStorage.removeItem('demo_user');
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isConfigured,
    userEmail: user?.email,
    userName: user?.displayName || user?.email?.split('@')[0] || 'Developer',
    userAvatar: user?.photoURL || null,
    signInWithGoogle,
    signInWithGithub,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
