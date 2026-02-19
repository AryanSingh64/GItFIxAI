import React from 'react';
import { Check, X } from 'lucide-react';

export default function FixesTable({ fixes }) {
    if (!fixes || fixes.length === 0) return null;

    return (
        <div className="bg-surface rounded-xl border border-white/5 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-white/5">
                <h3 className="text-secondary text-sm font-medium uppercase tracking-wider">Fixes Applied</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-black/20 text-secondary font-medium">
                        <tr>
                            <th className="px-6 py-4">File</th>
                            <th className="px-6 py-4">Bug Type</th>
                            <th className="px-6 py-4">Line</th>
                            <th className="px-6 py-4">Commit Message</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {fixes.map((fix, index) => (
                            <tr key={index} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-mono text-blue-300">{fix.file}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${fix.type === 'LINTING' ? 'bg-yellow-500/10 text-yellow-500' :
                                            fix.type === 'SYNTAX' ? 'bg-red-500/10 text-red-500' :
                                                fix.type === 'LOGIC' ? 'bg-purple-500/10 text-purple-500' :
                                                    'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        {fix.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-secondary">{fix.line}</td>
                                <td className="px-6 py-4 text-gray-300 max-w-xs truncate" title={fix.commit}>{fix.commit}</td>
                                <td className="px-6 py-4">
                                    {fix.status === 'FIXED' ? (
                                        <span className="flex items-center gap-1 text-green-400 font-medium">
                                            <Check className="w-4 h-4" /> Fixed
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-red-400 font-medium">
                                            <X className="w-4 h-4" /> Failed
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
