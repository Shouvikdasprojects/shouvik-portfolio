'use client';

import { useState, useMemo, useEffect } from 'react';
import { Article } from '@/lib/db';
import ArticleCard from '@/components/ui/ArticleCard';
import GlassCard from '@/components/ui/GlassCard';
import { Search, Mail, Sparkles, Filter, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { sfx } from '@/lib/soundEffects';

interface BlogListingProps {
  articles: Article[];
}

const categories = ["All", "Technology", "Science", "Global Innovations", "Entertainment", "Anime"];
const ITEMS_PER_PAGE = 12;

export default function BlogListing({ articles }: BlogListingProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [emailSub, setEmailSub] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      sfx.playClick();
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const filteredArticles = useMemo(() => {
    const sorted = [...articles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    const clean = searchTerm.toLowerCase().trim();
    return sorted.filter(art => {
      const matchesSearch = !clean ||
        art.title.toLowerCase().includes(clean) || 
        art.description.toLowerCase().includes(clean) || 
        art.content.toLowerCase().includes(clean) ||
        art.category.toLowerCase().includes(clean) ||
        art.source.toLowerCase().includes(clean);
        
      const matchesCategory = 
        activeCategory === "All" || 
        art.category.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchTerm, activeCategory]);

  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub.trim()) return;
    
    sfx.playChime();
    setIsSubscribed(true);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('shouvik_blog_sub_email', emailSub.trim());
    }

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ff007f', '#8b5cf6', '#0ea5e9']
    });

    setEmailSub("");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      
      {/* 1. Header Search Controls Grid */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12">
        
        {/* Search Input wrapped in Form with active live filtering */}
        <form onSubmit={handleSearchSubmit} className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles, releases, tags..."
            className="w-full pl-12 pr-6 py-3.5 glass-input text-sm rounded-xl"
          />
        </form>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 w-full lg:w-auto">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  sfx.playClick();
                  setActiveCategory(cat);
                }}
                onMouseEnter={() => sfx.playHover()}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_15px_rgba(255,0,127,0.35)]' 
                    : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Blog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Content Area: Articles Column */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <AnimatePresence mode="popLayout">
            {paginatedArticles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-panel p-12 text-center flex flex-col items-center gap-4 bg-[#0b0814]/40 border-white/5 rounded-2xl"
              >
                <Filter size={32} className="text-gray-500 animate-pulse" />
                <span className="font-mono text-gray-400 text-sm tracking-widest">
                  NO ARTICLES FOUND
                </span>
                <p className="text-gray-500 text-xs max-w-xs">
                  We couldn't find any articles matching "{searchTerm}" under {activeCategory}. Try modifying your keywords!
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-8">

                {/* Featured Hero Article — first and newest */}
                {currentPage === 1 && paginatedArticles[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-2xl overflow-hidden border border-white/10 group cursor-pointer shadow-2xl"
                  >
                    <div className="relative h-64 md:h-72 w-full bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={paginatedArticles[0].image}
                        alt={paginatedArticles[0].title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#040209] via-[#040209]/60 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#040209]/60 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-primary text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {paginatedArticles[0].category}
                        </span>
                        <span className="badge-new">FEATURED</span>
                      </div>
                      <a href={`/articles/${paginatedArticles[0].slug}`}>
                        <h2 className="text-xl md:text-2xl font-black text-white hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
                          {paginatedArticles[0].title}
                        </h2>
                      </a>
                      <p className="text-gray-300 text-sm line-clamp-2 mb-4 max-w-2xl">{paginatedArticles[0].description}</p>
                      <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400">
                        <span>via {paginatedArticles[0].source}</span>
                        <span>•</span>
                        <span>{new Date(paginatedArticles[0].publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 gap-8"
                >
                  {paginatedArticles.slice(currentPage === 1 ? 1 : 0).map((art) => (
                    <motion.div
                      key={art.slug}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ArticleCard article={art} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Premium Glassmorphism Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4 py-4 border-t border-white/5">
                    <button
                      onClick={() => {
                        sfx.playClick();
                        setCurrentPage(prev => Math.max(prev - 1, 1));
                      }}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-white/5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 cursor-pointer text-xs font-mono font-bold"
                    >
                      <ChevronLeft size={14} /> PREV
                    </button>
                    
                    <div className="flex gap-1.5 items-center font-mono text-xs font-bold text-gray-400">
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const pageNum = index + 1;
                        const isCurrent = currentPage === pageNum;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => {
                              sfx.playClick();
                              setCurrentPage(pageNum);
                            }}
                            className={`w-8 h-8 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                              isCurrent
                                ? 'bg-gradient-to-r from-primary to-secondary border-transparent text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                                : 'border-white/5 bg-white/5 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => {
                        sfx.playClick();
                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                      }}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-white/5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 cursor-pointer text-xs font-mono font-bold"
                    >
                      NEXT <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Panel: Discover Newsletter & Dynamic Actions */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* A. Premium newsletter card */}
          <GlassCard className="bg-[#0b0814]/50 border-white/5 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-primary animate-pulse" /> Global Discoveries Digest
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              Subscribe to get immediate email alerts the instant new breakthroughs in technology, pop-culture, or anime are automatically aggregated and published!
            </p>

            {isSubscribed ? (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-center">
                <span className="text-xs font-mono font-bold text-primary flex items-center justify-center gap-1">
                  <CheckCircle2 size={14} /> SUCCESSFUL SUBSCRIPTION!
                </span>
                <p className="text-[10px] text-gray-400 mt-1">You will now receive automatic release alerts.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  placeholder="Enter your email"
                  className="px-4 py-3 text-xs glass-input focus:border-primary rounded-xl"
                  required
                />
                <button
                  type="submit"
                  onMouseEnter={() => sfx.playHover()}
                  className="w-full py-3 text-xs font-bold font-mono tracking-wider bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(255,0,127,0.3)]"
                >
                  <Mail size={12} /> SUBSCRIBE NOW
                </button>
              </form>
            )}
          </GlassCard>

          {/* B. News Feed Metrics Panel */}
          <GlassCard className="bg-[#0b0814]/50 border-white/5 p-6 rounded-2xl">
            <h3 className="text-sm font-mono font-bold text-gray-300 uppercase tracking-widest mb-4">
              Autonomous Aggregation Engine
            </h3>
            <div className="space-y-3 font-mono text-xs text-gray-400">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span>Cron Frequency:</span>
                <span className="text-green-400 font-bold">Daily @ 03:00 UTC</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span>AI Enhancement:</span>
                <span className="text-primary font-bold">Gemini 2.5 Flash</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Global Sources:</span>
                <span className="text-cyan-400 font-bold">NewsAPI & RSS</span>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>
    </div>
  );
}
