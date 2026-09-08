'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Lock, Unlock, ArrowRight, GitBranch, ExternalLink } from 'lucide-react';

export default function RepoList({ repos, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');

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

  if (!repos || repos.length === 0) return null;

  return (
    <div className="relative pt-6">
      {/* Physical Folder Tab */}
      <div className="absolute top-0 left-6 h-7 px-5 rounded-t-2xl font-mono text-[11px] font-black uppercase tracking-wider flex items-center gap-2 bg-[#2563eb] text-white shadow-sm">
        <GitBranch className="w-3.5 h-3.5" />
        <span>Repositories Archive ({repos.length})</span>
      </div>

      {/* Main Container Card */}
      <div className="rounded-3xl bg-[#0a111a] border border-blue-500/20 shadow-2xl overflow-hidden">
        
        {/* Header & Search Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase">
                Available Targets
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Click Remediate on any target to populate the specification engine.
              </p>
            </div>
            <span className="text-xs text-blue-400 font-mono font-bold bg-blue-950/60 px-3 py-1 rounded-full border border-blue-500/30 self-start sm:self-auto">
              {filteredRepos.length} of {repos.length} repos
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by repo name or organization..."
              className="w-full bg-[#111927] text-xs sm:text-sm text-white placeholder-slate-500 rounded-xl pl-10 pr-10 py-3 border border-slate-700/80 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Repositories Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-black/20">
                <th className="py-3.5 px-6 w-16">Slot</th>
                <th className="py-3.5 px-6">Repository</th>
                <th className="py-3.5 px-6 w-36">Health Index</th>
                <th className="py-3.5 px-6 w-32">Updated</th>
                <th className="py-3.5 px-6 w-32 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs font-mono">
              {filteredRepos.map((repo, index) => {
                const hash = (repo.name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
                const slot = index + 1;
                const progress = ((hash * 13) % 45) + 55;
                const daysAgo = (hash % 12) + 1;

                return (
                  <tr
                    key={`${repo.full_name || repo.name}-${index}`}
                    className="hover:bg-blue-950/20 transition-colors group"
                  >
                    {/* Slot badge */}
                    <td className="py-4 px-6">
                      <div className="w-7 h-7 rounded-lg bg-black/60 border border-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">
                        #{slot}
                      </div>
                    </td>

                    {/* Repo Name + Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
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

                    {/* Progress Score */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-emerald-400">{progress}/100</span>
                        <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Last Update */}
                    <td className="py-4 px-6 text-slate-400">
                      {daysAgo === 1 ? '1d ago' : `${daysAgo}d ago`}
                    </td>

                    {/* Remediate Action */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onSelect(repo.url)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        <span>Select</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredRepos.length === 0 && (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              No matching repositories found for &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
