'use client';

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sfx } from '@/lib/soundEffects';
import { Sparkles, MessageSquareHeart } from 'lucide-react';

interface ArticleReactionsProps {
  slug: string;
}

const REACTIONS = [
  { id: 'mindblown', emoji: '🔥', label: 'Mindblown', color: '#ff007f', burst: ['#ff007f', '#ff7700', '#ffffff'] },
  { id: 'futuristic', emoji: '🚀', label: 'Futuristic', color: '#8b5cf6', burst: ['#8b5cf6', '#06b6d4', '#ffffff'] },
  { id: 'insightful', emoji: '💡', label: 'Insightful', color: '#eab308', burst: ['#eab308', '#f59e0b', '#ffffff'] },
  { id: 'loved', emoji: '💖', label: 'Loved It', color: '#ec4899', burst: ['#ec4899', '#f43f5e', '#ffffff'] },
];

export default function ArticleReactions({ slug }: ArticleReactionsProps) {
  const [counts, setCounts] = useState<Record<string, number>>({
    mindblown: 18,
    futuristic: 24,
    insightful: 14,
    loved: 31,
  });
  const [userReacted, setUserReacted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`shouvik_reactions_${slug}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserReacted(parsed.user || {});
        setCounts(prev => ({ ...prev, ...(parsed.counts || {}) }));
      }
    } catch {
      // ignore
    }
  }, [slug]);

  const handleReact = (id: string, burstColors: string[]) => {
    if (userReacted[id]) return;

    sfx.playChime();

    // Trigger colorful confetti burst
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.85 },
      colors: burstColors,
    });

    const nextCounts = { ...counts, [id]: (counts[id] || 0) + 1 };
    const nextUser = { ...userReacted, [id]: true };

    setCounts(nextCounts);
    setUserReacted(nextUser);

    try {
      localStorage.setItem(`shouvik_reactions_${slug}`, JSON.stringify({
        counts: nextCounts,
        user: nextUser,
      }));
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full rounded-3xl bg-[#0c0818]/90 border border-white/10 p-6 sm:p-8 my-12 text-center relative overflow-hidden backdrop-blur-xl shadow-2xl">
      <div className="flex flex-col items-center gap-2 mb-6">
        <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
          <MessageSquareHeart size={14} /> HOW DID THIS DISCOVERY HIT YOU?
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-white">
          Drop a Live Cyber Reaction
        </h3>
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {REACTIONS.map((r) => {
          const isClicked = !!userReacted[r.id];
          return (
            <button
              key={r.id}
              onClick={() => handleReact(r.id, r.burst)}
              onMouseEnter={() => sfx.playHover()}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-mono text-xs font-bold transition-all duration-300 cursor-pointer border ${
                isClicked
                  ? 'bg-primary/20 border-primary text-white shadow-[0_0_20px_rgba(255,0,127,0.35)] scale-105'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <span className="text-lg">{r.emoji}</span>
              <span>{r.label}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] text-gray-300 font-mono">
                {counts[r.id]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
