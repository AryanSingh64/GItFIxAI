'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Lock, Unlock, ArrowRight, GitBranch, ExternalLink, Check, Plus, FolderGit2 } from 'lucide-react';

export default function RepoList({ repos, onSelect, selectedUrl }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customInput, setCustomInput] = useState('');

  const filteredRepos = useMemo(() => {
    if (!repos) return [];
    if (!searchQuery.trim()) return repos;
    const q = searchQuery.toLowerCase();
    return repos.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.full_name?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
    );
  }, [repos, searchQuery]);

  const handleSelectCustom = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    let url = customInput.trim();
    if (!url.startsWith('http')) {
      url = `https://github.com/${url.replace(/^\/+/, '')}`;
    }
    onSelect(url);
    setCustomInput('');
  };

  return (
    <div className="relative pt-6">
      {/* Physical Folder Tab */}
      <div className="absolute top-0 left-6 h-7 px-5 rounded-t-2xl font-mono text-[11px] font-black uppercase tracking-wider flex items-center gap-2 bg-[#2563eb] text-white shadow-sm">
        <FolderGit2 className="w-3.5 h-3.5" />
        <span>Repository Selector ({repos?.length || 0})</span>
      </div>

      {/* Main Container Card */}
      <div className="rounded-3xl bg-[#0a111a] border border-blue-500/20 shadow-2xl overflow-hidden">
        
        {/* Top Header & Option to add a separate repo manually */}
        <div className="p-5 sm:p-6 border-b border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase">
                Choose Individual Repository
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Select a single target for autonomous remediation, or specify a separate repo below.
              </p>
            </div>
            {repos && repos.length > 0 && (
              <span className="text-xs text-blue-400 font-mono font-bold bg-blue-950/60 px-3 py-1 rounded-full border border-blue-500/30 self-start sm:self-auto">
                {filteredRepos.length} available
              </span>
            )}
          </div>

          {/* Quick Option: Enter a separate repository manually */}
          <form onSubmit={handleSelectCustom} className="flex flex-col sm:flex-row items-stretch gap-2 pt-1">
            <div className="relative flex-1">
              <GitBranch className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Or specify separate repo: owner/repo (e.g. facebook/react)"
                className="w-full bg-[#111927] text-xs sm:text-sm text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 border border-slate-700 focus:outline-none focus:border-blue-400 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer font-mono shrink-0 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Select Separate Repo</span>
            </button>
          </form>

          {/* Search Filter for Account Repos (only if repos exist) */}
          {repos && repos.length > 0 && (
            <div className="relative flex items-center pt-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter repositories list..."
                className="w-full bg-[#0d1420] text-xs sm:text-sm text-white placeholder-slate-500 rounded-xl pl-10 pr-10 py-2.5 border border-slate-800 focus:outline-none focus:border-blue-400 font-mono"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Repositories Table / Grid */}
        {repos && repos.length > 0 ? (
          <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-[#0c1219]">
                <tr className="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-6 w-16">Slot</th>
                  <th className="py-3 px-6">Repository</th>
                  <th className="py-3 px-6 w-32">Status</th>
                  <th className="py-3 px-6 w-36 text-right">Target Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs font-mono">
                {filteredRepos.map((repo, index) => {
                  const isSelected = selectedUrl && (
                    selectedUrl === repo.url ||
                    selectedUrl.toLowerCase() === (repo.url || '').toLowerCase() ||
                    selectedUrl.includes(repo.full_name)
                  );
                  const slot = index + 1;

                  return (
                    <tr
                      key={`${repo.full_name || repo.name}-${index}`}
                      className={`transition-colors ${
                        isSelected ? 'bg-emerald-950/40 border-l-4 border-l-emerald-400' : 'hover:bg-blue-950/20'
                      }`}
                    >
                      {/* Slot badge */}
                      <td className="py-3.5 px-6">
                        <div className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-black/60 border-slate-800 text-slate-400'
                        }`}>
                          #{slot}
                        </div>
                      </td>

                      {/* Repo Name + Details */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-bold text-sm transition-colors ${
                            isSelected ? 'text-emerald-300' : 'text-white hover:text-blue-300'
                          }`}>
                            {repo.name}
                          </span>
                          {repo.private ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                              <Lock className="w-2.5 h-2.5" /> Private
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                              <Unlock className="w-2.5 h-2.5" /> Public
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-md">
                          {repo.url || `https://github.com/${repo.full_name}`}
                        </div>
                      </td>

                      {/* Selection Status */}
                      <td className="py-3.5 px-6">
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 font-bold text-[10px] uppercase tracking-wide">
                            <Check className="w-3 h-3" /> Selected Target
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Ready</span>
                        )}
                      </td>

                      {/* Remediate Action Button */}
                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => onSelect(repo.url)}
                          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                              : 'bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white'
                          }`}
                        >
                          <span>{isSelected ? 'Active' : 'Select Target'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredRepos.length === 0 && (
              <div className="p-10 text-center text-slate-500 font-mono text-xs">
                No matching repositories found for &quot;{searchQuery}&quot;. You can enter any separate repo above.
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 font-mono text-xs">
            Enter a separate repository above to inspect and remediate.
          </div>
        )}
      </div>
    </div>
  );
}
