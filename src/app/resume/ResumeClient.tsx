'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TiltCard from '@/components/ui/TiltCard';
import GlowButton from '@/components/ui/GlowButton';
import { personalInfo, projectsList, youtubeChannels } from '@/lib/realData';
import { 
  Printer, 
  Download, 
  Mail, 
  MapPin, 
  Sparkles, 
  ExternalLink, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Palette, 
  CheckCircle2, 
  Copy, 
  Share2, 
  Layers, 
  Tv, 
  Globe 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sfx } from '@/lib/soundEffects';

export default function ResumeClient() {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    sfx.playWarp();
    window.print();
  };

  const handleCopyEmail = () => {
    sfx.playClick();
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ff007f', '#8b5cf6', '#0ea5e9']
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    sfx.playClick();
    if (navigator.share) {
      navigator.share({
        title: 'Shouvik Das — Executive Resume',
        text: 'Check out Shouvik Das’s Executive Resume and 3D Portfolio.',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('📋 Resume URL copied to clipboard!');
    }
  };

  return (
    <>
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="relative min-h-screen pt-28 pb-24 overflow-hidden bg-transparent print:pt-0 print:pb-0 print:bg-white print:text-black">
        {/* Ambient background glows (Hidden in print) */}
        <div className="ambient-glow -top-48 -left-48 bg-primary/15 pointer-events-none print:hidden" />
        <div className="ambient-glow top-1/2 -right-48 bg-secondary/10 pointer-events-none print:hidden" />

        <div className="max-w-5xl mx-auto px-6 relative z-10 print:max-w-full print:px-0">
          
          {/* Action Toolbar Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-4 rounded-2xl bg-[#090611]/80 border border-white/10 backdrop-blur-xl shadow-xl print:hidden">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-mono font-bold text-white tracking-wider">
                VERIFIED EXECUTIVE RESUME
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 ml-2">
                2026 EDITION
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary text-white text-xs font-mono font-bold border border-primary/30 hover:border-primary flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(255,0,127,0.2)]"
              >
                <Printer size={14} /> Print / Save as PDF
              </button>

              <GlowButton
                href={personalInfo.resumeUrl}
                download="Shouvik_Das_Resume.pdf"
                className="!px-4 !py-2 !text-xs !shadow-none"
                confettiBurst={false}
              >
                <Download size={14} /> Download PDF
              </GlowButton>

              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
                title="Copy Contact Email"
              >
                {copied ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} />}
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
                title="Share Resume"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* MAIN RESUME PAPER / CARD CONTAINER */}
          <div className="rounded-3xl bg-[#090614]/90 border border-white/10 p-8 sm:p-12 shadow-[0_0_80px_rgba(0,0,0,0.8)] print:bg-white print:border-none print:shadow-none print:p-0 print:text-slate-900">
            
            {/* 1. Header Profile & Contact Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/10 print:border-slate-300">
              <div className="flex items-center gap-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={personalInfo.avatarUrl}
                  alt={personalInfo.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/40 shadow-lg print:w-16 print:h-16"
                />
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight print:text-black">
                    {personalInfo.name}
                  </h1>
                  <p className="text-sm font-mono font-bold text-primary mt-1 print:text-slate-700">
                    Visionary UI/UX Architect & Spatial Web3D Developer | Media Creator
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400 font-mono print:text-slate-600">
                    <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" /> West Bengal, India</span>
                    <span className="flex items-center gap-1"><Mail size={12} className="text-primary" /> {personalInfo.email}</span>
                    <span className="flex items-center gap-1 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Available for Global Contract & Full-Time</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-right font-mono text-xs text-gray-400 print:text-slate-600">
                <a href="https://heylink.me/ShouvikDas/" target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center justify-end gap-1">
                  heylink.me/ShouvikDas <ExternalLink size={10} />
                </a>
                <a href="https://x.com/shouvikdas155" target="_blank" rel="noreferrer" className="hover:text-white">
                  Twitter/X: @shouvikdas155
                </a>
                <a href="https://www.instagram.com/shouvik_das_official" target="_blank" rel="noreferrer" className="hover:text-white">
                  Instagram: @shouvik_das_official
                </a>
              </div>
            </div>

            {/* 2. Executive Summary */}
            <div className="py-6 border-b border-white/10 print:border-slate-300">
              <h2 className="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                <Sparkles size={14} /> Executive Summary
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed print:text-slate-800">
                Visionary UI/UX Architect and Spatial Web3D Developer with 4+ years of expertise engineering high-performance, spatial web ecosystems and hardware-accelerated WebGL applications. Proven creator leadership directing multi-channel digital media networks exceeding 25,000+ followers and millions of impressions across Anime Nation India and personal brands. Specialist in Next.js 16 (App Router), React 19, Three.js (R3F), TypeScript, bespoke design systems, motion graphics, and world-class video production.
              </p>
            </div>

            {/* 3. Core Competencies & Skills Matrix */}
            <div className="py-6 border-b border-white/10 print:border-slate-300">
              <h2 className="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                <Code2 size={14} /> Core Technical & Design Competencies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 print:bg-slate-50 print:border-slate-200">
                  <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5 mb-2 print:text-slate-900">
                    <Palette size={12} className="text-primary" /> UI/UX Design
                  </span>
                  <p className="text-[11px] text-gray-400 leading-relaxed print:text-slate-600">
                    Figma, Wireframing, Rapid Prototyping, Design Systems, Mobile-First UX, Glassmorphism, Micro-Interactions
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 print:bg-slate-50 print:border-slate-200">
                  <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5 mb-2 print:text-slate-900">
                    <Layers size={12} className="text-secondary" /> Frontend & 3D
                  </span>
                  <p className="text-[11px] text-gray-400 leading-relaxed print:text-slate-600">
                    Next.js (App Router), React 19, Three.js, React Three Fiber, TypeScript, Tailwind CSS, Framer Motion
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 print:bg-slate-50 print:border-slate-200">
                  <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5 mb-2 print:text-slate-900">
                    <Globe size={12} className="text-cyan-400" /> Backend & Data
                  </span>
                  <p className="text-[11px] text-gray-400 leading-relaxed print:text-slate-600">
                    Supabase (PostgreSQL), REST APIs, Node.js, Vercel Cron Scheduling, Automation Webhooks
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 print:bg-slate-50 print:border-slate-200">
                  <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5 mb-2 print:text-slate-900">
                    <Tv size={12} className="text-amber-400" /> Media Production
                  </span>
                  <p className="text-[11px] text-gray-400 leading-relaxed print:text-slate-600">
                    DaVinci Resolve, Adobe Premiere, Photoshop, Cinematography, YouTube SEO & Viral Thumbnail Design
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Professional Experience & Creative Production */}
            <div className="py-6 border-b border-white/10 print:border-slate-300">
              <h2 className="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                <Briefcase size={14} /> Professional Experience & Creator Milestones
              </h2>

              <div className="space-y-6">
                {/* Role 1 */}
                <div className="relative pl-6 border-l-2 border-primary/40 print:border-slate-400">
                  <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-primary" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-base font-bold text-white print:text-black">
                      Lead Web3D Developer & UI/UX Consultant
                    </h3>
                    <span className="text-xs font-mono text-primary font-bold">2022 — Present</span>
                  </div>
                  <span className="text-xs font-mono text-gray-400 block mb-2 print:text-slate-600">Independent / Contract Studio</span>
                  <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside leading-relaxed print:text-slate-800">
                    <li>Designed and engineered hardware-accelerated 3D spatial web experiences with Three.js and Next.js.</li>
                    <li>Built dynamic real-time caching architecture with Supabase and ISR for sub-50ms page transitions.</li>
                    <li>Created responsive cyberpunk design systems featuring glassmorphism, procedural starfields, and physics-based tilt cards.</li>
                  </ul>
                </div>

                {/* Role 2 */}
                <div className="relative pl-6 border-l-2 border-secondary/40 print:border-slate-400">
                  <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-secondary" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-base font-bold text-white print:text-black">
                      Founder & Lead Content Creator — Anime Nation India
                    </h3>
                    <span className="text-xs font-mono text-secondary font-bold">2021 — Present</span>
                  </div>
                  <span className="text-xs font-mono text-gray-400 block mb-2 print:text-slate-600">YouTube & Multi-Platform Community (25,000+ Followers)</span>
                  <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside leading-relaxed print:text-slate-800">
                    <li>Produced over 200+ high-engagement video edits, manga analysis narratives, and cinematic synchronizations.</li>
                    <li>Scaled community engagement across YouTube, Instagram, and Facebook with daily content pipelines.</li>
                    <li>Designed high-CTR custom YouTube thumbnails and visual brand identities for multiple creator networks.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. Key Shipped Projects */}
            <div className="py-6 border-b border-white/10 print:border-slate-300">
              <h2 className="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                <Layers size={14} /> Key Shipped Production Builds
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectsList.slice(0, 4).map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 print:bg-slate-50 print:border-slate-200">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-white text-sm print:text-black">{proj.title}</h4>
                      {proj.demoUrl && (
                        <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-primary hover:underline flex items-center gap-0.5 print:hidden">
                          Live Demo <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed mb-2.5 print:text-slate-700">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {proj.techStack.map(t => (
                        <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10 print:bg-slate-200 print:text-slate-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Technical Focus & Languages */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Sparkles size={14} /> Specialized Technical Focus
                </h2>
                <div className="space-y-3">
                  <div className="border-l-2 border-primary/40 pl-3">
                    <h3 className="text-sm font-bold text-white print:text-black">Hardware-Accelerated Web3D</h3>
                    <p className="text-xs text-primary font-mono">Three.js, WebGL Shaders &amp; React Three Fiber</p>
                    <span className="text-[11px] font-mono text-gray-400 print:text-slate-600">Sub-50ms Edge Performance &amp; Next.js 16</span>
                  </div>
                  <div className="border-l-2 border-secondary/40 pl-3">
                    <h3 className="text-xs font-bold text-gray-200 print:text-slate-800">Design Systems &amp; Motion Architecture</h3>
                    <span className="text-[10px] font-mono text-gray-400 print:text-slate-500">Figma, Glassmorphism, Micro-Interactions &amp; Framer Motion</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Globe size={14} /> Languages &amp; Passions
                </h2>
                <div className="space-y-1.5 text-xs text-gray-300 print:text-slate-800">
                  <p><strong className="text-white print:text-black">Languages:</strong> English (Professional), Hindi, Bengali (Native)</p>
                  <p><strong className="text-white print:text-black">Interests:</strong> Travel Cinematography, Manga &amp; Anime Lore, Spatial Interfaces, World Cuisines</p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom CTA for recruiters (Hidden in print) */}
          <div className="mt-12 text-center print:hidden">
            <h3 className="text-lg font-black text-white mb-2">
              Interested in collaborating or hiring?
            </h3>
            <p className="text-gray-400 text-xs max-w-md mx-auto mb-6">
              I am currently taking on high-impact contracts and creative development inquiries.
            </p>
            <GlowButton href="/contact">
              <Mail size={14} /> GET IN TOUCH NOW
            </GlowButton>
          </div>

        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
