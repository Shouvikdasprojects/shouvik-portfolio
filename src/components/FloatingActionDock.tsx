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
  Sparkles, 
  ChevronUp,
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

  return (
    <aside aria-label="Quick Actions Dock" className="fixed bottom-6 right-6 z-40 print:hidden flex flex-col items-end gap-2">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            className="flex items-center gap-2 p-2 rounded-2xl bg-[#090614]/90 border border-white/10 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
          >
            {/* 1. Command Palette Trigger */}
            <button
              onClick={openCommandPalette}
              onMouseEnter={() => sfx.playHover()}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-primary/20 hover:border-primary/40 border border-white/5 text-gray-300 hover:text-white flex items-center gap-1.5 transition-all text-xs font-mono font-bold cursor-pointer group"
              title="Search Portfolio & Commands (⌘K)"
            >
              <Command size={13} className="text-primary group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">CMD</span>
              <kbd className="text-[9px] bg-black/40 px-1.5 py-0.5 rounded text-gray-400 border border-white/10">⌘K</kbd>
            </button>

            {/* 2. Sound Toggle */}
            <button
              onClick={toggleSound}
              onMouseEnter={() => sfx.playHover()}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isMuted
                  ? 'bg-white/5 border-white/5 text-gray-500 hover:text-white'
                  : 'bg-primary/10 border-primary/30 text-primary shadow-[0_0_12px_rgba(255,0,127,0.2)]'
              }`}
              title={isMuted ? 'Turn Sound FX ON' : 'Mute Sound FX'}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="animate-pulse" />}
            </button>

            {/* 3. Resume Link */}
            <Link
              href="/resume"
              onMouseEnter={() => sfx.playHover()}
              onClick={() => sfx.playClick()}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-secondary/20 hover:border-secondary/40 border border-white/5 text-gray-300 hover:text-white flex items-center gap-1.5 transition-all text-xs font-mono font-bold cursor-pointer"
              title="View Interactive Executive Resume"
            >
              <FileText size={13} className="text-secondary" />
              <span className="hidden sm:inline">CV / Resume</span>
            </Link>

            {/* 4. Contact Link */}
            <Link
              href="/contact"
              onMouseEnter={() => sfx.playHover()}
              onClick={() => sfx.playClick()}
              className="p-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(255,0,127,0.4)] flex items-center justify-center transition-all cursor-pointer"
              title="Send Direct Inquiry"
            >
              <Mail size={15} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand / Minimize Handle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-8 h-8 rounded-full bg-[#090614]/80 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center text-[10px] backdrop-blur transition-all cursor-pointer"
        title={isExpanded ? 'Minimize Dock' : 'Expand Quick Dock'}
      >
        {isExpanded ? <X size={12} /> : <Sparkles size={12} className="text-primary animate-pulse" />}
      </button>
    </aside>
  );
}
