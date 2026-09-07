'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Play,
  Activity,
  Zap,
  Users,
  CheckCircle2,
  Menu as MenuIcon,
  X
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 font-sans flex flex-col justify-between select-none overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════
          HERO CONTAINER (Curved Dark Midnight Navy Canvas)
         ═══════════════════════════════════════════════════════════ */}
      <div className="relative w-full rounded-b-[36px] sm:rounded-b-[44px] md:rounded-b-[52px] bg-gradient-to-b from-[#0b0f19] via-[#090d16] to-[#070a12] border-b border-x border-white/[0.07] px-6 sm:px-10 md:px-14 lg:px-16 pt-7 pb-12 sm:pb-16 md:pb-20 flex flex-col justify-between overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex-1 min-h-[82vh] lg:min-h-[86vh]">

        {/* Ambient Dark Navy/Blue Atmosphere (Center-Right) */}
        <div
          className="absolute top-1/4 right-[5%] w-[550px] h-[550px] rounded-full pointer-events-none blur-[150px] opacity-35"
          style={{ background: 'radial-gradient(circle, #0f2e4d 0%, #091929 60%, transparent 80%)' }}
        />

        {/* Ambient Matt Green Glow (Lower-Right Corner) */}
        <div
          className="absolute -bottom-20 right-[2%] w-[420px] h-[420px] rounded-full pointer-events-none blur-[130px] opacity-35"
          style={{ background: 'radial-gradient(circle, #1c6d50 0%, #0d3627 50%, transparent 75%)' }}
        />

        {/* Dot Matrix Grid Pattern in lower right */}
        <div
          className="absolute bottom-8 right-12 w-[420px] h-[260px] pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
            maskImage: 'radial-gradient(ellipse at bottom right, black 25%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at bottom right, black 25%, transparent 75%)'
          }}
        />

        {/* ─── TOP NAVBAR ─── */}
        <nav className="relative z-20 flex items-center justify-between w-full">
          {/* Logo Glyph (left) - abstract vortex spiral matching reference */}
          <Link href="/" className="group flex items-center">
            <div className="w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 32 32" className="w-8 h-8 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M7 16 C 7 10, 16 9, 21 13 C 25 16, 25 22, 19 23 C 14 24, 11 20, 14 17 C 17 14, 23 15, 25 16" strokeLinecap="round" />
              </svg>
            </div>
          </Link>

          {/* Center Links (Menu, Docs) with generous spacing */}
          <div className="hidden sm:flex items-center gap-16 md:gap-24 text-[13px] font-medium text-[#8b9bb4]">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2.5 hover:text-white transition-colors cursor-pointer"
            >
              <div className="grid grid-cols-3 gap-0.5 w-3.5 h-3.5 opacity-80">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span key={i} className="w-0.5 h-0.5 bg-current rounded-full" />
                ))}
              </div>
              <span className="tracking-wide">Menu</span>
            </button>

            <Link
              href="/docs"
              className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
            >
              <Play className="w-2.5 h-2.5 fill-current text-current opacity-80" />
              <span className="tracking-wide">Docs</span>
            </Link>
          </div>

          {/* Right Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-[#8b9bb4] hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>

          {/* Right CTA Button ("Try Now" frosted pill) */}
          <button
            onClick={() => router.push('/auth')}
            className="hidden sm:block px-6 py-2.5 rounded-xl text-[13px] font-medium text-slate-100 bg-[#192233]/70 hover:bg-[#202b40] border border-white/[0.14] hover:border-white/[0.24] transition-all shadow-[0_4px_16px_rgba(0,0,0,0.3)] cursor-pointer backdrop-blur-md"
          >
            Try Now
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden relative z-30 mt-4 p-4 rounded-xl bg-[#121824] border border-white/10 flex flex-col gap-3 text-xs">
            <Link href="/dashboard" className="text-slate-300 hover:text-white py-1">Menu (Repositories)</Link>
            <Link href="/docs" className="text-slate-300 hover:text-white py-1">Docs</Link>
            <Link href="/history" className="text-slate-300 hover:text-white py-1">History</Link>
            <button
              onClick={() => router.push('/auth')}
              className="mt-2 w-full py-2 bg-[#192233] text-white rounded-lg font-medium border border-white/15"
            >
              Try Now
            </button>
          </div>
        )}

        {/* ─── HERO CONTENT AREA ─── */}
        <div className="relative z-10 my-auto py-10 sm:py-14 md:py-16 flex flex-col justify-between gap-12 lg:gap-16">

          {/* Top Right Floating Card (Matching the exact card in the reference image) */}
          <div className="self-end w-full sm:w-[410px] md:w-[440px] lg:w-[470px]">
            <div className="p-6 sm:p-7 rounded-2xl bg-[#121826]/70 border border-white/[0.08] backdrop-blur-xl shadow-2xl">
              <h3 className="text-[17px] sm:text-[18px] font-medium text-slate-100 tracking-[-0.01em] leading-[1.35] mb-6">
                Automated code healing & test repair across TypeScript, Python, Go & more
              </h3>

              <div className="flex items-center gap-3 pt-1">
                {/* Tech icons cluster */}
                <div className="flex items-center -space-x-1.5 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-[#1b2333] border border-white/15 flex items-center justify-center text-[9px] font-mono font-bold text-slate-300 shadow-sm">
                    TS
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#1b2333] border border-white/15 flex items-center justify-center text-[9px] font-mono font-bold text-slate-300 shadow-sm">
                    PY
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#1b2333] border border-white/15 flex items-center justify-center text-[9px] font-mono font-bold text-slate-300 shadow-sm">
                    GO
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#1b2333] border border-white/15 flex items-center justify-center text-[9px] font-mono font-bold text-slate-300 shadow-sm">
                    RS
                  </div>
                </div>

                <div className="text-[11px] text-[#758a9e] leading-[1.3] pl-2">
                  Ultra-fast execution with deterministic AST validation
                </div>
              </div>
            </div>
          </div>

          {/* Lower Row: Left Title & Right Subcopy + Button */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            
            {/* Left Column: Pill badge + Headline */}
            <div className="lg:col-span-8 flex flex-col gap-3.5">
              {/* Pill badge (Image: 🚀 Sigma — speed advantage!) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131e2e]/80 border border-[#3b82f6]/20 text-[#7dd3fc] text-[12px] font-medium w-fit backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>
                  GitFix <span className="opacity-50">—</span> autonomous advantage!
                </span>
              </div>

              {/* Headline with Matt Green color on "remediation platform" */}
              <h1 className="text-3xl sm:text-5xl md:text-[54px] lg:text-[58px] font-semibold text-white tracking-[-0.03em] leading-[1.08] max-w-2xl">
                Leading multi-language code repair and{' '}
                <span className="text-[#32a87a]">remediation platform</span>
              </h1>
            </div>

            {/* Right Column: Copy + Frosted CTA button */}
            <div className="lg:col-span-4 flex flex-col gap-4 lg:pl-6">
              <p className="text-[13px] text-[#758a9e] leading-[1.48] max-w-[340px]">
                Elevate your repository reliability! Remediate <strong className="text-slate-200 font-medium">fast</strong> and <strong className="text-slate-200 font-medium">confidently</strong> with AST verification. Your ultimate CI/CD healing companion.
              </p>

              <div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 rounded-xl text-[13px] font-medium text-slate-200 bg-[#182235]/80 hover:bg-[#202c42] border border-white/[0.16] hover:border-white/[0.28] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.35)] cursor-pointer inline-flex items-center gap-2 backdrop-blur-md"
                >
                  Try Mission Control
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════
          DARK BLUE BOTTOM STATS BAR
          (4 discrete columns with vertical hairline dividers)
         ═══════════════════════════════════════════════════════════ */}
      <footer className="w-full bg-[#05070d] px-6 sm:px-10 md:px-14 lg:px-16 py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
          
          {/* Stat 1 */}
          <div className="md:pr-8 md:border-r border-white/[0.08] flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                <Activity className="w-3.5 h-3.5 text-[#8293a9]" />
              </div>
              <span className="text-[11px] text-[#718298] leading-[1.3] font-normal">
                Code fixes executed<br />through GitFix
              </span>
            </div>
            <div className="text-[26px] sm:text-[30px] font-semibold text-white tracking-tight tabular-nums pl-10 mt-3">
              $100M+
            </div>
          </div>

          {/* Stat 2 */}
          <div className="md:px-8 md:border-r border-white/[0.08] flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5 text-[#8293a9]" />
              </div>
              <span className="text-[11px] text-[#718298] leading-[1.3] font-normal">
                Speed of execution of<br />remediation passes
              </span>
            </div>
            <div className="text-[26px] sm:text-[30px] font-semibold text-white tracking-tight tabular-nums pl-10 mt-3">
              &lt;0.1s
            </div>
          </div>

          {/* Stat 3 */}
          <div className="md:px-8 md:border-r border-white/[0.08] flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5 text-[#8293a9]" />
              </div>
              <span className="text-[11px] text-[#718298] leading-[1.3] font-normal">
                Developers trust<br />GitFix
              </span>
            </div>
            <div className="text-[26px] sm:text-[30px] font-semibold text-white tracking-tight tabular-nums pl-10 mt-3">
              10,000+
            </div>
          </div>

          {/* Stat 4 */}
          <div className="md:pl-8 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8293a9]" />
              </div>
              <span className="text-[11px] text-[#718298] leading-[1.3] font-normal">
                Successful builds with<br />advanced algorithms
              </span>
            </div>
            <div className="text-[26px] sm:text-[30px] font-semibold text-white tracking-tight tabular-nums pl-10 mt-3">
              98%
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
