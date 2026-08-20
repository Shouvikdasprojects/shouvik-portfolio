'use client';

import { Star, Quote, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import { sfx } from '@/lib/soundEffects';

const TESTIMONIALS = [
  {
    name: 'Vikram Sengupta',
    role: 'Lead Product Manager',
    company: 'NextGen Spatial Labs',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: 'Shouvik has a rare gift for combining ultra-fluid WebGL 3D graphics with rock-solid Next.js architectures. He delivered our showroom portal 2 weeks ahead of schedule with sub-50ms latency.',
    rating: 5,
    tag: 'Web3D Architecture',
    highlight: '2 weeks ahead of schedule',
  },
  {
    name: 'Ananya Roy',
    role: 'Co-Director & Media Producer',
    company: 'Anime Nation India',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    content: 'Working with Shouvik on Anime Nation India has been incredible. His visual storytelling, high-end motion editing, and UI design helped us scale to over 25,000+ passionate followers across India!',
    rating: 5,
    tag: 'Creative Direction & 25K+ Growth',
    highlight: 'Scaled to 25,000+ followers',
  },
  {
    name: 'David K. Vance',
    role: 'Senior Engineering Director',
    company: 'Apex Cloud Solutions',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content: 'Otaku Insider is one of the cleanest edge-native implementations of Next.js 16 and Cloudflare Workers I have reviewed. The GraphQL data pipelining and caching strategy is pure genius.',
    rating: 5,
    tag: 'Edge Computing & GraphQL',
    highlight: 'Pure genius architecture',
  },
  {
    name: 'Priyanka Sen',
    role: 'UI/UX Design Lead',
    company: 'Studio Lumina',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    content: 'Shouvik’s eye for glassmorphism, micro-interactions, and neon aesthetics is top-tier. He turns complex Figma wireframes into pixel-perfect, hardware-accelerated code effortlessly.',
    rating: 5,
    tag: 'UI/UX & Design Systems',
    highlight: 'Pixel-perfect execution',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden bg-transparent border-t border-white/5">
      <div className="ambient-glow top-1/2 -right-48 bg-secondary/10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14 gap-3">
          <span className="text-xs font-bold text-primary font-mono uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={13} /> CLIENT &amp; PEER ENDORSEMENTS
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            What Collaborators <span className="gradient-text-glow">Say</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
            Real feedback from engineering directors, media partners, and creative leads who have built projects with me.
          </p>
          <div className="w-20 h-[3px] bg-gradient-to-r from-primary via-accent to-secondary rounded-full mt-1" />
        </div>

        {/* Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { value: '5.0 ★', label: 'Client Satisfaction' },
            { value: '100%', label: 'On-Time Delivery' },
            { value: '25K+', label: 'Community Audience' },
            { value: '<24h', label: 'Response Guarantee' },
          ].map((m) => (
            <div key={m.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 text-center">
              <span className="text-2xl font-black text-primary font-mono block">{m.value}</span>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{m.label}</span>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={t.name}
              onMouseEnter={() => sfx.playHover()}
              className="p-7 rounded-3xl bg-[#090516]/75 border border-white/8 hover:border-primary/40 hover:bg-[#0d0822]/90 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group shadow-xl relative overflow-hidden"
            >
              {/* Subtle top gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary transition-all" />

              <div>
                {/* Top Row: Stars + Tag */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1 text-yellow-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                    {t.tag}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 italic relative z-10">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              {/* Author Row */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-primary/30"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="text-white text-xs font-bold font-mono flex items-center gap-1">
                      {t.name} <CheckCircle2 size={12} className="text-primary" />
                    </h4>
                    <p className="text-gray-400 text-[10px]">{t.role} · <span className="text-primary/90">{t.company}</span></p>
                  </div>
                </div>

                <Quote size={24} className="text-white/10 group-hover:text-primary/20 transition-colors" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
