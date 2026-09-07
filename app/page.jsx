'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowUpRight,
  MousePointer2,
  Terminal,
  GitBranch,
  CheckCircle2,
  Cpu,
  Layers,
  FileCode,
  Shield,
  Activity,
  Menu as MenuIcon,
  X,
  Check
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(2); // Center card (GitFix Core) active by default

  const cards = [
    {
      id: 0,
      title: 'Python AST',
      subtitle: 'flake8 & mypy inference',
      tag: 'AST Scanned',
      color: 'from-[#7c3aed]/50 to-[#3b0764]/70',
      border: 'border-purple-500/25',
      badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      rotation: 'lg:-rotate-12 lg:-translate-y-2',
      zIndex: 'z-10',
      codeSnippet: `def repair(user_id: int):
    return db.query(User).filter(User.id == user_id)`
    },
    {
      id: 1,
      title: 'TypeScript',
      subtitle: 'Compiler & ESLint fixes',
      tag: 'Zero TS Errors',
      color: 'from-[#f43f5e]/50 to-[#881337]/70',
      border: 'border-rose-500/25',
      badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      rotation: 'lg:-rotate-6 lg:translate-y-4',
      zIndex: 'z-15',
      codeSnippet: `export const resolveSession = (req: AuthReq) => {
  return req.auth?.userId ?? null;
};`
    },
    {
      id: 2,
      title: 'GitFix Core',
      subtitle: 'Deterministic AST Engine',
      tag: 'Deterministic',
      color: 'from-[#0d9488]/60 via-[#115e59]/70 to-[#042f2e]/90',
      border: 'border-teal-400/40 shadow-[0_0_40px_rgba(20,184,166,0.18)]',
      badgeBg: 'bg-teal-400/20 text-teal-200 border-teal-400/30',
      rotation: 'lg:rotate-0 lg:-translate-y-8',
      zIndex: 'z-30',
      isCenter: true,
      codeSnippet: `- const user = db.query(id == id);
+ const user = db.query(User.id == userId);
// AST Verified • 100% test pass rate`
    },
    {
      id: 3,
      title: 'Go & Rust',
      subtitle: 'Staticcheck & memory safety',
      tag: 'Compiler Verified',
      color: 'from-[#10b981]/50 to-[#064e3b]/70',
      border: 'border-emerald-500/25',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      rotation: 'lg:rotate-6 lg:translate-y-4',
      zIndex: 'z-15',
      codeSnippet: `func SafeHandle(ctx context.Context) error {
    select { case <-ctx.Done(): return ctx.Err() }
}`
    },
    {
      id: 4,
      title: 'CI/CD Pipelines',
      subtitle: 'GitHub Actions automated PR',
      tag: 'Auto-Merged PR',
      color: 'from-[#3b82f6]/50 to-[#1e3a8a]/70',
      border: 'border-blue-500/25',
      badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      rotation: 'lg:rotate-12 lg:-translate-y-2',
      zIndex: 'z-10',
      codeSnippet: `on: [push, pull_request]
jobs:
  heal:
    runs-on: gitfix-isolated-runner`
    }
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 font-sans flex flex-col justify-between relative overflow-hidden select-none">

      {/* Subtle Starfield / Dust Background Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-[15%] w-1 h-1 bg-white rounded-full opacity-60" />
        <div className="absolute top-1/3 right-[20%] w-1 h-1 bg-white rounded-full opacity-40" />
        <div className="absolute top-1/2 left-[30%] w-1.5 h-1.5 bg-teal-300 rounded-full opacity-50 blur-[0.5px]" />
        <div className="absolute top-2/3 right-[35%] w-1 h-1 bg-white rounded-full opacity-70" />
        <div className="absolute top-1/5 right-[40%] w-1 h-1 bg-rose-300 rounded-full opacity-50" />
      </div>

      {/* Ambient Top Glow */}
      <div
        className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none blur-[180px] opacity-25"
        style={{ background: 'radial-gradient(circle, #0d9488 0%, #1e1b4b 60%, transparent 80%)' }}
      />

      {/* ═══════════════════════════════════════════════════════════
          NAVBAR (Image #3 Style: Logo Left, Center Island, Actions Right)
         ═══════════════════════════════════════════════════════════ */}
      <header className="relative z-50 w-full max-w-7xl mx-auto px-6 pt-7 pb-4 flex items-center justify-between">
        
        {/* Left: Brand Logo Glyph */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center p-1.5 group-hover:border-white/25 transition-colors">
            <BrandLogo size={24} />
          </div>
          <span className="font-semibold tracking-tight text-white text-sm hidden sm:inline">
            GitFix<span className="text-white/40 font-normal">AI</span>
          </span>
        </Link>

        {/* Center: Floating Island Navigation Pill (Exact Image #3 Style) */}
        <nav className="hidden md:flex items-center gap-8 px-7 py-2.5 rounded-full bg-[#15161b]/80 border border-white/[0.09] backdrop-blur-xl shadow-xl text-xs font-medium text-slate-300">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Repositories
          </Link>
          <Link href="#architecture" className="hover:text-white transition-colors">
            Engine
          </Link>
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
          <Link href="/history" className="hover:text-white transition-colors">
            History
          </Link>
        </nav>

        {/* Right: Login Text Link + Get Started White Pill Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/auth"
            className="hidden sm:inline-block text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            Login
          </Link>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-black bg-white hover:bg-slate-200 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Contact
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden relative z-50 mx-6 mb-4 p-5 rounded-2xl bg-[#121319] border border-white/10 flex flex-col gap-3 text-xs">
          <Link href="/dashboard" className="text-slate-200 py-1">Repositories</Link>
          <Link href="/docs" className="text-slate-200 py-1">Documentation</Link>
          <Link href="/history" className="text-slate-200 py-1">Telemetry History</Link>
          <Link href="/auth" className="text-slate-200 py-1">Login</Link>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-2 w-full py-2.5 bg-white text-black font-semibold rounded-full"
          >
            Launch Console
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION (Image #3 Style: Mixed Typography + Cursor Badges)
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-20 w-full max-w-5xl mx-auto px-6 pt-10 sm:pt-14 pb-6 text-center flex flex-col items-center">
        
        {/* Floating Collaborative Agent Cursor Badges (Image #3 Callouts) */}
        {/* Left Cursor: ast-scanner */}
        <div className="hidden lg:flex items-center gap-1.5 absolute top-28 left-4 px-3 py-1.5 rounded-full bg-[#0d9488]/80 text-white text-[11px] font-mono shadow-lg border border-teal-300/30 animate-bounce">
          <MousePointer2 className="w-3 h-3 fill-current" />
          <span>ast-scanner</span>
        </div>

        {/* Right Cursor: ci-diagnostics */}
        <div className="hidden lg:flex items-center gap-1.5 absolute top-36 right-4 px-3 py-1.5 rounded-full bg-[#f43f5e]/80 text-white text-[11px] font-mono shadow-lg border border-rose-300/30 animate-bounce [animation-delay:0.8s]">
          <MousePointer2 className="w-3 h-3 fill-current" />
          <span>ci-diagnostics</span>
        </div>

        {/* Pill Badge at top (Image #3: Early Access badge) */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#13151b] border border-white/[0.08] backdrop-blur-md mb-6 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#e2f952]" />
          <span className="text-xs font-medium text-slate-300">
            Early Access <span className="text-white/30">—</span> Build Your Resilience
          </span>
        </div>

        {/* Main Headline (Image #3 Mixed Typography: Sans paired with Serif Italic) */}
        <h1 className="text-4xl sm:text-6xl md:text-[68px] font-bold tracking-[-0.03em] text-white leading-[1.08] max-w-3xl mb-6">
          Build Your Resilience<br />
          <span className="font-serif italic font-normal text-slate-300">Automate</span> Your Codebase
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6">
          Continuous autonomous code healing and test repair. Detect failing builds instantly, synthesize deterministic AST fixes, and merge verified Pull Requests with zero manual intervention.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3D FANNED CAROUSEL CARDS (Bottom of Hero matching Image #3)
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-center -space-y-8 lg:-space-y-0 lg:-space-x-8 xl:-space-x-10 transition-all duration-500">
          
          {cards.map((card) => {
            const isSelected = activeCard === card.id;
            
            return (
              <div
                key={card.id}
                onClick={() => setActiveCard(card.id)}
                className={`w-full max-w-[340px] sm:max-w-[380px] lg:w-[320px] xl:w-[340px] rounded-3xl p-6 sm:p-7 bg-gradient-to-b ${card.color} border ${card.border} backdrop-blur-2xl transition-all duration-500 cursor-pointer ${card.rotation} ${card.zIndex} ${
                  isSelected ? 'lg:scale-105 lg:-translate-y-10 shadow-2xl z-40' : 'hover:scale-[1.02] hover:-translate-y-2'
                }`}
                style={{
                  minHeight: card.isCenter ? '380px' : '340px'
                }}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-xs text-white/70 mt-0.5">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Center Card Action: Yellow "Get Started ↗" pill matching Image #3 */}
                  {card.isCenter ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push('/dashboard');
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-[#e2f952] text-black font-bold text-xs flex items-center gap-1 shadow-md hover:bg-lime-300 transition-all cursor-pointer shrink-0"
                    >
                      <span>Get Started</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-medium border ${card.badgeBg} shrink-0`}>
                      {card.tag}
                    </span>
                  )}
                </div>

                {/* Monospace Code / AST Box inside card */}
                <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-[11px] leading-relaxed text-slate-200 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{card.codeSnippet}</pre>
                </div>

                {/* Bottom Card Signal */}
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                  <span className="font-mono text-[10px]">Zero Hallucination Guarantee</span>
                  <CheckCircle2 className="w-4 h-4 text-white/80" />
                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MINIMALIST CLEAN FOOTER (Matching Image #3 Aesthetics)
         ═══════════════════════════════════════════════════════════ */}
      <footer className="relative z-30 w-full border-t border-white/[0.08] bg-[#070709] px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <BrandLogo size={20} />
            <span className="font-medium text-slate-300">GitFixAI</span>
            <span>—</span>
            <span>Autonomous Code Remediation</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-white transition-colors">Repositories</Link>
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
            <a href="https://github.com/AryanSingh64/GItFIxAI" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <Link href="/auth" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
