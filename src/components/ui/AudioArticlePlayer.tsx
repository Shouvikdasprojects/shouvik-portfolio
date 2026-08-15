'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, Square, Sparkles, FastForward } from 'lucide-react';
import { sfx } from '@/lib/soundEffects';

interface AudioArticlePlayerProps {
  title: string;
  content: string;
}

export default function AudioArticlePlayer({ title, content }: AudioArticlePlayerProps) {
  const [supported, setSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progress, setProgress] = useState(0);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const cleanTextRef = useRef<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
      // Strip HTML tags for clean narration
      const stripped = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      cleanTextRef.current = `${title}. ${stripped}`;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [title, content]);

  if (!supported) return null;

  const handlePlay = () => {
    sfx.playClick();
    if (typeof window === 'undefined') return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanTextRef.current);
    utterance.rate = playbackRate;
    utterance.pitch = 1;

    // Pick pleasant English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => (v.lang.includes('en-US') || v.lang.includes('en-GB')) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setProgress(5);
    };

    utterance.onboundary = (e) => {
      if (cleanTextRef.current.length > 0) {
        const pct = Math.min(100, Math.round((e.charIndex / cleanTextRef.current.length) * 100));
        setProgress(pct);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      sfx.playChime();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    sfx.playClick();
    if (typeof window !== 'undefined') {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    sfx.playClick();
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(0);
    }
  };

  const cyclePlaybackRate = () => {
    sfx.playHover();
    const rates = [1, 1.25, 1.5];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (isPlaying) {
      handlePlay();
    }
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-primary/10 via-[#0b0814]/90 to-secondary/10 border border-primary/25 p-4 sm:p-5 my-8 shadow-[0_0_30px_rgba(255,0,127,0.1)] relative overflow-hidden backdrop-blur-xl">
      {/* Dynamic progress fill bar */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary transition-all duration-300"
        style={{ width: `${progress}%` }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title and Voice Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(255,0,127,0.3)] shrink-0">
            <Volume2 size={18} className={isPlaying ? "animate-pulse text-white" : "text-primary"} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white tracking-wider">AI AUDIO NARRATOR</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-[9px] font-mono font-bold text-primary flex items-center gap-1 border border-primary/30">
                <Sparkles size={10} /> ZERO-LAG TTS
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">
              {isPlaying ? "Narrating article in real-time..." : isPaused ? "Playback paused." : "Listen to this discovery hands-free."}
            </p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Speed Button */}
          <button
            onClick={cyclePlaybackRate}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono font-bold text-gray-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
            title="Adjust Speech Speed"
          >
            <FastForward size={12} /> {playbackRate}x
          </button>

          {/* Play / Pause Toggle */}
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,0,127,0.35)] transition-all cursor-pointer"
            >
              <Play size={13} fill="currentColor" /> {isPaused ? "RESUME" : "LISTEN NOW"}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-4 py-1.5 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Pause size={13} fill="currentColor" /> PAUSE
            </button>
          )}

          {/* Stop Button */}
          {(isPlaying || isPaused) && (
            <button
              onClick={handleStop}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
              title="Stop Narration"
            >
              <Square size={13} fill="currentColor" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
