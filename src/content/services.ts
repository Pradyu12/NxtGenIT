export type Service = {
  /** Two-digit index rendered in the card corner. */
  index: string;
  slug: string;
  title: string;
  description: string;
  /** Short capability lines, surfaced as a technical indicator list. */
  capabilities: string[];
  /** Technology chips. Keep in sync with src/content/stack.ts. */
  indicators: string[];
  href: string;
};

/** Service numbers are derived so re-ordering the array never leaves stale labels. */
const serviceSeed: Omit<Service, 'index'>[] = [
  {
    slug: 'frontend',
    title: 'Frontend',
    description: 'Interfaces that feel fast, intuitive and alive.',
    capabilities: ['Design systems', 'Interaction engineering', 'Performance budgets'],
    indicators: ['React', 'Next.js', 'TypeScript'],
    href: '#contact',
  },
  {
    slug: 'backend',
    title: 'Backend',
    description: 'Systems designed for reliability, security and scale.',
    capabilities: ['API architecture', 'Data modelling', 'Observability'],
    indicators: ['Node.js', 'Go', 'Rust', 'PostgreSQL'],
    href: '#contact',
  },
  {
    slug: 'fullstack',
    title: 'Full Stack',
    description: 'Complete products engineered end-to-end.',
    capabilities: ['Product architecture', 'Interface + systems', 'CI/CD delivery'],
    indicators: ['TypeScript', 'Go', 'Docker', 'Cloud'],
    href: '#contact',
  },
];

export const services: Service[] = serviceSeed.map((service, index) => ({
  ...service,
  index: String(index + 1).padStart(2, '0'),
}));
