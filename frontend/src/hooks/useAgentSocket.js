import { useEffect, useRef, useState, useCallback } from 'react';

export function useAgentSocket() {
    const [logs, setLogs] = useState([]);
    const [stages, setStages] = useState({});
    const [diffs, setDiffs] = useState([]);
    const [result, setResult] = useState(null);
    const [prUrl, setPrUrl] = useState(null);

    const ws = useRef(null);
    const mounted = useRef(false);
    const reconnectTimer = useRef(null);

    const retryDelay = useRef(2000);
    const maxRetries = useRef(10);
    const retryCount = useRef(0);

    const connect = useCallback(() => {
        if (ws.current?.readyState === WebSocket.OPEN) return;
        if (retryCount.current >= maxRetries.current) return;

        // Dynamic URL based on environment variable - platform agnostic
        const validApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const wsProtocol = validApiUrl.startsWith('https') ? 'wss' : 'ws';
        const wsUrl = validApiUrl.replace(/^http(s)?/, wsProtocol) + '/ws';

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log('Agent WebSocket connected');
            retryDelay.current = 2000; // Reset backoff on success
            retryCount.current = 0;
        };

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'STAGE') {
                    setStages(prev => ({ ...prev, [data.stage]: data.status }));
                } else if (data.type === 'DIFF') {
                    setDiffs(prev => [...prev, data]);
                } else if (data.type === 'RESULT') {
                    setResult(data);
                } else if (data.type === 'PR') {
                    setPrUrl(data.url);
                } else {
                    setLogs(prev => [...prev, data]);
                }
            } catch (e) {
                // ignore parse errors
            }
        };

        ws.current.onclose = () => {
            if (mounted.current) {
                retryCount.current += 1;
                reconnectTimer.current = setTimeout(connect, retryDelay.current);
                retryDelay.current = Math.min(retryDelay.current * 1.5, 30000); // Backoff up to 30s
            }
        };

        ws.current.onerror = () => { };
    }, []);

    useEffect(() => {
        if (mounted.current) return;
        mounted.current = true;
        connect();

        return () => {
            mounted.current = false;
            clearTimeout(reconnectTimer.current);
            ws.current?.close();
        };
    }, [connect]);

    const clearAll = useCallback(() => {
        setLogs([]);
        setStages({});
        setDiffs([]);
        setResult(null);
        setPrUrl(null);
    }, []);

    return { logs, stages, diffs, result, prUrl, clearAll };
}
