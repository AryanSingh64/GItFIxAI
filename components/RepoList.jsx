'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, GitBranch, Lock, Unlock, ExternalLink, ArrowRight, RefreshCw } from 'lucide-react';

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
    <div className="rounded-2xl bg-[#0c0e17] border border-white/[0.08] shadow-2xl overflow-hidden">
      {/* Table Header & Search Bar (Image 3) */}
      <div className="p-5 md:p-6 border-b border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold text-white tracking-tight">Repositories</h2>
          <span className="text-xs text-slate-400 font-mono">
            {filteredRepos.length} of {repos.length} repos
          </span>
        </div>

        {/* Search Bar matching Image 3 (search icon + rep| input + X clear button) */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search repositories..."
            className="w-full bg-[#131622] text-sm text-white placeholder-slate-500 rounded-xl pl-10 pr-10 py-2.5 border border-white/[0.08] focus:outline-none focus:border-white/20 transition-colors font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Repositories Table matching Image 3 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] text-[11px] font-mono uppercase tracking-wider text-slate-500">
              <th className="py-3 px-6 w-20">Level</th>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6 w-32">Progress</th>
              <th className="py-3 px-6 w-36">Last Update</th>
              <th className="py-3 px-6 w-28 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-xs">
            {filteredRepos.map((repo, index) => {
              // Deterministic pseudo-metrics based on repo name for consistent display
              const hash = (repo.name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
              const level = (hash % 8) + 1;
              const progress = ((hash * 13) % 85) + 10;
              const daysAgo = (hash % 12) + 1;

              return (
                <tr
                  key={`${repo.full_name || repo.name}-${index}`}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Circular Level Badge (Image 3: circular grey badge) */}
                  <td className="py-4 px-6">
                    <div className="w-8 h-8 rounded-full bg-[#181c28] border border-white/10 flex items-center justify-center font-mono font-medium text-slate-300 text-xs">
                      {level}
                    </div>
                  </td>

                  {/* Name + URL (Image 3: orange/accent title + muted github url) */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-amber-400/90 text-sm group-hover:text-amber-300 transition-colors">
                        {repo.name}
                      </span>
                      {repo.private ? (
                        <Lock className="w-3 h-3 text-slate-500" />
                      ) : (
                        <Unlock className="w-3 h-3 text-slate-600" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono truncate max-w-sm">
                      {repo.url || `https://github.com/${repo.full_name}`}
                    </div>
                  </td>

                  {/* Progress (Image 3: percentage) */}
                  <td className="py-4 px-6 font-mono text-slate-300">
                    <div className="flex items-center gap-2">
                      <span>{progress}%</span>
                      <div className="w-12 h-1.5 bg-[#191e2b] rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-lime-400 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Last Update (Image 3: e.g. 2 hours ago, 4 days ago) */}
                  <td className="py-4 px-6 text-slate-400 font-mono">
                    {daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`}
                  </td>

                  {/* Action Button (Image 3: Bordered Update button) */}
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => onSelect(repo.url)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1d2233] border border-white/10 hover:border-white/20 text-slate-200 hover:text-white transition-all text-xs font-medium cursor-pointer"
                    >
                      Remediate
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredRepos.length === 0 && (
          <div className="p-12 text-center text-slate-500 font-mono text-xs">
            No matching repositories found for "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
}
