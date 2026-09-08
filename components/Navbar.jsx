'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, ArrowLeft, LayoutDashboard, User, ChevronDown, History, BookOpen, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import BrandLogo from '@/components/BrandLogo';

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
    <nav className="border-b border-emerald-900/40 bg-[#062e1d]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white border border-emerald-500/30 group-hover:scale-105 transition-transform">
              <BrandLogo size={18} />
            </div>
            <span className="font-extrabold tracking-tight text-white text-base">
              GITFIX <span className="text-emerald-400 font-bold">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1.5 bg-black/30 p-1 rounded-full border border-emerald-600/30 text-xs font-medium text-emerald-100">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                pathname === '/dashboard' ? 'bg-white text-slate-950 font-bold shadow-sm' : 'hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Repositories</span>
            </Link>

            <Link
              href="/history"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                pathname === '/history' ? 'bg-white text-slate-950 font-bold shadow-sm' : 'hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </Link>

            <Link
              href="/docs"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                pathname === '/docs' ? 'bg-white text-slate-950 font-bold shadow-sm' : 'hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Docs</span>
            </Link>

            {pathname === '/agent' && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>Live Telemetry</span>
              </div>
            )}
          </div>
        </div>

        {/* Right User & Actions */}
        <div className="flex items-center gap-3">
          {pathname === '/agent' && (
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-emerald-200 hover:text-white hover:bg-emerald-900/50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Repos</span>
            </button>
          )}

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-emerald-500/30 transition-colors text-xs text-white cursor-pointer"
            >
              {userAvatar ? (
                <img src={userAvatar} alt="" className="w-5 h-5 rounded-full ring-1 ring-emerald-400/40" />
              ) : (
                <User className="w-3.5 h-3.5 text-emerald-300" />
              )}
              <span className="hidden sm:inline font-semibold text-emerald-100">{userName || 'Developer'}</span>
              <ChevronDown className="w-3 h-3 text-emerald-400" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-[#091510] border border-emerald-800/60 rounded-2xl shadow-2xl py-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-2 border-b border-emerald-900/50">
                  <div className="text-xs font-bold text-white truncate">{userName || 'Developer'}</div>
                  <div className="text-[10px] text-emerald-400/80 font-mono truncate">{userEmail}</div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setShowDropdown(false)}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-emerald-100 hover:text-white hover:bg-emerald-900/40 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Mission Control</span>
                </Link>

                <Link
                  href="/history"
                  onClick={() => setShowDropdown(false)}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-emerald-100 hover:text-white hover:bg-emerald-900/40 transition-colors"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Run History</span>
                </Link>

                <div className="border-t border-emerald-900/50 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-950/40 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}
