'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowRight,
  Terminal,
  Github,
  Link as LinkIcon,
  Loader2,
  User,
  RefreshCw,
  Unplug,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Eye,
  Pencil,
  Package,
  Palette,
  Lock,
  Cpu,
  Sparkles,
  GitBranch,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import RepoList from '@/components/RepoList';

function DashboardContent() {
  const [repos, setRepos] = useState([]);
  const [repoUrl, setRepoUrl] = useState('');
  const [commitMsg, setCommitMsg] = useState('fix(gitfix): healed {issues_count} issues in {files_changed} files • score {score}/100');
  const [autoFix, setAutoFix] = useState({ syntax: true, imports: true, formatting: true, security: false });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubUser, setGithubUser] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userName, userAvatar, authProvider, signInWithGithub } = useAuth();
  const oauthProcessed = useRef(false);

  // ─── On mount: check for GitHub OAuth callback code OR existing token ───
  useEffect(() => {
    const processGithubCallback = async () => {
      const code = searchParams.get('code');

      if (code && !oauthProcessed.current) {
        oauthProcessed.current = true;
        setLoading(true);
        setStatusMsg('Connecting GitHub account...');

        try {
          const response = await fetch('/api/auth/github', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });

          if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Server Error: ${response.status} - ${errText}`);
          }

          const data = await response.json();

          if (data.access_token) {
            localStorage.setItem('github_access_token', data.access_token);
            setGithubConnected(true);
          }

          if (data.user) {
            localStorage.setItem('github_user', JSON.stringify(data.user));
            setGithubUser(data.user);
          }

          if (data.repos) {
            setRepos(data.repos);
          }
        } catch (error) {
          console.error('GitHub connection failed:', error);
          alert(`GitHub connection failed: ${error.message}`);
        } finally {
          setLoading(false);
          setStatusMsg('');
          router.replace('/dashboard');
        }
        return;
      }

      const storedToken = localStorage.getItem('github_access_token');
      const storedUser = localStorage.getItem('github_user');

      if (storedToken) {
        setGithubConnected(true);
        if (storedUser) {
          try { setGithubUser(JSON.parse(storedUser)); } catch (e) { /* ignore */ }
        }
        await fetchRepos(storedToken);
      }
    };

    processGithubCallback();
  }, [searchParams, router]);

  // ─── Fetch repos using a GitHub token ───
  const fetchRepos = async (token) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setRepos(data.map(r => ({
          name: r.name,
          full_name: r.full_name,
          url: r.clone_url || `https://github.com/${r.full_name}`,
          private: r.private,
          description: r.description
        })));
      }
    } catch (err) {
      console.warn('Could not fetch repos directly:', err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Connect GitHub ───
  const handleConnectGithub = async () => {
    setLoading(true);
    setStatusMsg('Connecting GitHub...');
    try {
      const res = await signInWithGithub();
      if (res.token) {
        localStorage.setItem('github_access_token', res.token);
        setGithubConnected(true);
        await fetchRepos(res.token);
      }
    } catch (err) {
      console.error(err);
      alert(`GitHub connection failed: ${err.message}`);
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  // ─── Disconnect GitHub ───
  const handleDisconnectGithub = () => {
    localStorage.removeItem('github_access_token');
    localStorage.removeItem('github_user');
    setGithubConnected(false);
    setGithubUser(null);
    setRepos([]);
  };

  // ─── Refresh repos ───
  const handleRefreshRepos = async () => {
    const token = localStorage.getItem('github_access_token');
    if (!token) {
      alert('No GitHub connection. Please connect your GitHub account first.');
      return;
    }
    await fetchRepos(token);
  };

  // ─── Start Analysis ───
  const startAnalysis = () => {
    if (!repoUrl) return alert('Please select a repository or enter a URL!');
    if (!repoUrl.includes('github.com')) return alert('Please enter a valid GitHub repository URL!');

    const token = localStorage.getItem('github_access_token');
    sessionStorage.setItem('gitfixai_session', JSON.stringify({
      repoUrl,
      commitMsg,
      autoFix,
      accessToken: token
    }));

    router.push('/agent');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white selection:bg-emerald-400 selection:text-black">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
          
          {/* ═══════════════════════════════════════════════════════════
              MISSION CONTROL HERO BANNER (Directly matching theme)
             ═══════════════════════════════════════════════════════════ */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#073f27] via-[#08472c] to-[#052b1a] border-2 border-emerald-500/30 p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
            
            {/* Ambient Radiance */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

            {/* Retro PC Sticker floating on top right */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-8 opacity-80 sm:opacity-100 hover:scale-105 transition-transform pointer-events-none">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
                <Image
                  src="/ui/asset/sticker_pc.png"
                  alt="Retro PC Workstation"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-emerald-400/30 text-[11px] font-mono uppercase tracking-widest text-emerald-300 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Autonomous Engine &bull; Ready</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#1ae38e] leading-none mb-3">
                Mission Control
              </h1>

              <p className="text-xs sm:text-sm text-emerald-100/85 font-medium leading-relaxed max-w-xl">
                Select any repository to begin autonomous AST scanning, self-healing test runs, and automated Pull Request creation on GitHub.
              </p>

              {/* Status Telemetry Pills */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs font-mono">
                {githubConnected ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-emerald-500/40 text-emerald-300">
                    <Github className="w-3.5 h-3.5 text-white" />
                    <span>GitHub: <strong>@{githubUser?.login || 'connected'}</strong></span>
                  </div>
                ) : (
                  <button
                    onClick={handleConnectGithub}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Connect GitHub Account</span>
                  </button>
                )}

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-emerald-500/30 text-emerald-200">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Available Targets: <strong>{repos.length}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-[#0b131b] border-2 border-emerald-400/40 rounded-3xl p-8 text-center shadow-2xl max-w-sm">
                <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto mb-4" />
                <p className="text-white font-mono text-sm font-bold">{statusMsg || 'Loading...'}</p>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              GITHUB CONNECT PROMPT (When disconnected)
             ═══════════════════════════════════════════════════════════ */}
          {!githubConnected && (
            <div className="rounded-3xl bg-[#0d141e] border border-blue-500/30 p-6 sm:p-8 shadow-xl text-center relative overflow-hidden">
              <div className="inline-flex p-3 bg-blue-600/20 rounded-2xl border border-blue-400/30 mb-3">
                <Github className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-black uppercase text-white tracking-tight mb-2">
                Connect GitHub for 1-Click Auto-PRs
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
                Connect your GitHub account to import your repositories and allow GitFix to open verified, ready-to-merge Pull Requests automatically.
              </p>
              <button
                onClick={handleConnectGithub}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-emerald-50 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Github className="w-4 h-4" />
                <span>Authorize GitHub Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              TARGET SPECIFICATION PANEL (Physical Folder Metaphor)
             ═══════════════════════════════════════════════════════════ */}
          <div className="relative pt-6">
            
            {/* Physical Folder Tab */}
            <div className="absolute top-0 left-6 h-7 px-5 rounded-t-2xl font-mono text-[11px] font-black uppercase tracking-wider flex items-center gap-2 bg-[#10b981] text-slate-950 shadow-sm">
              <Terminal className="w-3.5 h-3.5" />
              <span>Target Specification Engine</span>
            </div>

            {/* Folder Body Container */}
            <div className="rounded-3xl bg-[#0c1219] border border-emerald-500/25 p-6 sm:p-8 shadow-2xl space-y-6">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-black uppercase text-white tracking-tight">
                    Remediation Parameters
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Configure repository target, automated commit message, and test healing passes.
                  </p>
                </div>

                {githubConnected && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRefreshRepos}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
                      title="Refresh Repositories"
                    >
                      <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>

                    <button
                      onClick={handleDisconnectGithub}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 text-xs font-mono transition-colors cursor-pointer"
                      title="Disconnect GitHub"
                    >
                      <Unplug className="w-3 h-3" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Form Inputs */}
              <div className="space-y-5">
                
                {/* Repo URL Input */}
                <div>
                  <label className="text-xs font-mono uppercase font-bold text-slate-300 mb-2 flex items-center justify-between">
                    <span>Git Repository Target</span>
                    <span className="text-[11px] text-emerald-400 font-normal">Click a repo below or enter custom URL</span>
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="https://github.com/organization/repository"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="w-full bg-[#111927] border border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Commit Message Template */}
                <div>
                  <label className="text-xs font-mono uppercase font-bold text-slate-300 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Automated PR Commit Message Template</span>
                  </label>
                  <input
                    type="text"
                    value={commitMsg}
                    onChange={(e) => setCommitMsg(e.target.value)}
                    placeholder="fix(gitfix): healed {issues_count} issues in {files_changed} files"
                    className="w-full bg-[#111927] border border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
                  />
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-slate-400">
                    <Eye className="w-3 h-3 text-slate-500" />
                    <span className="truncate">
                      Preview: {commitMsg.replace('{issues_count}', '8').replace('{files_changed}', '3').replace('{score}', '98')}
                    </span>
                  </div>
                </div>

                {/* Remediation Passes Toggles */}
                <div>
                  <label className="text-xs font-mono uppercase font-bold text-slate-300 mb-3 block">
                    Remediation Passes Enabled
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { key: 'syntax', label: 'Syntax AST', color: 'border-blue-500/40 bg-blue-950/30 text-blue-300', icon: <Pencil className="w-3.5 h-3.5" /> },
                      { key: 'imports', label: 'Imports Fixer', color: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300', icon: <Package className="w-3.5 h-3.5" /> },
                      { key: 'formatting', label: 'Formatter', color: 'border-orange-500/40 bg-orange-950/30 text-orange-300', icon: <Palette className="w-3.5 h-3.5" /> },
                      { key: 'security', label: 'Security Guard', color: 'border-pink-500/40 bg-pink-950/30 text-pink-300', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                    ].map(({ key, label, color, icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setAutoFix(prev => ({ ...prev, [key]: !prev[key] }))}
                        className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                          autoFix[key]
                            ? `${color} shadow-sm`
                            : 'border-slate-800 bg-slate-900/40 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {icon}
                          <span>{label}</span>
                        </div>
                        <div className={`w-3 h-3 rounded-full transition-colors ${autoFix[key] ? 'bg-emerald-400 shadow-xs' : 'bg-slate-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={startAnalysis}
                  className="w-full py-4 sm:py-4.5 rounded-2xl bg-[#b2f540] hover:bg-[#a1e52f] text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span>Launch Remediation Session</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {!githubConnected && (
                  <div className="flex items-center gap-2 justify-center mt-3 text-[11px] font-mono text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>GitHub not connected &bull; Scan will run in read-only mode unless authenticated.</span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              REPOSITORIES LIST SECTION
             ═══════════════════════════════════════════════════════════ */}
          {repos.length > 0 ? (
            <RepoList
              repos={repos}
              onSelect={(url) => {
                setRepoUrl(url);
                window.scrollTo({ top: 180, behavior: 'smooth' });
              }}
            />
          ) : (
            githubConnected && !loading && (
              <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-950/40">
                <Github className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No Repositories Discovered</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  We couldn&apos;t find any repositories on this account. Try clicking Refresh or paste a GitHub URL directly above.
                </p>
              </div>
            )
          )}

        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
