export type SiteConfig = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  /**
   * Full canonical origin *including* the deploy subpath, no trailing slash —
   * e.g. `https://pradyu12.github.io/NxtGenIT`. Used for canonical URLs, OG and
   * sitemap.
   */
  url: string;
  /**
   * Scheme and host only, with no subpath — e.g. `https://pradyu12.github.io`.
   *
   * This is what `metadataBase` must be set to. Next already prefixes generated
   * metadata image routes with `basePath`, so a `metadataBase` that includes the
   * subpath produces a doubled `/NxtGenIT/NxtGenIT/` URL.
   */
  origin: string;
  email: string;
  location: string;
  footerServices: string[];
  /** Absolute origin for JSON-LD publisher / sameAs entries. */
  social: { label: string; href: string }[];
};

/** Subpath the site is served from, without a trailing slash. '' for a domain root. */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

const url = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nxtgenit.dev').replace(/\/$/, '');

// Only strip when the URL genuinely ends with the subpath, so a mismatched
// configuration degrades to the full URL rather than a mangled origin.
const origin = basePath && url.endsWith(basePath) ? url.slice(0, -basePath.length) : url;

export const site: SiteConfig = {
  name: 'NxtGenIT',
  shortName: 'NXT',
  tagline: 'Building what comes next.',
  description:
    'NxtGenIT is a technology studio building modern web experiences, scalable software and ambitious digital products.',
  url,
  origin,
  email: 'hello@nxtgenit.dev',
  location: 'Remote · Worldwide',
  footerServices: ['Web Development', 'Software', 'Products'],
  social: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'X', href: 'https://x.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
};
