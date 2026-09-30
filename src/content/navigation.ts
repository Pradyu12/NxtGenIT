export type NavItem = {
  id: string;
  label: string;
  href: string;
};

/**
 * Single source of truth for the header, mobile nav, footer and skip-link.
 * `id` maps to the `id` attribute of the matching <section> on the home page.
 */
export const navigation: NavItem[] = [
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'work', label: 'Work', href: '#work' },
  { id: 'shunya', label: 'Shunya', href: '#shunya' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];
