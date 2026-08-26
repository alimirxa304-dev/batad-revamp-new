import { useState, useEffect, useRef } from 'react';
import { getCourseSuggestions } from '@/action/courses';
import { useLocale } from 'next-intl';

// Module-level cache: survives re-renders, cleared on page reload
const cache = new Map();
const CACHE_MAX = 40;

function addToCache(key, value) {
    if (cache.size >= CACHE_MAX) {
        cache.delete(cache.keys().next().value);
    }
    cache.set(key, value);
}

export default function useSearchAutocomplete() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const locale = useLocale();
    const reqIdRef = useRef(0);

    useEffect(() => {
        const trimmed = query.trim();

        if (trimmed.length < 2) {
            setSuggestions([]);
            setIsLoading(false);
            return;
        }

        // Show loading immediately so dropdown stays open
        setIsLoading(true);

        const cacheKey = `${locale}:${trimmed.toLowerCase()}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            setSuggestions(cached);
            setIsLoading(false);
            return;
        }

        const timer = setTimeout(async () => {
            const reqId = ++reqIdRef.current;
            try {
                const results = await getCourseSuggestions(locale, trimmed);
                // Ignore response if a newer request is already in flight
                if (reqId !== reqIdRef.current) return;
                addToCache(cacheKey, results);
                setSuggestions(results);
            } catch {
                if (reqId === reqIdRef.current) setSuggestions([]);
            } finally {
                if (reqId === reqIdRef.current) setIsLoading(false);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [query, locale]);

    const clearSuggestions = () => {
        setSuggestions([]);
        setIsLoading(false);
    };

    const showDropdown = query.trim().length >= 2 && (isLoading || suggestions.length > 0);

    return { query, setQuery, suggestions, isLoading, showDropdown, clearSuggestions };
}
