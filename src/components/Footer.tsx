'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowUp, 
  Mail, 
  Globe, 
  ChevronDown, 
  Calendar, 
  Terminal, 
  Command, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Radio, 
  Zap,
  ExternalLink,
  Code2
} from 'lucide-react';
import { personalInfo, socialLinks } from '@/lib/realData';
import { sfx } from '@/lib/soundEffects';

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const scrollToTop = () => {
    sfx.playWarp();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    sfx.playChime();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const openBooking = () => {
    sfx.playWarp();
    window.dispatchEvent(new CustomEvent('open-booking-modal'));
  };

  const openTerminal = () => {
    sfx.playWarp();
    window.dispatchEvent(new CustomEvent('open-terminal'));
  };

  const openCommandPalette = () => {
    sfx.playWarp();
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#05030c] pt-16 pb-12 overflow-hidden z-20">
      {/* Dynamic ambient background glow that responds to active theme */}
      <div className="ambient-glow -bottom-64 left-1/2 -translate-x-1/2 pointer-events-none opacity-20" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* 1. TOP INTERACTIVE ACTION DOCK & QUICK WARP */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0e0822] via-[#090518] to-[#0e0822] border border-primary/20 shadow-[0_0_35px_var(--primary-glow)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                AVAILABLE FOR Q3/Q4 2026 CONTRACTS
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Have a Vision? <span className="gradient-text-primary">Let&apos;s Build Together.</span>
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
                Open for high-impact Full-Stack architecture, Web3D immersive web apps, and digital media partnerships.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                onClick={openBooking}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs tracking-wider transition-all flex items-center gap-2 shadow-[0_0_20px_var(--primary-glow)] hover:scale-105 cursor-pointer"
              >
                <Calendar size={14} /> Schedule 1-on-1 Call
              </button>

              <button
                onClick={copyEmail}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/40 text-gray-200 hover:text-white font-mono text-xs transition-all flex items-center gap-2 cursor-pointer"
                title="Copy email to clipboard"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-cyan-400" />}
                <span>{copied ? 'Copied Email!' : 'Copy Email'}</span>
              </button>

              <button
                onClick={openTerminal}
                className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-gray-300 hover:text-emerald-400 font-mono text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Open Developer Terminal (Shortcut: ~)"
              >
                <Terminal size={14} /> <span>CLI ~</span>
              </button>

              <button
                onClick={openCommandPalette}
                className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-primary/15 border border-white/10 hover:border-primary/40 text-gray-300 hover:text-primary font-mono text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Command Palette (Shortcut: ⌘K)"
              >
                <Command size={14} /> <span>⌘K</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. 4-COLUMN COMPREHENSIVE SITEMAP & BRAND SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-14">
          
          {/* Column 1: Brand Info & Social Network (Spans 4 columns) */}
          <div className="lg:col-span-4 flex flex-col items-start gap-4 text-left">
            <div>
              <span className="text-2xl font-black tracking-widest text-white font-mono block">
                SHOUVIK <span className="text-primary">DAS</span>
              </span>
              <span className="text-xs font-mono text-cyan-400 mt-0.5 block">
                Full-Stack Architect & Media Lead
              </span>
            </div>

            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Architecting high-performance spatial Web3D applications, edge computing systems, and leading a 25K+ creator ecosystem across YouTube, Instagram, and digital networks.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>West Bengal, India • Global Remote (IST)</span>
            </div>
            
            {/* Social Badges Grid */}
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { name: 'GitHub', href: personalInfo.github, icon: '🐙' },
                { name: 'YouTube', href: 'https://youtube.com/@shouvikdasvlogss?si=JxiajbZVf-s12mMU', icon: '🎬' },
                { name: 'Instagram', href: 'https://www.instagram.com/shouvik_das_official', icon: '📸' },
                { name: 'HeyLink', href: personalInfo.heylink, icon: '🔗' },
                { name: 'X / Twitter', href: 'https://x.com/shouvikdas155', icon: '🐦' },
                { name: 'Email', href: `mailto:${personalInfo.email}`, icon: '✉️' }
              ].map((s) => (
                <a 
                  key={s.name}
                  href={s.href} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 text-xs font-mono text-gray-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  aria-label={s.name}
                >
                  <span>{s.icon}</span>
                  <span>{s.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Flagship Case Studies (Spans 3 columns) */}
          <div className="lg:col-span-3 flex flex-col items-start gap-3.5 text-left">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest font-mono flex items-center gap-2">
              <Code2 size={13} className="text-primary" /> Case Studies
            </span>
            <ul className="flex flex-col gap-2 text-xs font-mono text-gray-400">
              <li>
                <Link href="/projects/otaku-insider" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <span className="text-primary">›</span> Otaku Insider (Next.js 16)
                </Link>
              </li>
              <li>
                <Link href="/projects/anispectra" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <span className="text-primary">›</span> AniSpectra (3D WebGL)
                </Link>
              </li>
              <li>
                <Link href="/projects/ani-media-online" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <span className="text-primary">›</span> ANI Media Online (API)
                </Link>
              </li>
              <li>
                <Link href="/projects/anime-nation-india" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <span className="text-primary">›</span> Anime Nation India (25K+)
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-cyan-400 hover:underline flex items-center gap-1 mt-1">
                  View All Projects <ExternalLink size={10} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Navigation & Legal (Spans 2 columns) */}
          <div className="lg:col-span-2 flex flex-col items-start gap-3.5 text-left">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest font-mono flex items-center gap-2">
              <Zap size={13} className="text-cyan-400" /> Platform
            </span>
            <ul className="flex flex-col gap-2 text-xs font-mono text-gray-400">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Shouvik</Link></li>
              <li><Link href="/resume" className="hover:text-primary transition-colors">Resume & CV</Link></li>
              <li><Link href="/socials" className="hover:text-primary transition-colors">Socials & Media</Link></li>
              <li><Link href="/articles" className="hover:text-primary transition-colors">Discoveries Blog</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Direct Contact</Link></li>
              <li><Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 4: System Telemetry & FAQs (Spans 3 columns) */}
          <div className="lg:col-span-3 flex flex-col items-start gap-3.5 text-left">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest font-mono flex items-center gap-2">
              <ShieldCheck size={13} className="text-emerald-400" /> FAQ & Telemetry
            </span>
            
            <div className="flex flex-col gap-2.5 w-full">
              <details className="group border-b border-white/5 pb-2 cursor-pointer w-full">
                <summary className="text-xs font-bold text-gray-300 hover:text-white flex justify-between items-center list-none outline-none select-none transition-colors py-0.5">
                  <span>What is your tech stack?</span>
                  <ChevronDown size={13} className="text-primary group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                  Next.js 16 App Router, React 19, TypeScript, Three.js / WebGL, Tailwind CSS, Supabase, and Cloudflare Workers.
                </p>
              </details>

              <details className="group border-b border-white/5 pb-2 cursor-pointer w-full">
                <summary className="text-xs font-bold text-gray-300 hover:text-white flex justify-between items-center list-none outline-none select-none transition-colors py-0.5">
                  <span>Average Response Time?</span>
                  <ChevronDown size={13} className="text-primary group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                  Guaranteed response within &lt;12 hours via email or direct meeting scheduler.
                </p>
              </details>

              {/* Service SLA Badge */}
              <div className="mt-2 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] font-mono text-gray-400 flex flex-col gap-1">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Edge Latency</span>
                  <span>&lt; 50ms (Global CDN)</span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>Build Engine</span>
                  <span>Turbopack v16.2.6</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3. BOTTOM FOOTER BAR WITH ROCKET LAUNCH BUTTON */}
        <div className="relative pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-mono">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEM ONLINE
              </span>
              <span>•</span>
              <p>© {new Date().getFullYear()} Shouvik Das. All rights reserved.</p>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/resume" className="hover:text-primary transition-colors text-[11px]">Executive Resume</Link>
              <Link href="/sitemap.xml" className="hover:text-primary transition-colors text-[11px]">Sitemap</Link>
              <a href="https://heylink.me/ShouvikDas/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1 text-[11px]">
                <Globe size={11} /> heylink.me
              </a>
              
              {/* Back to top rocket button */}
              <button
                onClick={scrollToTop}
                className="rocket-btn ml-2 p-2 rounded-xl bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-gray-300 hover:text-white transition-all cursor-pointer shadow-sm flex items-center gap-1"
                aria-label="Back to top"
                title="Warp to top of page"
              >
                <span className="rocket-icon text-sm select-none">🚀</span>
                <span className="text-[10px] font-bold">TOP</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
