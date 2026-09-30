'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useFinePointer } from '@/lib/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/cn';
import styles from './MagneticButton.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'signal';

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  /** Maximum travel in px. Keep it low — 8–12px reads as magnetic, more reads as broken. */
  strength?: number;
  /** Trailing element, usually an arrow glyph. */
  trailing?: ReactNode;
  type?: 'button' | 'submit';
  'aria-label'?: string;
};

/**
 * Pointer-reactive call to action.
 *
 * The button eases toward the cursor with a critically-damped lerp, and the
 * label counter-moves at 0.35× for parallax. Both are written straight to
 * `style.transform` inside one rAF loop — no React re-render per frame.
 *
 * Magnetic behaviour is disabled entirely on coarse pointers and when the user
 * prefers reduced motion, so touch and accessibility requirements are met by the
 * base styles alone.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className,
  strength = 10,
  trailing,
  type = 'button',
  'aria-label': ariaLabel,
}: MagneticButtonProps) {
  const shellRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const finePointer = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const magnetic = finePointer && !reducedMotion;

  useEffect(() => {
    if (!magnetic) return;

    const shell = shellRef.current;
    if (!shell) return;

    let frame = 0;
    let running = false;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const settle = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      const x = currentX.toFixed(2);
      const y = currentY.toFixed(2);

      shell.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${(-currentX * 0.35).toFixed(2)}px, ${(-currentY * 0.35).toFixed(2)}px, 0)`;
      }

      const settled = Math.abs(targetX - currentX) < 0.05 && Math.abs(targetY - currentY) < 0.05;
      if (settled) {
        shell.style.transform = 'translate3d(0, 0, 0)';
        if (labelRef.current) labelRef.current.style.transform = 'translate3d(0, 0, 0)';
        running = false;
        return;
      }
      frame = requestAnimationFrame(settle);
    };

    const kick = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(settle);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      const offsetX = event.clientX - (rect.left + rect.width / 2);
      const offsetY = event.clientY - (rect.top + rect.height / 2);
      targetX = Math.max(-strength, Math.min(strength, offsetX * 0.34));
      targetY = Math.max(-strength, Math.min(strength, offsetY * 0.44));
      kick();
    };

    const recentre = () => {
      targetX = 0;
      targetY = 0;
      kick();
    };

    shell.addEventListener('pointermove', onPointerMove);
    shell.addEventListener('pointerleave', recentre);
    shell.addEventListener('pointercancel', recentre);

    return () => {
      cancelAnimationFrame(frame);
      shell.removeEventListener('pointermove', onPointerMove);
      shell.removeEventListener('pointerleave', recentre);
      shell.removeEventListener('pointercancel', recentre);
    };
  }, [magnetic, strength]);

  const content = (
    <>
      <span ref={labelRef} className={styles.label}>
        {children}
      </span>
      {trailing ? (
        <span aria-hidden="true" className={styles.trailing}>
          {trailing}
        </span>
      ) : null}
    </>
  );

  const shared = {
    className: cn(styles.button, styles[variant], className),
    'aria-label': ariaLabel,
  };

  if (href) {
    return (
      <span ref={shellRef} className={styles.shell} data-magnetic={magnetic || undefined}>
        <a href={href} {...shared} data-cursor="hover">
          {content}
        </a>
      </span>
    );
  }

  return (
    <span ref={shellRef} className={styles.shell} data-magnetic={magnetic || undefined}>
      <button type={type} onClick={onClick} {...shared} data-cursor="hover">
        {content}
      </button>
    </span>
  );
}
