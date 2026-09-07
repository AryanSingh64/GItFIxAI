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
  X,
  ChevronDown,
  ArrowRight,
  Github,
  Twitter,
  Mail,
  GitBranch,
  Terminal,
  Shield,
  FileCode,
  Check
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const steps = [
    {
      num: '1',
      title: 'Connect your target repository',
      desc: 'Authorize via GitHub OAuth or specify any public/private repository URL.',
      preview: {
        type: 'connect',
        title: 'Repository Source',
        sub: 'https://github.com/organization/production-api',
        tag: 'Connected via Octokit API'
      }
    },
    {
      num: '2',
      title: 'Index language AST & CI logs',
      desc: 'Static analyzer parses dependency graphs, imports, and failing workflow runs.',
      preview: {
        type: 'ast',
        title: 'AST Ingestion Stream',
        sub: '32 source files indexed • 4 syntax signals detected',
        tag: 'TypeScript 5.4 + Python 3.12'
      }
    },
    {
      num: '3',
      title: 'Synthesize surgical code fixes',
      desc: 'Deterministic patches crafted for scope shadowing, broken imports, and syntax.',
      preview: {
        type: 'fix',
        title: 'Surgical Patch Synthesis',
        sub: 'src/auth/session.ts L42 • Resolving TS2339',
        tag: 'Deterministic AI Remediation'
      }
    },
    {
      num: '4',
      title: 'Verify with sandboxed test suites',
      desc: 'Executes linter and test runners in isolated memory before committing.',
      preview: {
        type: 'test',
        title: 'Verification Sandbox',
        sub: '14 unit tests passing • 0 regressions detected',
        tag: '100% Pass Rate'
      }
    },
    {
      num: '5',
      title: 'Merge auto-generated Pull Request',
      desc: 'Atomic commit pushed to dedicated branch with full explanations and diagnostics.',
      preview: {
        type: 'pr',
        title: 'GitHub Pull Request',
        sub: 'PR #108 opened by GitFixAI • Ready for merge',
        tag: 'Branch: AI_REMEDIATION_FIX'
      }
    }
  ];

  const faqs = [
    {
      q: 'How does GitFix differ from Copilot or standard LLMs?',
      a: 'Standard AI assistants generate unverified text snippets that frequently hallucinate non-existent APIs. GitFix uses deterministic AST static analysis, validates compiler output, executes test suites in isolated sandboxes, and only opens PRs when code is mathematically verified.'
    },
    {
      q: 'Which programming languages and frameworks are supported?',
      a: 'GitFix provides native multi-language support for TypeScript, JavaScript, Python, Go, Rust, and Dockerfiles. It seamlessly parses ESLint, mypy, flake8, bandit, go vet, and GitHub Actions runner logs.'
    },
    {
      q: 'Does GitFix modify our main branch directly?',
      a: 'Never. GitFix operates under strict isolation protocols. It always creates a dedicated remediation branch (e.g. GITFIX_AI_FIX) and submits a comprehensive Pull Request complete with root-cause diagnostics and test verification.'
    },
    {
      q: 'Can GitFix run on private repositories?',
      a: 'Yes. When connecting via GitHub OAuth, GitFix requests minimal scoped permissions using short-lived tokens. Your proprietary source code is processed in transient memory and is never used to train public models.'
    },
    {
      q: 'Can we integrate GitFix directly into our CI/CD pipeline?',
      a: 'Yes. You can trigger GitFix automatically on failed GitHub Actions workflow runs via our webhook endpoint, or run it in your terminal as a zero-dependency CLI agent.'
    },
    {
      q: 'Is GitFix free to try?',
      a: 'Yes. Scans on public repositories and individual developer workspaces are completely free. Unlimited automated runs and team collaboration are available on standard tiers.'
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
    <div className="min-h-screen bg-[#05070d] text-slate-100 font-sans flex flex-col justify-between select-none overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: HERO CONTAINER (Curved Dark Midnight Navy Canvas)
         ═══════════════════════════════════════════════════════════ */}
      <div className="relative w-full rounded-b-[36px] sm:rounded-b-[44px] md:rounded-b-[52px] bg-gradient-to-b from-[#0b0f19] via-[#090d16] to-[#070a12] border-b border-x border-white/[0.07] px-6 sm:px-10 md:px-14 lg:px-16 pt-7 pb-12 sm:pb-16 md:pb-20 flex flex-col justify-between overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.7)] min-h-[82vh] lg:min-h-[86vh]">

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
              <BrandLogo size={32} />
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

          {/* Top Right Floating Card (Matching reference image) */}
          <div className="self-end w-full sm:w-[410px] md:w-[440px] lg:w-[470px]">
            <div className="p-6 sm:p-7 rounded-2xl bg-[#121826]/70 border border-white/[0.08] backdrop-blur-xl shadow-2xl">
              <h3 className="text-[17px] sm:text-[18px] font-medium text-slate-100 tracking-[-0.01em] leading-[1.35] mb-6">
                Automated code healing & test repair across TypeScript, Python, Go & more
              </h3>

              <div className="flex items-center gap-3 pt-1">
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131e2e]/80 border border-[#3b82f6]/20 text-[#7dd3fc] text-[12px] font-medium w-fit backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>
                  GitFix <span className="opacity-50">—</span> autonomous advantage!
                </span>
              </div>

              {/* Headline with Matt Green color */}
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
          SECTION 2: DARK BLUE STATS BAR
          (4 discrete columns with vertical hairline dividers)
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#05070d] px-6 sm:px-10 md:px-14 lg:px-16 py-10 md:py-12 border-b border-white/[0.06]">
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
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: "IT'S SIMPLE TO GET STARTED" (Image 1 top part)
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-24 md:py-32">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-center mb-16">
          It's simple to get started
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Numbered Step Cards */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            {steps.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer flex items-center gap-4 ${
                    isSelected
                      ? 'bg-[#131926] border border-white/15 shadow-xl scale-[1.01]'
                      : 'bg-transparent border border-white/[0.04] hover:bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  {/* Number pill */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#2fb380] text-black font-bold shadow-md shadow-[#2fb380]/20'
                      : 'bg-white/[0.05] border border-white/10 text-slate-400'
                  }`}>
                    {step.num}
                  </div>

                  <div className="flex-1">
                    <h3 className={`text-sm sm:text-base font-semibold transition-colors ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}>
                      {step.title}
                    </h3>
                    {isSelected && (
                      <p className="text-xs text-[#758a9e] mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Soft Container with Step Preview Card */}
          <div className="lg:col-span-6">
            <div className="p-7 sm:p-10 rounded-3xl bg-gradient-to-br from-[#101624] to-[#0d121c] border border-white/10 shadow-2xl relative overflow-hidden">
              
              {/* Subtle Ambient Matte Glow */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none blur-[100px] opacity-25"
                style={{ background: '#2fb380' }}
              />

              {/* Mockup Window */}
              <div className="rounded-2xl bg-[#090d14] border border-white/[0.08] overflow-hidden shadow-2xl">
                {/* Browser bar */}
                <div className="px-4 py-3 bg-[#0d121c] border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    <span className="text-[11px] font-mono text-slate-400 ml-2">gitfix-console</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2fb380]/15 text-[#2fb380] border border-[#2fb380]/25">
                    {steps[activeStep].preview.tag}
                  </span>
                </div>

                {/* Content based on active step */}
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                    {steps[activeStep].preview.title}
                  </div>
                  <div className="text-sm font-mono text-white font-medium break-all">
                    {steps[activeStep].preview.sub}
                  </div>

                  {activeStep === 0 && (
                    <div className="p-4 rounded-xl bg-[#121826] border border-white/10 space-y-2 font-mono text-xs">
                      <div className="flex items-center gap-2 text-[#38bdf8]">
                        <GitBranch className="w-4 h-4" />
                        <span>Branch: main • Commit: a84ef02</span>
                      </div>
                      <div className="text-slate-400">Target readiness assessment: Level 4 ready</div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="p-4 rounded-xl bg-[#121826] border border-white/10 space-y-2 font-mono text-xs">
                      <div className="text-slate-400">[AST] Parsing 32 abstract syntax trees...</div>
                      <div className="text-amber-400">[CI] Run #14 failing on TypeScript typecheck</div>
                      <div className="text-emerald-400">[SCAN] Root-cause syntax error located at L42</div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="p-4 rounded-xl bg-[#121826] border border-white/10 space-y-1.5 font-mono text-xs">
                      <div className="text-red-400/90 bg-red-500/10 px-2 py-0.5 rounded">- const user = db.query(id == id)</div>
                      <div className="text-[#2fb380] bg-[#2fb380]/10 px-2 py-0.5 rounded">+ const user = db.query(User.id == userId)</div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="p-4 rounded-xl bg-[#121826] border border-white/10 space-y-2 font-mono text-xs">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Check className="w-4 h-4" />
                        <span>All 14 test suites executed successfully</span>
                      </div>
                      <div className="text-slate-400">Zero regressions • Build latency: 380ms</div>
                    </div>
                  )}

                  {activeStep === 4 && (
                    <div className="p-4 rounded-xl bg-[#121826] border border-white/10 space-y-2 font-mono text-xs">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">Open</span>
                        <span className="text-white font-medium">GitFix: auto-resolved 4 CI/CD issues</span>
                      </div>
                      <div className="text-slate-400">1 commit • 2 files changed • 100/100 score</div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: FAQS ACCORDION (Image 1 bottom part)
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-4xl mx-auto px-6 py-20 md:py-28 border-t border-white/[0.06]">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-center mb-12">
          FAQs
        </h2>

        <div className="space-y-3.5">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="rounded-2xl bg-[#0d121c] border border-white/[0.07] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-200">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-white' : ''
                  }`} />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#788ca2] leading-relaxed border-t border-white/[0.04]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: MASSIVE MINIMALIST FOOTER (Image 2 directly!)
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
            {/* Column 1 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white tracking-wide">Find Work</h4>
              <ul className="space-y-2.5 text-slate-400">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Repositories</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">AST Analysis</Link></li>
                <li><Link href="/history" className="hover:text-white transition-colors">Run History</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Diagnostics</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white tracking-wide">Developers</h4>
              <ul className="space-y-2.5 text-slate-400">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><a href="https://github.com/AryanSingh64/GItFIxAI" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub Repository</a></li>
                <li><Link href="/auth" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/auth" className="hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white tracking-wide">Company</h4>
              <ul className="space-y-2.5 text-slate-400">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="mailto:contact@gitfix.ai" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#privacy" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* ─── MASSIVE ULTRA-BOLD WORDMARK (Image 2 Parallel style) ─── */}
        <div className="pt-6 pb-4 border-t border-white/[0.06] flex items-center justify-between gap-4 overflow-hidden">
          <div className="flex items-baseline gap-4 w-full">
            {/* Logo glyph */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 flex items-center justify-center">
              <BrandLogo size={64} />
            </div>
            
            {/* Giant "gitfix" text filling screen width */}
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
