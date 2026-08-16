import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const runtime = 'nodejs';
export const revalidate = 0;

interface LiveSearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  image: string;
  category: string;
}

function getCategoryFromQuery(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('anime') || q.includes('manga') || q.includes('otaku') || q.includes('webtoon')) return 'Anime';
  if (q.includes('science') || q.includes('quantum') || q.includes('space') || q.includes('biology')) return 'Science';
  if (q.includes('ai') || q.includes('tech') || q.includes('code') || q.includes('software') || q.includes('next') || q.includes('react')) return 'Technology';
  if (q.includes('global') || q.includes('world') || q.includes('innovation')) return 'Global Innovations';
  if (q.includes('movie') || q.includes('film') || q.includes('music') || q.includes('entertainment')) return 'Entertainment';
  return 'Technology';
}

// Smart image fallback by category
function getCategoryImage(category: string): string {
  const imgs: Record<string, string> = {
    'Anime': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    'Technology': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    'Science': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    'Global Innovations': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    'Entertainment': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
  };
  return imgs[category] || imgs['Technology'];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], message: 'Query too short' });
  }

  const parser = new Parser({
    customFields: {
      item: ['media:content', 'description', 'source']
    },
    timeout: 8000, // 8 second timeout
  });

  const results: LiveSearchResult[] = [];
  const seenTitles = new Set<string>();

  // Build RSS URLs — Google News searches
  const rssUrls = [
    `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`,
    `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' latest news')}&hl=en-IN&gl=IN&ceid=IN:en`,
  ];

  for (const url of rssUrls) {
    try {
      const feed = await parser.parseURL(url);

      for (const item of (feed.items || []).slice(0, 8)) {
        if (!item.title || item.title === '[Removed]') continue;

        const cleanTitle = item.title.replace(/ - [^-]+$/, '').trim(); // Remove " - Source Name" suffix
        if (seenTitles.has(cleanTitle.toLowerCase())) continue;
        seenTitles.add(cleanTitle.toLowerCase());

        const category = getCategoryFromQuery(query);
        const image = getCategoryImage(category);

        const cleanDescription = (item.contentSnippet || item.content || '')
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 200) || 'Click to read the full article from the original source.';

        results.push({
          id: `live-${Date.now()}-${results.length}`,
          title: cleanTitle,
          description: cleanDescription + (cleanDescription.length >= 200 ? '...' : ''),
          url: item.link || '#',
          source: (item as any).source?.name || item.creator || new URL(item.link || 'https://news.google.com').hostname.replace('www.', ''),
          publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          image,
          category,
        });

        if (results.length >= 12) break;
      }
      if (results.length >= 12) break;
    } catch (err) {
      console.warn(`⚠️ Live search RSS fetch failed for: ${url}`, err);
    }
  }

  return NextResponse.json({
    results,
    query,
    count: results.length,
    fetchedAt: new Date().toISOString(),
  });
}
