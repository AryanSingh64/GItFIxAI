import React from 'react';
import { CheckCircle2, XCircle, Timer, AlertCircle } from 'lucide-react';

export default function RunSummary({ result }) {
    if (!result) return null;

    return (
        <div className="bg-surface p-6 rounded-xl border border-white/5 shadow-lg">
            <h3 className="text-secondary text-sm font-medium mb-4 uppercase tracking-wider">Run Summary</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Status Badge */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-secondary">Final Status</span>
                    <div className={`flex items-center gap-2 font-bold text-lg ${result.status === 'PASSED' ? 'text-green-400' : 'text-red-400'}`}>
                        {result.status === 'PASSED' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        {result.status}
                    </div>
                </div>

                {/* Total Failures */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-secondary">Failures Detected</span>
                    <div className="font-mono text-xl text-white">{result.totalFailures}</div>
                </div>

                {/* Fixes Applied */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-secondary">Fixes Applied</span>
                    <div className="font-mono text-xl text-blue-400">{result.fixesApplied}</div>
                </div>

                {/* Duration */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-secondary">Duration</span>
                    <div className="flex items-center gap-1 font-mono text-lg text-white">
                        <Timer className="w-4 h-4 text-secondary" /> {result.duration}
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary">Branch Created:</span>
                    <code className="bg-black/30 px-2 py-1 rounded text-primary font-mono select-all">
                        {result.branchName}
                    </code>
                </div>
            </div>
        </div>
    );
}
