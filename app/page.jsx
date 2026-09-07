'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  MousePointer2,
  GitBranch,
  CheckCircle2,
  Menu as MenuIcon,
  X,
  Github,
  Twitter,
  Mail,
  Check
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(2);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Cards focused on what GitFix DOES, simple and clear without technical clutter
  const cards = [
    {
      id: 0,
      title: 'Bug Fixing',
      subtitle: 'Fixes code errors automatically',
      tag: 'Auto-Fixed',
      color: 'from-[#7c3aed]/50 to-[#3b0764]/70',
      border: 'border-purple-500/25',
      badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      rotation: 'lg:-rotate-12 lg:-translate-y-2',
      zIndex: 'z-10',
      codeSnippet: `// Detects broken code and fixes it
def get_user(user_id: int):
    return db.users.find(id=user_id)`
    },
    {
      id: 1,
      title: 'CI/CD Healing',
      subtitle: 'Fixes failing build pipelines',
      tag: 'Build Passing',
      color: 'from-[#f43f5e]/50 to-[#881337]/70',
      border: 'border-rose-500/25',
      badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      rotation: 'lg:-rotate-6 lg:translate-y-4',
      zIndex: 'z-15',
      codeSnippet: `// Resolves GitHub Actions failures
Workflow: CI Test Suite
Status: All 24 tests passing`
    },
    {
      id: 2,
      title: 'Instant PRs',
      subtitle: 'Verified fixes ready to merge',
      tag: 'Ready to Merge',
      color: 'from-[#0d9488]/60 via-[#115e59]/70 to-[#042f2e]/90',
      border: 'border-teal-400/40 shadow-[0_0_40px_rgba(20,184,166,0.2)]',
      badgeBg: 'bg-teal-400/20 text-teal-200 border-teal-400/30',
      rotation: 'lg:rotate-0 lg:-translate-y-8',
      zIndex: 'z-30',
      isCenter: true,
      codeSnippet: `- const user = db.find(id);
+ const user = db.find({ id: userId });
// 100% test pass rate • Zero bugs`
    },
    {
      id: 3,
      title: 'Any Language',
      subtitle: 'Python, TypeScript, Go & Rust',
      tag: 'Universal',
      color: 'from-[#10b981]/50 to-[#064e3b]/70',
      border: 'border-emerald-500/25',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      rotation: 'lg:rotate-6 lg:translate-y-4',
      zIndex: 'z-15',
      codeSnippet: `// Works across your entire stack
TypeScript • Python • Go • Rust
Docker • GitHub Workflows`
    },
    {
      id: 4,
      title: 'Branch Safe',
      subtitle: 'Never breaks your main branch',
      tag: 'Safe',
      color: 'from-[#3b82f6]/50 to-[#1e3a8a]/70',
      border: 'border-blue-500/25',
      badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      rotation: 'lg:rotate-12 lg:-translate-y-2',
      zIndex: 'z-10',
      codeSnippet: `// Opens an isolated Pull Request
Branch: gitfix/auto-remediation
Review diff, test, and merge`
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setSubscribed(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 font-sans flex flex-col justify-between relative overflow-hidden select-none">

      {/* Subtle Starfield Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-[15%] w-1 h-1 bg-white rounded-full opacity-60" />
        <div className="absolute top-1/3 right-[20%] w-1 h-1 bg-white rounded-full opacity-40" />
        <div className="absolute top-1/2 left-[30%] w-1.5 h-1.5 bg-teal-300 rounded-full opacity-50 blur-[0.5px]" />
        <div className="absolute top-2/3 right-[35%] w-1 h-1 bg-white rounded-full opacity-70" />
      </div>

      {/* Ambient Top Glow */}
      <div
        className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none blur-[180px] opacity-25"
        style={{ background: 'radial-gradient(circle, #0d9488 0%, #1e1b4b 60%, transparent 80%)' }}
      />

      {/* ═══════════════════════════════════════════════════════════
          NAVBAR (Image #3 Style: Floating Island)
         ═══════════════════════════════════════════════════════════ */}
      <header className="relative z-50 w-full max-w-7xl mx-auto px-6 pt-7 pb-4 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center p-1.5 group-hover:border-white/25 transition-colors">
            <BrandLogo size={24} />
          </div>
          <span className="font-semibold tracking-tight text-white text-sm hidden sm:inline">
            GitFix<span className="text-white/40 font-normal">AI</span>
          </span>
        </Link>

        {/* Center: Floating Island Navigation */}
        <nav className="hidden md:flex items-center gap-8 px-7 py-2.5 rounded-full bg-[#15161b]/80 border border-white/[0.09] backdrop-blur-xl shadow-xl text-xs font-medium text-slate-300">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Repositories
          </Link>
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
          <Link href="/history" className="hover:text-white transition-colors">
            History
          </Link>
        </nav>

        {/* Right: Login & Launch Button */}
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
            Launch Console
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
          <Link href="/docs" className="text-slate-200 py-1">Docs</Link>
          <Link href="/history" className="text-slate-200 py-1">History</Link>
          <Link href="/auth" className="text-slate-200 py-1">Login</Link>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION (Clean, Punchy, Simple - No Fluff Pill)
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-20 w-full max-w-5xl mx-auto px-6 pt-14 sm:pt-20 pb-6 text-center flex flex-col items-center">
        
        {/* Floating Cursors (Matching Image #3 Robert & Clarissa style) */}
        <div className="hidden lg:flex items-center gap-1.5 absolute top-20 left-6 px-3 py-1 rounded-full bg-[#0d9488] text-white text-[11px] font-medium shadow-lg border border-teal-300/30">
          <MousePointer2 className="w-3 h-3 fill-current" />
          <span>Robert</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 absolute top-28 right-6 px-3 py-1 rounded-full bg-[#f43f5e] text-white text-[11px] font-medium shadow-lg border border-rose-300/30">
          <MousePointer2 className="w-3 h-3 fill-current" />
          <span>Clarissa</span>
        </div>

        {/* Main Headline (Image #3 Mixed Typography) */}
        <h1 className="text-4xl sm:text-6xl md:text-[72px] font-bold tracking-[-0.03em] text-white leading-[1.06] max-w-3xl mb-5">
          Heal Your Codebase<br />
          <span className="font-serif italic font-normal text-slate-200">Automate</span> Your PRs
        </h1>

        {/* Short, simple 1-line subtitle explaining what it does */}
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed mb-8">
          GitFix automatically diagnoses broken builds, fixes code errors, and opens verified Pull Requests on GitHub.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3D FANNED CARDS CAROUSEL (Image #3 Style)
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-20">
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
                  minHeight: card.isCenter ? '360px' : '320px'
                }}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-xs text-white/70 mt-0.5">
                      {card.subtitle}
                    </p>
                  </div>

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
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${card.badgeBg} shrink-0`}>
                      {card.tag}
                    </span>
                  )}
                </div>

                {/* Code Snippet Box */}
                <div className="mt-5 p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-[11px] leading-relaxed text-slate-200 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{card.codeSnippet}</pre>
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                  <span className="text-[11px]">100% automated</span>
                  <CheckCircle2 className="w-4 h-4 text-white/80" />
                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MASSIVE MINIMALIST FOOTER (Brought back from Image #2)
         ═══════════════════════════════════════════════════════════ */}
      <footer className="w-full bg-[#030508] border-t border-white/[0.07] px-6 sm:px-10 md:px-14 lg:px-16 pt-16 sm:pt-20 pb-10">
        
        {/* Top Footer Row: Newsletter & Navigation Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16">
          
          {/* Left Column: Brand tag, Input, Socials */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="text-xs font-mono text-slate-400 tracking-wider">
              Heal Different™
            </div>

            {/* Newsletter input + button */}
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-sm">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="email@example.com"
                className="flex-1 bg-[#101420] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/25 transition-colors font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-slate-200 transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                {subscribed ? 'Subscribed!' : 'Join for free'}
              </button>
            </form>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/AryanSingh64/GItFIxAI"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-colors"
                title="GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-colors"
                title="Twitter / X"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="mailto:contact@gitfix.ai"
                className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-colors"
                title="Email"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Navigation Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-normal">
            <div className="space-y-3">
              <h4 className="font-semibold text-white tracking-wide">Product</h4>
              <ul className="space-y-2.5 text-slate-400">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Repositories</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Bug Remediation</Link></li>
                <li><Link href="/history" className="hover:text-white transition-colors">Run History</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-white tracking-wide">Developers</h4>
              <ul className="space-y-2.5 text-slate-400">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><a href="https://github.com/AryanSingh64/GItFIxAI" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub Repository</a></li>
                <li><Link href="/auth" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-white tracking-wide">Company</h4>
              <ul className="space-y-2.5 text-slate-400">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="mailto:contact@gitfix.ai" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* ─── MASSIVE ULTRA-BOLD WORDMARK (Image 2 style) ─── */}
        <div className="pt-6 pb-4 border-t border-white/[0.06] flex items-center justify-between gap-4 overflow-hidden">
          <div className="flex items-baseline gap-4 w-full">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 flex items-center justify-center">
              <BrandLogo size={64} />
            </div>
            
            <div className="text-[15vw] font-black tracking-[-0.06em] text-white select-none leading-none w-full">
              gitfix
            </div>
          </div>
        </div>

        {/* Bottom Copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600 font-mono">
          <div>© 2026 GitFixAI Group. All rights reserved.</div>
          <div className="flex items-center gap-4 text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>

      </footer>

    </div>
  );
}
