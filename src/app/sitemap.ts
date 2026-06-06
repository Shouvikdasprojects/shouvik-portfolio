import { MetadataRoute } from 'next';
import { getArticles } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://shouvikdas-portfolio.vercel.app';
  
  // Static routes
  const staticRoutes = [
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
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/articles' || route === '/uploads' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1.0 : route === '/contact' ? 0.9 : 0.8,
  }));

  try {
    // Dynamic article routes
    const articles = await getArticles();
    const articleRoutes = articles.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.publishedAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...articleRoutes];
  } catch (error) {
    console.error('Error generating sitemap for articles:', error);
    return staticRoutes;
  }
}
