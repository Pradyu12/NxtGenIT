'use client';

import { useEffect, useState } from 'react';

/**
 * SSR-safe `matchMedia` hook. Always returns `false` on the server so the
 * initial client render matches the server HTML, then corrects on mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** True on devices with a precise pointer (desktop/laptop). Drives cursor + magnetic UI. */
export function useFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}
