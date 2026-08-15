'use client';

import { Article } from '@/lib/db';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { Calendar, Clock, Bookmark, ArrowRight, Sparkles, Flame } from 'lucide-react';
import { sfx } from '@/lib/soundEffects';
import { isArticleSaved, toggleArticleSaved } from '@/lib/bookmarkStore';
import { useState, useEffect } from 'react';

interface FeaturedArticleHeroProps {
  article: Article;
}

export default function FeaturedArticleHero({ article }: FeaturedArticleHeroProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isArticleSaved(article.slug));
    const handleSync = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.slug === article.slug) {
        setSaved(custom.detail.saved);
      }
    };
    window.addEventListener('bookmarks-updated', handleSync);
    return () => window.removeEventListener('bookmarks-updated', handleSync);
  }, [article.slug]);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sfx.playClick();
    const nextState = toggleArticleSaved(article.slug);
    setSaved(nextState);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c0818] via-[#090614] to-[#120a22] border border-primary/25 p-6 sm:p-10 lg:p-12 shadow-[0_0_60px_rgba(255,0,127,0.12)] group">
        
        {/* Glow corner elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Cover Story Info (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5 text-left">
            
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,0,127,0.3)]">
                <Flame size={13} className="text-primary animate-pulse" /> FEATURED DISCOVERY
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                <Clock size={12} className="text-secondary" /> 3 min read
              </span>
            </div>

            {/* Title */}
            <Link href={`/articles/${article.slug}`} onClick={() => sfx.playWarp()}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-black text-white leading-[1.18] tracking-tight group-hover:text-primary transition-colors">
                {article.title}
              </h2>
            </Link>

            {/* Description */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3">
              {article.description}
            </p>

            {/* Author and Action Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
              
              {/* Author Pill */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/40 p-0.5 bg-slate-900 shrink-0">
                  <SafeImage
                    src="/assets/shouvik.jpg"
                    alt="Shouvik Das"
                    className="w-full h-full object-cover rounded-full"
                    fallbackSrc="/assets/shouvik.jpg"
                  />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-white flex items-center gap-1">
                    Shouvik Das <span className="text-[10px] text-primary">✓</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                    <Calendar size={10} /> {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBookmarkToggle}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    saved 
                      ? 'bg-primary/20 border-primary text-primary shadow-[0_0_12px_rgba(255,0,127,0.3)]' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  title={saved ? "Remove Bookmark" : "Save for Later"}
                >
                  <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
                </button>

                <Link
                  href={`/articles/${article.slug}`}
                  onClick={() => sfx.playWarp()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white font-mono font-bold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,127,0.35)] transition-all cursor-pointer"
                >
                  READ DEEP DIVE <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Cinematic Image Card (5 cols) */}
          <div className="lg:col-span-5 relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden border border-white/10 group-hover:border-primary/40 transition-all shadow-2xl">
            <Link href={`/articles/${article.slug}`} onClick={() => sfx.playWarp()}>
              <SafeImage
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                fallbackSrc="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040209]/80 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-cyan-400">
                via {article.source}
              </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
