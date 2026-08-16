import type { MetadataRoute } from 'next';
import { skills } from '../lib/skills';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://skills.lingxilearn.cn';
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/skills/`, changeFrequency: 'weekly', priority: 0.9 },
    ...skills.map((skill) => ({ url: `${base}/skills/${skill.slug}/`, changeFrequency: 'weekly' as const, priority: 0.7 })),
  ];
}
