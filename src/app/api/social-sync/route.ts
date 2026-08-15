import { NextResponse } from 'next/server';
import { getRealTimeSocialRegistry } from '@/lib/socialSync';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const secret = searchParams.get('secret') || bearerToken;

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

    const data = await getRealTimeSocialRegistry();
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    console.error("Error in /api/social-sync GET route:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch real-time social registry details.",
      details: error.message 
    }, { status: 500 });
  }
}
