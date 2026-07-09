import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ArrowLeft, Terminal, LayoutDashboard, User, ChevronDown, History, BookOpen } from 'lucide-react';
import { signOut } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userName, userAvatar, userEmail, authProvider } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = async () => {
        try {
            // Clear separate GitHub connection tokens
            localStorage.removeItem('github_access_token');
            localStorage.removeItem('github_user');
            await signOut();
            navigate('/');
        } catch (err) {
            console.error('Logout error:', err);
            localStorage.removeItem('github_access_token');
            localStorage.removeItem('github_user');
            navigate('/');
        }
    };

    const isLanding = location.pathname === '/';
    const isAuth = location.pathname === '/auth';
    const isDocs = location.pathname === '/docs';

    if (isLanding || isAuth || isDocs) return null;

    return (
        <div className="border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-3 md:px-6 h-12 md:h-14 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
                        <div className="bg-gradient-to-br from-[#0066ff]/20 to-[#7c3aed]/20 p-1 md:p-1.5 rounded-lg border border-white/10 group-hover:border-[#7c3aed]/50 transition-colors">
                            <svg viewBox="0 0 120 120" className="w-4 h-4 md:w-5 md:h-5">
                                <circle cx="60" cy="32" r="16" fill="#24292e" />
                                <circle cx="54" cy="30" r="4" fill="white" />
                                <circle cx="66" cy="30" r="4" fill="white" />
                                <circle cx="55" cy="30" r="2" fill="#0d1117" />
                                <circle cx="67" cy="30" r="2" fill="#0d1117" />
                                <path d="M55 37 Q60 42 65 37" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                <ellipse cx="60" cy="52" rx="18" ry="20" fill="#24292e" />
                                <circle cx="46" cy="22" r="5" fill="#24292e" />
                                <circle cx="74" cy="22" r="5" fill="#24292e" />
                            </svg>
                        </div>
                        <span className="font-bold tracking-tight text-white text-sm md:text-base">
                            <span className="font-normal">Git</span>
                            <span className="font-bold">Fix</span>
                            <span className="font-bold bg-gradient-to-r from-[#0066ff] to-[#7c3aed] bg-clip-text text-transparent">AI</span>
                        </span>
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-1 text-sm font-medium text-secondary">
                        <Link to="/dashboard" className={`flex items-center gap-2 px-3 py-1.5 rounded-md hover:text-white transition-colors ${location.pathname === '/dashboard' ? 'text-white bg-white/5' : ''}`}>
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link to="/history" className={`flex items-center gap-2 px-3 py-1.5 rounded-md hover:text-white transition-colors ${location.pathname === '/history' ? 'text-white bg-white/5' : ''}`}>
                            <History className="w-4 h-4" /> History
                        </Link>
                        <Link to="/docs" className={`flex items-center gap-2 px-3 py-1.5 rounded-md hover:text-white transition-colors ${location.pathname === '/docs' ? 'text-white bg-white/5' : ''}`}>
                            <BookOpen className="w-4 h-4" /> Docs
                        </Link>
                        {location.pathname === '/agent' && (
                            <>
                                <span className="text-white/10">/</span>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-primary bg-primary/10 border border-primary/20">
                                    <Terminal className="w-3 h-3" /> Active Session
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile nav icons */}
                    <div className="flex md:hidden items-center gap-0.5 ml-2">
                        <Link to="/dashboard" className={`p-2 rounded-md transition-colors ${location.pathname === '/dashboard' ? 'text-white bg-white/5' : 'text-white/40'}`}>
                            <LayoutDashboard className="w-4 h-4" />
                        </Link>
                        <Link to="/history" className={`p-2 rounded-md transition-colors ${location.pathname === '/history' ? 'text-white bg-white/5' : 'text-white/40'}`}>
                            <History className="w-4 h-4" />
                        </Link>
                        <Link to="/docs" className={`p-2 rounded-md transition-colors ${location.pathname === '/docs' ? 'text-white bg-white/5' : 'text-white/40'}`}>
                            <BookOpen className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {location.pathname === '/agent' && (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-secondary hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </button>
                    )}

                    {/* User Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-1.5 md:gap-2 px-1.5 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                        >
                            {userAvatar ? (
                                <img src={userAvatar} alt={userName} className="w-7 h-7 rounded-full ring-2 ring-gradient-to-r from-[#0066ff]/50 to-[#7c3aed]/50" />
                            ) : (
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/10">
                                    {userName?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                            )}
                            <span className="text-sm font-medium text-white hidden md:block max-w-[120px] truncate">{userName}</span>
                            <ChevronDown className={`w-3 h-3 text-secondary transition-transform hidden md:block ${showDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                                <div className="absolute right-0 top-full mt-2 w-64 bg-surface border border-white/10 rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden animate-fade-in">
                                    <div className="p-4 border-b border-white/5">
                                        <div className="flex items-center gap-3">
                                            {userAvatar ? (
                                                <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full ring-2 ring-white/10" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-sm font-bold text-white">
                                                    {userName?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-white truncate">{userName}</p>
                                                <p className="text-xs text-secondary truncate">{userEmail}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-xs text-secondary border border-white/5 capitalize">
                                                {authProvider === 'google' ? (
                                                    <GoogleIcon />
                                                ) : authProvider === 'github' ? (
                                                    <GithubIcon />
                                                ) : (
                                                    <User className="w-3 h-3" />
                                                )}
                                                {authProvider}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 text-sm font-medium text-secondary hover:text-red-400 hover:bg-white/5 transition-colors px-3 py-2.5 rounded-lg"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function GoogleIcon() {
    return (
        <svg className="w-3 h-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

function GithubIcon() {
    return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
    );
}
