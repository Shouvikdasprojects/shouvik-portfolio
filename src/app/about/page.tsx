import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/ui/GlassCard';
import GlowButton from '@/components/ui/GlowButton';
import SafeImage from '@/components/ui/SafeImage';
import { personalInfo } from '@/lib/realData';
import SocialDirectoryServer from './SocialDirectoryServer';
import { Mail, Compass, Star, Camera, Film, Palette, MapPin } from 'lucide-react';
import { Suspense } from 'react';
import TiltCard from '@/components/ui/AboutTiltCardWrapper';

export const revalidate = 60; // Cache for 60 seconds (ISR) to fix slow page loads

export const metadata = {
  title: 'About Shouvik Das | Web3D Developer & UI/UX Designer',
  description: 'Get to know Shouvik Das—an India-based UI/UX Designer, Web3D Developer, and content creator. Discover my hobbies, traveling logs, anime content, photography, and follow all 12 of my official social channels.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <section className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-transparent">
        {/* Ambient background styling */}
        <div className="ambient-glow -top-48 -left-48 bg-primary/15 pointer-events-none" />
        <div className="ambient-glow top-1/2 -right-48 bg-secondary/10 pointer-events-none" />
        <div className="ambient-glow bottom-0 left-1/4 bg-blue-500/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16 gap-3">
            <span className="text-xs font-bold text-primary font-mono tracking-[0.2em] uppercase animate-pulse">
              GET TO KNOW ME
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              About <span className="gradient-text-primary">Shouvik Das</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
              A passionate UI/UX Designer & Web3D Developer based in India. Exploring the world, creating anime universes, and crafting next-generation spatial web experiences.
            </p>
            <div className="w-24 h-[3px] bg-gradient-to-r from-primary via-pink-500 to-secondary rounded-full mt-4" />
          </div>

          {/* Core Profile & Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            
            {/* Left Column: Portrait Card with premium 3D Tilt */}
            <div className="lg:col-span-5 flex justify-center">
              <Suspense fallback={
                <div className="w-full max-w-[380px] aspect-[4/5] rounded-2xl bg-[#0b0814]/65 border border-white/5 flex items-center justify-center shadow-2xl relative">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              }>
                <TiltCard className="w-full max-w-[380px] p-4 bg-[#0b0814]/65 border-white/5 shadow-2xl relative group rounded-2xl">
                  <div className="photo-glow-border overflow-hidden rounded-xl bg-slate-900 border border-white/10 aspect-[4/5] relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={personalInfo.avatarUrl} 
                      alt={personalInfo.name} 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />
                    
                    {/* Location badge on the picture */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs text-white font-semibold">
                      <MapPin size={12} className="text-primary" />
                      {personalInfo.aboutDetails.location}
                    </div>
                  </div>
                </TiltCard>
              </Suspense>
            </div>

            {/* Right Column: In-depth Biography & Passion Chronicles */}
            <div className="lg:col-span-7 flex flex-col gap-8 text-left">
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  <Compass className="text-primary" size={24} /> My Creative Journey & Passions
                </h2>
                <div className="w-16 h-[2px] bg-primary rounded-full" />
              </div>

              <div className="flex flex-col gap-4 text-gray-300 text-sm md:text-base leading-relaxed space-y-3">
                <p>
                  I am Shouvik Das, a visionary UI/UX Architect, Spatial Web3D Developer, and digital media director based in India. My mission is to push the boundaries of modern web applications by fusing cinematic visual design with hardware-accelerated WebGL spatial computing and sub-50ms cloud performance.
                </p>
                <p>
                  Beyond engineering, my creative passions are anchored in three pillars: <strong className="text-white">Immersive Anime Lore</strong>, <strong className="text-white">Cinematographic Travel</strong>, and <strong className="text-white">World Gastronomy</strong>. I orchestrate a multi-platform content ecosystem with over 25,000+ dedicated followers across Anime Nation India and personal channels, producing deep narrative manga breakdowns, visual synchronization layers, and motion graphics.
                </p>
                <p>
                  As an end-to-end creative technologist, I excel in high-fidelity prototyping, advanced video editing & VFX, viral YouTube thumbnail architecture, and capturing stunning cinematography from scenic expeditions around the world.
                </p>
              </div>

              {/* Hobbies / Passions Row — animated icon cards */}
              <div className="flex flex-col gap-4">
                <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">THINGS I ABSOLUTELY LOVE:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { emoji: '✈️', label: 'Traveling', desc: 'Scenic spots & countries', color: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20' },
                    { emoji: '🎌', label: 'Anime', desc: 'Content & edits creator', color: 'from-primary/10 to-secondary/10 border-primary/20' },
                    { emoji: '🍜', label: 'Foodie', desc: 'Taste explorer', color: 'from-orange-500/10 to-amber-500/10 border-orange-500/20' },
                    { emoji: '🎬', label: 'Content', desc: 'Video & photography', color: 'from-green-500/10 to-emerald-500/10 border-green-500/20' },
                  ].map((hobby) => (
                    <div
                      key={hobby.label}
                      className={`p-3 rounded-xl bg-gradient-to-br ${hobby.color} border hover:scale-105 transition-transform duration-200 text-center flex flex-col items-center gap-1`}
                    >
                      <span className="text-2xl">{hobby.emoji}</span>
                      <span className="text-white text-xs font-bold font-mono">{hobby.label}</span>
                      <span className="text-gray-400 text-[9px] leading-tight">{hobby.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills with animated progress bars */}
              <div className="flex flex-col gap-4">
                <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">CREATIVE SKILLS ENGINE:</span>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'UI/UX Design', level: 92, icon: <Palette size={12} className="text-primary" /> },
                    { label: 'Web3D Development', level: 85, icon: <Compass size={12} className="text-secondary" /> },
                    { label: 'Photography & Videography', level: 88, icon: <Camera size={12} className="text-blue-400" /> },
                    { label: 'Video Editing', level: 90, icon: <Film size={12} className="text-green-400" /> },
                    { label: 'YouTube Thumbnail Art', level: 93, icon: <Star size={12} className="text-orange-400" /> },
                  ].map((skill) => (
                    <div key={skill.label} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-gray-300 flex items-center gap-1.5">{skill.icon} {skill.label}</span>
                        <span className="text-[10px] font-bold font-mono text-primary">{skill.level}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="skill-bar"
                          style={{ '--skill-level': `${skill.level}%` } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal Fun Facts block */}
              <div className="bg-[#05030e]/80 border border-white/8 rounded-2xl p-5 font-mono text-xs text-left">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-gray-500 ml-2 text-[10px]">shouvik@portfolio ~ stats</span>
                </div>
                <div className="space-y-1.5 text-gray-400">
                  <p><span className="text-primary">$</span> youtube_channels <span className="text-green-400">5</span></p>
                  <p><span className="text-primary">$</span> social_platforms <span className="text-green-400">8</span></p>
                  <p><span className="text-primary">$</span> projects_shipped <span className="text-green-400">7</span></p>
                  <p><span className="text-primary">$</span> countries_explored <span className="text-green-400">3+</span></p>
                  <p><span className="text-primary">$</span> total_subscribers <span className="text-green-400">1594+</span></p>
                  <p><span className="text-primary">$</span> status <span className="text-yellow-400 animate-pulse">"Available for hire ✓"</span></p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-2">
                <GlowButton href="/resume">
                  VIEW FULL RESUME / CV
                </GlowButton>
                <a 
                  href="/contact"
                  className="px-6 py-3.5 rounded-full border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 text-white font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  GET IN TOUCH
                </a>
              </div>

            </div>

          </div>

          {/* Social Platforms & Pages Directory */}
          <div className="border-t border-white/5 pt-20">
            <div className="flex flex-col items-center text-center mb-16 gap-3">
              <span className="text-xs font-bold text-primary font-mono tracking-widest uppercase animate-pulse">
                COMPLETE PLATFORMS DIRECTORY
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white">
                All My <span className="gradient-text-glow">12 Social Channels</span>
              </h2>
              <p className="text-gray-400 text-sm max-w-xl">
                I maintain active communities, vlogging spaces, and galleries. Here is the direct map to every single profile, with custom avatars and live feed links.
              </p>
              <div className="w-16 h-[2.5px] bg-primary rounded-full mt-2" />
            </div>

            <Suspense fallback={
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                <span className="text-sm font-bold font-mono text-primary animate-pulse">SYNCING LIVE SOCIAL FEEDS...</span>
              </div>
            }>
              <SocialDirectoryServer />
            </Suspense>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
