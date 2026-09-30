import styles from './Logo.module.css';

/**
 * Wordmark: an infinity loop with an arrow rising through it — continuity
 * paired with forward motion.
 *
 * Drawn as inline SVG rather than an image file so it stays crisp at any DPR,
 * adds no extra request, and can pick up the brand tokens directly. Both
 * gradients run bottom-left to top-right, matching the direction of the arrow.
 */
export function Logo() {
  return (
    <span className={styles.logo}>
      <svg
        className={styles.mark}
        viewBox="0 0 32 32"
        width="26"
        height="26"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="ngit-loop" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--lime-400)" />
            <stop offset="52%" stopColor="var(--lime-300)" />
            <stop offset="100%" stopColor="var(--cyan-300)" />
          </linearGradient>
          <linearGradient id="ngit-arrow" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--blue-500)" />
            <stop offset="48%" stopColor="var(--blue-300)" />
            <stop offset="100%" stopColor="var(--lime-300)" />
          </linearGradient>
        </defs>

        {/* The loop. Two mirrored lobes meeting at the centre crossing. */}
        <path
          d="M16 16C13 9.5 10 7 7.5 9C4.5 11.5 4.5 20.5 7.5 23C10 25 13 22.5 16 16C19 9.5 22 7 24.5 9C27.5 11.5 27.5 20.5 24.5 23C22 25 19 22.5 16 16"
          fill="none"
          stroke="url(#ngit-loop)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        {/*
          The arrow rises out of the lower-left lobe and exits past the upper
          right, the way it does in the source artwork.

          The over/under crossing is done with surface-coloured "knockout"
          strokes rather than a mask: a wide `--ink-1000` stroke is laid down
          first, and the gradient shaft and head are drawn on top of it. The
          arrowhead is outlined the same way, otherwise its tip collides with
          the loop's upper-right lobe and the two shapes merge into a blob.
        */}
        <g className={styles.arrow}>
          <path d="M7.5 24.5L27 4" fill="none" stroke="var(--ink-1000)" strokeWidth="5.6" strokeLinecap="round" />
          <path
            d="M7.5 24.5L23 8.5"
            fill="none"
            stroke="url(#ngit-arrow)"
            strokeWidth="3.1"
            strokeLinecap="round"
          />
          <path d="M27 4L25.02 10.51L20.49 5.98Z" fill="var(--ink-1000)" stroke="var(--ink-1000)" strokeWidth="5" />
          <path d="M27 4L25.02 10.51L20.49 5.98Z" fill="url(#ngit-arrow)" />
        </g>
      </svg>
      <span className={styles.wordmark}>NxtGenIT</span>
    </span>
  );
}
