'use client';

import { useEffect, useState } from 'react';
import styles from './HeroTelemetry.module.css';

/**
 * Ambient studio readout in the hero's lower-right corner.
 *
 * The values are real runtime facts (viewport class, input capability, render
 * preference) rather than invented metrics — the kind of detail a technology
 * studio actually shows, and it costs one resize listener to maintain.
 */
type Reading = { label: string; value: string };

const BREAKPOINTS: Array<[number, string]> = [
  [1920, '≥1920'],
  [1440, '≥1440'],
  [1024, '≥1024'],
  [768, '≥768'],
  [0, 'mobile'],
];

function readViewport(): string {
  const width = window.innerWidth;
  return (BREAKPOINTS.find(([min]) => width >= min)?.[1]) ?? 'mobile';
}

export function HeroTelemetry() {
  const [readings, setReadings] = useState<Reading[]>([]);

  useEffect(() => {
    const compute = () => {
      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      setReadings([
        { label: 'Viewport', value: readViewport() },
        { label: 'Input', value: finePointer ? 'Pointer' : 'Touch' },
        { label: 'Motion', value: reduced ? 'Reduced' : 'Full' },
      ]);
    };

    compute();
    window.addEventListener('resize', compute, { passive: true });
    return () => window.removeEventListener('resize', compute);
  }, []);

  return (
    <dl className={styles.telemetry} aria-label="Runtime environment">
      {readings.map((reading) => (
        <div key={reading.label} className={styles.row}>
          <dt className="mono">{reading.label}</dt>
          <dd className="mono">{reading.value}</dd>
        </div>
      ))}
      <div className={styles.row}>
        <dt className="mono">Studio</dt>
        <dd className={`mono ${styles.live}`}>
          <span className="pulse" aria-hidden="true" />
          Online
        </dd>
      </div>
    </dl>
  );
}
