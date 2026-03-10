import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, Mail, Lock, User, Eye, EyeOff,
    ArrowRight, Loader2, CheckCircle2, AlertCircle, ArrowLeft
} from 'lucide-react';
import {
    signInWithEmail, signUpWithEmail,
    signInWithGoogle,
    resetPassword, updatePassword
} from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const TABS = {
    LOGIN: 'login',
    SIGNUP: 'signup',
    FORGOT: 'forgot',
    RESET: 'reset',
};

export default function Auth() {
    const [activeTab, setActiveTab] = useState(TABS.LOGIN);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success'|'error', text: '...' }
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated } = useAuth();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) navigate('/dashboard', { replace: true });
    }, [isAuthenticated, navigate]);

    // Handle password reset callback
    useEffect(() => {
        if (searchParams.get('mode') === 'reset') {
            setActiveTab(TABS.RESET);
        }
    }, [searchParams]);

    const clearForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        setMessage(null);
    };

    const showMsg = (type, text) => setMessage({ type, text });

    // ─── Handlers ──────────────────────────────────

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) return showMsg('error', 'Please fill in all fields.');
        setLoading(true);
        try {
            await signInWithEmail(email, password);
            navigate('/dashboard');
        } catch (err) {
            showMsg('error', err.message || 'Login failed. Check your credentials.');
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
            showMsg('success', '🎉 Account created! Check your email to verify your account.');
        } catch (err) {
            showMsg('error', err.message || 'Sign up failed.');
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
            showMsg('success', '📧 Password reset link sent! Check your email inbox.');
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
            setTimeout(() => navigate('/dashboard'), 2000);
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
        } catch (err) {
            showMsg('error', err.message || 'Google login failed.');
            setLoading(false);
        }
    };



    // ─── Animations ──────────────────────────────────

    const formVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
        exit: { opacity: 0, y: -15, scale: 0.98, transition: { duration: 0.2 } },
    };

    // ─── Render ──────────────────────────────────────

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-[20%] left-[15%] w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[15%] w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md relative z-10"
            >
                {/* Card */}
                <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">

                    {/* Header */}
                    <div className="text-center pt-6 pb-3 px-6 md:px-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="inline-flex p-2.5 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-xl mb-4 border border-white/5 shadow-inner"
                        >
                            <ShieldCheck className="w-7 h-7 text-white" />
                        </motion.div>
                        <h1 className="text-xl font-bold tracking-tight text-white mb-0.5">
                            {activeTab === TABS.LOGIN && 'Welcome Back'}
                            {activeTab === TABS.SIGNUP && 'Create Account'}
                            {activeTab === TABS.FORGOT && 'Reset Password'}
                            {activeTab === TABS.RESET && 'Set New Password'}
                        </h1>
                        <p className="text-secondary text-xs">
                            {activeTab === TABS.LOGIN && 'Sign in to access your autonomous agent.'}
                            {activeTab === TABS.SIGNUP && 'Join the next generation of DevOps.'}
                            {activeTab === TABS.FORGOT && "Enter your email and we'll send you a reset link."}
                            {activeTab === TABS.RESET && 'Choose a new secure password.'}
                        </p>
                    </div>

                    {/* Tab Switcher (Login/Signup) */}
                    {(activeTab === TABS.LOGIN || activeTab === TABS.SIGNUP) && (
                        <div className="flex mx-6 md:mx-10 mb-4 bg-black/50 rounded-lg p-1 border border-white/5">
                            {[TABS.LOGIN, TABS.SIGNUP].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveTab(tab); clearForm(); }}
                                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${activeTab === tab
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'text-secondary hover:text-white'
                                        }`}
                                >
                                    {tab === TABS.LOGIN ? 'Sign In' : 'Sign Up'}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Form Content */}
                    <div className="px-6 md:px-10 pb-6 md:pb-10">
                        <AnimatePresence mode="wait">

                            {/* ───── Login ───── */}
                            {activeTab === TABS.LOGIN && (
                                <motion.form key="login" variants={formVariants} initial="hidden" animate="visible" exit="exit"
                                    onSubmit={handleEmailLogin} className="space-y-4">

                                    <InputField icon={<Mail />} type="email" placeholder="Email address"
                                        value={email} onChange={setEmail} />

                                    <InputField icon={<Lock />} type={showPassword ? 'text' : 'password'} placeholder="Password"
                                        value={password} onChange={setPassword}
                                        suffix={
                                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                className="text-secondary hover:text-white transition-colors">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        }
                                    />

                                    <div className="text-right">
                                        <button type="button" onClick={() => { setActiveTab(TABS.FORGOT); clearForm(); }}
                                            className="text-xs text-primary/80 hover:text-primary transition-colors">
                                            Forgot password?
                                        </button>
                                    </div>

                                    <SubmitButton loading={loading} text="Sign In" />
                                </motion.form>
                            )}

                            {/* ───── Signup ───── */}
                            {activeTab === TABS.SIGNUP && (
                                <motion.form key="signup" variants={formVariants} initial="hidden" animate="visible" exit="exit"
                                    onSubmit={handleEmailSignup} className="space-y-4">

                                    <InputField icon={<User />} type="text" placeholder="Full name"
                                        value={fullName} onChange={setFullName} />

                                    <InputField icon={<Mail />} type="email" placeholder="Email address"
                                        value={email} onChange={setEmail} />

                                    <InputField icon={<Lock />} type={showPassword ? 'text' : 'password'} placeholder="Password (min 6 chars)"
                                        value={password} onChange={setPassword}
                                        suffix={
                                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                className="text-secondary hover:text-white transition-colors">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        }
                                    />

                                    <InputField icon={<Lock />} type={showPassword ? 'text' : 'password'} placeholder="Confirm password"
                                        value={confirmPassword} onChange={setConfirmPassword} />

                                    <SubmitButton loading={loading} text="Create Account" />
                                </motion.form>
                            )}

                            {/* ───── Forgot Password ───── */}
                            {activeTab === TABS.FORGOT && (
                                <motion.form key="forgot" variants={formVariants} initial="hidden" animate="visible" exit="exit"
                                    onSubmit={handleForgotPassword} className="space-y-4">

                                    <InputField icon={<Mail />} type="email" placeholder="Your email address"
                                        value={email} onChange={setEmail} />

                                    <SubmitButton loading={loading} text="Send Reset Link" />

                                    <button type="button" onClick={() => { setActiveTab(TABS.LOGIN); clearForm(); }}
                                        className="flex items-center gap-2 text-sm text-secondary hover:text-white transition-colors mx-auto">
                                        <ArrowLeft className="w-4 h-4" /> Back to Sign In
                                    </button>
                                </motion.form>
                            )}

                            {/* ───── Reset Password ───── */}
                            {activeTab === TABS.RESET && (
                                <motion.form key="reset" variants={formVariants} initial="hidden" animate="visible" exit="exit"
                                    onSubmit={handleResetPassword} className="space-y-4">

                                    <InputField icon={<Lock />} type="password" placeholder="New password (min 6 chars)"
                                        value={password} onChange={setPassword} />

                                    <InputField icon={<Lock />} type="password" placeholder="Confirm new password"
                                        value={confirmPassword} onChange={setConfirmPassword} />

                                    <SubmitButton loading={loading} text="Update Password" />
                                </motion.form>
                            )}

                        </AnimatePresence>

                        {/* Status Messages */}
                        <AnimatePresence>
                            {message && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className={`mt-4 flex items-start gap-2 p-3 rounded-lg text-sm border ${message.type === 'success'
                                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                                        }`}
                                >
                                    {message.type === 'success'
                                        ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                                        : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    }
                                    <span>{message.text}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* OAuth Divider + Buttons (Login/Signup only) */}
                        {(activeTab === TABS.LOGIN || activeTab === TABS.SIGNUP) && (
                            <div className="mt-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex-1 h-px bg-white/10" />
                                    <span className="text-xs text-secondary uppercase tracking-widest">or continue with</span>
                                    <div className="flex-1 h-px bg-white/10" />
                                </div>

                                <div className="flex gap-3">
                                    <OAuthButton onClick={handleGoogleLogin} disabled={loading}
                                        icon={<GoogleIcon />} label="Continue with Google" fullWidth />
                                </div>
                            </div>
                        )}

                        <p className="mt-6 text-center text-xs text-zinc-600">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}


// ─── Sub-Components ─────────────────────────────────────────────────────

function InputField({ icon, type, placeholder, value, onChange, suffix }) {
    return (
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50 group-focus-within:text-primary transition-colors">
                {React.cloneElement(icon, { className: 'w-4 h-4' })}
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-11 pr-11 py-2.5 text-white text-sm placeholder:text-secondary/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
            {suffix && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {suffix}
                </div>
            )}
        </div>
    );
}

function SubmitButton({ loading, text }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 text-white font-bold rounded-xl py-2.5 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    {text} <ArrowRight className="w-4 h-4" />
                </>
            )}
        </button>
    );
}

function OAuthButton({ onClick, disabled, icon, label, fullWidth }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center justify-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white py-2.5 rounded-xl transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium ${fullWidth ? 'w-full' : ''}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

function GoogleIcon() {
    return (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

function GithubIcon() {
    return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
    );
}
