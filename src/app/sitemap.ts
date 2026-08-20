import { MetadataRoute } from 'next';
import { getArticles } from '@/lib/db';
import { projectsList } from '@/lib/realData';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://shouvikdasportfolio.qzz.io';
  
  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/projects',
    '/resume',
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
    priority: route === '' ? 1.0 : route === '/resume' || route === '/contact' ? 0.9 : 0.8,
  }));

  // Dynamic project case study routes
  const projectRoutes = projectsList.map((project) => ({
    url: `${baseUrl}/projects/${generateSlug(project.title)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
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

    return [...staticRoutes, ...projectRoutes, ...articleRoutes];
  } catch (error) {
    console.error('Error generating sitemap for dynamic content:', error);
    return [...staticRoutes, ...projectRoutes];
  }
}
