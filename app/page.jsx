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
  Check,
  FileCode2,
  Terminal as TerminalIcon,
  Sparkles
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // 6 Core GitFix AI Folders with rich visual illustrations and real code fixes
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
      badge: 'Multi-Lang',
      description: 'Deep Abstract Syntax Tree parsing that intercepts syntax errors, undefined references, and runtime null-pointer exceptions.',
      stats: 'Supports Python, TS, JS, Go',
      illustration: {
        type: 'ast',
        title: 'AST Parser Telemetry',
        subtitle: '412 files analyzed in 1.4s',
        status: '0 Unhandled Exceptions'
      },
      code: `// Bug Detected: TypeError: Cannot read properties of undefined
- const user = await db.users.find(req.user.id);
- return user.permissions.includes('admin');
+ const user = await db.users.find(req.user?.id);
+ return Boolean(user?.permissions?.includes('admin'));`
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
      badge: 'Zero Friction',
      description: 'Creates isolated branches, applies verified patches, writes clear markdown changelogs, and opens ready-to-merge Pull Requests.',
      stats: '1-Click Merge Verified',
      illustration: {
        type: 'pr',
        title: 'Pull Request #84 • gitfix/patch-auth',
        subtitle: '1 commit • +4 -2 lines • 100% checks passed',
        status: 'Ready to Merge'
      },
      code: `// GitFix Auto-PR Generated:
Branch: gitfix/auto-heal-session-tokens
Title: fix(auth): null-safe token lookup in session header
Reviewers: @lead-architect • CI Status: ALL 24 CHECKS PASSING`
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
      badge: 'Loop Engine',
      description: 'Discovers pytest, jest, and go test runners, executes suites, analyzes stack traces, and loops until all tests pass cleanly.',
      stats: '100% Pass Rate Target',
      illustration: {
        type: 'tests',
        title: 'Pytest Suite Execution',
        subtitle: 'tests/test_auth.py: 18/18 passed',
        status: 'Loop Complete (2 iterations)'
      },
      code: `// Loop Iteration 1: test_token_missing -> FAIL (KeyError)
// Loop Iteration 2: Applied patch -> RE-TESTING...
// Output: 48 passed, 0 failed in 2.11s [100% PASS RATE]`
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
      badge: 'Actions Ready',
      description: 'Listens for GitHub Actions failures. When a build breaks, GitFix triggers instantly to diagnose logs and submit a PR fix.',
      stats: 'Webhook Automated',
      illustration: {
        type: 'cicd',
        title: 'GitHub Actions Interceptor',
        subtitle: 'workflow_run: CI Build on push',
        status: 'Red Build Remediated'
      },
      code: `on: workflow_run
  workflows: ["CI Build"]
  types: [completed]
# GitFix auto-intercepts red builds and opens PR fix`
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
      badge: 'Static Analysis',
      description: 'Integrates Bandit, ESLint Security, flake8, and go vet to patch SQL injection risks, insecure dependencies, and data leaks.',
      stats: 'Zero Known CVEs',
      illustration: {
        type: 'security',
        title: 'Security Audit Scanner',
        subtitle: 'Bandit + ESLint + go vet',
        status: 'A+ Grade (0 Vulnerabilities)'
      },
      code: `// Bandit Alert: B608 (Possible SQL Injection)
- cursor.execute(f"SELECT * FROM users WHERE id = '{user_id}'")
+ cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))`
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
      badge: 'Real-Time',
      description: 'Real-time WebSocket telemetry with animated health score gauge, live streaming compiler logs, and interactive diff inspector.',
      stats: 'Live WebSocket Stream',
      illustration: {
        type: 'telemetry',
        title: 'WebSocket Mission Control',
        subtitle: 'Health Score: 98/100 (+14 pts)',
        status: 'Live Stream Active'
      },
      code: `[WS 12:44:02] Connected: worker_node_1
[WS 12:44:03] AST Parsing complete: 412 files
[WS 12:44:04] Patch verified: health score +14%`
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
          MINIMALIST TOP NAVIGATION BAR
          (Removed Manifesto link as requested)
         ═══════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#063a23]/90 backdrop-blur-md border-b border-emerald-800/40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          
          {/* Left: Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white border border-emerald-500/30 group-hover:scale-105 transition-transform">
              <BrandLogo size={18} />
            </div>
            <span className="font-extrabold tracking-tight text-base sm:text-lg text-white group-hover:text-emerald-300 transition-colors">
              GITFIX AI
            </span>
          </Link>

          {/* Center Links (Desktop - Clean: Home, Modules, Docs) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-black/30 p-1 rounded-full border border-emerald-600/30 text-xs font-medium text-emerald-100">
            <a href="#hero" className="px-4 py-1.5 rounded-full hover:bg-emerald-800/60 hover:text-white transition-all">
              Home
            </a>
            <a href="#archive" className="px-4 py-1.5 rounded-full hover:bg-emerald-800/60 hover:text-white transition-all">
              Modules
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
          Tightened vertical height (no longer takes too long to scroll),
          removed the top pill, and terminal code makes real sense!
         ═══════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative pt-24 sm:pt-28 pb-16 sm:pb-20 bg-gradient-to-b from-[#073f27] via-[#08472c] to-[#06331f] overflow-hidden flex flex-col justify-center"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Sticker 1: OMG! Comic Sticker (Top Left floating) */}
        <div className="absolute top-20 left-4 sm:top-24 sm:left-12 md:left-20 z-20 hover:scale-110 transition-transform duration-300 pointer-events-none sm:pointer-events-auto">
          <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 -rotate-12 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
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
        <div className="absolute top-20 right-4 sm:top-24 sm:right-10 md:right-16 z-20 hover:scale-110 transition-transform duration-300 pointer-events-none sm:pointer-events-auto">
          <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rotate-12 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            <Image
              src="/ui/asset/sticker_pc.png"
              alt="Retro Pixel PC Sticker"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* MASSIVE STATEMENT HEADLINE (Tightened, compact, punchy) */}
          <div className="relative my-2 sm:my-3">
            <h1 className="text-[13vw] sm:text-[11vw] lg:text-[8.8vw] font-black uppercase tracking-[-0.05em] leading-[0.88] text-[#1ae38e] drop-shadow-[0_8px_30px_rgba(0,0,0,0.4)] select-none">
              HEAL YOUR
              <br />
              CODEBASE.
            </h1>

            {/* Embedded Live Code Terminal (MAKES 100% SENSE FOR GITFIX AI) */}
            <div className="relative -mt-5 sm:-mt-8 lg:-mt-10 max-w-xl mx-auto z-20 px-2">
              <div className="bg-[#0b131b] border-2 border-emerald-400/40 rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-left font-mono text-xs relative backdrop-blur-md">
                
                {/* Sticker 3: Band-Aid Sticker angled across the code snippet */}
                <div className="absolute -top-5 -right-5 sm:-top-7 sm:-right-7 w-20 h-12 sm:w-28 sm:h-16 rotate-12 z-30 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] hover:scale-110 transition-transform">
                  <Image
                    src="/ui/asset/sticker_bandaid.png"
                    alt="Band-Aid Healing Sticker"
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Terminal Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-slate-300 font-semibold flex items-center gap-1.5">
                      <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                      CI Build #142 &bull; auth_handler.py
                    </span>
                  </div>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 24/24 Passed
                  </span>
                </div>

                {/* Real, developer-sensible bug fix: Missing null check crash resolved by GitFix */}
                <div className="mt-3 space-y-1.5 text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                  <div className="text-slate-500 text-[10px]">// GitFix detected unhandled KeyError on missing auth header</div>
                  <p className="text-red-400/90 font-mono bg-red-950/20 px-1 rounded">
                    - &nbsp;token = req.headers[&quot;Authorization&quot;].split(&quot; &quot;)[1]
                  </p>
                  <p className="text-emerald-400 font-mono font-semibold bg-emerald-950/20 px-1 rounded">
                    + &nbsp;auth = req.headers.get(&quot;Authorization&quot;) or &quot;&quot;
                  </p>
                  <p className="text-emerald-400 font-mono font-semibold bg-emerald-950/20 px-1 rounded">
                    + &nbsp;token = auth.split(&quot; &quot;)[1] if auth.startswith(&quot;Bearer &quot;) else None
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <p className="mt-6 sm:mt-8 max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-emerald-100/90 font-medium leading-relaxed">
            Autonomous code intelligence that catches build failures, patches bugs across Python, TypeScript, &amp; Go, runs verified tests, and opens PRs on GitHub.
          </p>

          {/* Tactile Button Pair */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/auth"
              className="inline-flex items-center rounded-xl bg-white hover:bg-emerald-50 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider overflow-hidden shadow-xl active:scale-95 transition-all group"
            >
              <span className="px-5 sm:px-6 py-3">Start Healing Free</span>
              <span className="bg-slate-200/90 group-hover:bg-emerald-200 px-3 py-3 flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </span>
            </Link>

            <a
              href="#archive"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black/30 hover:bg-black/50 text-emerald-200 hover:text-white font-semibold text-xs sm:text-sm border border-emerald-400/30 backdrop-blur-sm transition-all"
            >
              <span>Explore Archive</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </a>
          </div>

        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          SECTION 02: THE ARCHIVE / FOLDER GRID (Inspired by Inspo #2: 2.png)
          (Removed "Interactive System Modules" pill as requested)
         ═══════════════════════════════════════════════════════════════ */}
      <section
        id="archive"
        className="relative py-20 sm:py-28 bg-[#1d4ed8] text-white overflow-hidden"
      >
        {/* Decorative corner tag matching Inspo #2 yellow corner tag */}
        <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-[#facc15] rounded-br-full flex items-center justify-center text-slate-950 font-black text-xs uppercase -rotate-12 shadow-lg z-10 pt-2 pl-2 pointer-events-none">
          #GITFIX
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header (Clean without extra pill) */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
              The Intelligence Archive
            </h2>
            <p className="mt-3 text-sm sm:text-base text-blue-100 font-medium">
              Click any module folder to inspect how GitFix autonomously analyzes, tests, and heals your code.
            </p>
          </div>

          {/* PHYSICAL FOLDER GRID */}
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
                    className={`${f.bodyColor} ${f.textColor} rounded-3xl p-6 sm:p-7 shadow-[0_15px_35px_rgba(0,0,0,0.25)] border border-white/20 transition-all duration-300 group-hover:-translate-y-2.5 group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.35)] relative overflow-hidden flex flex-col justify-between min-h-[250px]`}
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
                      <span className="underline font-bold text-[11px]">Inspect &rarr;</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ═══════════════════════════════════════════════════════════════
            RICH MODAL POPUP FOR CLICKED FOLDER
            (With dedicated visual graphic illustration matching Inspo #2)
           ═══════════════════════════════════════════════════════════════ */}
        {selectedFolder && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedFolder(null)}
          >
            <div
              className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedFolder(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-slate-950 font-bold ${selectedFolder.tabColor}`}>
                  <selectedFolder.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-emerald-400 font-semibold">{selectedFolder.tag}</span>
                  <h3 className="text-2xl font-black">{selectedFolder.name}</h3>
                </div>
              </div>

              {/* VISUAL ILLUSTRATION BANNER (Fixed popup visual) */}
              <div className="mb-5 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-slate-200">
                      {selectedFolder.illustration.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {selectedFolder.illustration.subtitle}
                  </p>
                </div>
                <div className="relative z-10 px-3 py-1 rounded-lg bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
                  {selectedFolder.illustration.status}
                </div>
                {/* Ambient glow */}
                <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {selectedFolder.description}
              </p>

              {/* Live Code Snippet Box */}
              <div className="bg-black/90 rounded-2xl p-4 border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed mb-6 overflow-x-auto">
                <div className="text-[10px] text-slate-500 pb-1.5 border-b border-slate-800/80 mb-2 flex items-center justify-between">
                  <span>CLI / AST PATCH PREVIEW</span>
                  <span className="text-emerald-400 font-bold">100% VERIFIED</span>
                </div>
                <pre>{selectedFolder.code}</pre>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-800">
                <span className="text-xs font-mono text-slate-400">{selectedFolder.stats}</span>
                <Link
                  href="/auth"
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-transform active:scale-95"
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
         ═══════════════════════════════════════════════════════════════ */}
      <section
        id="manifesto"
        className="relative py-24 sm:py-36 bg-[#000000] text-white overflow-hidden flex flex-col justify-center items-center"
      >
        {/* Floating Stickers & Badges */}
        <div className="absolute top-10 left-6 sm:top-16 sm:left-20 -rotate-12 hover:rotate-0 transition-transform duration-300 cursor-pointer z-20">
          <div className="px-4 py-2 rounded-2xl bg-[#ec4899] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg border-2 border-pink-300/40">
            100% VERIFIED PRS
          </div>
        </div>

        <div className="absolute top-12 right-8 sm:top-18 sm:right-28 rotate-12 hover:rotate-0 transition-transform duration-300 cursor-pointer z-20">
          <div className="relative w-20 h-12 sm:w-28 sm:h-16 drop-shadow-[0_10px_20px_rgba(255,255,255,0.15)]">
            <Image
              src="/ui/asset/sticker_bandaid.png"
              alt="GitFix Code Band-Aid"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="absolute top-1/2 -translate-y-24 left-4 sm:left-14 rotate-6 hover:rotate-0 transition-transform duration-300 cursor-pointer z-20">
          <div className="px-4 py-2 rounded-full bg-[#10b981] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg border-2 border-emerald-300">
            ZERO DOWNTIME
          </div>
        </div>

        <div className="absolute top-1/2 -translate-y-16 right-6 sm:right-16 -rotate-6 hover:scale-110 transition-transform duration-300 cursor-pointer z-20">
          <div className="relative w-18 h-18 sm:w-24 sm:h-24 drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]">
            <Image
              src="/ui/asset/sticker_pc.png"
              alt="Retro Pixel PC"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="absolute bottom-12 left-8 sm:bottom-20 sm:left-24 -rotate-6 hover:rotate-0 transition-transform duration-300 cursor-pointer z-20">
          <div className="px-4 py-2 rounded-2xl bg-[#f97316] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg border-2 border-orange-300">
            AUTO LINTING
          </div>
        </div>

        <div className="absolute bottom-12 right-8 sm:bottom-20 sm:right-24 rotate-12 hover:rotate-0 transition-transform duration-300 cursor-pointer z-20">
          <div className="px-4 py-2 rounded-full bg-[#06b6d4] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg border-2 border-cyan-200">
            SELF-HEALING TESTS
          </div>
        </div>

        {/* Center Manifesto Statement */}
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 my-8">
          <h2 className="text-[12vw] sm:text-[9vw] lg:text-[7.5vw] font-black uppercase tracking-[-0.04em] leading-[0.9] text-white select-none">
            We exist to
            <br />
            <span className="text-emerald-400">heal broken</span>
            <br />
            codebases.
          </h2>

          <p className="mt-8 max-w-xl mx-auto text-xs sm:text-sm md:text-base text-slate-400 font-medium leading-relaxed">
            Engineers waste 30% of their sprints babysitting CI failures, hunting broken imports, and fixing lint errors. GitFix turns that painful cycle into one automated command.
          </p>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          SECTION 04: CONTACT CTA & EDITORIAL FOOTER (Inspired by Inspo #4: 4.png)
          (LOCKED FOOTER: Pure locked vector lime grid without any weird
          banding, seamless scallop divider, and bold editorial footer)
         ═══════════════════════════════════════════════════════════════ */}
      <footer className="relative bg-[#faf7f2] text-slate-950 overflow-hidden border-t-4 border-black">
        
        {/* UPPER LIME GRID SECTION (LOCKED & SEAMLESS) */}
        <div
          className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-black flex flex-col items-center text-center bg-[#b2f540]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 2px, transparent 2px),
              linear-gradient(to bottom, #000 2px, transparent 2px)
            `,
            backgroundSize: '48px 48px'
          }}
        >
          {/* Floating Ticket Badges */}
          <div className="relative z-10 w-full max-w-3xl flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="px-4 py-1.5 rounded-lg bg-[#22c55e] text-slate-950 font-mono font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] -rotate-3">
              RESERVE YOUR REPO
            </div>
            <div className="px-4 py-1.5 rounded-lg bg-[#3b82f6] text-white font-mono font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] rotate-3">
              100% FREE FOR OPEN SOURCE
            </div>
          </div>

          {/* Central Oval Action Button */}
          <div className="relative z-10 max-w-xl w-full my-3">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center w-full max-w-md py-4 sm:py-5 px-8 rounded-full bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-black text-lg sm:text-2xl uppercase tracking-tight border-3 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all active:scale-[0.98]"
            >
              <span>Connect GitHub Repo</span>
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
          </div>

          <p className="relative z-10 text-xs sm:text-sm font-mono font-bold text-slate-900 mt-3 max-w-md bg-white/70 px-3 py-1 rounded-md border border-black/30">
            Zero configuration required. Intercepts failures, applies verified fixes, and opens ready PRs.
          </p>
        </div>

        {/* Scalloped Wavy Divider */}
        <div className="w-full overflow-hidden leading-none -mt-1">
          <svg
            viewBox="0 0 1200 40"
            className="w-full h-8 sm:h-12 text-[#faf7f2] fill-current"
            preserveAspectRatio="none"
          >
            <path d="M0,0 C150,40 350,-20 500,20 C650,40 850,-20 1000,20 C1100,40 1180,10 1200,0 L1200,40 L0,40 Z" />
          </svg>
        </div>

        {/* LOWER EDITORIAL FOOTER (LOCKED) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 pb-12 border-b-2 border-slate-300">
            
            {/* Brand Description */}
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

            {/* Quick Links */}
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

          {/* MASSIVE WORDMARK */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 select-none">
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

      </footer>

    </div>
  );
}
