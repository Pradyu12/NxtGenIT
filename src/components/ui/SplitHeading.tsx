'use client';

import { Fragment, type ElementType, type ReactNode } from 'react';
import { Reveal } from './Reveal';
import { cn } from '@/lib/cn';

export type HeadingLine = {
  text: ReactNode;
  /**
   * `bright` — full white, the default voice.
   * `dim`    — muted, used for the setup line of a two-line heading.
   * `accent` — electric blue, reserved for one word per page at most.
   * `lime`   — the acid-green punctuation mark.
   */
  tone?: 'bright' | 'dim' | 'accent' | 'lime';
};

type SplitHeadingProps = {
  lines: HeadingLine[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  id?: string;
  /** Base delay for the first line; subsequent lines stagger automatically. */
  delay?: number;
  /** ms between each line. */
  stagger?: number;
};

const toneClass: Record<NonNullable<HeadingLine['tone']>, string> = {
  bright: '',
  dim: 'dim',
  accent: 'accent',
  lime: 'lime',
};

/**
 * Multi-line display heading where each line slides up from behind a mask.
 *
 * The mask is what makes it feel like a title sequence rather than a fade-in:
 * the line is physically hidden by the overflow edge, so there is no ghosting
 * or blur. `overflow: hidden` also gives the descenders room to breathe via
 * the padding/margin compensation in globals.css.
 */
export function SplitHeading({
  lines,
  as: Tag = 'h2',
  className,
  lineClassName,
  id,
  delay = 0,
  stagger = 90,
}: SplitHeadingProps) {
  return (
    <Reveal as={Tag} mode="lines" className={cn('split', className)} id={id}>
      {lines.map((line, index) => (
        // The whitespace between lines is load-bearing: each `.line-mask` is a
        // block, so without it the accessible name collapses to one run
        // ("Building thenext generation."). Whitespace-only text between block
        // boxes is not rendered, so this changes nothing visually.
        <Fragment key={index}>
          <span className="line-mask">
            <span
              className={cn(lineClassName, toneClass[line.tone ?? 'bright'])}
              style={{ '--line-delay': `${delay + index * stagger}ms` } as React.CSSProperties}
            >
              {line.text}
            </span>
          </span>
          {index < lines.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Reveal>
  );
}
