import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

// `output: 'export'` pre-renders every route. Metadata routes are otherwise
// treated as dynamic, so they must be pinned static or the build fails.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
