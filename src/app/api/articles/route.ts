import { NextResponse } from 'next/server';
import { getArticles, incrementArticleInteraction, searchArticles } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    let data;
    if (search) {
      data = await searchArticles(search);
    } else {
      data = await getArticles();
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in GET /api/articles:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Could not fetch articles from database. Verify DB connection parameters.",
      details: error.message
    }, { status: 500 });
  }
}

/**
 * NOTE ON SERVERLESS RATE LIMITING:
 * The current per-IP rate limiter is stored in-memory within this Node/Vercel serverless function instance.
 * Trade-offs:
 * 1. Resets on function cold starts / redeploys.
 * 2. In high-traffic serverless multi-instance environments, counters are isolated to each active instance.
 * 
 * Future Upgrade:
 * For distributed, high-concurrency production deployments requiring shared persistence across all edge nodes,
 * upgrade this to an external key-value store such as Upstash Redis (@upstash/ratelimit).
 */
const interactionRateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: Request) {
  try {
    // 1. Same-Origin / Host Verification
    const origin = request.headers.get('origin') || '';
    const referer = request.headers.get('referer') || '';
    const host = request.headers.get('host') || '';
    const allowedHosts = ['localhost', '127.0.0.1', 'shouvikdasportfolio.qzz.io', 'shouvikdas-portfolio.vercel.app'];
    
    const isAllowedOrigin = !origin || allowedHosts.some(h => origin.includes(h) || referer.includes(h) || host.includes(h));
    if (!isAllowedOrigin) {
      return NextResponse.json({ success: false, error: "Forbidden origin." }, { status: 403 });
    }

    // 2. Client IP rate limiting (max 15 interaction calls per minute per IP)
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     request.headers.get('x-real-ip') || 
                     'anonymous';
    const now = Date.now();
    const rateData = interactionRateLimitMap.get(clientIp);

    if (rateData && rateData.resetTime > now) {
      if (rateData.count >= 15) {
        return NextResponse.json({ 
          success: false, 
          error: "Rate limit exceeded. Please wait a moment before reacting again." 
        }, { status: 429 });
      }
      rateData.count++;
    } else {
      interactionRateLimitMap.set(clientIp, { count: 1, resetTime: now + 60000 });
    }

    // Clean up expired rate limit entries periodically
    if (interactionRateLimitMap.size > 1000) {
      for (const [key, val] of interactionRateLimitMap.entries()) {
        if (val.resetTime <= now) interactionRateLimitMap.delete(key);
      }
    }

    // 3. Input Validation & Sanitization
    const body = await request.json();
    const { slug, action } = body;

    if (!slug || typeof slug !== 'string' || slug.length > 200) {
      return NextResponse.json({ success: false, error: "Invalid slug parameter." }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/[^\w-]/g, '');

    if (action !== 'likes' && action !== 'followers' && action !== 'shares') {
      return NextResponse.json({ success: false, error: "Invalid action. Must be 'likes', 'followers', or 'shares'." }, { status: 400 });
    }

    // Increment in the database
    const newValue = await incrementArticleInteraction(cleanSlug, action);

    return NextResponse.json({
      success: true,
      slug: cleanSlug,
      action,
      newValue
    });

  } catch (error: any) {
    console.error("Error in POST /api/articles:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to process interaction.",
      details: error.message
    }, { status: 500 });
  }
}
