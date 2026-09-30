'use client';

import { useMemo } from 'react';
import { buildGraph } from '@/lib/graph';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';
import styles from './SystemMap.module.css';

type SystemMapProps = {
  seed: number;
  /** Rendered as the accessible description of the diagram. */
  label: string;
};

/** 16:9 user-space. The container matches this ratio exactly, so circles stay circular. */
const VIEW_W = 160;
const VIEW_H = 90;

/**
 * Abstract system diagram used as the visual for a project.
 *
 * Pure SVG: no canvas, no images, scales to any DPI, and costs a few hundred
 * bytes of DOM instead of a texture. Node coordinates are generated in a
 * normalised 0..1 space then projected into the 16:9 viewBox, so proportions
 * hold at every breakpoint.
 */
export function SystemMap({ seed, label }: SystemMapProps) {
  const reducedMotion = usePrefersReducedMotion();
  const { nodes, edges } = useMemo(() => buildGraph(seed), [seed]);

  const px = (value: number) => Number((value * VIEW_W).toFixed(2));
  const py = (value: number) => Number((value * VIEW_H).toFixed(2));
  // Node radius in user units — ~4px at desktop scale.
  const radius = (value: number) => Number((value * VIEW_H * 0.045).toFixed(2));

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.map}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label={label}
      >
        <defs>
          <linearGradient id="ngit-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--blue-400)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--cyan-400)" stopOpacity="0.22" />
          </linearGradient>
        </defs>

        <g>
          {edges.map((edge) => (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={px(nodes[edge.from].x)}
              y1={py(nodes[edge.from].y)}
              x2={px(nodes[edge.to].x)}
              y2={py(nodes[edge.to].y)}
              stroke="url(#ngit-edge)"
              strokeWidth="0.5"
            />
          ))}
        </g>

        <g>
          {nodes.map((node, index) => (
            <circle
              key={index}
              cx={px(node.x)}
              cy={py(node.y)}
              r={radius(node.r)}
              className={node.active ? styles.nodeActive : styles.node}
            />
          ))}
        </g>
      </svg>

      {/* Travelling highlight bar */}
      {!reducedMotion ? <span className={styles.signal} aria-hidden="true" /> : null}

      <span className={styles.scanline} aria-hidden="true" />
    </div>
  );
}
