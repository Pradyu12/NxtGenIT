'use client';

import { useEffect, useRef, useState } from 'react';
import { createStage, type Stage } from '@/lib/webgl/stage';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';
import styles from './SceneCanvas.module.css';

type SceneCanvasProps = {
  fragment: string;
  className?: string;
  /** Upper bound on DPR. Fullscreen scenes stay at 1.25–1.5. */
  dprCap?: number;
  /** React to pointer movement (desktop only). */
  interactive?: boolean;
  /** Extra scrim over the canvas; keeps display type legible. */
  scrim?: 'left' | 'bottom' | 'vignette' | 'none';
};

/**
 * Host for a full-bleed fragment-shader scene.
 *
 * Progressive enhancement by design:
 *  - A CSS gradient sits behind the canvas, so the section is never empty.
 *  - No WebGL, or a context-creation failure, leaves the gradient in place.
 *  - `prefers-reduced-motion` renders exactly one frame and never animates.
 *  - The stage pauses itself when scrolled out of view or when the tab is hidden.
 */
export function SceneCanvas({
  fragment,
  className,
  dprCap = 1.5,
  interactive = true,
  scrim = 'none',
}: SceneCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let stage: Stage | null = null;
    try {
      stage = createStage(canvas, {
        fragment,
        dprCap,
        interactive,
        still: reducedMotion,
        intro: !reducedMotion,
        onFrame: () => {},
      });
    } catch {
      // A driver-level context failure should never break the page.
      setSupported(false);
      return;
    }

    setSupported(stage.supported);
    return () => stage?.destroy();
  }, [fragment, dprCap, interactive, reducedMotion]);

  return (
    <div className={`${styles.stage} ${className ?? ''}`} aria-hidden="true">
      <div className={styles.fallback} data-visible={supported === false || undefined} />
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        data-scrim={scrim}
        data-live={supported ? 'true' : undefined}
      />
    </div>
  );
}
