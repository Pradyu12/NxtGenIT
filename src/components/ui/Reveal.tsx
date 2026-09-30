'use client';

import type { CSSProperties, ElementType, ReactNode, Ref } from 'react';
import { useInView } from '@/lib/hooks/useInView';

export type RevealMode = 'up' | 'fade' | 'scale' | 'line' | 'lines';

type RevealProps = {
  children: ReactNode;
  /** Element to render. Defaults to a div. */
  as?: ElementType;
  /**
   * `up` / `fade` / `scale` / `line` map to the data-reveal variants in globals.css.
   * `lines` reveals nothing itself — it exists only to flip `data-shown` so that
   * nested `.line-mask` children animate. Use `SplitHeading` for that.
   */
  mode?: RevealMode;
  /** Stagger in milliseconds. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

/**
 * Scroll-reveal wrapper.
 *
 * The hidden state lives in CSS behind a `.js` class that is only added by the
 * inline script in the root layout. Without JS the content renders normally,
 * which keeps the page readable for crawlers and for users with JS disabled.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  mode = 'up',
  delay = 0,
  className,
  style,
  id,
}: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.12 });

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as Ref<any>}
      id={id}
      className={className}
      data-shown={inView ? 'true' : 'false'}
      {...(mode === 'lines' ? {} : { 'data-reveal': mode })}
      style={{ '--reveal-delay': `${delay}ms`, ...style } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
