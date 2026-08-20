'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Home, Layers, FileText, Mail, Bot, Terminal, Compass, ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';
import { sfx } from '@/lib/soundEffects';

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');
  const [countdown, setCountdown] = useState(20);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();

  // Automatic gentle countdown to return home (can be paused)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    sfx.playClick();
    router.push(`/articles?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const openTerminal = () => {
    sfx.playWarp();
    window.dispatchEvent(new CustomEvent('open-terminal'));
  };

  const openAIChat = () => {
    sfx.playWarp();
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
  };

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen pt-28 pb-20 flex flex-col items-center justify-center overflow-hidden bg-transparent px-6">
        {/* Ambient background glows */}
        <div className="ambient-glow -top-48 -left-48 bg-primary/20 pointer-events-none" />
        <div className="ambient-glow bottom-0 -right-48 bg-secondary/15 pointer-events-none" />
        <div className="ambient-glow top-1/2 left-1/3 bg-cyan-500/10 pointer-events-none" />

        {/* Floating animated radar pulses */}
        <div className="absolute top-1/4 left-1/5 w-2 h-2 rounded-full bg-primary/70 animate-ping" style={{ animationDuration: '2.5s' }} />
        <div className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-secondary/70 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-cyan-400/70 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />

        <div className="relative z-10 text-center flex flex-col items-center gap-6 max-w-2xl">
          
          {/* Big Glitching 404 Headline */}
          <div className="relative">
            <span className="text-[9rem] sm:text-[14rem] md:text-[16rem] font-black leading-none select-none tracking-tighter gradient-text-primary filter drop-shadow-[0_0_80px_rgba(255,0,127,0.35)] block">
              404
            </span>
            {/* Hologram scan line */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-pulse" />
            </div>
          </div>

          {/* Alert Status Pill */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono font-bold uppercase tracking-widest animate-pulse">
            <AlertTriangle size={13} />
            <span>SECTOR COORDINATES UNRESOLVED</span>
          </div>

          {/* Heading & Context */}
          <div className="flex flex-col gap-2.5">
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Lost in <span className="gradient-text-glow">Deep Space</span>?
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              The galaxy or route you requested does not exist or has been relocated. Search our real-time index or return to the mothership.
            </p>
          </div>

          {/* Interactive Search Bar on 404 */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-md relative flex items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, projects, topics..."
              className="w-full bg-[#0c0820]/90 border border-white/10 focus:border-primary px-4 py-3 pl-11 rounded-2xl text-xs sm:text-sm text-white placeholder:text-gray-500 focus:outline-none transition-all shadow-xl"
            />
            <Search size={16} className="absolute left-4 text-gray-500 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-2 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all shadow-[0_0_12px_rgba(255,0,127,0.3)] cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Terminal Diagnostic Box */}
          <div className="bg-[#05030e]/90 border border-white/10 rounded-2xl p-5 font-mono text-xs text-left w-full max-w-md shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/8">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-gray-500 text-[10px] ml-1">telemetry_diagnostic.log</span>
              </div>
              <span className="text-[10px] text-red-400 font-bold">ERR_404_PAGE_NOT_FOUND</span>
            </div>
            
            <div className="space-y-1.5 text-gray-400 text-[11px]">
              <p><span className="text-primary">$</span> status: <span className="text-yellow-400">404 (Resource Missing)</span></p>
              <p><span className="text-primary">$</span> engine: <span className="text-cyan-400">Next.js 16 App Router Edge</span></p>
              <p><span className="text-primary">$</span> auto_warp: <span className="text-emerald-400">Redirecting in {countdown}s</span> ({isPaused ? 'Paused' : 'Active'})</p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/5 flex justify-between items-center text-[10px]">
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="text-gray-400 hover:text-white underline cursor-pointer"
              >
                {isPaused ? '▶ Resume Auto-Redirect' : '⏸ Pause Countdown'}
              </button>
              <button
                type="button"
                onClick={openTerminal}
                className="text-primary hover:text-white flex items-center gap-1 cursor-pointer font-bold"
              >
                <Terminal size={11} /> Open CyberOS (~)
              </button>
            </div>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link
              href="/"
              onClick={() => sfx.playClick()}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_18px_rgba(255,0,127,0.35)] cursor-pointer"
            >
              <Home size={13} /> Return Home
            </Link>

            <Link
              href="/projects"
              onClick={() => sfx.playClick()}
              className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-primary/40 bg-white/5 hover:bg-primary/10 text-white font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Layers size={13} className="text-secondary" /> Explore Projects
            </Link>

            <Link
              href="/articles"
              onClick={() => sfx.playClick()}
              className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-primary/40 bg-white/5 hover:bg-primary/10 text-white font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Compass size={13} className="text-cyan-400" /> Read Discoveries
            </Link>

            <button
              onClick={openAIChat}
              className="px-5 py-2.5 rounded-xl border border-primary/30 hover:border-primary bg-primary/10 hover:bg-primary/20 text-white font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(255,0,127,0.2)]"
            >
              <Bot size={13} className="text-primary" /> Ask AI
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
