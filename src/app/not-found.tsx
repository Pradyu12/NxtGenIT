import type { Metadata } from 'next';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { navigation } from '@/content/navigation';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you were looking for does not exist.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.75rem',
        padding: '6rem var(--shell-pad)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <p className="mono" style={{ color: 'var(--lime-400)' }}>
        Error 404
      </p>

      <h1
        style={{
          fontSize: 'clamp(2.5rem, 1.2rem + 6vw, 6rem)',
          lineHeight: 0.95,
          letterSpacing: '-0.045em',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}
      >
        Off the map
      </h1>

      <p
        style={{
          color: 'var(--text-dim)',
          maxWidth: '44ch',
          lineHeight: 1.6,
        }}
      >
        This page doesn&rsquo;t exist — or hasn&rsquo;t been built yet. Head back, or jump straight to
        something useful.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', justifyContent: 'center' }}>
        <MagneticButton href="/" variant="primary">
          Back to home
        </MagneticButton>
        {navigation.slice(0, 2).map((item) => (
          <MagneticButton key={item.id} href={item.href} variant="secondary">
            {item.label}
          </MagneticButton>
        ))}
      </div>

      <p className="mono" style={{ color: 'var(--text-faint)', fontSize: '0.6875rem' }}>
        {site.name} — {site.tagline}
      </p>
    </section>
  );
}
