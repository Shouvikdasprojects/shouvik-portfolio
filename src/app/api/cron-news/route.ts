import { NextResponse } from 'next/server';
import { generateBatchTechArticles, RawNewsItem } from '@/lib/gemini';
import { getArticleBySlug, saveArticle } from '@/lib/db';
import Parser from 'rss-parser';

// Simple slug generator helper
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word chars
    .replace(/[\s_-]+/g, '-') // replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
}

/**
 * Production-safe RSS news fetcher using Google News RSS feeds.
 * Works seamlessly in serverless/cloud environments (Vercel) without localhost restrictions or API keys.
 */
async function fetchNewsFromRSS(): Promise<any[]> {
  const parser = new Parser({
    customFields: {
      item: ['media:content', 'description']
    }
  });

  const feeds = [
    'https://news.google.com/rss/search?q=technology+AI+breakthrough&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=science+space+discovery&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=anime+manga+gaming+news&hl=en-US&gl=US&ceid=US:en'
  ];

  const items: any[] = [];
  const titlesSet = new Set<string>();

  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      for (const item of feed.items || []) {
        if (!item.title || item.title === '[Removed]') continue;
        
        const cleanTitle = item.title.trim();
        if (titlesSet.has(cleanTitle.toLowerCase())) continue;
        titlesSet.add(cleanTitle.toLowerCase());

        let img = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
        if (item.content && item.content.includes('<img')) {
          const imgMatch = item.content.match(/src="([^"]+)"/);
          if (imgMatch) img = imgMatch[1];
        }

        items.push({
          title: cleanTitle,
          description: item.contentSnippet?.replace(/<[^>]+>/g, '').slice(0, 250) || cleanTitle,
          urlToImage: img,
          source: { name: (item as any).source || item.creator || 'Google News' },
          publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn(`⚠️ RSS feed fetch warning for ${url}:`, err);
    }
  }

  return items;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const secret = searchParams.get('secret') || bearerToken;
  const forceAll = searchParams.get('forceAll') === 'true';

  // Security Hardening: CRON_SECRET is strictly required in production
  const cronSecret = process.env.CRON_SECRET;
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev) {
    if (!cronSecret || secret !== cronSecret) {
      return NextResponse.json({ 
        error: "Unauthorized access. A valid CRON_SECRET matching the server environment is required." 
      }, { status: 401 });
    }
  }

  const newsApiKey = process.env.NEWS_API_KEY;
  let rawArticles: any[] = [];
  let sourceUsed = 'NewsAPI';

  // 1. Attempt primary news fetch from NewsAPI if key is available
  if (newsApiKey) {
    try {
      const query = encodeURIComponent(
        '(technology OR science OR "global innovation" OR "space discovery" OR "entertainment news" OR anime OR manga OR gaming OR Hollywood OR "AI breakthrough") AND NOT (adult OR explicit OR nsfw OR porn OR erotic OR sexy OR naked OR violent OR blood OR gore OR murder OR suicide OR death OR terror OR horror OR leak OR hack)'
      );

      const newsResponse = await fetch(
        `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=100&apiKey=${newsApiKey}`,
        { next: { revalidate: 0 } }
      );

      if (newsResponse.ok) {
        const newsData = await newsResponse.json();
        rawArticles = newsData.articles || [];
      } else {
        const errorMsg = await newsResponse.text();
        console.warn(`⚠️ NewsAPI returned status ${newsResponse.status} (${errorMsg}). Activating production RSS fallback.`);
      }
    } catch (apiErr) {
      console.warn("⚠️ NewsAPI network error. Activating production RSS fallback:", apiErr);
    }
  }

  // 2. Fallback to production-safe Google News RSS feeds if NewsAPI returned 0 articles or failed
  if (rawArticles.length === 0) {
    console.log("📡 Ingesting live news via production-safe RSS feeds...");
    rawArticles = await fetchNewsFromRSS();
    sourceUsed = 'Google News RSS (Production Fallback)';
  }

  if (rawArticles.length === 0) {
    return NextResponse.json({ 
      success: false, 
      message: "No news articles found across both NewsAPI and RSS fallback streams." 
    }, { status: 200 });
  }

  try {
    // Filter for valid unique articles having titles and descriptions
    const uniqueValids: any[] = [];
    const titlesSet = new Set<string>();

    for (const art of rawArticles) {
      if (
        art.title && 
        art.description && 
        art.title !== "[Removed]" && 
        !titlesSet.has(art.title.toLowerCase())
      ) {
        titlesSet.add(art.title.toLowerCase());
        uniqueValids.push(art);
      }
      if (uniqueValids.length >= 40) break;
    }

    if (uniqueValids.length === 0) {
      return NextResponse.json({ message: "No valid news articles met the schema." }, { status: 200 });
    }

    // Filter out already generated articles using unique slug lookup
    const newArticlesToGenerate: any[] = [];
    for (const art of uniqueValids) {
      const slug = generateSlug(art.title);
      const existing = await getArticleBySlug(slug);
      if (!existing) {
        newArticlesToGenerate.push(art);
      }
    }

    if (newArticlesToGenerate.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: `All target articles already exist in the database. 0 new articles generated. Source: ${sourceUsed}.` 
      });
    }

    // Batching optimization for Vercel serverless execution limits
    const isDev = process.env.NODE_ENV === 'development';
    const batchSizeCap = (isDev || forceAll) ? newArticlesToGenerate.length : 8;
    const itemsToProcess = newArticlesToGenerate.slice(0, batchSizeCap);

    console.log(`🚀 Processing a batch of ${itemsToProcess.length} articles via ${sourceUsed}...`);

    const SUB_BATCH_SIZE = 8;
    const savedArticles: any[] = [];
    const rejectedCount: number[] = [];

    for (let i = 0; i < itemsToProcess.length; i += SUB_BATCH_SIZE) {
      const subBatch = itemsToProcess.slice(i, i + SUB_BATCH_SIZE);
      
      const rawPayload: RawNewsItem[] = subBatch.map(art => ({
        title: art.title,
        description: art.description,
        source: art.source?.name || "Global News"
      }));

      // Call Gemini batch generation
      const aiResults = await generateBatchTechArticles(rawPayload);

      for (const aiArt of aiResults) {
        const originalIndex = aiArt.originalIndex;
        const originalNewsItem = subBatch[originalIndex];

        if (!originalNewsItem) continue;

        // Strict NSFW Safety Filter
        if (aiArt.rejected) {
          console.warn(`⚠️ NSFW/Inappropriate content rejected for: "${originalNewsItem.title}"`);
          rejectedCount.push(originalIndex);
          continue;
        }

        const slug = generateSlug(originalNewsItem.title);
        const articleToSave = {
          title: aiArt.title,
          slug: slug,
          description: aiArt.description,
          content: aiArt.content,
          image: originalNewsItem.urlToImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
          publishedAt: new Date().toISOString(),
          likes: Math.floor(Math.random() * 50) + 15,
          followers: Math.floor(Math.random() * 20) + 5,
          shares: Math.floor(Math.random() * 10) + 2,
          source: originalNewsItem.source?.name || "Global Discoveries",
          category: aiArt.category || "Technology",
        };

        const insertedId = await saveArticle(articleToSave);
        savedArticles.push({ id: insertedId, slug, title: articleToSave.title });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${savedArticles.length + rejectedCount.length} items. Published ${savedArticles.length} clean articles. Source: ${sourceUsed}.`,
      processedCount: savedArticles.length,
      rejectedCount: rejectedCount.length,
      remainingCount: newArticlesToGenerate.length - itemsToProcess.length,
      source: sourceUsed,
      articles: savedArticles
    });

  } catch (error: any) {
    console.error("Error executing high-volume cron-news:", error);
    return NextResponse.json({ 
      error: "High-volume AI article batch generation failed.", 
      details: error.message 
    }, { status: 500 });
  }
}
