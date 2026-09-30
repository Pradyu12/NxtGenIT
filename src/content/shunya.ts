export type ShunyaStage = {
  id: string;
  label: string;
  caption: string;
  /**
   * `active`  — a workstream currently under construction.
   * `horizon` — a phase whose timing is deliberately open-ended.
   * There is intentionally no `complete` state and no percentage: Shunya is a
   * long-term project, and reporting partial completion as a number would be
   * misleading. Add stages, don't add progress metrics.
   */
  state: 'active' | 'horizon';
};

export const shunya = {
  name: 'SHUNYA',
  kicker: 'Long-term original project',
  titleLines: ["WE'RE ALSO BUILDING", 'SOMETHING MUCH BIGGER.'] as const,
  wordmark: 'SHUNYA',
  subtitle: 'A world that is years in the making.',
  description:
    "Shunya is NxtGenIT's long-term original game project, currently in active development. We're building its world, systems, story and technology step by step.",
  status: {
    label: 'DEVELOPMENT',
    value: 'LIVE',
  },
  /**
   * Honest framing: an approximate horizon, explicitly not a release date.
   * Rendered as a secondary detail, never as a countdown or ETA.
   */
  horizonNote: 'No release date. No roadmap deadline. A project measured in decades of work, not sprints.',
  stages: [
    { id: 'concept', label: 'CONCEPT', caption: 'Premise, pillars, tone', state: 'active' },
    { id: 'world', label: 'WORLD', caption: 'Places, cultures, ecology', state: 'active' },
    { id: 'systems', label: 'SYSTEMS', caption: 'Simulation, economy, rules', state: 'active' },
    { id: 'gameplay', label: 'GAMEPLAY', caption: 'Core loops and verbs', state: 'active' },
    { id: 'development', label: 'DEVELOPMENT', caption: 'Ongoing, year after year', state: 'active' },
    { id: 'launch', label: 'LAUNCH', caption: 'A destination, not a date', state: 'horizon' },
  ] satisfies ShunyaStage[],
  cta: {
    label: 'Enter Shunya',
    href: '#contact',
  },
  /** Low-key telemetry strip — ambient studio signal, not fake metrics. */
  telemetry: [
    { label: 'Build', value: 'Continuous' },
    { label: 'Team', value: 'Internal' },
    { label: 'Status', value: 'In development' },
  ],
} as const;
