'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Github,
  Search,
  Command
} from 'lucide-react';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithGithub,
  resetPassword,
  updatePassword
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
        showMsg('error', 'Email/Password sign-in is not enabled in Firebase Console. Enable it in Auth > Sign-in method.');
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
        showMsg('error', 'Email/Password sign-up is not enabled in Firebase Console. Enable it in Auth > Sign-in method.');
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
    <div className="min-h-screen bg-[#eef1f6] flex items-center justify-center p-3 sm:p-6 md:p-10 select-none font-sans relative">
      
      {/* Back to Home link */}
      <Link
        href="/"
        className="absolute top-5 left-5 sm:top-8 sm:left-8 flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Main Elevated Modal Card (Matching reference image directly) */}
      <div className="w-full max-w-5xl bg-white rounded-[28px] sm:rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 min-h-[640px] z-10">

        {/* ═══════════════════════════════════════════════════════════
            LEFT COLUMN: AUTHENTICATION FORM
           ═══════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-6 p-7 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-center">
          
          {/* Logo Badge (Circular black circle with vortex logo glyph) */}
          <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white mb-6 shadow-md">
            <BrandLogo size={24} />
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight mb-6">
            {activeTab === TABS.LOGIN && 'Welcome back to GitFix'}
            {activeTab === TABS.SIGNUP && 'Create your GitFix account'}
            {activeTab === TABS.FORGOT && 'Reset your password'}
            {activeTab === TABS.RESET && 'Set new password'}
          </h1>

          {/* Social Auth Buttons (Google & GitHub matching Google & Apple from image) */}
          {(activeTab === TABS.LOGIN || activeTab === TABS.SIGNUP) && (
            <div className="space-y-2.5 mb-6">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2.5 text-xs sm:text-sm font-medium text-slate-800 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* GitHub Button (Clean white pill matching Apple button from image) */}
              <button
                type="button"
                onClick={handleGithubLogin}
                disabled={loading}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2.5 text-xs sm:text-sm font-medium text-slate-800 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Github className="w-4 h-4 text-black" />
                <span>Continue with GitHub</span>
              </button>
            </div>
          )}

          {/* Divider: "Or, sign up with your email" */}
          {(activeTab === TABS.LOGIN || activeTab === TABS.SIGNUP) && (
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-slate-400 absolute">
                {activeTab === TABS.LOGIN ? 'Or, continue with your email' : 'Or, sign up with your email'}
              </span>
            </div>
          )}

          {/* Notification Alert */}
          {message && (
            <div
              className={`p-3 rounded-xl mb-4 flex items-center gap-2 text-xs font-medium ${
                message.type === 'error'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {message.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Login Form */}
          {activeTab === TABS.LOGIN && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-800 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-800 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => { setActiveTab(TABS.FORGOT); setMessage(null); }}
                    className="text-xs text-slate-500 hover:text-black font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* Continue Solid Black Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-black hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] cursor-pointer mt-3 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Continue'}
              </button>

              <div className="text-center text-xs text-slate-500 mt-4">
                Don't have an account ?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab(TABS.SIGNUP); setMessage(null); }}
                  className="font-bold text-slate-900 hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </div>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === TABS.SIGNUP && (
            <form onSubmit={handleEmailSignup} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-800 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ada Lovelace"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-800 mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-800 mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-800 mb-1 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-black hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] cursor-pointer mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Create Account'}
              </button>

              <div className="text-center text-xs text-slate-500 mt-3">
                Already have an account ?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab(TABS.LOGIN); setMessage(null); }}
                  className="font-bold text-slate-900 hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          {/* Forgot Password */}
          {activeTab === TABS.FORGOT && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your registered email address to receive a password reset link.
              </p>
              <div>
                <label className="text-xs font-semibold text-slate-800 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-black hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Send Reset Link'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setActiveTab(TABS.LOGIN); setMessage(null); }}
                  className="text-xs text-slate-500 hover:text-black font-semibold cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Reset Password */}
          {activeTab === TABS.RESET && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-800 mb-1.5 block">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-800 mb-1.5 block">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-black hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Update Password'}
              </button>
            </form>
          )}

        </div>

        {/* ═══════════════════════════════════════════════════════════
            RIGHT COLUMN: DECORATIVE APP PREVIEW PANEL (Matching image)
           ═══════════════════════════════════════════════════════════ */}
        <div className="hidden lg:flex lg:col-span-6 relative overflow-hidden bg-gradient-to-br from-[#f2c6b0] via-[#dc9e83] to-[#c78467] p-8 pt-12 flex-col justify-end">
          
          {/* Subtle Ambient Silk Glow */}
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-orange-200/20 blur-3xl pointer-events-none" />

          {/* Floating Application Preview Card (Directly mirrors Quantro card in image) */}
          <div className="relative w-full ml-auto rounded-tl-[24px] rounded-bl-[12px] bg-white shadow-[-20px_20px_50px_rgba(0,0,0,0.15)] border-t border-l border-white/80 p-6 flex flex-col min-h-[460px]">
            
            {/* Header: Logo badge + GitFix brand */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white shrink-0">
                <BrandLogo size={16} />
              </div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">
                GitFix
              </span>
            </div>

            {/* Mockup Search Bar (Search... ⌘F) */}
            <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 font-normal">Search...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-400 shadow-2xs">
                ⌘ F
              </kbd>
            </div>

            {/* Menu Skeleton Rows (Directly matching the image) */}
            <div className="mt-6 space-y-4">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Menu
              </div>

              {/* 5 Skeleton Pill Rows */}
              {[
                { w: 'w-24' },
                { w: 'w-32' },
                { w: 'w-28' },
                { w: 'w-36' },
                { w: 'w-20' },
                { w: 'w-30' },
              ].map((row, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-slate-200 shrink-0" />
                  <div className={`h-2 rounded-full bg-slate-100 ${row.w}`} />
                </div>
              ))}
            </div>

            {/* Subtle floating badge */}
            <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Ready for CI/CD</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#eef1f6] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-black animate-spin" />
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
