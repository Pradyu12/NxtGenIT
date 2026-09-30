import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

// `output: 'export'` pre-renders every route. Metadata routes are otherwise
// treated as dynamic, so they must be pinned static or the build fails.
export const dynamic = 'force-static';

/**
 * Generated from a single list. Add a route here when a new page is created —
 * the sitemap stays correct without hand-editing XML.
 */
const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
  { path: '/', priority: 1, changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
