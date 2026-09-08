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
  Unlock,
  Cpu,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Check,
  FolderGit2,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import RepoList from '@/components/RepoList';

function DashboardContent() {
  const [repos, setRepos] = useState([]);
  const [repoUrl, setRepoUrl] = useState('');
  const [targetDetails, setTargetDetails] = useState(null);
  const [verifyingRepo, setVerifyingRepo] = useState(false);
  const [verifyError, setVerifyError] = useState(null);
  const [commitMsg, setCommitMsg] = useState('fix(gitfix): healed {issues_count} issues in {files_changed} files • score {score}/100');
  const [autoFix, setAutoFix] = useState({ syntax: true, imports: true, formatting: true, security: false });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubUser, setGithubUser] = useState(null);
  const [selectionMode, setSelectionMode] = useState('separate'); // 'separate' | 'all'
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
        // Fetch repositories
        await fetchRepos(storedToken);
      }
    };

    processGithubCallback();
  }, [searchParams, router]);

  // ─── Fetch repos using a GitHub token ───
  const fetchRepos = async (token) => {
    if (!token) return;
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
          description: r.description,
          default_branch: r.default_branch || 'main'
        })));
      }
    } catch (err) {
      console.warn('Could not fetch repos directly:', err);
    }
  };

  // ─── Verify single separate repo ───
  const verifySeparateRepo = async (urlToVerify) => {
    const target = urlToVerify || repoUrl;
    if (!target) return;
    
    // Parse owner/repo
    let clean = target.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').trim();
    const parts = clean.split('/');
    if (parts.length < 2) {
      setVerifyError('Please enter a valid GitHub repository in "owner/repo" or full URL format');
      return;
    }

    const owner = parts[0];
    const repo = parts[1];
    setVerifyingRepo(true);
    setVerifyError(null);

    const token = localStorage.getItem('github_access_token');
    const headers = { Accept: 'application/vnd.github.v3+json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setTargetDetails({
          name: data.name,
          fullName: data.full_name,
          description: data.description,
          private: data.private,
          defaultBranch: data.default_branch,
          stars: data.stargazers_count,
          language: data.language,
          url: data.clone_url || `https://github.com/${data.full_name}`
        });
        setRepoUrl(data.clone_url || `https://github.com/${data.full_name}`);
        setVerifyError(null);
      } else if (res.status === 404) {
        setVerifyError('Repository not found. If it is private, make sure GitHub is connected.');
        setTargetDetails(null);
      } else {
        setVerifyError(`GitHub error (${res.status}). Could not inspect repository.`);
      }
    } catch (e) {
      setVerifyError('Could not verify repository with GitHub API.');
    } finally {
      setVerifyingRepo(false);
    }
  };

  // ─── Select separate repository handler ───
  const handleSelectRepo = (url) => {
    setRepoUrl(url);
    verifySeparateRepo(url);
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
    setTargetDetails(null);
  };

  // ─── Refresh repos ───
  const handleRefreshRepos = async () => {
    const token = localStorage.getItem('github_access_token');
    if (!token) {
      alert('No GitHub connection. Please connect your GitHub account first.');
      return;
    }
    setLoading(true);
    setStatusMsg('Refreshing repositories...');
    await fetchRepos(token);
    setLoading(false);
    setStatusMsg('');
  };

  // ─── Start Analysis ───
  const startAnalysis = () => {
    if (!repoUrl) return alert('Please select a separate repository or enter a URL!');
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
              MISSION CONTROL HERO BANNER
             ═══════════════════════════════════════════════════════════ */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#073f27] via-[#08472c] to-[#052b1a] border-2 border-emerald-500/30 p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
            
            {/* Ambient Radiance */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

            {/* Retro PC Sticker */}
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
                <span>Single Target Mode &bull; Ready</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#1ae38e] leading-none mb-3">
                Mission Control
              </h1>

              <p className="text-xs sm:text-sm text-emerald-100/85 font-medium leading-relaxed max-w-xl">
                Choose a separate repository for autonomous remediation. GitFix executes AST parsing, self-healing test loops, and submits a verified PR to your chosen target.
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
                  <span>
                    Selected Target: {repoUrl ? <strong>{repoUrl.replace('https://github.com/', '')}</strong> : 'None selected'}
                  </span>
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
              TARGET SPECIFICATION PANEL (Physical Folder Metaphor)
              With Option to Select a Separate Repo
             ═══════════════════════════════════════════════════════════ */}
          <div className="relative pt-6">
            
            {/* Physical Folder Tab */}
            <div className="absolute top-0 left-6 h-7 px-5 rounded-t-2xl font-mono text-[11px] font-black uppercase tracking-wider flex items-center gap-2 bg-[#10b981] text-slate-950 shadow-sm">
              <Terminal className="w-3.5 h-3.5" />
              <span>Target Specification Engine</span>
            </div>

            {/* Folder Body Container */}
            <div className="rounded-3xl bg-[#0c1219] border border-emerald-500/25 p-6 sm:p-8 shadow-2xl space-y-6">
              
              {/* Mode Toggle Header: Separate Repo vs Browse All */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-black uppercase text-white tracking-tight">
                    Remediation Target
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Select a separate repository target or browse your connected repositories.
                  </p>
                </div>

                {/* Mode Selector Pills */}
                <div className="flex items-center gap-1.5 p-1 bg-black/50 border border-slate-700 rounded-2xl text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setSelectionMode('separate')}
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      selectionMode === 'separate'
                        ? 'bg-emerald-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Select Separate Repo
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectionMode('all');
                      if (repos.length === 0 && githubConnected) handleRefreshRepos();
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      selectionMode === 'all'
                        ? 'bg-emerald-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Browse All Repos ({repos.length})
                  </button>
                </div>
              </div>

              {/* MODE 1: SELECT SEPARATE REPOSITORY INPUT */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase font-bold text-slate-300 mb-2 flex items-center justify-between">
                    <span>Target Repository (owner/repo or URL)</span>
                    <span className="text-[11px] text-emerald-400 font-normal">GitFix runs exclusively on this chosen repository</span>
                  </label>
                  
                  <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                    <div className="relative flex-1">
                      <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. AryanSingh64/GItFIxAI or https://github.com/owner/repo"
                        value={repoUrl}
                        onChange={(e) => {
                          setRepoUrl(e.target.value);
                          setTargetDetails(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            verifySeparateRepo();
                          }
                        }}
                        className="w-full bg-[#111927] border border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => verifySeparateRepo()}
                      disabled={!repoUrl.trim() || verifyingRepo}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-sm"
                    >
                      {verifyingRepo ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Verify Target</span>
                        </>
                      )}
                    </button>
                  </div>

                  {verifyError && (
                    <div className="flex items-center gap-2 mt-2 text-xs font-mono text-rose-400 bg-rose-950/30 p-2.5 rounded-xl border border-rose-500/30">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{verifyError}</span>
                    </div>
                  )}
                </div>

                {/* VERIFIED SEPARATE REPOSITORY TARGET CARD */}
                {targetDetails && (
                  <div className="p-4 rounded-2xl bg-[#11231a] border-2 border-emerald-400/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-400 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider">
                          Active Target
                        </span>
                        <h3 className="font-bold text-base text-white font-mono">
                          {targetDetails.fullName}
                        </h3>
                        {targetDetails.private ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30 font-mono">
                            <Lock className="w-2.5 h-2.5" /> Private
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                            <Unlock className="w-2.5 h-2.5" /> Public
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 font-medium line-clamp-1">
                        {targetDetails.description || 'No description provided.'}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] font-mono text-emerald-300/80 pt-1">
                        <span>Default Branch: <strong>{targetDetails.defaultBranch}</strong></span>
                        {targetDetails.language && <span>Language: <strong>{targetDetails.language}</strong></span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <a
                        href={targetDetails.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                        title="Open on GitHub"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setTargetDetails(null);
                          setRepoUrl('');
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/50 hover:text-rose-300 text-slate-400 text-xs font-mono transition-colors cursor-pointer"
                      >
                        Change Target
                      </button>
                    </div>
                  </div>
                )}

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
                  <span>Launch Remediation for Selected Repo</span>
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
              MODE 2 / OPTIONAL REPOSITORIES LIST
              (Shown when user clicks "Browse All Repos" or enters repo)
             ═══════════════════════════════════════════════════════════ */}
          {selectionMode === 'all' && (
            repos.length > 0 ? (
              <RepoList
                repos={repos}
                selectedUrl={repoUrl}
                onSelect={(url) => {
                  handleSelectRepo(url);
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
              />
            ) : (
              githubConnected && !loading && (
                <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-950/40">
                  <Github className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-white mb-1">No Repositories Loaded</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    Click Refresh to fetch account repositories or enter any separate repo above.
                  </p>
                  <button
                    onClick={handleRefreshRepos}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Fetch Account Repositories</span>
                  </button>
                </div>
              )
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
