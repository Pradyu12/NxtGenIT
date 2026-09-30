'use client';

import dynamic from 'next/dynamic';
import { site } from '@/content/site';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Reveal } from '@/components/ui/Reveal';
import { HeroTelemetry } from './HeroTelemetry';
import { HERO_FRAGMENT } from '@/lib/webgl/scenes/hero';
import styles from './Hero.module.css';

/**
 * The WebGL scene is ~4KB of GLSL plus a 2KB engine, but it is still not needed
 * for first paint of any text. `ssr: false` + dynamic import keeps it out of the
 * initial document and out of the critical CSS/JS path entirely.
 */
const HeroScene = dynamic(
  () => import('@/components/visual/SceneCanvas').then((mod) => mod.SceneCanvas),
  { ssr: false },
);

/** Hero copy lives in JSX because the line-by-line tone control is presentational. */
const headingLines = [
  { text: 'Building the', tone: 'dim' as const },
  { text: <>next generation<span className={styles.period}>.</span></> },
];

export function Hero() {
  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-title">
      <HeroScene fragment={HERO_FRAGMENT} className={styles.scene} dprCap={1.5} scrim="left" />

      {/* Fine rule-work that anchors the composition to the grid */}
      <div className={styles.frame} aria-hidden="true">
        <span className={styles.frameLine} />
        <span className={styles.frameLine} />
        <span className={styles.frameLine} />
      </div>

      <div className={`shell ${styles.inner}`}>
        <div className={styles.copy}>
          <Reveal mode="fade" delay={120} className={styles.eyebrowRow}>
            <p className="eyebrow">
              <em>Technology Studio</em>
              <span>{site.tagline}</span>
            </p>
          </Reveal>

          <SplitHeading
            as="h1"
            id="hero-title"
            className={styles.title}
            lineClassName={styles.titleLine}
            lines={headingLines}
            delay={180}
            stagger={110}
          />

          <Reveal mode="up" delay={420} className={styles.ledeWrap}>
            <p className={`measure ${styles.lede}`}>{site.description}</p>
          </Reveal>

          <Reveal mode="up" delay={540} className={styles.ctaRow}>
            <MagneticButton href="#contact" variant="primary" trailing={<Arrow />}>
              Start a Project
            </MagneticButton>
            <MagneticButton href="#shunya" variant="secondary" trailing={<Arrow />}>
              Explore Shunya
            </MagneticButton>
          </Reveal>
        </div>

        <HeroTelemetry />
      </div>

      {/* Scroll affordance */}
      <a href="#services" className={styles.scrollCue} aria-label="Scroll to services" data-cursor="hover">
        <span className="mono">Scroll</span>
        <span className={styles.scrollTrack} aria-hidden="true">
          <span className={styles.scrollDot} />
        </span>
      </a>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2 12L12 2M12 2H5.5M12 2v6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}
