'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight, Github, Terminal, CheckCircle2, Shield,
  GitPullRequest, Zap, Cpu, Code2, ArrowUpRight,
  Layers, Check, Copy, ExternalLink, Sparkles, RefreshCw
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   GEOMETRIC BRAND GLYPH (Image 1 top left)
   ═══════════════════════════════════════════════════════════ */
function BrandGlyph({ size = 32 }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-white/20 transition-colors"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a10 10 0 0 1 10 10c0 4.418-2.865 8.167-6.84 9.47M12 22A10 10 0 0 1 2 12C2 7.582 4.865 3.833 8.84 2.53" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3.5" fill="currentColor" fillOpacity="0.4" />
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('diff');

  const copySnippet = () => {
    navigator.clipboard.writeText('npx gitfix-agent init --repo=owner/repo');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-slate-100 selection:bg-lime-400 selection:text-black font-sans relative overflow-x-hidden">
      {/* Ambient background glow matching Image 1 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-150px] left-[10%] w-[550px] h-[550px] bg-sky-900/15 rounded-full blur-[140px]" />
        <div className="absolute top-[-100px] right-[5%] w-[600px] h-[600px] bg-teal-900/10 rounded-full blur-[160px]" />
        <div className="absolute top-[300px] right-[25%] w-[350px] h-[350px] bg-indigo-950/20 rounded-full blur-[130px]" />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          NAVBAR (Image 1 Style: Logo on left, Centered pills, Try Now on right)
         ═══════════════════════════════════════════════════════════ */}
      <header className="relative z-50 max-w-7xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
        {/* Left Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <BrandGlyph size={36} />
          <span className="text-base font-semibold tracking-tight text-white">
            GitFix<span className="text-white/40 font-normal">AI</span>
          </span>
        </Link>

        {/* Center Pill Menu (Image 1: Menu, Docs, GitHub) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
          <Link
            href="#features"
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white rounded-full hover:bg-white/[0.05] transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Architecture</span>
          </Link>
          <Link
            href="/docs"
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white rounded-full hover:bg-white/[0.05] transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>Docs</span>
          </Link>
          <a
            href="https://github.com/AryanSingh64/GItFIxAI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white rounded-full hover:bg-white/[0.05] transition-colors"
          >
            <Github className="w-3.5 h-3.5 text-slate-400" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Right CTA (Image 1: Try Now Pill) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/auth')}
            className="px-5 py-2 rounded-xl text-xs font-medium text-white bg-white/[0.06] border border-white/[0.14] hover:bg-white/[0.1] hover:border-white/[0.24] transition-all shadow-[0_0_15px_rgba(255,255,255,0.04)] cursor-pointer"
          >
            Try Now
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION (Direct layout match to Image 1)
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Headline + Badge) */}
          <div className="lg:col-span-7 flex flex-col justify-between pt-2">
            {/* Pill Badge (Image 1: Sigma - speed advantage style) */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md w-fit mb-8"
            >
              <Zap className="w-3.5 h-3.5 text-lime-400" />
              <span className="text-xs font-medium text-slate-300">
                GitFix <span className="text-white/40">—</span> autonomous code healing
              </span>
            </motion.div>

            {/* Main Headline (Image 1 Asymmetrical typography) */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.08] max-w-2xl mb-8"
            >
              Autonomous code{' '}
              <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-lime-300 bg-clip-text text-transparent">
                healing and CI/CD
              </span>{' '}
              remediation platform
            </motion.h1>

            {/* Quick Terminal Command */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-2 flex items-center gap-3 p-2 pl-3.5 rounded-xl bg-[#0e111a]/80 border border-white/[0.07] backdrop-blur-md max-w-md font-mono text-xs text-slate-300"
            >
              <Terminal className="w-4 h-4 text-lime-400 shrink-0" />
              <span className="truncate text-slate-400">npx gitfix-agent init --repo=owner/repo</span>
              <button
                onClick={copySnippet}
                className="ml-auto p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Copy command"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </motion.div>
          </div>

          {/* Right Column (Floating Capability Card & Secondary Copy) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Floating Glassmorphic Capability Card (Image 1 top right card) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="p-6 md:p-7 rounded-2xl bg-gradient-to-b from-[#111420]/90 to-[#0c0e17]/90 border border-white/[0.09] shadow-2xl backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

              <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight leading-snug mb-5">
                Automated bug fixing & test healing across TypeScript, Python, Go & more
              </h2>

              {/* Language badges cluster */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  TypeScript
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  Python
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  Go
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-orange-500/10 border border-orange-500/20 text-orange-300">
                  Rust
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-500/10 border border-slate-500/20 text-slate-300">
                  Docker
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Deterministic AST validation with real-time CI log diagnostics and zero hallucinatory patches.
              </p>
            </motion.div>

            {/* Secondary Copy & Frosted Pill CTA Button (Image 1 lower right) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col gap-4 pl-1"
            >
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-md">
                Eliminate broken builds. Detect failure root causes fast and confidently with zero manual intervention. Your continuous reliability companion.
              </p>

              <div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 rounded-xl text-xs md:text-sm font-medium text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.16] hover:border-white/[0.28] transition-all shadow-[0_0_25px_rgba(255,255,255,0.06)] cursor-pointer inline-flex items-center gap-2 group"
                >
                  <span>Launch Mission Control</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            STATS BAR (Image 1 Bottom: 4 distinct columns with vertical dividers)
           ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 pt-8 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0"
        >
          {/* Stat 1 */}
          <div className="md:px-6 md:first:pl-0 border-r-0 md:border-r border-white/[0.08]">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400">Issues Remediated</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-white tabular-nums">
              10,000+
            </div>
          </div>

          {/* Stat 2 */}
          <div className="md:px-6 border-r-0 md:border-r border-white/[0.08]">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400">Mean Time to Healed PR</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-white tabular-nums">
              &lt; 45s
            </div>
          </div>

          {/* Stat 3 */}
          <div className="md:px-6 border-r-0 md:border-r border-white/[0.08]">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400">Autonomous Pass Rate</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-white tabular-nums">
              99.2%
            </div>
          </div>

          {/* Stat 4 */}
          <div className="md:px-6 md:last:pr-0">
            <div className="flex items-center gap-2 mb-2">
              <GitPullRequest className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400">Regressions Prevented</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-white tabular-nums">
              1,250+
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          INTERACTIVE ARCHITECTURE & CODE COMPARISON
         ═══════════════════════════════════════════════════════════ */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-400 mb-3">
            <Cpu className="w-3.5 h-3.5 text-lime-400" />
            <span>Deterministic AST Engine</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            How autonomous code healing works
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            From webhook trigger to passing unit test: a continuous closed-loop pipeline running in isolated environments.
          </p>
        </div>

        {/* 3 Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-[#0b0d14] border border-white/[0.07]">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-mono font-semibold mb-4">
              01
            </div>
            <h3 className="text-base font-semibold text-white mb-2">AST Log Ingestion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts failing stack traces, syntax errors, and lint warnings directly from GitHub Actions, GitLab CI, or local CLI runs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b0d14] border border-white/[0.07]">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-mono font-semibold mb-4">
              02
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Contextual Fix Synthesis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Correlates import maps, type definitions, and dependencies across files to generate minimal, non-breaking surgical diffs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b0d14] border border-white/[0.07]">
            <div className="w-8 h-8 rounded-lg bg-lime-500/10 border border-lime-500/20 text-lime-400 flex items-center justify-center text-xs font-mono font-semibold mb-4">
              03
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Verification & PR Creation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verifies the patch by re-executing test suites. Once passing, commits directly to a branch and opens an automated PR.
            </p>
          </div>
        </div>

        {/* Real Code Diff Preview (Human-crafted feel, no cartoon illustrations) */}
        <div className="rounded-2xl bg-[#0c0e17] border border-white/[0.09] overflow-hidden shadow-2xl">
          {/* Header tabs */}
          <div className="px-5 py-3.5 border-b border-white/[0.07] flex items-center justify-between bg-black/30">
            <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
              <span className="text-slate-200 font-medium">patch_verification.ts</span>
              <span className="text-white/20">|</span>
              <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-[11px]">
                AST Validated
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('diff')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  activeTab === 'diff' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Unified Diff
              </button>
              <button
                onClick={() => setActiveTab('ast')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  activeTab === 'ast' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                AST Signals
              </button>
            </div>
          </div>

          {/* Code content */}
          <div className="p-6 font-mono text-xs leading-relaxed overflow-x-auto">
            {activeTab === 'diff' ? (
              <pre className="space-y-1">
                <span className="text-slate-500 select-none">@@ -14,8 +14,8 @@ export async function handleSession(req: Request) &#123;</span>
                {'\n'}
                <span className="text-red-400/90 bg-red-500/10 block px-2 py-0.5 rounded">
                  - const user = await db.users.findUnique(&#123; where: &#123; id &#125; &#125;);
                </span>
                <span className="text-red-400/90 bg-red-500/10 block px-2 py-0.5 rounded">
                  - if (!user.isActive) throw new Error('Inactive account');
                </span>
                <span className="text-lime-300 bg-lime-500/10 block px-2 py-0.5 rounded">
                  + const user = await db.users.findUnique(&#123; where: &#123; id: req.auth.userId &#125; &#125;);
                </span>
                <span className="text-lime-300 bg-lime-500/10 block px-2 py-0.5 rounded">
                  + if (!user?.isActive) return NextResponse.json(&#123; error: 'Unauthorized' &#125;, &#123; status: 401 &#125;);
                </span>
                {'\n'}
                <span className="text-slate-400 block px-2">  return NextResponse.json(&#123; success: true, data: user &#125;);</span>
                <span className="text-slate-400 block px-2">&#125;</span>
              </pre>
            ) : (
              <div className="space-y-2 text-slate-300">
                <div className="flex items-center gap-2 text-lime-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>TS2339: Property 'id' is used before being declared in scope. Resolved via parameter resolution.</span>
                </div>
                <div className="flex items-center gap-2 text-lime-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>TS2532: Object is possibly 'undefined'. Added optional chaining safe navigation.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Terminal className="w-4 h-4 text-sky-400" />
                  <span>Test runner: 14 passing, 0 failing (duration: 382ms).</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          BOTTOM CTA & FOOTER
         ═══════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#050608] py-14 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <BrandGlyph size={28} />
            <span className="text-sm font-medium text-slate-300">GitFixAI</span>
            <span className="text-xs text-slate-600">|</span>
            <span className="text-xs text-slate-500">Autonomous code remediation platform</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">Repositories</Link>
            <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
            <a href="https://github.com/AryanSingh64/GItFIxAI" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <Link href="/auth" className="text-white hover:text-lime-300 transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
