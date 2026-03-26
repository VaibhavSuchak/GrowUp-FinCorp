import { useState, useEffect, useCallback, useRef } from 'react';

const CACHE_PREFIX = 'supabase_cache_';
const DEFAULT_TTL = 1000 * 60 * 15; // 15 minutes
const CHANNEL_NAME = 'supabase_sync_channel';

interface CacheItem<T> {
    data: T;
    timestamp: number;
}

const CACHE_EVENT = 'supabase_cache_invalidate';

// Create a broadcast channel for cross-tab communication
const broadcastChannel = typeof window !== 'undefined' ? new BroadcastChannel(CHANNEL_NAME) : null;

export const invalidateSupabaseCache = (key?: string) => {
    if (key) {
        sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
        sessionStorage.removeItem(`admin_cache_${key}`);
    } else {
        // Clear all supabase and admin related cache
        Object.keys(sessionStorage).forEach(k => {
            if (k.startsWith(CACHE_PREFIX) || k.startsWith('admin_cache_')) {
                sessionStorage.removeItem(k);
            }
        });
    }

    // Dispatch locally
    window.dispatchEvent(new CustomEvent(CACHE_EVENT, { detail: { key } }));

    // Dispatch to other tabs
    broadcastChannel?.postMessage({ type: CACHE_EVENT, key });
};

export function useSupabaseQuery<T>(
    key: string,
    queryFn: () => Promise<{ data: T | null; error: any }>,
    options: { ttl?: number; enabled?: boolean } = {}
) {
    const { ttl = DEFAULT_TTL, enabled = true } = options;
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(enabled);

    const cacheKey = `${CACHE_PREFIX}${key}`;
    const queryRef = useRef(queryFn);
    useEffect(() => { queryRef.current = queryFn; }, [queryFn]);

    const fetchData = useCallback(async (ignoreCache = false) => {
        if (!enabled) return;

        if (!ignoreCache) {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                try {
                    const { data: cachedData, timestamp }: CacheItem<T> = JSON.parse(cached);
                    if (Date.now() - timestamp < ttl) {
                        setData(cachedData);
                        setLoading(false);
                        return;
                    }
                } catch (e) {
                    sessionStorage.removeItem(cacheKey);
                }
            }
        }

        setLoading(true);
        try {
            const { data: result, error: queryError } = await queryRef.current();
            if (queryError) throw queryError;

            if (result) {
                const cacheItem: CacheItem<T> = {
                    data: result,
                    timestamp: Date.now()
                };
                sessionStorage.setItem(cacheKey, JSON.stringify(cacheItem));
                setData(result);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [cacheKey, ttl, enabled]);

    useEffect(() => {
        fetchData();

        const handleInvalidate = (e: any) => {
            const invalidatedKey = e.detail?.key || e.key; // Handle both CustomEvent and BroadcastMessage
            if (!invalidatedKey || invalidatedKey === key) {
                fetchData(true);
            }
        };

        // Listen for local events
        window.addEventListener(CACHE_EVENT, handleInvalidate);

        // Listen for cross-tab messages
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === CACHE_EVENT) {
                const invalidatedKey = event.data.key;
                if (!invalidatedKey || invalidatedKey === key) {
                    fetchData(true);
                }
            }
        };
        broadcastChannel?.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener(CACHE_EVENT, handleInvalidate);
            broadcastChannel?.removeEventListener('message', handleMessage);
        };
    }, [fetchData, key]);

    const refetch = () => fetchData(true);

    return { data, error, loading, refetch };
}
