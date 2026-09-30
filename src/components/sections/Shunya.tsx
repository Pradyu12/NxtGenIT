'use client';

import dynamic from 'next/dynamic';
import { shunya } from '@/content/shunya';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Reveal } from '@/components/ui/Reveal';
import { SHUNYA_FRAGMENT } from '@/lib/webgl/scenes/shunya';
import styles from './Shunya.module.css';

const ShunyaScene = dynamic(
  () => import('@/components/visual/SceneCanvas').then((mod) => mod.SceneCanvas),
  { ssr: false },
);

export function Shunya() {
  return (
    <section className={styles.shunya} id="shunya" aria-labelledby="shunya-title">
      <ShunyaScene fragment={SHUNYA_FRAGMENT} className={styles.scene} dprCap={1.25} scrim="vignette" />

      <div className="shell">
        {/* --- Overture -------------------------------------------------- */}
        <div className={styles.overture}>
          <Reveal mode="fade" className={styles.eyebrowRow}>
            <p className="eyebrow">
              <em>02</em>
              <span>{shunya.kicker}</span>
            </p>
          </Reveal>

          <SplitHeading
            as="h2"
            id="shunya-title"
            className={styles.title}
            lines={[{ text: shunya.titleLines[0], tone: 'dim' }, { text: shunya.titleLines[1] }]}
          />

          {/* THE WORDMARK — the visual centrepiece of the page */}
          <div className={styles.wordmarkWrap}>
            <Reveal as="p" mode="scale" delay={160} className={styles.wordmarkClip}>
              <span className={styles.wordmark} data-text={shunya.wordmark}>
                {shunya.wordmark}
              </span>
            </Reveal>

            <Reveal mode="fade" delay={420} className={styles.subtitleWrap}>
              <p className={styles.subtitle}>{shunya.subtitle}</p>
            </Reveal>

            <Reveal mode="fade" delay={520} className={styles.statusWrap}>
              <p className={styles.status} role="status">
                <span className="pulse" aria-hidden="true" />
                <span className={styles.statusLabel}>{shunya.status.label}:</span>
                <span className={styles.statusValue}>{shunya.status.value}</span>
              </p>
            </Reveal>
          </div>
        </div>

        {/* --- Description ------------------------------------------------ */}
        <div className={styles.detail}>
          <Reveal mode="up" className={styles.detailText}>
            <p className={styles.description}>{shunya.description}</p>
          </Reveal>

          <Reveal mode="up" delay={120} className={styles.detailAside}>
            <dl className={styles.telemetry}>
              {shunya.telemetry.map((item) => (
                <div key={item.label} className={styles.telemetryRow}>
                  <dt className="mono">{item.label}</dt>
                  <dd className="mono">{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.horizonNote}>{shunya.horizonNote}</p>
          </Reveal>
        </div>

        {/* --- Timeline ---------------------------------------------------- */}
        <Timeline />

        <Reveal mode="up" delay={120} className={styles.ctaWrap}>
          <MagneticButton
            href={shunya.cta.href}
            variant="signal"
            strength={14}
            trailing={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M2 12L12 2M12 2H5.5M12 2v6.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="square"
                />
              </svg>
            }
          >
            {shunya.cta.label}
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * The build sequence.
 *
 * Note what is deliberately absent: no progress bar, no percentage, no "x%".
 * Stages 1–5 are all `active` because a long-term project really is worked on
 * across every axis simultaneously, and `launch` is marked `horizon` — a
 * destination, not a date. `aria-label` states the ordering explicitly so the
 * arrow sequence is not the only signal.
 */
function Timeline() {
  return (
    <div className={styles.timelineWrap}>
      <Reveal mode="fade" className={styles.timelineHead}>
        <p className="mono">
          <span className={styles.timelineLabel}>Build sequence</span>
          <span className={styles.timelineNote}> — not a completion tracker</span>
        </p>
      </Reveal>

      <ol className={styles.timeline} aria-label="Shunya build sequence, in order">
        {shunya.stages.map((stage, index) => (
          <li key={stage.id} className={styles.stage} data-state={stage.state}>
            <Reveal mode="up" delay={index * 80} className={styles.stageInner}>
              <span className={styles.node} aria-hidden="true">
                <span className={styles.nodeCore} />
              </span>
              <span className={styles.stageLabel}>{stage.label}</span>
              <span className={styles.stageCaption}>{stage.caption}</span>
            </Reveal>

            {index < shunya.stages.length - 1 ? (
              <span className={styles.connector} aria-hidden="true">
                <svg viewBox="0 0 40 8" width="40" height="8" fill="none" preserveAspectRatio="none">
                  <path d="M0 4h34M30 1l4 3-4 3" stroke="currentColor" strokeWidth="1" />
                </svg>
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
