'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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
  Sparkles
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
        showMsg('error', 'Email/Password sign-in is not enabled in Firebase Console.');
      } else if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
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
        showMsg('error', 'Email/Password sign-up is not enabled in Firebase Console.');
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
      showMsg('success', 'Password reset link sent. Check your inbox.');
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans selection:bg-slate-900 selection:text-white">

      {/* ═══════════════════════════════════════════════════════════════
          LEFT COLUMN: FULL-HEIGHT AUTHENTICATION PANEL
         ═══════════════════════════════════════════════════════════════ */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 xl:p-20 bg-white relative">
        
        {/* Top Bar: Back to Home Link */}
        <div className="w-full flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors py-1.5 px-2.5 -ml-2.5 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Center Container: Exact reference spacing & form elements */}
        <div className="w-full max-w-[420px] mx-auto my-auto py-8">
          
          {/* Logo Badge: Solid black circle with user's vortex brand glyph */}
          <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white mb-6 shadow-md">
            <BrandLogo size={24} />
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight mb-6">
            {activeTab === TABS.LOGIN && 'Welcome back to GitFix'}
            {activeTab === TABS.SIGNUP && 'Create your GitFix account'}
            {activeTab === TABS.FORGOT && 'Reset your password'}
            {activeTab === TABS.RESET && 'Set new password'}
          </h1>

          {/* Social Auth Buttons (Google & GitHub) */}
          {(activeTab === TABS.LOGIN || activeTab === TABS.SIGNUP) && (
            <div className="space-y-3 mb-6">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-xs sm:text-sm font-medium text-slate-800 shadow-2xs cursor-pointer disabled:opacity-50 active:scale-[0.99]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* GitHub Button */}
              <button
                type="button"
                onClick={handleGithubLogin}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-xs sm:text-sm font-medium text-slate-800 shadow-2xs cursor-pointer disabled:opacity-50 active:scale-[0.99]"
              >
                <Github className="w-4 h-4 text-black" />
                <span>Continue with GitHub</span>
              </button>
            </div>
          )}

          {/* Divider */}
          {(activeTab === TABS.LOGIN || activeTab === TABS.SIGNUP) && (
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-slate-400 font-medium absolute tracking-wide">
                {activeTab === TABS.LOGIN ? 'Or, continue with your email' : 'Or, sign up with your email'}
              </span>
            </div>
          )}

          {/* Feedback Message */}
          {message && (
            <div
              className={`p-3 rounded-xl mb-4 flex items-center gap-2 text-xs font-medium ${
                message.type === 'error'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {message.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Form: LOGIN */}
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
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => { setActiveTab(TABS.FORGOT); setMessage(null); }}
                    className="text-xs text-slate-500 hover:text-black font-medium transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* Solid Black Continue Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-black hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-[0.99] cursor-pointer mt-3 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Continue'}
              </button>

              <div className="text-center text-xs text-slate-500 mt-5">
                Don&apos;t have an account ?{' '}
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

          {/* Form: SIGN UP */}
          {activeTab === TABS.SIGNUP && (
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-800 mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
              </div>

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
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-800 mb-1.5 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-black hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-[0.99] cursor-pointer mt-3 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Create Account'}
              </button>

              <div className="text-center text-xs text-slate-500 mt-5">
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

          {/* Form: FORGOT PASSWORD */}
          {activeTab === TABS.FORGOT && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Enter your account email and we&apos;ll send you a link to reset your password.
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
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-black hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Send Reset Link'}
              </button>

              <div className="text-center text-xs text-slate-500 mt-5">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab(TABS.LOGIN); setMessage(null); }}
                  className="font-bold text-slate-900 hover:underline cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Form: RESET PASSWORD */}
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
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
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
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-black hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Update Password'}
              </button>
            </form>
          )}

        </div>

        {/* Bottom Footer Note */}
        <div className="w-full text-center lg:text-left text-[11px] text-slate-400">
          GitFix Platform &bull; Autonomous Code Intelligence
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RIGHT COLUMN: FULL-HEIGHT LIQUID GLASS SHOWCASE
         ═══════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen relative overflow-hidden items-center justify-center p-8 xl:p-14 bg-[#dfa891]">
        
        {/* Real 3D Liquid Glass Background Image */}
        <Image
          src="/liquid_glass.jpg"
          alt="Liquid Glass Ambient Art"
          fill
          priority
          sizes="50vw"
          className="object-cover object-center scale-105"
        />

        {/* Soft Ambient Refractive Lighting Blobs */}
        <div className="absolute -top-16 -right-16 w-96 h-96 rounded-full bg-white/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-orange-300/25 blur-3xl pointer-events-none" />

        {/* Floating Liquid Glassmorphic Card (Translucent & Frosted Glass) */}
        <div className="relative w-full max-w-[430px] rounded-[32px] bg-white/20 backdrop-blur-2xl border border-white/45 shadow-[0_24px_50px_rgba(0,0,0,0.14),inset_0_1px_1px_rgba(255,255,255,0.75)] p-7 flex flex-col min-h-[460px] text-slate-900 transition-all">
          
          {/* Glass Specular Reflection Sheen */}
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/30 via-white/5 to-transparent pointer-events-none" />

          {/* Header: Logo Badge + Brand Title + Subtle Frosted Tag */}
          <div className="relative flex items-center justify-between pb-5 border-b border-white/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white shadow-sm shrink-0">
                <BrandLogo size={18} />
              </div>
              <span className="font-bold text-slate-900 text-base tracking-tight drop-shadow-2xs">
                GitFix
              </span>
            </div>
            
            {/* Subtle frosted glass badge */}
            <div className="px-2.5 py-1 rounded-full bg-white/35 backdrop-blur-md border border-white/50 text-[11px] font-semibold text-slate-800 shadow-2xs flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-slate-700" />
              <span>Studio</span>
            </div>
          </div>

          {/* Liquid Glass Search Bar */}
          <div className="relative mt-5 p-3 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/50 flex items-center justify-between text-xs text-slate-600 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-600/80" />
              <span className="text-slate-600 font-medium">Search...</span>
            </div>
            <kbd className="px-2 py-0.5 rounded-lg bg-white/50 border border-white/60 text-[10px] font-mono font-semibold text-slate-700 shadow-2xs">
              ⌘ F
            </kbd>
          </div>

          {/* Menu Skeleton Rows with Glass Transparency */}
          <div className="relative mt-6 space-y-3.5">
            <div className="text-[11px] font-bold text-slate-700/80 uppercase tracking-wider px-1">
              Menu
            </div>

            {/* Translucent pill items showcasing transparent depth */}
            {[
              { w: 'w-28', active: true },
              { w: 'w-36', active: false },
              { w: 'w-24', active: false },
              { w: 'w-40', active: false },
              { w: 'w-20', active: false },
            ].map((row, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                  row.active
                    ? 'bg-white/40 backdrop-blur-lg border border-white/60 shadow-2xs'
                    : 'hover:bg-white/20'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    row.active ? 'bg-slate-900 shadow-2xs' : 'bg-slate-700/30'
                  }`}
                />
                <div
                  className={`h-2.5 rounded-full ${row.w} ${
                    row.active ? 'bg-slate-900/60' : 'bg-slate-700/20'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Subtle Frosted Accent Bottom Card */}
          <div className="relative mt-auto pt-4">
            <div className="p-3.5 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/45 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-slate-900" />
                <span className="text-xs font-semibold text-slate-800">Auto Diagnostics</span>
              </div>
              <span className="text-[11px] font-mono text-slate-600 bg-white/40 px-2 py-0.5 rounded-md border border-white/50">
                Active
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-black animate-spin" />
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
