import { NextResponse } from 'next/server';
import { generateBatchTechArticles, RawNewsItem } from '@/lib/gemini';
import { getArticleBySlug, saveArticle } from '@/lib/db';

// Simple slug generator helper
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word chars
    .replace(/[\s_-]+/g, '-') // replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const forceAll = searchParams.get('forceAll') === 'true'; // Allow forcing all 40 in one execution
  
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized access key." }, { status: 401 });
  }

  const newsApiKey = process.env.NEWS_API_KEY;
  if (!newsApiKey) {
    return NextResponse.json({ 
      error: "NEWS_API_KEY is not configured in .env.local! Cannot fetch real news." 
    }, { status: 400 });
  }

  try {
    // 1. Fetch high volume news across Technology, Science, Global Innovations, Entertainment, and Anime updates.
    // Proactively apply strict negative adult/NSFW filters in the query!
    const query = encodeURIComponent(
      '(technology OR science OR "global innovation" OR "space discovery" OR "entertainment news" OR anime OR manga OR gaming OR Hollywood OR "AI breakthrough") AND NOT (adult OR explicit OR nsfw OR porn OR erotic OR sexy OR naked OR violent OR blood OR gore OR murder OR suicide OR death OR terror OR horror OR leak OR hack)'
    );

    // Requesting a larger page size (100 items) to guarantee at least 40 valid unique clean items with images
    const newsResponse = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=100&apiKey=${newsApiKey}`,
      { next: { revalidate: 0 } }
    );

    if (!newsResponse.ok) {
      const errorMsg = await newsResponse.text();
      return NextResponse.json({ error: `NewsAPI Error: ${errorMsg}` }, { status: 500 });
    }

    const newsData = await newsResponse.json();
    const rawArticles = newsData.articles || [];

    if (rawArticles.length === 0) {
      return NextResponse.json({ message: "No news articles found at this moment." }, { status: 200 });
    }

    // Filter for valid unique articles having titles, descriptions, and high-res images
    const uniqueValids: any[] = [];
    const titlesSet = new Set<string>();

    for (const art of rawArticles) {
      if (
        art.title && 
        art.description && 
        art.urlToImage && 
        art.title !== "[Removed]" && 
        !titlesSet.has(art.title.toLowerCase())
      ) {
        titlesSet.add(art.title.toLowerCase());
        uniqueValids.push(art);
      }
      // Target exactly 40 daily publications
      if (uniqueValids.length >= 40) break;
    }

    if (uniqueValids.length === 0) {
      return NextResponse.json({ message: "No valid news articles met the schema." }, { status: 200 });
    }

    // 2. Filter out already generated articles using slugs
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
        message: "All 40 target articles already exist in the database. 0 new articles generated." 
      });
    }

    // 3. Batching optimization to prevent free-tier API rate limits and Vercel timeouts!
    // Vercel serverless has a 10s timeout on free tier.
    // If not local development and forceAll is false, limit single execution to 8 articles (1 batch query)
    const isDev = process.env.NODE_ENV === 'development';
    const batchSizeCap = (isDev || forceAll) ? newArticlesToGenerate.length : 8;
    const itemsToProcess = newArticlesToGenerate.slice(0, batchSizeCap);

    console.log(`🚀 Processing a batch of ${itemsToProcess.length} articles...`);

    // Split items into sub-batches of 8 for Gemini API efficiency
    const SUB_BATCH_SIZE = 8;
    const savedArticles: any[] = [];
    const rejectedCount: number[] = [];

    for (let i = 0; i < itemsToProcess.length; i += SUB_BATCH_SIZE) {
      const subBatch = itemsToProcess.slice(i, i + SUB_BATCH_SIZE);
      
      const rawPayload: RawNewsItem[] = subBatch.map(art => ({
        title: art.title,
        description: art.description,
        source: art.source.name || "News Network"
      }));

      // Call batch generation in one single request
      const aiResults = await generateBatchTechArticles(rawPayload);

      // Save each generated article to the database if NOT rejected
      for (const aiArt of aiResults) {
        const originalIndex = aiArt.originalIndex;
        const originalNewsItem = subBatch[originalIndex];

        if (!originalNewsItem) continue;

        // Strict NSFW Safety Filter: discard flagged articles
        if (aiArt.rejected) {
          console.warn(`⚠️ NSFW/Inappropriate content detected and rejected for: "${originalNewsItem.title}"`);
          rejectedCount.push(originalIndex);
          continue;
        }

        const slug = generateSlug(originalNewsItem.title);
        const articleToSave = {
          title: aiArt.title,
          slug: slug,
          description: aiArt.description,
          content: aiArt.content,
          image: originalNewsItem.urlToImage,
          publishedAt: new Date().toISOString(),
          likes: Math.floor(Math.random() * 50) + 15,
          followers: Math.floor(Math.random() * 20) + 5,
          shares: Math.floor(Math.random() * 10) + 2,
          source: originalNewsItem.source.name || "News Source",
          category: aiArt.category || "Technology",
        };

        const insertedId = await saveArticle(articleToSave);
        savedArticles.push({ id: insertedId, slug, title: articleToSave.title });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${savedArticles.length + rejectedCount.length} items. Published ${savedArticles.length} clean articles. Rejected ${rejectedCount.length} NSFW/adult entries.`,
      processedCount: savedArticles.length,
      rejectedCount: rejectedCount.length,
      remainingCount: newArticlesToGenerate.length - itemsToProcess.length,
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
