'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  Github,
  Twitter,
  Mail,
  CheckCircle2,
  Bug,
  GitPullRequest,
  RefreshCw,
  Workflow,
  ShieldCheck,
  Cpu,
  Menu as MenuIcon,
  X,
  ExternalLink,
  Code2,
  Terminal,
  Layers
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // 6 Core GitFix AI Folders (Directly inspired by Inspo #2 with physical folder cards)
  const folders = [
    {
      id: 'bug-detection',
      name: 'Bug Detection',
      tag: 'AST Scanner',
      tabColor: 'bg-[#60a5fa]',
      bodyColor: 'bg-[#3b82f6]',
      textColor: 'text-white',
      accentColor: 'text-blue-100',
      icon: Bug,
      rotation: 'hover:-rotate-2',
      badge: 'Multi-Lang',
      description: 'Deep Abstract Syntax Tree parsing that intercepts syntax errors, undefined references, and runtime exceptions.',
      stats: 'Supports Python, TS, JS, Go',
      code: `// Bug Detected: TypeError at line 42
- const token = user.auth.getToken()
+ const token = user.auth?.getToken?.() ?? null`
    },
    {
      id: 'auto-prs',
      name: 'Autonomous PRs',
      tag: 'GitHub Native',
      tabColor: 'bg-[#4ade80]',
      bodyColor: 'bg-[#22c55e]',
      textColor: 'text-slate-950',
      accentColor: 'text-emerald-900',
      icon: GitPullRequest,
      rotation: 'hover:rotate-2',
      badge: 'Zero Friction',
      description: 'Creates isolated branches, applies verified patches, writes clear changelogs, and opens ready-to-merge Pull Requests.',
      stats: '1-Click Merge Verified',
      code: `// Branch: gitfix/patch-sec-auth
// Title: fix(auth): null-safe token extraction
// All CI checks passing • Verified by GitFix`
    },
    {
      id: 'test-healing',
      name: 'Test Healing',
      tag: 'Auto-Retry',
      tabColor: 'bg-[#fb923c]',
      bodyColor: 'bg-[#f97316]',
      textColor: 'text-white',
      accentColor: 'text-orange-100',
      icon: RefreshCw,
      rotation: 'hover:-rotate-1',
      badge: 'Loop Engine',
      description: 'Discovers pytest, jest, and go test runners, executes suites, analyzes stack traces, and loops until all tests pass.',
      stats: '100% Pass Rate Target',
      code: `// Running pytest -v tests/
// FAIL: test_auth_token_null_safety
// Applying AI patch -> RE-TESTING...
// PASS: All 18 tests passing successfully!`
    },
    {
      id: 'ci-cd',
      name: 'CI/CD Pipelines',
      tag: 'Webhook Bot',
      tabColor: 'bg-[#facc15]',
      bodyColor: 'bg-[#eab308]',
      textColor: 'text-slate-950',
      accentColor: 'text-yellow-950',
      icon: Workflow,
      rotation: 'hover:rotate-1',
      badge: 'Actions Ready',
      description: 'Listens for GitHub Actions failures. When a build breaks, GitFix triggers instantly to diagnose and submit a PR fix.',
      stats: 'Webhook Automated',
      code: `on: workflow_run
  workflows: ["CI Build"]
  types: [completed]
# GitFix auto-intercepts red builds`
    },
    {
      id: 'security-audits',
      name: 'Security Audits',
      tag: 'Vulnerability Guard',
      tabColor: 'bg-[#f472b6]',
      bodyColor: 'bg-[#ec4899]',
      textColor: 'text-white',
      accentColor: 'text-pink-100',
      icon: ShieldCheck,
      rotation: 'hover:-rotate-2',
      badge: 'Static Analysis',
      description: 'Integrates Bandit, ESLint Security, flake8, and go vet to patch SQL injection risks, insecure dependencies, and data leaks.',
      stats: 'Zero Known CVEs',
      code: `// Bandit Security Alert: B608 (SQL Injection)
- query = f"SELECT * FROM users WHERE id = {user_id}"
+ query = "SELECT * FROM users WHERE id = %s", (user_id,)`
    },
    {
      id: 'mission-control',
      name: 'Mission Control',
      tag: 'Live Telemetry',
      tabColor: 'bg-white',
      bodyColor: 'bg-slate-100',
      textColor: 'text-slate-900',
      accentColor: 'text-slate-600',
      icon: Cpu,
      rotation: 'hover:rotate-2',
      badge: 'Real-Time',
      description: 'Real-time WebSocket telemetry with animated health score gauge, live streaming compiler logs, and interactive diff inspector.',
      stats: 'Live WebSocket Stream',
      code: `[WS] Connected: session_71829
[STATUS] AST Parse: OK (412 files)
[STATUS] Health Score: 98/100 (+14 pts)`
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-400 selection:text-black">

      {/* ═══════════════════════════════════════════════════════════════
          MINIMALIST TOP NAVIGATION BAR (Matching Inspo #1)
         ═══════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#063a23]/80 backdrop-blur-md border-b border-emerald-800/40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Left: Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white border border-emerald-500/30 group-hover:scale-105 transition-transform">
              <BrandLogo size={18} />
            </div>
            <span className="font-extrabold tracking-tight text-base sm:text-lg text-white group-hover:text-emerald-300 transition-colors">
              GITFIX AI
            </span>
          </Link>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-black/25 p-1 rounded-full border border-emerald-600/30 text-xs font-medium text-emerald-100">
            <a href="#hero" className="px-4 py-1.5 rounded-full hover:bg-emerald-800/60 hover:text-white transition-all">
              Home
            </a>
            <a href="#archive" className="px-4 py-1.5 rounded-full hover:bg-emerald-800/60 hover:text-white transition-all">
              Modules
            </a>
            <a href="#manifesto" className="px-4 py-1.5 rounded-full hover:bg-emerald-800/60 hover:text-white transition-all">
              Manifesto
            </a>
            <Link href="/docs" className="px-4 py-1.5 rounded-full hover:bg-emerald-800/60 hover:text-white transition-all">
              Docs
            </Link>
          </nav>

          {/* Right CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-emerald-100 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              <span>Try GitFix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/50"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#052b1a] border-b border-emerald-800 px-5 py-6 space-y-4">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-emerald-100 hover:text-white"
            >
              Home
            </a>
            <a
              href="#archive"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-emerald-100 hover:text-white"
            >
              Modules Archive
            </a>
            <a
              href="#manifesto"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-emerald-100 hover:text-white"
            >
              Manifesto
            </a>
            <Link
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-emerald-100 hover:text-white"
            >
              Documentation
            </Link>
            <div className="pt-2">
              <Link
                href="/auth"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-white text-slate-950 font-bold text-sm uppercase tracking-wider"
              >
                <span>Launch GitFix</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>


      {/* ═══════════════════════════════════════════════════════════════
          SECTION 01: HERO POSTER (Directly inspired by Inspo #1: 1.png)
          Deep saturated green background, giant condensed typography,
          collage sticker elements, and small tactile CTA.
         ═══════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen pt-28 sm:pt-36 pb-20 sm:pb-28 bg-gradient-to-b from-[#073f27] via-[#08472c] to-[#06331f] overflow-hidden flex flex-col justify-center"
      >
        {/* Subtle Ambient Grain & Radiance */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Sticker 1: OMG! Comic Sticker (Top Left floating) */}
        <div className="absolute top-28 left-6 sm:top-36 sm:left-14 md:left-24 z-20 hover:scale-110 transition-transform duration-300">
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 -rotate-12 drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]">
            <Image
              src="/ui/asset/sticker_omg.png"
              alt="Bug Intercepted OMG Sticker"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Sticker 2: Retro Computer (Top Right floating) */}
        <div className="absolute top-28 right-6 sm:top-36 sm:right-12 md:right-20 z-20 hover:scale-110 transition-transform duration-300">
          <div className="relative w-18 h-18 sm:w-26 sm:h-26 md:w-32 md:h-32 rotate-12 drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]">
            <Image
              src="/ui/asset/sticker_pc.png"
              alt="Retro Pixel PC Sticker"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-emerald-400/30 text-[11px] font-mono uppercase tracking-widest text-emerald-300 mb-6 sm:mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Autonomous Code Healing Engine</span>
          </div>

          {/* MASSIVE STATEMENT HEADLINE (Matching Inspo #1 typography style) */}
          <div className="relative my-2 sm:my-4">
            <h1 className="text-[14vw] sm:text-[12vw] lg:text-[9.8vw] font-black uppercase tracking-[-0.05em] leading-[0.88] text-[#1ae38e] drop-shadow-[0_8px_30px_rgba(0,0,0,0.4)] select-none">
              HEAL YOUR
              <br />
              CODEBASE.
            </h1>

            {/* Embedded Live Code Snapshot Card (Interacting with the headline like Inspo #1) */}
            <div className="relative -mt-6 sm:-mt-10 lg:-mt-14 max-w-lg mx-auto z-20 px-2">
              <div className="bg-[#0b131b] border-2 border-emerald-400/40 rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-left font-mono text-xs relative backdrop-blur-md">
                
                {/* Sticker 3: Band-Aid Sticker angled across the code snippet */}
                <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-24 h-14 sm:w-32 sm:h-18 rotate-12 z-30 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] hover:scale-110 transition-transform">
                  <Image
                    src="/ui/asset/sticker_bandaid.png"
                    alt="Band-Aid Healing Sticker"
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-slate-300 font-semibold">gitfix-agent.py</span>
                  </div>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tests Passed
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                  <p className="text-red-400/90 font-mono">- def calculate_discount(price: float, rate: float):</p>
                  <p className="text-red-400/90 font-mono">- &nbsp;&nbsp;return price * rate # ZeroDivisionError</p>
                  <p className="text-emerald-400 font-mono font-semibold">+ def calculate_discount(price: float, rate: float):</p>
                  <p className="text-emerald-400 font-mono font-semibold">+ &nbsp;&nbsp;return max(0.0, price * (1.0 - (rate or 0.0)))</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <p className="mt-8 sm:mt-10 max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-emerald-100/90 font-medium leading-relaxed">
            Diagnoses broken builds, fixes multi-line code errors across Python, TypeScript, & Go, runs verified tests, and opens ready-to-merge Pull Requests.
          </p>

          {/* Tactile Button Pair (Matching Inspo #1 book tickets button) */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            
            {/* Primary Pill Button with arrow compartment */}
            <Link
              href="/auth"
              className="inline-flex items-center rounded-xl bg-white hover:bg-emerald-50 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider overflow-hidden shadow-xl active:scale-95 transition-all group"
            >
              <span className="px-5 sm:px-6 py-3.5">Start Healing Free</span>
              <span className="bg-slate-200/90 group-hover:bg-emerald-200 px-3.5 py-3.5 flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </span>
            </Link>

            {/* Secondary Anchor */}
            <a
              href="#archive"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-black/30 hover:bg-black/50 text-emerald-200 hover:text-white font-semibold text-xs sm:text-sm border border-emerald-400/30 backdrop-blur-sm transition-all"
            >
              <span>Explore Archive</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </a>
          </div>

        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          SECTION 02: THE ARCHIVE / FOLDER GRID (Inspired by Inspo #2: 2.png)
          Vivid electric royal blue background, physical colorful folder
          cards with tabs, popping illustrations & interactive modules.
         ═══════════════════════════════════════════════════════════════ */}
      <section
        id="archive"
        className="relative py-24 sm:py-32 bg-[#1d4ed8] text-white overflow-hidden"
      >
        {/* Decorative corner tag matching Inspo #2 yellow corner tag */}
        <div className="absolute top-0 left-0 w-28 h-28 sm:w-36 sm:h-36 bg-[#facc15] rounded-br-full flex items-center justify-center text-slate-950 font-black text-xs sm:text-sm uppercase -rotate-12 shadow-lg z-10 pt-2 pl-2 pointer-events-none">
          #GITFIX
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-200 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
              Interactive System Modules
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight mt-4 text-white">
              The Intelligence Archive
            </h2>
            <p className="mt-4 text-sm sm:text-base text-blue-100 font-medium">
              Click any folder to inspect how GitFix autonomously analyzes, heals, and tests your repositories.
            </p>
          </div>

          {/* PHYSICAL FOLDER GRID (Matching 2.png layout: colored tabs, bodies, and pop-outs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pt-6">
            {folders.map((f) => {
              const IconComp = f.icon;
              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedFolder(f)}
                  className="group relative cursor-pointer pt-6"
                >
                  {/* Physical Folder Tab */}
                  <div
                    className={`absolute top-0 left-6 h-7 px-5 rounded-t-2xl font-mono text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-transform duration-300 group-hover:-translate-y-1.5 ${f.tabColor} ${
                      f.id === 'mission-control' ? 'text-slate-900' : 'text-slate-950'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{f.tag}</span>
                  </div>

                  {/* Physical Folder Body */}
                  <div
                    className={`${f.bodyColor} ${f.textColor} rounded-3xl p-6 sm:p-7 shadow-[0_15px_35px_rgba(0,0,0,0.25)] border border-white/20 transition-all duration-300 group-hover:-translate-y-2.5 group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.35)] relative overflow-hidden flex flex-col justify-between min-h-[260px]`}
                  >
                    {/* Top Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/15 ${f.accentColor}`}>
                          {f.badge}
                        </span>
                        <ArrowUpRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>

                      <h3 className="text-2xl font-black tracking-tight mb-2 uppercase">
                        {f.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90 line-clamp-3">
                        {f.description}
                      </p>
                    </div>

                    {/* Bottom Status / Stats */}
                    <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold">{f.stats}</span>
                      <span className="underline font-bold text-[11px]">Inspect Module &rarr;</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Modal Drawer for Clicked Folder */}
        {selectedFolder && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedFolder(null)}
          >
            <div
              className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-white shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedFolder(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-slate-950 font-bold ${selectedFolder.tabColor}`}>
                  <selectedFolder.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-emerald-400">{selectedFolder.tag}</span>
                  <h3 className="text-2xl font-black">{selectedFolder.name}</h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-5">
                {selectedFolder.description}
              </p>

              {/* Code Snippet Box */}
              <div className="bg-black/80 rounded-2xl p-4 border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed mb-6 overflow-x-auto">
                <pre>{selectedFolder.code}</pre>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-mono text-slate-400">Target: {selectedFolder.stats}</span>
                <Link
                  href="/auth"
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2"
                >
                  <span>Launch Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          SECTION 03: "WHAT WE DO" MANIFESTO (Inspired by Inspo #3: 3.png)
          Pitch black background, massive typography "We exist to heal
          broken code" surrounded by colorful floating tilted stickers.
         ═══════════════════════════════════════════════════════════════ */}
      <section
        id="manifesto"
        className="relative py-28 sm:py-40 bg-[#000000] text-white overflow-hidden flex flex-col justify-center items-center"
      >
        {/* Floating Stickers & Badges (Matching Inspo #3 sticker collage composition) */}

        {/* Sticker: 100% VERIFIED PRS (Pink badge - top left) */}
        <div className="absolute top-12 left-6 sm:top-20 sm:left-20 -rotate-12 hover:rotate-0 transition-transform duration-300 cursor-pointer z-20">
          <div className="px-4 py-2 rounded-2xl bg-[#ec4899] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg border-2 border-pink-300/40">
            100% VERIFIED PRS
          </div>
        </div>

        {/* Sticker: BAND-AID ASSET (Top right) */}
        <div className="absolute top-14 right-8 sm:top-20 sm:right-28 rotate-12 hover:rotate-0 transition-transform duration-300 cursor-pointer z-20">
          <div className="relative w-24 h-14 sm:w-32 sm:h-18 drop-shadow-[0_10px_20px_rgba(255,255,255,0.15)]">
            <Image
              src="/ui/asset/sticker_bandaid.png"
              alt="GitFix Code Band-Aid"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Sticker: ZERO DOWNTIME (Emerald badge - mid left) */}
        <div className="absolute top-1/2 -translate-y-24 left-4 sm:left-14 rotate-6 hover:rotate-0 transition-transform duration-300 cursor-pointer z-20">
          <div className="px-4 py-2 rounded-full bg-[#10b981] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg border-2 border-emerald-300">
            ZERO DOWNTIME
          </div>
        </div>

        {/* Sticker: RETRO COMPUTER ASSET (Mid right) */}
        <div className="absolute top-1/2 -translate-y-16 right-6 sm:right-16 -rotate-6 hover:scale-110 transition-transform duration-300 cursor-pointer z-20">
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]">
            <Image
              src="/ui/asset/sticker_pc.png"
              alt="Retro Pixel PC"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Sticker: AUTO LINTING (Orange badge - bottom left) */}
        <div className="absolute bottom-16 left-8 sm:bottom-24 sm:left-24 -rotate-6 hover:rotate-0 transition-transform duration-300 cursor-pointer z-20">
          <div className="px-4 py-2 rounded-2xl bg-[#f97316] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg border-2 border-orange-300">
            AUTO LINTING
          </div>
        </div>

        {/* Sticker: SELF-HEALING TESTS (Cyan badge - bottom right) */}
        <div className="absolute bottom-16 right-8 sm:bottom-24 sm:right-24 rotate-12 hover:rotate-0 transition-transform duration-300 cursor-pointer z-20">
          <div className="px-4 py-2 rounded-full bg-[#06b6d4] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg border-2 border-cyan-200">
            SELF-HEALING TESTS
          </div>
        </div>

        {/* Center Editorial Manifesto Copy */}
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 my-10">
          <h2 className="text-[12vw] sm:text-[9vw] lg:text-[7.5vw] font-black uppercase tracking-[-0.04em] leading-[0.9] text-white select-none">
            We exist to
            <br />
            <span className="text-emerald-400">heal broken</span>
            <br />
            codebases.
          </h2>

          <p className="mt-8 max-w-xl mx-auto text-sm sm:text-base md:text-lg text-slate-400 font-medium leading-relaxed">
            Engineers waste 30% of their sprints babysitting CI failures, hunting broken imports, and fixing lint errors. GitFix turns that painful cycle into one automated command.
          </p>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          SECTION 04: CONTACT CTA & EDITORIAL FOOTER (Inspired by Inspo #4: 4.png)
          Lime green grid background texture (using footer.png), scallop
          wavy divider, pill CTA button, and massive wordmark footer.
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#faf7f2] text-slate-950 overflow-hidden">
        
        {/* Upper Lime Grid Accent Area (Matching Inspo #4 grid + tickets layout) */}
        <div
          className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b-4 border-slate-950 flex flex-col items-center text-center"
          style={{
            backgroundImage: `url('/ui/asset/footer.png')`,
            backgroundSize: '220px 220px',
            backgroundRepeat: 'repeat'
          }}
        >
          {/* Subtle Dark Overlay to make content punchy and readable */}
          <div className="absolute inset-0 bg-lime-400/20 pointer-events-none" />

          {/* Floating Ticket Badges (Matching Inspo #4 tickets) */}
          <div className="relative z-10 w-full max-w-4xl flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="px-4 py-1.5 rounded-lg bg-[#22c55e] text-slate-950 font-mono font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] -rotate-3">
              RESERVE YOUR REPO
            </div>
            <div className="px-4 py-1.5 rounded-lg bg-[#3b82f6] text-white font-mono font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] rotate-3">
              100% FREE FOR OPEN SOURCE
            </div>
          </div>

          {/* Central Oval Action Pill (Matching Inspo #4 "Book a Call" button) */}
          <div className="relative z-10 max-w-xl w-full my-4">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center w-full max-w-md py-4 sm:py-5 px-8 rounded-full bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-black text-lg sm:text-2xl uppercase tracking-tight border-3 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all active:scale-[0.98]"
            >
              <span>Connect GitHub Repo</span>
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
          </div>

          <p className="relative z-10 text-xs sm:text-sm font-mono font-bold text-slate-900 mt-4 max-w-md">
            Zero configuration required. Intercepts failures, applies verified fixes, and opens ready PRs.
          </p>
        </div>

        {/* Scalloped Wavy Divider (Matching Inspo #4 scallop transition) */}
        <div className="w-full overflow-hidden leading-none -mt-1">
          <svg
            viewBox="0 0 1200 40"
            className="w-full h-8 sm:h-12 text-[#faf7f2] fill-current"
            preserveAspectRatio="none"
          >
            <path d="M0,0 C150,40 350,-20 500,20 C650,40 850,-20 1000,20 C1100,40 1180,10 1200,0 L1200,40 L0,40 Z" />
          </svg>
        </div>

        {/* Lower Editorial Footer Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 pb-16 border-b-2 border-slate-300">
            
            {/* Left: Brand Description */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white">
                  <BrandLogo size={20} />
                </div>
                <span className="text-xl font-black tracking-tight text-slate-950 uppercase">
                  GitFix AI
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-sm">
                Autonomous code healing engine for modern software teams. Scan, diagnose, test, and ship verified PRs directly to GitHub.
              </p>

              {/* Newsletter Form */}
              <form onSubmit={handleSubscribe} className="pt-2 max-w-md">
                <div className="flex items-center rounded-xl border-2 border-black bg-white overflow-hidden shadow-[3px_3px_0px_#000]">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter engineering email..."
                    className="w-full px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-black hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider shrink-0 transition-colors"
                  >
                    {subscribed ? 'Joined!' : 'Join'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Quick Links */}
            <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs font-mono">
              <div>
                <div className="font-bold text-slate-950 uppercase tracking-wider mb-3">
                  Product
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li><a href="#archive" className="hover:text-black">Bug Detection</a></li>
                  <li><a href="#archive" className="hover:text-black">Autonomous PRs</a></li>
                  <li><a href="#archive" className="hover:text-black">Test Healing</a></li>
                  <li><a href="#archive" className="hover:text-black">CI/CD Webhooks</a></li>
                </ul>
              </div>

              <div>
                <div className="font-bold text-slate-950 uppercase tracking-wider mb-3">
                  Resources
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li><Link href="/docs" className="hover:text-black">Documentation</Link></li>
                  <li><Link href="/auth" className="hover:text-black">Mission Control</Link></li>
                  <li><a href="https://github.com/AryanSingh64/GItFIxAI" target="_blank" rel="noreferrer" className="hover:text-black">GitHub Repo</a></li>
                  <li><Link href="/auth" className="hover:text-black">API Status</Link></li>
                </ul>
              </div>

              <div>
                <div className="font-bold text-slate-950 uppercase tracking-wider mb-3">
                  Social
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/AryanSingh64/GItFIxAI"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href="mailto:contact@gitfix.ai"
                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* MASSIVE WORDMARK (Matching Inspo #4 "bitesized" oversized typography) */}
          <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 select-none">
            <div className="flex items-center gap-3">
              <span className="text-[14vw] sm:text-[11vw] font-black uppercase tracking-[-0.07em] leading-none text-slate-950">
                gitfix
              </span>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-black flex items-center justify-center text-white shrink-0">
                <BrandLogo size={32} />
              </div>
            </div>

            <div className="text-right text-xs font-mono text-slate-500">
              <p>&copy; {new Date().getFullYear()} GitFix AI. All rights reserved.</p>
              <p className="text-[11px] text-slate-400 mt-1">Autonomous Code Intelligence &bull; Built for Builders</p>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
