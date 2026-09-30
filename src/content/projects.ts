export type ProjectStatus = 'live' | 'in-progress' | 'archived' | 'private';

export type Project = {
  id: string;
  title: string;
  client: string;
  year: string;
  summary: string;
  body: string;
  status: ProjectStatus;
  statusLabel: string;
  role: string[];
  stack: string[];
  href?: string;
  /** `featured` projects render as a large primary panel. */
  featured?: boolean;
  /** Seed for the deterministic node-graph visual. Same seed = same composition. */
  graphSeed: number;
};

export const projectStatusLabels: Record<ProjectStatus, string> = {
  live: 'Live',
  'in-progress': 'In development',
  archived: 'Archived',
  private: 'Private',
};

/**
 * SHUNYA leads the list because it is our own IP.
 * To add a client project, append an entry below — the Work section picks it up
 * automatically, and `featured: true` promotes it to the primary panel.
 */
export const projects: Project[] = [
  {
    id: 'shunya',
    title: 'Shunya',
    client: 'NxtGenIT Original IP',
    year: 'Ongoing',
    summary: 'A long-term original game project. World, systems, story and technology — built step by step.',
    body: "Shunya is not a release with a date attached. It is a world under continuous construction, developed in parallel across concept, worldbuilding, systems and gameplay, with our own technology underneath it.",
    status: 'in-progress',
    statusLabel: 'Development live',
    role: ['Concept', 'Worldbuilding', 'Systems design', 'Engineering'],
    stack: ['TypeScript', 'Go', 'Rust', 'WebGL'],
    featured: true,
    graphSeed: 1729,
  },
  {
    id: 'studio-site',
    title: 'NxtGenIT Studio Site',
    client: 'NxtGenIT',
    year: '2025',
    summary: 'This site. A dark-first, motion-led studio presence built on a strict performance budget.',
    body: 'Zero animation runtime dependencies, custom WebGL visuals, a token-driven design system and a fully keyboard-accessible experience.',
    status: 'live',
    statusLabel: 'Live',
    role: ['Design system', 'Frontend', 'WebGL'],
    stack: ['Next.js', 'React', 'TypeScript'],
    graphSeed: 4104,
  },
];
