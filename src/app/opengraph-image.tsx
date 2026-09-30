import { ImageResponse } from 'next/og';
import { site } from '@/content/site';

// Pre-rendered to a static PNG at build time. `output: 'export'` has no server to
// render this on demand, and GitHub Pages cannot run a Node or edge runtime, so
// the image is generated during the build. `scripts/postbuild.mjs` then copies it
// to `opengraph-image.png` and `layout.tsx` references that stable path, because
// the auto-generated URL carries a `?hash` query string that a static host ignores.
export const dynamic = 'force-static';
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Open Graph card, pre-rendered by Satori at build time.
 *
 * No custom font is loaded: the built-in fallback keeps the route self-contained
 * and means the OG endpoint never depends on an external CDN being reachable.
 * The composition mirrors the site — near-black ground, hairline grid, the
 * wordmark and the headline set in caps.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#04060a',
          color: '#f4f7fc',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Aurora wash */}
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -160,
            width: 760,
            height: 760,
            borderRadius: 999,
            background:
              'radial-gradient(circle, rgba(29,91,196,0.55) 0%, rgba(15,156,143,0.22) 42%, rgba(4,6,10,0) 70%)',
            display: 'flex',
          }}
        />
        {/* Grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(to right, rgba(148,178,222,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,178,222,0.07) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            display: 'flex',
          }}
        />

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <svg width="40" height="40" viewBox="0 0 28 28">
              <path
                d="M5 22V6l18 16V6"
                fill="none"
                stroke="#5b9dff"
                strokeWidth="2.6"
                strokeLinecap="square"
              />
              <circle cx="5" cy="22" r="2" fill="#b8f23d" />
              <circle cx="23" cy="6" r="2" fill="#7ef0ff" />
            </svg>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>
              NxtGenIT
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 16,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#8a97a9',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 999, background: '#b8f23d' }} />
            Technology Studio
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div
            style={{
              fontSize: 82,
              fontWeight: 600,
              letterSpacing: '-0.04em',
              lineHeight: 1.02,
              textTransform: 'uppercase',
            }}
          >
            Building the
          </div>
          <div
            style={{
              fontSize: 82,
              fontWeight: 600,
              letterSpacing: '-0.04em',
              lineHeight: 1.02,
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            next generation
            <span style={{ color: '#b8f23d' }}>.</span>
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 26,
              color: '#a8b4c4',
              maxWidth: 860,
              lineHeight: 1.4,
            }}
          >
            Modern web experiences, scalable software and ambitious digital products.
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(148,178,222,0.18)',
            paddingTop: 28,
            fontSize: 17,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#6f7c8e',
          }}
        >
          <div style={{ display: 'flex' }}>Web Development • Software • Products</div>
          <div style={{ display: 'flex', color: '#d6ff7a' }}>Shunya — In development</div>
        </div>
      </div>
    ),
    size,
  );
}
