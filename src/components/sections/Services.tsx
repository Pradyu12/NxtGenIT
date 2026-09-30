'use client';

import { useRef, type PointerEvent } from 'react';
import { services, type Service } from '@/content/services';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';
import styles from './Services.module.css';

const headingLines = [{ text: 'From idea' }, { text: <>to internet<span className={styles.period}>.</span></> }];

export function Services() {
  return (
    <section className="section" id="services" aria-labelledby="services-title">
      <div className="shell">
        <div className={styles.head}>
          <Reveal mode="fade" className={styles.eyebrowRow}>
            <p className="eyebrow">
              <em>01</em>
              <span>Services</span>
            </p>
          </Reveal>

          <SplitHeading as="h2" id="services-title" className={styles.title} lines={headingLines} />

          <Reveal mode="up" delay={140} className={styles.ledeWrap}>
            <p className={`measure ${styles.lede}`}>
              Three disciplines, one standard. We scope the work, design the architecture and ship
              software that stays maintainable long after launch.
            </p>
          </Reveal>
        </div>

        <ul className={styles.grid}>
          {services.map((service, index) => (
            <Reveal
              as="li"
              key={service.slug}
              mode="up"
              delay={index * 110}
              className={styles.item}
            >
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

type ServiceCardProps = {
  service: Service;
};

/**
 * Interactive service card.
 *
 * Two behaviours, both pointer-driven and both fully suppressed on touch and
 * under reduced motion:
 *  1. A spotlight follows the cursor, written as two CSS custom properties so
 *     only the gradient repaints — no React state, no re-render per move.
 *  2. The card lifts a few pixels and its top rule draws in.
 *
 * The whole card is a single link so keyboard users get the same target.
 */
function ServiceCard({ service }: ServiceCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    node.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <a
      ref={ref}
      href={service.href}
      className={cn(styles.card, 'card-hover')}
      onPointerMove={onPointerMove}
      data-cursor="hover"
      aria-labelledby={`service-${service.slug}`}
    >
      <span className={styles.spotlight} aria-hidden="true" />

      <span className={styles.top} aria-hidden="true">
        <span className={styles.topRule} />
      </span>

      <span className={styles.cardHead}>
        <span className={`mono ${styles.index}`}>{service.index}</span>
        <span className={styles.glyph} aria-hidden="true">
          <ServiceGlyph slug={service.slug} />
        </span>
      </span>

      <span className={styles.cardBody}>
        <span className={styles.cardTitle} id={`service-${service.slug}`}>
          {service.title}
        </span>
        <span className={styles.cardDescription}>{service.description}</span>
      </span>

      <ul className={styles.capabilities}>
        {service.capabilities.map((capability) => (
          <li key={capability} className={styles.capability}>
            {capability}
          </li>
        ))}
      </ul>

      <span className={styles.cardFoot}>
        <span className={styles.chips}>
          {service.indicators.map((indicator) => (
            <span key={indicator} className="chip">
              {indicator}
            </span>
          ))}
        </span>
        <span className={styles.arrow} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 13L13 3M13 3H6.5M13 3v6.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </span>
      </span>
    </a>
  );
}

/** Small technical glyph per discipline — drawn, not iconified. */
function ServiceGlyph({ slug }: { slug: string }) {
  if (slug === 'frontend') {
    return (
      <svg viewBox="0 0 32 32" width="30" height="30" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="26" height="22" stroke="currentColor" strokeWidth="1.2" />
        <path d="M3 11h26" stroke="currentColor" strokeWidth="1.2" />
        <path d="M9 17h8M9 21h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
        <circle cx="6.5" cy="8" r="0.9" fill="currentColor" />
      </svg>
    );
  }

  if (slug === 'backend') {
    return (
      <svg viewBox="0 0 32 32" width="30" height="30" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="24" height="8" stroke="currentColor" strokeWidth="1.2" />
        <rect x="4" y="20" width="24" height="8" stroke="currentColor" strokeWidth="1.2" />
        <path d="M10 8h.01M10 24h.01M16 12v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" width="30" height="30" fill="none" aria-hidden="true">
      <path d="M16 4l11 6.5v11L16 28 5 21.5v-11L16 4z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M16 4v24M5 10.5l11 6.5 11-6.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
