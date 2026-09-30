export type SiteConfig = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  /** Absolute origin, no trailing slash. Used for canonical URLs, OG and sitemap. */
  url: string;
  email: string;
  location: string;
  footerServices: string[];
  /** Absolute origin for JSON-LD publisher / sameAs entries. */
  social: { label: string; href: string }[];
};

export const site: SiteConfig = {
  name: 'NxtGenIT',
  shortName: 'NXT',
  tagline: 'Building what comes next.',
  description:
    'NxtGenIT is a technology studio building modern web experiences, scalable software and ambitious digital products.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nxtgenit.dev',
  email: 'hello@nxtgenit.dev',
  location: 'Remote · Worldwide',
  footerServices: ['Web Development', 'Software', 'Products'],
  social: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'X', href: 'https://x.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
};
