import { NextResponse } from 'next/server';
import { personalInfo, projectsList, socialLinks, youtubeChannels } from '@/lib/realData';

const KNOWLEDGE_BASE = {
  name: personalInfo.name,
  role: personalInfo.role,
  bio: personalInfo.bio,
  email: personalInfo.email,
  location: personalInfo.aboutDetails.location,
  skills: personalInfo.aboutDetails.skills,
  hobbies: personalInfo.aboutDetails.hobbies,
  projects: projectsList.map(p => ({
    title: p.title,
    description: p.description,
    techStack: p.techStack,
    demoUrl: p.demoUrl,
    featured: p.featured,
  })),
  socials: socialLinks.map(s => ({
    name: s.name,
    username: s.username,
    url: s.url,
    followers: s.followers,
  })),
  youtube: youtubeChannels.map(y => ({
    name: y.name,
    url: y.url,
    subscribers: y.subscribers,
    focus: y.focus,
  })),
};

function generateSmartAnswer(query: string): string {
  const q = query.toLowerCase();

  // Contact / Hire
  if (q.includes('hire') || q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('work with') || q.includes('rate') || q.includes('price')) {
    return `You can hire or collaborate with Shouvik Das directly! 🚀\n\n• **Email:** [${personalInfo.email}](mailto:${personalInfo.email})\n• **Location:** ${personalInfo.aboutDetails.location}\n• **Status:** 🟢 Currently accepting Web3D development contracts, UI/UX design partnerships, and frontend engineering roles.\n\nYou can also submit the Contact Form at [/contact](/contact) or message via HeyLink: [heylink.me/ShouvikDas](https://heylink.me/ShouvikDas/).`;
  }

  // Skills / Tech stack
  if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('three') || q.includes('react') || q.includes('next') || q.includes('tailwind')) {
    return `Shouvik's core technical arsenal includes:\n\n• **Frontend & Spatial 3D:** Next.js 16 (App Router), React 19, Three.js, React Three Fiber (R3F), WebGL shaders, TypeScript, Tailwind CSS v4, Framer Motion, GSAP.\n• **Backend & Edge:** Cloudflare Workers, Neon Serverless Postgres, Drizzle ORM, Supabase, MongoDB, Node.js, Express.js.\n• **Design & Media:** Figma, High-End Video Editing (VFX), Cinematography, Viral YouTube Thumbnail Design.\n• **Mobile:** Android (Kotlin) & iOS (Swift) cross-platform tracking apps.`;
  }

  // Projects / Apps
  if (q.includes('project') || q.includes('app') || q.includes('work') || q.includes('otaku') || q.includes('anispectra') || q.includes('portfolio') || q.includes('build')) {
    const list = projectsList.slice(0, 4).map(p => `• **${p.title}**: ${p.description.slice(0, 110)}... (Stack: ${p.techStack.slice(0, 3).join(', ')})`).join('\n\n');
    return `Here are some of Shouvik's top production projects:\n\n${list}\n\n👉 View all projects and live specs at [/projects](/projects)!`;
  }

  // YouTube / Content creation / Anime
  if (q.includes('youtube') || q.includes('anime') || q.includes('manga') || q.includes('subscriber') || q.includes('channel') || q.includes('video')) {
    return `Shouvik runs a multi-platform anime and lifestyle media network with **25,000+ followers**:\n\n• **Anime Nation India (YT & Insta):** Over 25K+ community members enjoying trailer reviews, daily reels, and otaku lore.\n• **Shouvik Das Vlogs (YT):** Travel documentaries across India & culinary exploration.\n• **Shouvik Manga Explanations (YT):** Deep-dive manga theories, recap podcasts, and lore breakdowns.\n• **Shouvik X Anime & Shouvik Senpai:** AMVs, visual synchronizations, and edits.\n\nExplore the full channel hub at [/socials](/socials)!`;
  }

  // Resume / Experience
  if (q.includes('resume') || q.includes('cv') || q.includes('experience') || q.includes('background') || q.includes('about')) {
    return `Shouvik's official Executive CV is available online! 📄\n\n• **Title:** ${personalInfo.role}\n• **Highlights:** 8+ shipped production web & mobile applications, sub-50ms edge architectures, 25K+ audience leadership.\n• **Interactive Resume:** Visit [/resume](/resume) to inspect full technical breakdowns or download the official PDF!`;
  }

  // General / Default
  return `Hello! I'm Shouvik's AI Portfolio Assistant. 🤖✨\n\nShouvik Das is a **${personalInfo.role}** based in India. He crafts hardware-accelerated spatial web experiences with Next.js 16, Three.js, and Cloudflare Workers while directing a 25K+ digital content ecosystem.\n\nHow can I help you today? You can ask me about:\n1. *"What is Shouvik's tech stack?"*\n2. *"Show me his featured projects"*\n3. *"How can I hire him?"*\n4. *"Tell me about his YouTube channels and anime work"*`;
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const systemPrompt = `You are the official AI representative for Shouvik Das's 3D Developer Portfolio.
Here is the factual knowledge base about Shouvik Das:
${JSON.stringify(KNOWLEDGE_BASE, null, 2)}

Instructions:
- Be confident, ultra-helpful, highly professional, and friendly.
- Answer user inquiries accurately using Shouvik's real skills, projects, contact info (${personalInfo.email}), and links.
- Emphasize his strengths in Next.js 16, Three.js/Web3D, UI/UX architecture, Cloudflare Workers, and digital media production.
- Use markdown styling with bullet points where appropriate. Keep responses concise (under 150 words).`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }],
                },
              ],
              generationConfig: {
                maxOutputTokens: 300,
                temperature: 0.7,
              },
            }),
          }
        );

        const geminiData = await geminiRes.json();
        const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (reply) {
          return NextResponse.json({ reply });
        }
      } catch (geminiErr) {
        console.error('Gemini API call fallback to smart knowledge engine:', geminiErr);
      }
    }

    // High quality intelligent local engine fallback
    const answer = generateSmartAnswer(message);
    return NextResponse.json({ reply: answer });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({ error: 'Failed to process AI chat message' }, { status: 500 });
  }
}
