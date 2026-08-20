'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, X, Calendar, Mail } from 'lucide-react';
import { sfx } from '@/lib/soundEffects';

export default function HireWidget() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-20 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* Expanded panel */}
      {expanded && (
        <div className="pointer-events-auto bg-[#0d0820]/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-5 w-64 shadow-[0_0_40px_rgba(255,0,127,0.2)] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AVAILABLE FOR HIRE
              </span>
              <p className="text-white font-bold text-sm">Let&apos;s Build Together</p>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed mb-4">
            Open to Web3D contracts, UI/UX collaborations, and creative tech projects.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/contact"
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs tracking-wider text-center flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,0,127,0.4)] cursor-pointer"
            >
              <Mail size={12} /> Send a Message
            </Link>
            <button
              onClick={() => {
                sfx.playWarp();
                setExpanded(false);
                window.dispatchEvent(new CustomEvent('open-booking-modal'));
              }}
              className="w-full py-2 rounded-xl border border-white/10 hover:border-primary/40 bg-white/5 hover:bg-white/10 text-white font-bold text-xs tracking-wider text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Calendar size={12} className="text-cyan-400" /> Book a Call
            </button>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-[9px] text-gray-600 hover:text-gray-400 mt-3 text-center w-full transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="pointer-events-auto group relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0d0820]/95 backdrop-blur-xl border border-primary/40 hover:border-primary text-white font-bold text-xs transition-all duration-300 shadow-[0_0_25px_rgba(255,0,127,0.3)] hover:shadow-[0_0_35px_rgba(255,0,127,0.5)] cursor-pointer"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <span>Available for Hire</span>
        <Sparkles size={12} className="text-primary animate-pulse" />
      </button>
    </div>
  );
}
