import React from 'react';
import { GitBranch, Lock, Unlock, ArrowRight } from 'lucide-react';

export default function RepoList({ repos, onSelect }) {
    if (!repos || repos.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {repos.map((repo) => (
                <div
                    key={repo.name}
                    className="bg-surface p-5 rounded-xl border border-white/5 hover:border-primary/50 transition-all cursor-pointer group hover:shadow-lg hover:shadow-primary/10"
                    onClick={() => onSelect(repo.url)}
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-black/30 rounded-lg text-secondary group-hover:text-primary transition-colors">
                            <GitBranch className="w-5 h-5" />
                        </div>
                        {repo.private ? <Lock className="w-4 h-4 text-secondary/50" /> : <Unlock className="w-4 h-4 text-secondary/50" />}
                    </div>

                    <h3 className="font-semibold text-lg mb-1 truncate" title={repo.full_name}>
                        {repo.name}
                    </h3>
                    <p className="text-sm text-secondary line-clamp-2 h-10 mb-4">
                        {repo.description || "No description provided."}
                    </p>

                    <button className="w-full py-2 bg-white/5 rounded-lg text-sm font-medium group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center gap-2">
                        Select Repository <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
