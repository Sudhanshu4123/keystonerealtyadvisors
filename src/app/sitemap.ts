import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://keystonedev.com';

  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const projectUrls = projects.map((proj) => ({
    url: `${baseUrl}/projects/${proj.slug}`,
    lastModified: proj.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticPages = [
    '',
    '/projects',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-and-conditions',
    '/cookie-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.7,
  }));

  return [...staticPages, ...projectUrls];
}
