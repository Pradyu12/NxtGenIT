import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import { site } from '@/content/site';
import { Atmosphere } from '@/components/visual/Atmosphere';
import { CursorGlow } from '@/components/visual/CursorGlow';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import './globals.css';

/**
 * Fonts are self-hosted by `next/font` at build time: no render-blocking request
 * to a third party, no layout shift, and `font-display: swap` with a metric
 * override so the fallback occupies the same space.
 */
const geistSans = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-sans',
  weight: ['400', '500', '600', '700'],
  preload: true,
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
  weight: ['400', '500'],
  // Only the hero eyebrow is above the fold; preloading it would compete with
  // the critical CSS for bandwidth.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    'technology studio',
    'frontend development',
    'backend development',
    'full stack development',
    'web development',
    'Next.js',
    'React',
    'TypeScript',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  category: 'technology',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.svg' }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#04060a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organisationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    slogan: site.tagline,
    description: site.description,
    email: site.email,
    sameAs: site.social.map((item) => item.href),
  };

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: site.url,
    name: site.name,
    description: site.description,
    publisher: { '@id': `${site.url}/#organization` },
    inLanguage: 'en',
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {/*
          Runs before paint. Two jobs:
            1. Flag that JS is available, which is what enables the hidden
               pre-reveal state in globals.css. Without it, content renders
               immediately and nothing is ever stuck invisible.
            2. Record the reduced-motion preference up front so the first
               animation frame is already correct.
        */}
        <Script id="ngit-boot" strategy="beforeInteractive">
          {`(function(){var d=document.documentElement;d.classList.add('js');if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('reduce-motion');}})();`}
        </Script>

        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <Atmosphere />
        <CursorGlow />
        <SiteHeader />

        <main id="main" className="js-only-content">
          {children}
        </main>

        <SiteFooter />

        <Script
          id="ngit-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          // Content is a build-time constant from src/content/site.ts, not user input.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organisationLd, websiteLd]),
          }}
        />
      </body>
    </html>
  );
}
