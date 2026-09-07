'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Mail, Lock, User, Eye, EyeOff,
  ArrowRight, Loader2, CheckCircle2, AlertCircle, ArrowLeft
} from 'lucide-react';
import {
  signInWithEmail, signUpWithEmail,
  signInWithGoogle, signInWithGithub,
  resetPassword, updatePassword
} from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';

const TABS = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  FORGOT: 'forgot',
  RESET: 'reset',
};

function AuthForm() {
  const [activeTab, setActiveTab] = useState(TABS.LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard');
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (searchParams.get('mode') === 'reset') {
      setActiveTab(TABS.RESET);
    }
  }, [searchParams]);

  const showMsg = (type, text) => setMessage({ type, text });

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return showMsg('error', 'Please fill in all fields.');
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push('/dashboard');
    } catch (err) {
      if (err.code === 'auth/operation-not-allowed') {
        showMsg('error', 'Email/Password sign-in is not enabled in Firebase Console. Go to Authentication > Sign-in method > Email/Password and toggle it ON.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        showMsg('error', 'Invalid email or password. Please check your credentials.');
      } else {
        showMsg('error', err.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) return showMsg('error', 'Please fill in all fields.');
    if (password.length < 6) return showMsg('error', 'Password must be at least 6 characters.');
    if (password !== confirmPassword) return showMsg('error', 'Passwords do not match.');
    setLoading(true);
    try {
      await signUpWithEmail(email, password, fullName);
      showMsg('success', 'Account created. Redirecting to Mission Control...');
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err) {
      if (err.code === 'auth/operation-not-allowed') {
        showMsg('error', 'Email/Password sign-up is not enabled in Firebase Console. Go to Authentication > Sign-in method > Email/Password and toggle it ON.');
      } else if (err.code === 'auth/email-already-in-use') {
        showMsg('error', 'An account already exists with this email address. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        showMsg('error', 'Password is too weak. Please use at least 6 characters.');
      } else {
        showMsg('error', err.message || 'Sign up failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) return showMsg('error', 'Please enter your email address.');
    setLoading(true);
    try {
      await resetPassword(email);
      showMsg('success', 'Password reset link sent. Check your email inbox.');
    } catch (err) {
      showMsg('error', err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return showMsg('error', 'Please fill in all fields.');
    if (password.length < 6) return showMsg('error', 'Password must be at least 6 characters.');
    if (password !== confirmPassword) return showMsg('error', 'Passwords do not match.');
    setLoading(true);
    try {
      await updatePassword(password);
      showMsg('success', 'Password updated! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      showMsg('error', err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      showMsg('error', err.message || 'Google login failed.');
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    try {
      await signInWithGithub();
      router.push('/dashboard');
    } catch (err) {
      showMsg('error', err.message || 'GitHub login failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Back to Home link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs text-secondary hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-3 group">
            <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 group-hover:border-white/20 transition-colors shadow-lg">
              <BrandLogo size={28} />
            </div>
            <span className="font-semibold tracking-tight text-white text-xl">
              GitFix<span className="text-white/40 font-normal">AI</span>
            </span>
          </Link>
          <p className="text-slate-400 text-xs font-mono">Autonomous code remediation platform</p>
        </div>

        {/* Card Container */}
        <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Quick OAuth Providers */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium text-white cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continue with Google (Free / Permanent)
            </button>

            <button
              onClick={handleGithubLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-white/10 bg-[#24292e] hover:bg-[#2f363d] transition-colors text-sm font-medium text-white cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0c0c10] px-3 text-[11px] text-secondary uppercase tracking-widest absolute">or</span>
          </div>

          {/* Form Tabs */}
          <div className="flex border-b border-white/5 mb-6">
            <button
              onClick={() => { setActiveTab(TABS.LOGIN); setMessage(null); }}
              className={`flex-1 pb-3 text-xs font-semibold transition-colors border-b-2 cursor-pointer ${
                activeTab === TABS.LOGIN
                  ? 'border-primary text-white'
                  : 'border-transparent text-secondary hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab(TABS.SIGNUP); setMessage(null); }}
              className={`flex-1 pb-3 text-xs font-semibold transition-colors border-b-2 cursor-pointer ${
                activeTab === TABS.SIGNUP
                  ? 'border-primary text-white'
                  : 'border-transparent text-secondary hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Notification Alert */}
          {message && (
            <div
              className={`p-3 rounded-xl mb-4 flex items-center gap-2.5 text-xs ${
                message.type === 'error'
                  ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                  : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              }`}
            >
              {message.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Forms */}
          {activeTab === TABS.LOGIN && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="text-xs text-secondary mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-secondary absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dev@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-9 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-secondary">Password</label>
                  <button
                    type="button"
                    onClick={() => { setActiveTab(TABS.FORGOT); setMessage(null); }}
                    className="text-xs text-primary hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-secondary absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-9 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-secondary hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {activeTab === TABS.SIGNUP && (
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div>
                <label className="text-xs text-secondary mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-secondary absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ada Lovelace"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-9 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-secondary mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-secondary absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dev@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-9 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-secondary mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-secondary absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-9 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-secondary mb-1.5 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-secondary absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-9 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {activeTab === TABS.FORGOT && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-secondary leading-relaxed">
                Enter your email address and we will send you a password reset link.
              </p>
              <div>
                <label className="text-xs text-secondary mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-secondary absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dev@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-9 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary hover:bg-primary/90 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab(TABS.LOGIN); setMessage(null); }}
                className="w-full text-xs text-secondary hover:text-white transition-colors text-center cursor-pointer"
              >
                Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
