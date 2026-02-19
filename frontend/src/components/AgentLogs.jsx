import React from 'react';
import { Activity } from 'lucide-react';

export default function AgentLogs({ logs }) {
    return (
        <div className="bg-black/50 p-4 rounded-xl border border-white/10 h-64 overflow-y-auto font-mono text-xs">
            <div className="flex items-center gap-2 text-secondary mb-3 sticky top-0 bg-black/90 pb-2 border-b border-white/5">
                <Activity className="w-3 h-3" /> Agent Live Logs
            </div>
            <div className="space-y-2">
                {logs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                        <span className="text-secondary shrink-0">[{log.time}]</span>
                        <span className={
                            log.type === 'ERROR' ? 'text-red-400' :
                                log.type === 'SUCCESS' ? 'text-green-400' :
                                    log.type === 'ACTION' ? 'text-blue-400' :
                                        'text-gray-400'
                        }>{log.message}</span>
                    </div>
                ))}
                <div className="animate-pulse text-primary">_</div>
            </div>
        </div>
    );
}
