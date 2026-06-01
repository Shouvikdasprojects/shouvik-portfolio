import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://shouvikdas.eu.org';
  const routes = [
    '',
    '/about',
    '/projects',
    '/socials',
    '/articles',
    '/uploads',
    '/portfolio',
    '/contact',
    '/privacy',
    '/terms',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/articles' || route === '/uploads' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/contact' ? 0.9 : 0.8,
  }));
}
