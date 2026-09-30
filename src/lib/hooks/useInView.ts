'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

type InViewOptions = {
  /** Fraction of the element that must be visible before it counts as in view. */
  threshold?: number;
  /** Margin around the root. `0px 0px -12% 0px` triggers slightly before entry. */
  rootMargin?: string;
  /** Stop observing after the first intersection (default: true — reveal once). */
  once?: boolean;
};

/**
 * IntersectionObserver primitive powering every scroll reveal on the site.
 * Returns a ref to attach and a boolean that flips on first intersection.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  once = true,
}: InViewOptions = {}): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No IO support (or a prerender pass) — show content rather than hide it.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
