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

export async function POST(request: Request) {
  try {
    const { slug, action } = await request.json();

    if (!slug || !action) {
      return NextResponse.json({ success: false, error: "Missing slug or action." }, { status: 400 });
    }

    if (action !== 'likes' && action !== 'followers' && action !== 'shares') {
      return NextResponse.json({ success: false, error: "Invalid action. Must be 'likes', 'followers', or 'shares'." }, { status: 400 });
    }

    // Increment in the database
    const newValue = await incrementArticleInteraction(slug, action);

    return NextResponse.json({
      success: true,
      slug,
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
