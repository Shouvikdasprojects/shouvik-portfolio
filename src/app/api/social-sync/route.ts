import { NextResponse } from 'next/server';
import { getRealTimeSocialRegistry } from '@/lib/socialSync';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
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
