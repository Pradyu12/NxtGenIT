export type Discipline = {
  id: string;
  title: string;
  /** Every technology listed here is actively used by NxtGenIT. Remove freely. */
  items: string[];
};

export const stack: Discipline[] = [
  { id: 'frontend', title: 'Frontend', items: ['React', 'Next.js', 'TypeScript'] },
  { id: 'backend', title: 'Backend', items: ['Node.js', 'Go', 'Rust'] },
  { id: 'data', title: 'Data', items: ['PostgreSQL', 'Redis', 'SQLite', 'DuckDB'] },
  { id: 'infrastructure', title: 'Infrastructure', items: ['Docker', 'Linux', 'CI/CD', 'Cloud'] },
];
