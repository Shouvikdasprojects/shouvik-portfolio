'use client';

import { useState } from 'react';
import { Article } from '@/lib/db';
import { Heart, UserPlus, Share2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [likes, setLikes] = useState(article.likes);
  const [isLiked, setIsLiked] = useState(false);
  
  const [followers, setFollowers] = useState(article.followers);
  const [isFollowed, setIsFollowed] = useState(false);
  
  const [shares, setShares] = useState(article.shares);
  const [isShared, setIsShared] = useState(false);

  // Sync click events to database using API routes
  const handleInteraction = async (action: 'likes' | 'followers' | 'shares') => {
    // 1. Optimistic updates
    if (action === 'likes') {
      if (isLiked) return;
      setIsLiked(true);
      setLikes(prev => prev + 1);
      // Nice heart confetti burst!
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.2, y: 0.8 },
        colors: ['#ec4899', '#f472b6', '#ffffff']
      });
    } else if (action === 'followers') {
      if (isFollowed) return;
      setIsFollowed(true);
      setFollowers(prev => prev + 1);
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 0.8, y: 0.8 },
        colors: ['#a855f7', '#c084fc', '#ffffff']
      });
    } else if (action === 'shares') {
      if (isShared) return;
      setIsShared(true);
      setShares(prev => prev + 1);
      
      // Copy to clipboard helper
      const url = `${window.location.origin}/articles/${article.slug}`;
      navigator.clipboard.writeText(url);
      alert("📋 Article link copied to clipboard! Share it with your friends!");

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#0ea5e9', '#38bdf8', '#ffffff']
      });
    }

    // 2. Persist to Supabase / MongoDB via API route
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: article.slug,
          action,
        }),
      });

      const res = await response.json();
      if (!res.success) {
        console.error("Interaction save failed in DB:", res.error);
      }
    } catch (error) {
      console.error("API call error while updating interactions:", error);
    }
  };

  return (
    <div className="glass-panel flex flex-col h-full bg-[#0b0814]/40 border-white/5 overflow-hidden group transition-all duration-300 hover:scale-[1.01]">
      {/* 1. Article Cover Image */}
      <div className="relative w-full h-48 rounded-t-xl overflow-hidden bg-slate-900 border-b border-white/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute top-4 left-4 bg-primary/95 text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
          {article.category}
        </div>
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-[9px] text-gray-300 font-mono px-2.5 py-1 rounded">
          {new Date(article.publishedAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>

      {/* 2. Body Details */}
      <div className="p-6 flex flex-col flex-grow justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold text-gray-500 font-mono">SOURCE: {article.source.toUpperCase()}</span>
          <Link href={`/articles/${article.slug}`}>
            <h3 className="text-xl font-bold text-white hover:text-primary transition-colors cursor-pointer mt-1 mb-2 line-clamp-2 leading-snug">
              {article.title}
            </h3>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
            {article.description}
          </p>
        </div>

        {/* 3. Discover Interactive Actions Area */}
        <div className="border-t border-white/5 pt-4 mt-auto">
          <div className="flex justify-between items-center gap-4">
            
            {/* LIKES, FOLLOWS, SHARES buttons */}
            <div className="flex gap-4 items-center">
              
              {/* Heart/Like Button */}
              <button 
                onClick={() => handleInteraction('likes')}
                className={`flex items-center gap-1 text-xs font-mono transition-colors cursor-pointer ${
                  isLiked ? 'text-pink-500 font-semibold' : 'text-gray-400 hover:text-pink-500'
                }`}
                aria-label="Like article"
              >
                <Heart size={14} className={isLiked ? 'fill-pink-500' : ''} />
                <span>{likes}</span>
              </button>

              {/* Follow Button */}
              <button 
                onClick={() => handleInteraction('followers')}
                className={`flex items-center gap-1 text-xs font-mono transition-colors cursor-pointer ${
                  isFollowed ? 'text-purple-400 font-semibold' : 'text-gray-400 hover:text-purple-400'
                }`}
                aria-label="Follow author"
              >
                <UserPlus size={14} />
                <span>{isFollowed ? 'Following' : followers}</span>
              </button>

              {/* Share Button */}
              <button 
                onClick={() => handleInteraction('shares')}
                className={`flex items-center gap-1 text-xs font-mono transition-colors cursor-pointer ${
                  isShared ? 'text-sky-400 font-semibold' : 'text-gray-400 hover:text-sky-400'
                }`}
                aria-label="Share article"
              >
                <Share2 size={14} />
                <span>{shares}</span>
              </button>

            </div>

            {/* Read Article Anchor */}
            <Link 
              href={`/articles/${article.slug}`}
              className="text-primary hover:text-accent text-xs font-bold font-mono flex items-center gap-0.5 group cursor-pointer"
            >
              Read Full <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
