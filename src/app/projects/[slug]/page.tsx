import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlowButton from '@/components/ui/GlowButton';
import { projectsList } from '@/lib/realData';
import { 
  ArrowLeft, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Database, 
  Globe, 
  Terminal, 
  ShieldCheck, 
  Zap,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getProjectBySlug(slug: string) {
  return projectsList.find((p) => generateSlug(p.title) === slug || p.title.toLowerCase().replace(/\s+/g, '-') === slug);
}

export async function generateStaticParams() {
  return projectsList.map((p) => ({
    slug: generateSlug(p.title),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Case Study Not Found | Shouvik Das',
    };
  }

  const title = `${project.title} — Architectural Case Study & System Specs | Shouvik Das`;
  const description = project.details?.tagline || project.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://shouvikdasportfolio.qzz.io/projects/${slug}`,
      siteName: 'Shouvik Das Portfolio',
      type: 'article',
      images: [
        {
          url: project.imageUrl.startsWith('http') ? project.imageUrl : `https://shouvikdasportfolio.qzz.io${project.imageUrl}`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [project.imageUrl.startsWith('http') ? project.imageUrl : `https://shouvikdasportfolio.qzz.io${project.imageUrl}`],
    },
    alternates: {
      canonical: `https://shouvikdasportfolio.qzz.io/projects/${slug}`,
    },
  };
}

export default async function ProjectCaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Find index for next/prev project navigation
  const currentIndex = projectsList.findIndex((p) => generateSlug(p.title) === slug || p.title.toLowerCase().replace(/\s+/g, '-') === slug);
  const nextProject = projectsList[(currentIndex + 1) % projectsList.length];

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-transparent">
        {/* Ambient background glows */}
        <div className="ambient-glow -top-48 -left-48 bg-primary/15 pointer-events-none" />
        <div className="ambient-glow top-1/3 -right-48 bg-secondary/10 pointer-events-none" />
        <div className="ambient-glow bottom-0 left-1/4 bg-accent/5 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">

          {/* Breadcrumb navigation */}
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-8">
            <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-primary transition-colors">PROJECTS</Link>
            <span>/</span>
            <span className="text-primary font-bold">{project.title.toUpperCase()}</span>
          </div>

          {/* Back button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white mb-8 group transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-primary" /> Back to all projects
          </Link>

          {/* Header & Hero Title */}
          <div className="flex flex-col gap-4 mb-10">
            <div className="flex flex-wrap items-center gap-3">
              {project.featured && (
                <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary uppercase tracking-widest flex items-center gap-1">
                  <Sparkles size={11} /> FEATURED BUILD
                </span>
              )}
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400">
                🟢 PRODUCTION ACTIVE
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              {project.title}
            </h1>

            <p className="text-xl md:text-2xl text-primary font-semibold leading-relaxed">
              {project.details?.tagline || project.description}
            </p>
          </div>

          {/* Main Showcase Hero Image */}
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 bg-slate-900 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040209] via-transparent to-transparent pointer-events-none" />

            {/* Launch Banner Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-white">LIVE AT EDGE RUNTIME</span>
              </div>
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,0,127,0.4)] transition-all cursor-pointer"
              >
                Launch Live App <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Quick Technical Specs Summary Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/8">
              <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-wider block">ROLE &amp; SCOPE</span>
              <span className="text-white font-bold text-xs md:text-sm">Architecture &amp; Lead Dev</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/8">
              <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-wider block">PRIMARY RUNTIME</span>
              <span className="text-primary font-bold text-xs md:text-sm">{project.techStack[0] || 'Next.js 16'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/8">
              <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-wider block">DATABASE ARCHITECTURE</span>
              <span className="text-cyan-400 font-bold text-xs md:text-sm">Serverless / GraphQL</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/8">
              <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-wider block">STATUS</span>
              <span className="text-emerald-400 font-bold text-xs md:text-sm">100% Shipped ✓</span>
            </div>
          </div>

          {/* Deep-Dive Overview */}
          <div className="flex flex-col gap-6 mb-16">
            <div className="flex items-center gap-2">
              <Terminal size={18} className="text-primary" />
              <h2 className="text-2xl font-bold text-white">System Overview &amp; Problem Statement</h2>
            </div>
            <div className="p-8 rounded-3xl bg-[#090516]/80 border border-white/10 backdrop-blur-xl text-gray-300 text-sm md:text-base leading-relaxed space-y-4 shadow-xl">
              <p>
                {project.details?.overview || project.description}
              </p>
            </div>
          </div>

          {/* Architecture Matrix Breakdown */}
          {project.details?.techStack && (
            <div className="flex flex-col gap-6 mb-16">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-secondary" />
                <h2 className="text-2xl font-bold text-white">Architecture &amp; Stack Decomposition</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(project.details.techStack).map(([layer, techs]) => (
                  <div key={layer} className="p-6 rounded-2xl bg-white/[0.025] border border-white/8 flex flex-col gap-3">
                    <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                      <Cpu size={12} /> {layer}
                    </span>
                    <ul className="space-y-1.5">
                      {(techs as string[]).map((t) => (
                        <li key={t} className="text-xs text-gray-300 flex items-center gap-1.5">
                          <CheckCircle2 size={11} className="text-emerald-400 shrink-0" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Features Grid */}
          {project.details?.features && (
            <div className="flex flex-col gap-6 mb-16">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-accent" />
                <h2 className="text-2xl font-bold text-white">Engineered Features</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.details.features.map((feat) => (
                  <div key={feat.title} className="p-6 rounded-2xl bg-white/[0.025] border border-white/8 flex flex-col gap-2 hover:border-primary/30 transition-all">
                    <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {feat.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Engineering Achievements */}
          {project.details?.achievements && (
            <div className="flex flex-col gap-6 mb-16">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                <h2 className="text-2xl font-bold text-white">Engineering Milestones &amp; Challenges Solved</h2>
              </div>

              <div className="p-8 rounded-3xl bg-emerald-500/[0.03] border border-emerald-500/20 backdrop-blur-xl space-y-4">
                {project.details.achievements.map((ach, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-emerald-400 font-mono font-bold text-xs mt-0.5">[{i + 1}]</span>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {ach}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action / Next Project Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 mt-16">
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">NEXT PROJECT IN QUEUE</span>
              <h3 className="text-xl font-black text-white">{nextProject.title}</h3>
              <p className="text-xs text-gray-400 max-w-sm">{nextProject.description.slice(0, 80)}...</p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/projects/${generateSlug(nextProject.title)}`}
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,0,127,0.3)] cursor-pointer"
              >
                Inspect Next Case Study <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
