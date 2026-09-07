'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, ArrowLeft, Terminal, LayoutDashboard, User, ChevronDown, History, BookOpen } from 'lucide-react';
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
    <div className="border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 md:px-6 h-12 md:h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
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
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md hover:text-white transition-colors ${
                pathname === '/dashboard' ? 'text-white bg-white/5' : ''
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link
              href="/history"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md hover:text-white transition-colors ${
                pathname === '/history' ? 'text-white bg-white/5' : ''
              }`}
            >
              <History className="w-4 h-4" /> History
            </Link>
            <Link
              href="/docs"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md hover:text-white transition-colors ${
                pathname === '/docs' ? 'text-white bg-white/5' : ''
              }`}
            >
              <BookOpen className="w-4 h-4" /> Docs
            </Link>
            {pathname === '/agent' && (
              <>
                <span className="text-white/10">/</span>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-primary bg-primary/10 border border-primary/20">
                  <Terminal className="w-3 h-3" /> Active Session
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {pathname === '/agent' && (
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-secondary hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
          )}

          {/* User profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-xs text-white cursor-pointer"
            >
              {userAvatar ? (
                <img src={userAvatar} alt="" className="w-5 h-5 rounded-full ring-1 ring-white/20" />
              ) : (
                <User className="w-4 h-4 text-violet-400" />
              )}
              <span className="hidden sm:inline font-medium">{userName}</span>
              <ChevronDown className="w-3 h-3 text-secondary" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0c0c10] border border-white/10 rounded-xl shadow-xl py-1 z-50">
                <div className="px-3 py-2 border-b border-white/5">
                  <div className="text-xs font-medium text-white truncate">{userName}</div>
                  <div className="text-[10px] text-secondary truncate">{userEmail}</div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setShowDropdown(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-secondary hover:text-white hover:bg-white/5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </Link>
                <Link
                  href="/history"
                  onClick={() => setShowDropdown(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-secondary hover:text-white hover:bg-white/5"
                >
                  <History className="w-3.5 h-3.5" /> Run History
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
