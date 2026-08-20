'use client';

import { useState, useEffect } from 'react';
import { ambientSound } from '@/lib/ambientSound';
import { Music, Radio } from 'lucide-react';
import { sfx } from '@/lib/soundEffects';

export default function AmbientAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = () => {
    sfx.playClick();
    const playing = ambientSound.toggle();
    setIsPlaying(playing);
  };

  return (
    <button
      onClick={toggleMusic}
      onMouseEnter={() => sfx.playHover()}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer text-xs font-mono font-bold ${
        isPlaying
          ? 'bg-primary/15 border-primary text-primary shadow-[0_0_15px_rgba(255,0,127,0.35)]'
          : 'bg-white/5 border-white/10 hover:border-primary/40 text-gray-400 hover:text-white'
      }`}
      title={isPlaying ? 'Pause Ambient Cyber Audio' : 'Play Ambient Cyber Audio'}
    >
      <Radio size={12} className={isPlaying ? 'animate-pulse text-primary' : 'text-gray-500'} />
      <span className="hidden sm:inline text-[11px]">{isPlaying ? 'LO-FI ON' : 'AMBIENT'}</span>

      {/* Dancing Equalizer Bars */}
      <div className="flex items-end gap-[2px] h-3">
        <span
          className={`w-[2px] rounded-full bg-current transition-all duration-300 ${
            isPlaying ? 'h-full animate-[pulse_0.6s_ease-in-out_infinite]' : 'h-[30%]'
          }`}
        />
        <span
          className={`w-[2px] rounded-full bg-current transition-all duration-300 ${
            isPlaying ? 'h-[75%] animate-[pulse_0.4s_ease-in-out_infinite_0.2s]' : 'h-[50%]'
          }`}
        />
        <span
          className={`w-[2px] rounded-full bg-current transition-all duration-300 ${
            isPlaying ? 'h-[90%] animate-[pulse_0.8s_ease-in-out_infinite_0.1s]' : 'h-[30%]'
          }`}
        />
      </div>
    </button>
  );
}
