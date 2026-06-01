import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/db';
import { projectsList } from '@/lib/realData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const dbProjects = await getProjects();
    
    // Fall back to static projectsList if database table is empty to prevent blank page loads!
    const finalProjects = dbProjects.length > 0 ? dbProjects : projectsList;
    
    return NextResponse.json({ success: true, projects: finalProjects });
  } catch (error: any) {
    console.error("Error in /api/projects GET route:", error);
    // Silent failover to static projects list for absolute resilience!
    return NextResponse.json({ success: true, projects: projectsList, fromFallback: true });
  }
}
