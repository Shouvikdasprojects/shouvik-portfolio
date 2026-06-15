import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/db';
import { projectsList } from '@/lib/realData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Return static projectsList directly so realData.ts changes show up immediately.
    // The previous logic favored dbProjects, which was hiding local modifications.
    const finalProjects = projectsList;
    
    return NextResponse.json({ success: true, projects: finalProjects });
  } catch (error: any) {
    console.error("Error in /api/projects GET route:", error);
    // Silent failover to static projects list for absolute resilience!
    return NextResponse.json({ success: true, projects: projectsList, fromFallback: true });
  }
}
