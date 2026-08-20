'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Command, 
  Volume2, 
  VolumeX, 
  FileText, 
  Mail, 
  Calendar,
  Sparkles, 
  X 
} from 'lucide-react';
import { sfx } from '@/lib/soundEffects';

export default function FloatingActionDock() {
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    setIsMuted(sfx.getMuted());
  }, []);

  const toggleSound = () => {
    const next = sfx.toggleMute();
    setIsMuted(next);
  };

  const openCommandPalette = () => {
    sfx.playWarp();
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  const openBookingModal = () => {
    sfx.playWarp();
    window.dispatchEvent(new CustomEvent('open-booking-modal'));
  };

  return (
    <aside aria-label="Quick Actions Dock" className="fixed bottom-6 right-6 z-40 print:hidden flex flex-col items-end gap-2">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            className="flex items-center gap-2 p-2 rounded-2xl bg-[#090614]/92 border border-white/12 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.7)]"
          >
            {/* 1. Available for Hire Pulse Pill */}
            <Link
              href="/contact"
              onMouseEnter={() => sfx.playHover()}
              onClick={() => sfx.playClick()}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
              title="Shouvik is available for new contracts"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="hidden sm:inline">Hire Me</span>
            </Link>

            {/* 2. Book Call (1-Click Meeting) */}
            <button
              onClick={openBookingModal}
              onMouseEnter={() => sfx.playHover()}
              className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/40 border border-white/5 text-gray-300 hover:text-white flex items-center gap-1.5 transition-all text-xs font-mono font-bold cursor-pointer"
              title="Schedule 1-on-1 Discovery Call"
            >
              <Calendar size={13} className="text-cyan-400" />
              <span className="hidden md:inline">Book Call</span>
            </button>

            {/* 3. Command Palette Trigger */}
            <button
              onClick={openCommandPalette}
              onMouseEnter={() => sfx.playHover()}
              className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-primary/20 hover:border-primary/40 border border-white/5 text-gray-300 hover:text-white flex items-center gap-1.5 transition-all text-xs font-mono font-bold cursor-pointer group"
              title="Search Portfolio & Commands (⌘K)"
            >
              <Command size={13} className="text-primary group-hover:rotate-12 transition-transform" />
              <span className="hidden lg:inline">CMD</span>
              <kbd className="text-[9px] bg-black/40 px-1 py-0.5 rounded text-gray-400 border border-white/10">⌘K</kbd>
            </button>

            {/* 4. Sound Toggle */}
            <button
              onClick={toggleSound}
              onMouseEnter={() => sfx.playHover()}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isMuted
                  ? 'bg-white/5 border-white/5 text-gray-500 hover:text-white'
                  : 'bg-primary/10 border-primary/30 text-primary shadow-[0_0_12px_rgba(255,0,127,0.2)]'
              }`}
              title={isMuted ? 'Turn Sound FX ON' : 'Mute Sound FX'}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="animate-pulse" />}
            </button>

            {/* 5. Resume Link */}
            <Link
              href="/resume"
              onMouseEnter={() => sfx.playHover()}
              onClick={() => sfx.playClick()}
              className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-secondary/20 hover:border-secondary/40 border border-white/5 text-gray-300 hover:text-white flex items-center gap-1.5 transition-all text-xs font-mono font-bold cursor-pointer"
              title="View Interactive Executive Resume"
            >
              <FileText size={13} className="text-secondary" />
              <span className="hidden md:inline">CV</span>
            </Link>

            {/* 6. Contact Link */}
            <Link
              href="/contact"
              onMouseEnter={() => sfx.playHover()}
              onClick={() => sfx.playClick()}
              className="p-2 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(255,0,127,0.4)] flex items-center justify-center transition-all cursor-pointer"
              title="Send Direct Message"
            >
              <Mail size={14} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand / Minimize Handle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-7 h-7 rounded-full bg-[#090614]/80 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center text-[10px] backdrop-blur transition-all cursor-pointer shadow-md"
        title={isExpanded ? 'Minimize Quick Dock' : 'Expand Quick Dock'}
      >
        {isExpanded ? <X size={11} /> : <Sparkles size={11} className="text-primary animate-pulse" />}
      </button>
    </aside>
  );
}
