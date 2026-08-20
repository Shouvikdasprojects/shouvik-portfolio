'use client';

import { useState, useEffect } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { sfx } from '@/lib/soundEffects';

export type CyberTheme = 
  | 'neon-pink' 
  | 'cyber-cyan' 
  | 'matrix-emerald' 
  | 'sunset-gold'
  | 'hyper-violet'
  | 'crimson-red'
  | 'toxic-lime'
  | 'ice-arctic';

const THEMES: { id: CyberTheme; name: string; color: string; desc: string }[] = [
  { id: 'neon-pink', name: 'Neon Pink', color: '#ff007f', desc: 'Signature Cyber Magenta' },
  { id: 'cyber-cyan', name: 'Cyber Cyan', color: '#00f0ff', desc: 'Electric Neo-Tokyo Blue' },
  { id: 'matrix-emerald', name: 'Matrix Emerald', color: '#00e676', desc: 'Terminal Code Green' },
  { id: 'sunset-gold', name: 'Sunset Gold', color: '#f59e0b', desc: 'Solar Flare Amber' },
  { id: 'hyper-violet', name: 'Hyper Violet', color: '#a855f7', desc: 'Synthwave Deep Purple' },
  { id: 'crimson-red', name: 'Crimson Red', color: '#ff003c', desc: 'Blood Moon Cyber Red' },
  { id: 'toxic-lime', name: 'Toxic Lime', color: '#ccff00', desc: 'Acid Chartreuse Neon' },
  { id: 'ice-arctic', name: 'Ice Arctic', color: '#38bdf8', desc: 'Glacier Diamond Frost' },
];

export default function ThemeAccentSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<CyberTheme>('neon-pink');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('shouvik_cyber_theme') as CyberTheme;
    if (saved && THEMES.some(t => t.id === saved)) {
      setCurrentTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const changeTheme = (theme: CyberTheme) => {
    sfx.playWarp();
    setCurrentTheme(theme);
    localStorage.setItem('shouvik_cyber_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: theme }));
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => {
          sfx.playClick();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => sfx.playHover()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/40 text-xs font-mono font-bold text-gray-300 hover:text-white transition-all cursor-pointer shadow-sm"
        title="Switch Cyber Glow Accent Theme"
      >
        <span
          className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm"
          style={{ backgroundColor: THEMES.find(t => t.id === currentTheme)?.color || '#ff007f' }}
        />
        <Palette size={12} className="text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#080415]/95 backdrop-blur-2xl border border-white/15 p-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.85)] z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2.5 py-1.5 text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 mb-1.5 flex items-center justify-between">
              <span>CYBER THEMES (8)</span>
              <Sparkles size={10} className="text-primary" />
            </div>

            <div className="grid grid-cols-1 gap-1 max-h-72 overflow-y-auto pr-1">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => changeTheme(theme.id)}
                  onMouseEnter={() => sfx.playHover()}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    currentTheme === theme.id
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-sm shrink-0"
                      style={{ backgroundColor: theme.color }}
                    />
                    <div className="text-left">
                      <div className="leading-tight">{theme.name}</div>
                      <div className="text-[9px] text-gray-500 font-sans">{theme.desc}</div>
                    </div>
                  </div>
                  {currentTheme === theme.id && <Check size={14} className="text-emerald-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
