'use client';

import { useEffect, useRef } from 'react';
import { useFinePointer } from '@/lib/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';
import styles from './CursorGlow.module.css';

/**
 * Subtle cursor treatment: a crisp dot that tracks 1:1 and a hollow ring that
 * lags behind with a lerp. The ring dilates over interactive elements.
 *
 * Strictly a fine-pointer enhancement — it is never rendered on touch, and it
 * does not intercept pointer events, so native cursor behaviour on links and
 * text inputs is fully preserved.
 */
export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!finePointer) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const show = () => dot.setAttribute('data-visible', 'true');
    const hide = () => dot.setAttribute('data-visible', 'false');

    // Reduced motion: snap to the pointer with no easing, no ring lag.
    if (reducedMotion) {
      const snap = (event: PointerEvent) => {
        show();
        dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      };
      window.addEventListener('pointermove', snap, { passive: true });
      window.addEventListener('pointerdown', show, { passive: true });
      document.addEventListener('pointerleave', hide);

      return () => {
        window.removeEventListener('pointermove', snap);
        window.removeEventListener('pointerdown', show);
        document.removeEventListener('pointerleave', hide);
      };
    }

    let frame = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;

    // The ring only *needs* to move while it is out of sync with the pointer.
    // An unconditional rAF loop keeps waking the compositor 60x a second for
    // the whole session even when the cursor is parked, which on a laptop
    // battery is pure waste and shows up as a steady idle drain. So the loop
    // parks itself once the ring converges and `onMove` restarts it.
    const settled = () => Math.abs(targetX - ringX) < 0.1 && Math.abs(targetY - ringY) < 0.1;

    const tick = () => {
      if (settled()) {
        frame = 0;
        return;
      }
      ringX += (targetX - ringX) * 0.14;
      ringY += (targetY - ringY) * 0.14;
      ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (frame) return;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      show();
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      wake();

      // Dilate when over anything interactive — no need for a separate listener.
      const interactive = (event.target as Element | null)?.closest?.(
        'a, button, [data-cursor="hover"], input, textarea, select, summary',
      );
      ring.setAttribute('data-active', interactive ? 'true' : 'false');
    };

    const onLeave = () => {
      hide();
      ring.setAttribute('data-active', 'false');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [finePointer, reducedMotion]);

  if (!finePointer) return null;

  return (
    <div className={styles.layer} aria-hidden="true">
      <div ref={ringRef} className={styles.ring} />
      <div ref={dotRef} className={styles.dot} />
    </div>
  );
}
