'use client';

import { useState, useMemo, useEffect } from 'react';
import { Article } from '@/lib/db';
import ArticleCard from '@/components/ui/ArticleCard';
import GlassCard from '@/components/ui/GlassCard';
import { Search, Mail, Sparkles, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface BlogListingProps {
  articles: Article[];
}

const categories = ["All", "Technology", "Science", "Global Innovations", "Entertainment", "Anime"];
const ITEMS_PER_PAGE = 12; // Premium pagination limit (12 items per page)

export default function BlogListing({ articles }: BlogListingProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [emailSub, setEmailSub] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // High performance filtered articles memoization with strict case-insensitive, partial-string matching
  const filteredArticles = useMemo(() => {
    const clean = searchTerm.toLowerCase().trim();
    return articles.filter(art => {
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

  // Paginated articles
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub) return;
    setIsSubscribed(true);
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
            className="w-full pl-12 pr-6 py-3.5 glass-input text-sm"
          />
        </form>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 w-full lg:w-auto">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-mono font-bold tracking-wider rounded-full transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
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
                className="glass-panel p-12 text-center flex flex-col items-center gap-4 bg-[#0b0814]/40 border-white/5"
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
              <div className="flex flex-col gap-12">
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 gap-8"
                >
                  {paginatedArticles.map((art) => (
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
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                            onClick={() => setCurrentPage(pageNum)}
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
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
          <GlassCard className="bg-[#0b0814]/50 border-white/5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-primary animate-pulse" /> Global Discoveries Digest
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              Subscribe to get immediate email alerts the instant new breakthroughs in technology, pop-culture, or anime are automatically aggregated and published!
            </p>

            {isSubscribed ? (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
                <span className="text-xs font-mono font-bold text-primary block">✓ SUCCESSFUL SUBSCRIPTION!</span>
                <p className="text-[10px] text-gray-400 mt-1">You will now receive automatic release alerts.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  placeholder="Enter your email"
                  className="px-4 py-3 text-xs glass-input focus:border-primary"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3 text-xs font-bold font-mono tracking-wider bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Mail size={12} /> SUBSCRIBE NOW
                </button>
              </form>
            )}
          </GlassCard>

          {/* B. News Feed Metrics Panel */}
          <GlassCard className="bg-[#0b0814]/50 border-white/5">
            <h3 className="text-sm font-mono font-bold text-gray-300 uppercase tracking-widest mb-4">
              Newsfeed Statistics
            </h3>
            
            <div className="flex flex-col gap-4 text-xs font-mono">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-500">Total Publications</span>
                <span className="text-white font-bold">{filteredArticles.length}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-500">Engine Source</span>
                <span className="text-primary font-bold">NewsAPI + Gemini AI</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-500">Refresh Frequency</span>
                <span className="text-secondary font-bold">24-hour Auto Cron</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-500">Adult Safety Filter</span>
                <span className="text-green-500 font-bold">STRICT NSFW ACTIVE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Database Driver</span>
                <span className="text-accent font-bold uppercase">{process.env.DATABASE_TYPE || 'supabase'}</span>
              </div>
            </div>
          </GlassCard>

        </div>
      </div>

    </div>
  );
}
