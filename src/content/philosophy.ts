export type Principle = {
  index: string;
  title: string;
  body: string;
};

export const principles: Principle[] = [
  { index: '01', title: 'Build', body: 'We turn ideas into working products.' },
  { index: '02', title: 'Engineer', body: 'We care about the architecture beneath the interface.' },
  { index: '03', title: 'Evolve', body: 'We build systems that can grow with the product.' },
];
