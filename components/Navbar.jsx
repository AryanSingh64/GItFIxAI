'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, ArrowLeft, Terminal, LayoutDashboard, User, ChevronDown, History, BookOpen, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { userName, userAvatar, userEmail, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('github_access_token');
      localStorage.removeItem('github_user');
      await signOut();
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
      router.push('/');
    }
  };

  const isLanding = pathname === '/';
  const isAuth = pathname === '/auth';

  if (isLanding || isAuth) return null;

  return (
    <nav className="border-b border-white/[0.06] bg-[#07080b]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            {/* Geometric vortex glyph from Image 1 */}
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 0 1 10 10c0 4.418-2.865 8.167-6.84 9.47M12 22A10 10 0 0 1 2 12C2 7.582 4.865 3.833 8.84 2.53" strokeLinecap="round" />
                <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.4" />
              </svg>
            </div>
            <span className="font-semibold tracking-tight text-white text-sm">
              GitFix<span className="text-white/40 font-normal">AI</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-400">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md hover:text-white hover:bg-white/[0.04] transition-colors ${
                pathname === '/dashboard' ? 'text-white bg-white/[0.06]' : ''
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Repositories
            </Link>
            <Link
              href="/history"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md hover:text-white hover:bg-white/[0.04] transition-colors ${
                pathname === '/history' ? 'text-white bg-white/[0.06]' : ''
              }`}
            >
              <History className="w-3.5 h-3.5" /> History
            </Link>
            <Link
              href="/docs"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md hover:text-white hover:bg-white/[0.04] transition-colors ${
                pathname === '/docs' ? 'text-white bg-white/[0.06]' : ''
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Docs
            </Link>
            {pathname === '/agent' && (
              <>
                <span className="text-white/10">/</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-lime-400 bg-lime-400/10 border border-lime-400/20 text-xs">
                  <Activity className="w-3 h-3 animate-pulse" /> Active Telemetry
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {pathname === '/agent' && (
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Repositories
            </button>
          )}

          {/* User profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition-colors text-xs text-white cursor-pointer"
            >
              {userAvatar ? (
                <img src={userAvatar} alt="" className="w-5 h-5 rounded-full ring-1 ring-white/20" />
              ) : (
                <User className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span className="hidden sm:inline font-medium text-slate-200">{userName || 'Developer'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0d0f17] border border-white/10 rounded-xl shadow-2xl py-1 z-50">
                <div className="px-3 py-2 border-b border-white/5">
                  <div className="text-xs font-medium text-white truncate">{userName || 'Developer'}</div>
                  <div className="text-[10px] text-slate-400 truncate">{userEmail}</div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setShowDropdown(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Repositories
                </Link>
                <Link
                  href="/history"
                  onClick={() => setShowDropdown(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5"
                >
                  <History className="w-3.5 h-3.5" /> Run History
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

