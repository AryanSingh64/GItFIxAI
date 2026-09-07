'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu as MenuIcon,
  Play,
  ArrowRight,
  Layers,
  Terminal,
  Shield,
  Activity,
  Zap,
  Users,
  CheckCircle2,
  GitPullRequest,
  Sparkles,
  X
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans flex flex-col justify-between p-3 sm:p-5 md:p-8 lg:p-10 select-none overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════
          MAIN HERO CONTAINER (Large rounded dark card matching image)
         ═══════════════════════════════════════════════════════════ */}
      <div className="relative w-full rounded-[24px] sm:rounded-[32px] md:rounded-[40px] bg-[#0c0f17] border border-white/[0.07] p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-between overflow-hidden shadow-2xl min-h-[78vh] lg:min-h-[82vh]">

        {/* Ambient Matt Green Glow in lower right */}
        <div
          className="absolute -bottom-24 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none blur-[140px] opacity-40"
          style={{ background: 'radial-gradient(circle, #228b65 0%, #134e38 50%, transparent 70%)' }}
        />

        {/* Subtle Ambient top-left glow */}
        <div
          className="absolute -top-32 -left-32 w-[380px] h-[380px] rounded-full pointer-events-none blur-[150px] opacity-20"
          style={{ background: 'radial-gradient(circle, #1a365d 0%, transparent 70%)' }}
        />

        {/* Dot Matrix Pattern in lower right corner matching image */}
        <div
          className="absolute bottom-6 right-6 w-96 h-64 pointer-events-none opacity-25"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            maskImage: 'radial-gradient(circle at bottom right, black 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at bottom right, black 30%, transparent 80%)'
          }}
        />

        {/* ─── TOP NAVBAR ─── */}
        <nav className="relative z-20 flex items-center justify-between w-full">
          {/* Logo Glyph (left) - abstract double wave matching image */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
              <svg viewBox="0 0 32 32" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M7 16 C 7 10, 16 9, 21 13 C 25 16, 25 22, 19 23 C 14 24, 11 20, 14 17 C 17 14, 23 15, 25 16" strokeLinecap="round" />
              </svg>
            </div>
          </Link>

          {/* Center Navigation Pills (Menu, Docs) */}
          <div className="hidden sm:flex items-center gap-8 text-xs font-medium text-slate-400">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
            >
              <div className="grid grid-cols-3 gap-0.5 w-3.5 h-3.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span key={i} className="w-0.5 h-0.5 bg-slate-400 rounded-full" />
                ))}
              </div>
              <span>Menu</span>
            </button>

            <Link
              href="/docs"
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <Play className="w-2.5 h-2.5 fill-slate-400 text-slate-400" />
              <span>Docs</span>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>

          {/* Right CTA Button ("Try Now" glass pill) */}
          <button
            onClick={() => router.push('/auth')}
            className="px-5 py-2 rounded-xl text-xs font-medium text-slate-200 bg-[#161a26]/90 border border-white/[0.12] hover:bg-[#1f2536] hover:border-white/20 transition-all shadow-lg cursor-pointer"
          >
            Try Now
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden relative z-30 mt-4 p-4 rounded-xl bg-[#121622] border border-white/10 flex flex-col gap-3 text-xs">
            <Link href="/dashboard" className="text-slate-300 hover:text-white py-1">Menu (Repositories)</Link>
            <Link href="/docs" className="text-slate-300 hover:text-white py-1">Docs</Link>
            <Link href="/history" className="text-slate-300 hover:text-white py-1">History</Link>
          </div>
        )}

        {/* ─── HERO CONTENT AREA ─── */}
        <div className="relative z-10 my-auto py-8 sm:py-12 lg:py-14 flex flex-col justify-between gap-12 lg:gap-16">

          {/* Top Right Floating Card (Matching the exact card in the reference image) */}
          <div className="self-end w-full sm:w-[420px] lg:w-[460px]">
            <div className="p-6 md:p-7 rounded-2xl bg-[#141824]/70 border border-white/[0.08] backdrop-blur-xl shadow-xl">
              <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight leading-snug mb-5">
                Automated code healing & test repair across TypeScript, Python, Go & more
              </h3>

              <div className="flex items-center gap-3 pt-1">
                {/* Tech icons cluster */}
                <div className="flex items-center -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#1e2333] border border-white/15 flex items-center justify-center text-[9px] font-mono font-bold text-slate-300">
                    TS
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#1e2333] border border-white/15 flex items-center justify-center text-[9px] font-mono font-bold text-slate-300">
                    PY
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#1e2333] border border-white/15 flex items-center justify-center text-[9px] font-mono font-bold text-slate-300">
                    GO
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#1e2333] border border-white/15 flex items-center justify-center text-[9px] font-mono font-bold text-slate-300">
                    RS
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 leading-tight">
                  Ultra-fast execution with deterministic AST validation
                </div>
              </div>
            </div>
          </div>

          {/* Lower Row: Left Title & Right Subcopy + Button */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            
            {/* Left Column: Pill badge + Headline */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {/* Pill badge (Image: 🚀 Sigma - speed advantage!) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161a26]/80 border border-white/[0.08] backdrop-blur-md w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#34a87b]" />
                <span className="text-xs text-slate-300 font-medium">
                  GitFix <span className="text-white/30">—</span> autonomous advantage
                </span>
              </div>

              {/* Headline with Matt Green color on "remediation platform" */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.08] max-w-2xl">
                Leading multi-language code repair and{' '}
                <span className="text-[#2fb380]">remediation platform</span>
              </h1>
            </div>

            {/* Right Column: Copy + CTA button matching image */}
            <div className="lg:col-span-4 flex flex-col gap-4 lg:pl-4">
              <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed">
                Elevate your code quality! Fix fast and <strong className="text-white font-medium">confidently</strong> with deterministic AST validation. Your ultimate CI/CD healing companion.
              </p>

              <div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-medium text-white bg-[#1a202c]/90 hover:bg-[#242c3d] border border-white/[0.16] hover:border-white/30 transition-all shadow-lg cursor-pointer"
                >
                  Try Mission Control
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════
          BOTTOM STATS ROW (4 discrete columns matching reference image)
         ═══════════════════════════════════════════════════════════ */}
      <div className="w-full px-4 sm:px-8 py-8 md:py-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 border-t border-white/[0.06] mt-4">
        
        {/* Stat 1 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5 text-slate-400">
            <div className="w-6 h-6 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
              <Activity className="w-3 h-3 text-slate-400" />
            </div>
            <span className="text-[11px] sm:text-xs text-slate-400 leading-tight">
              Code fixes executed through GitFix
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight tabular-nums pl-8">
            $100M+
          </div>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5 text-slate-400">
            <div className="w-6 h-6 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
              <Zap className="w-3 h-3 text-slate-400" />
            </div>
            <span className="text-[11px] sm:text-xs text-slate-400 leading-tight">
              Speed of execution of AST passes
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight tabular-nums pl-8">
            &lt;0.1s
          </div>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5 text-slate-400">
            <div className="w-6 h-6 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
              <Users className="w-3 h-3 text-slate-400" />
            </div>
            <span className="text-[11px] sm:text-xs text-slate-400 leading-tight">
              Developers trust GitFix
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight tabular-nums pl-8">
            10,000+
          </div>
        </div>

        {/* Stat 4 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5 text-slate-400">
            <div className="w-6 h-6 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3 h-3 text-slate-400" />
            </div>
            <span className="text-[11px] sm:text-xs text-slate-400 leading-tight">
              Successful builds with deterministic fixes
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight tabular-nums pl-8">
            98%
          </div>
        </div>

      </div>

    </div>
  );
}
