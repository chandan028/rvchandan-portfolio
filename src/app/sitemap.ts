import type { MetadataRoute } from 'next';
import { caseStudies } from '@/data/case-studies';
import { site } from '@/data/site';

/** Emitted as a static sitemap.xml at build time. */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${site.url}/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...caseStudies.map((study) => ({
      url: `${site.url}/work/${study.slug}/`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
  ];
}
