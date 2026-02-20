import { useEffect, useRef, useState, useCallback } from 'react';
import { getWsUrl } from '../lib/api';

export function useAgentSocket() {
    const [logs, setLogs] = useState([]);
    const [stages, setStages] = useState({});
    const [diffs, setDiffs] = useState([]);
    const [result, setResult] = useState(null);
    const [prUrl, setPrUrl] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const ws = useRef(null);
    const mounted = useRef(true);
    const reconnectTimer = useRef(null);

    const retryDelay = useRef(2000);
    const maxRetries = useRef(10);
    const retryCount = useRef(0);

    const connect = useCallback(() => {
        // Don't connect if already open or connecting
        if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) return;
        if (retryCount.current >= maxRetries.current) {
            console.warn('WebSocket: max retries reached, giving up.');
            return;
        }

        const wsUrl = getWsUrl();
        console.log(`WebSocket: connecting to ${wsUrl} (attempt ${retryCount.current + 1})...`);

        try {
            ws.current = new WebSocket(wsUrl);
        } catch (e) {
            console.error('WebSocket: failed to create connection', e);
            return;
        }

        ws.current.onopen = () => {
            console.log('Agent WebSocket connected');
            setIsConnected(true);
            retryDelay.current = 2000;
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
            setIsConnected(false);
            if (mounted.current) {
                retryCount.current += 1;
                const delay = retryDelay.current;
                console.log(`WebSocket: closed. Reconnecting in ${delay / 1000}s...`);
                reconnectTimer.current = setTimeout(connect, delay);
                retryDelay.current = Math.min(retryDelay.current * 1.5, 30000);
            }
        };

        ws.current.onerror = () => {
            // onclose will fire after this, triggering reconnect
        };
    }, []);

    // Manual start — call this to initiate connection
    const startConnection = useCallback(() => {
        retryCount.current = 0;
        retryDelay.current = 2000;
        connect();
    }, [connect]);

    useEffect(() => {
        mounted.current = true;
        // Auto-connect on mount
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

    return { logs, stages, diffs, result, prUrl, clearAll, isConnected, startConnection };
}
