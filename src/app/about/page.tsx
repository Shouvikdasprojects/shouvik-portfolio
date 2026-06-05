import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/ui/GlassCard';
import GlowButton from '@/components/ui/GlowButton';
import SafeImage from '@/components/ui/SafeImage';
import { personalInfo } from '@/lib/realData';
import SocialDirectoryServer from './SocialDirectoryServer';
import { Mail, Compass, Star, Heart, Camera, Film, Palette, MapPin, Link2 } from 'lucide-react';
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
        <div className="ambient-glow -top-48 -left-48 bg-[#ff007f]/15 pointer-events-none" />
        <div className="ambient-glow top-1/2 -right-48 bg-[#8b5cf6]/10 pointer-events-none" />
        <div className="ambient-glow bottom-0 left-1/4 bg-blue-500/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16 gap-3">
            <span className="text-xs font-bold text-[#ff007f] font-mono tracking-[0.2em] uppercase animate-pulse">
              GET TO KNOW ME
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              About <span className="gradient-text-primary">Shouvik Das</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
              A passionate UI/UX Designer & Web3D Developer based in India. Exploring the world, creating anime universes, and crafting next-generation spatial web experiences.
            </p>
            <div className="w-24 h-[3px] bg-gradient-to-r from-[#ff007f] via-pink-500 to-[#8b5cf6] rounded-full mt-4" />
          </div>

          {/* Core Profile & Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            
            {/* Left Column: Portrait Card with premium 3D Tilt */}
            <div className="lg:col-span-5 flex justify-center">
              <Suspense fallback={
                <div className="w-full max-w-[380px] aspect-[4/5] rounded-xl bg-[#0b0814]/65 border border-white/5 flex items-center justify-center shadow-2xl relative">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff007f]"></div>
                </div>
              }>
                <TiltCard className="w-full max-w-[380px] p-4 bg-[#0b0814]/65 border-white/5 shadow-2xl relative group">
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
                      <MapPin size={12} className="text-[#ff007f]" />
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
                  <Compass className="text-[#ff007f]" size={24} /> My Creative Journey & Passions
                </h2>
                <div className="w-16 h-[2px] bg-[#ff007f]" />
              </div>

              <div className="flex flex-col gap-4 text-gray-300 text-sm md:text-base leading-relaxed space-y-4">
                <p>
                  Hi, I'm Shouvik Das, a tech enthusiast, visual storyteller, and Web3D developer from India. My work lies at the intersection of stunning visual design and interactive frontend technologies. I build high-performance, immersive environments that run smoothly across devices.
                </p>
                <p>
                  My heart belongs to three things: Adventure, Anime, and Gastronomy. I love traveling to scenic spots, exploring new cultures, and dreaming about visiting foreign countries. I am an avid reader of Manga and Manhwa, and the mind behind 3 active anime YouTube channels. There, I create in-depth manga explanation videos, custom edits, synchronization layers, and digital graphics.
                </p>
                <p>
                  As a creator, I am highly proficient in Photography & Videography, crafting high-end Video Editing sequences, and designing viral YouTube Thumbnails that grab attention instantly. And yes—I'm an absolute foodie who loves exploring local food joints and trying out new cuisines!
                </p>
              </div>

              {/* Hobbies / Passions Row */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">THINGS I ABSOLUTELY LOVE:</span>
                <div className="flex flex-wrap gap-2.5">
                  {personalInfo.aboutDetails.hobbies.map((hobby, idx) => (
                    <div 
                      key={idx} 
                      className="px-4 py-2 rounded-full border border-white/5 bg-white/5 hover:border-[#ff007f]/40 hover:bg-[#ff007f]/5 text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Heart size={12} className="text-[#ff007f]" /> {hobby}
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Row */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">CREATIVE SKILLS ENGINE:</span>
                <div className="flex flex-wrap gap-2.5">
                  <div className="px-3.5 py-1.5 rounded-lg bg-[#ff007f]/10 border border-[#ff007f]/25 text-white text-xs font-mono flex items-center gap-1">
                    <Palette size={12} className="text-[#ff007f]" /> UI/UX Design
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/25 text-white text-xs font-mono flex items-center gap-1">
                    <Compass size={12} className="text-[#8b5cf6]" /> Web3D (Three.js/R3F)
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/25 text-white text-xs font-mono flex items-center gap-1">
                    <Camera size={12} className="text-blue-400" /> Photography
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-green-500/10 border border-green-500/25 text-white text-xs font-mono flex items-center gap-1">
                    <Film size={12} className="text-green-400" /> Video Editing
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/25 text-white text-xs font-mono flex items-center gap-1">
                    <Star size={12} className="text-orange-400" /> Thumbnail Art
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Social Platforms & Pages Directory */}
          <div className="border-t border-white/5 pt-20">
            <div className="flex flex-col items-center text-center mb-16 gap-3">
              <span className="text-xs font-bold text-[#ff007f] font-mono tracking-widest uppercase">
                COMPLETE PLATFORMS DIRECTORY
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white">
                All My <span className="gradient-text-glow">12 Social Channels</span>
              </h2>
              <p className="text-gray-400 text-sm max-w-xl">
                I maintain active communities, vlogging spaces, and galleries. Here is the direct map to every single profile, with custom avatars and live feed links.
              </p>
              <div className="w-16 h-[2.5px] bg-[#ff007f] rounded-full mt-2" />
            </div>

            <Suspense fallback={
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff007f]"></div>
                <span className="text-sm font-bold font-mono text-[#ff007f] animate-pulse">SYNCING LIVE SOCIAL FEEDS...</span>
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
