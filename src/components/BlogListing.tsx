'use client';

import { useState, useMemo, useEffect } from 'react';
import { Article } from '@/lib/db';
import ArticleCard from '@/components/ui/ArticleCard';
import GlassCard from '@/components/ui/GlassCard';
import FeaturedArticleHero from '@/components/ui/FeaturedArticleHero';
import { Search, Mail, Sparkles, Filter, ChevronLeft, ChevronRight, CheckCircle2, Bookmark, Flame, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { sfx } from '@/lib/soundEffects';
import { getSavedArticleSlugs } from '@/lib/bookmarkStore';

interface BlogListingProps {
  articles: Article[];
}

const CATEGORIES = ["All", "Technology", "Science", "Global Innovations", "Entertainment", "Anime"];
const TRENDING_TAGS = ["#NextJS16", "#SpatialWeb3D", "#AIInnovations", "#AnimeLore", "#GlobalScience", "#VFXMotion"];
const ITEMS_PER_PAGE = 12;

export default function BlogListing({ articles }: BlogListingProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [emailSub, setEmailSub] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    setSavedSlugs(getSavedArticleSlugs());
    const handleBookmarkSync = () => {
      setSavedSlugs(getSavedArticleSlugs());
    };
    window.addEventListener('bookmarks-updated', handleBookmarkSync);
    return () => window.removeEventListener('bookmarks-updated', handleBookmarkSync);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory, showBookmarksOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      sfx.playClick();
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleTagClick = (tag: string) => {
    sfx.playClick();
    const cleanTag = tag.replace('#', '');
    setSearchTerm(cleanTag);
    setShowBookmarksOnly(false);
  };

  const filteredArticles = useMemo(() => {
    const sorted = [...articles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    const clean = searchTerm.toLowerCase().trim();

    return sorted.filter(art => {
      if (showBookmarksOnly && !savedSlugs.includes(art.slug)) {
        return false;
      }

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
  }, [articles, searchTerm, activeCategory, showBookmarksOnly, savedSlugs]);

  // Featured top article when in default view
  const featuredArticle = useMemo(() => {
    if (searchTerm || activeCategory !== "All" || showBookmarksOnly || articles.length === 0) {
      return null;
    }
    return articles[0];
  }, [articles, searchTerm, activeCategory, showBookmarksOnly]);

  // List of articles for grid (excludes featured article on page 1 if shown)
  const gridArticles = useMemo(() => {
    if (featuredArticle && currentPage === 1) {
      return filteredArticles.filter(a => a.slug !== featuredArticle.slug);
    }
    return filteredArticles;
  }, [filteredArticles, featuredArticle, currentPage]);

  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return gridArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [gridArticles, currentPage]);

  const totalPages = Math.max(1, Math.ceil(gridArticles.length / ITEMS_PER_PAGE));

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
    <div className="w-full">
      
      {/* 1. FEATURED COVER STORY (When in standard view) */}
      {featuredArticle && (
        <FeaturedArticleHero article={featuredArticle} />
      )}

      <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
        
        {/* 2. SEARCH & CATEGORIES CONTROLS BAR */}
        <div className="flex flex-col gap-6 mb-10">
          
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Search Bar with live filter */}
            <form onSubmit={handleSearchSubmit} className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles, topics, keywords..."
                className="w-full pl-12 pr-6 py-3.5 glass-input text-sm rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-primary/50"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-500 hover:text-white"
                >
                  CLEAR
                </button>
              )}
            </form>

            {/* Categories & Bookmark Selector */}
            <div className="flex flex-wrap justify-center items-center gap-2 w-full lg:w-auto">
              {CATEGORIES.map((cat) => {
                const isActive = !showBookmarksOnly && activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      sfx.playClick();
                      setShowBookmarksOnly(false);
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

              {/* Saved Bookmarks Tab */}
              <button
                onClick={() => {
                  sfx.playClick();
                  setShowBookmarksOnly(!showBookmarksOnly);
                }}
                onMouseEnter={() => sfx.playHover()}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                  showBookmarksOnly 
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]' 
                    : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Bookmark size={12} fill={showBookmarksOnly ? "currentColor" : "none"} />
                SAVED ({savedSlugs.length})
              </button>
            </div>
          </div>

          {/* Trending Topic Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
            <span className="text-[11px] font-mono font-bold text-gray-500 flex items-center gap-1">
              <Flame size={12} className="text-primary" /> TRENDING TOPICS:
            </span>
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                onMouseEnter={() => sfx.playHover()}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-primary/15 border border-white/5 hover:border-primary/30 text-[11px] font-mono text-gray-400 hover:text-primary transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>

        {/* 3. BLOG CONTENT GRID & SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Articles Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <AnimatePresence mode="popLayout">
              {paginatedArticles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass-panel p-12 text-center flex flex-col items-center gap-4 bg-[#0b0814]/40 border-white/5 rounded-3xl"
                >
                  <Filter size={32} className="text-primary animate-pulse" />
                  <span className="font-mono text-white text-sm font-bold tracking-widest uppercase">
                    {showBookmarksOnly ? "NO SAVED ARTICLES FOUND" : "NO ARTICLES FOUND"}
                  </span>
                  <p className="text-gray-400 text-xs max-w-sm leading-relaxed">
                    {showBookmarksOnly 
                      ? "You haven't bookmarked any discoveries yet. Click the 🔖 bookmark icon on any article to save it for offline reading!"
                      : `We couldn't find any articles matching "${searchTerm}". Try browsing by category or clear your search.`
                    }
                  </p>
                  {(searchTerm || showBookmarksOnly) && (
                    <button
                      onClick={() => {
                        sfx.playClick();
                        setSearchTerm("");
                        setShowBookmarksOnly(false);
                        setActiveCategory("All");
                      }}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold cursor-pointer transition-all"
                    >
                      RESET FILTERS
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 gap-8"
                >
                  {paginatedArticles.map((art) => (
                    <motion.div
                      key={art.slug}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <ArticleCard article={art} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-8 pt-6 border-t border-white/10">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    sfx.playClick();
                    setCurrentPage(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 text-white transition-all cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="font-mono text-xs text-gray-400">
                  PAGE <strong className="text-white">{currentPage}</strong> OF <strong className="text-white">{totalPages}</strong>
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    sfx.playClick();
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 text-white transition-all cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Column: Topics, Newsletter & Author (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* 1. Newsletter Box */}
            <GlassCard className="p-6 bg-[#0b0814]/40 border-white/5 rounded-3xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/20 text-primary border border-primary/30 shadow-[0_0_12px_rgba(255,0,127,0.3)]">
                  <Mail size={18} />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-white leading-tight">Neural Dispatch</h3>
                  <span className="text-[10px] font-mono text-gray-400">Bi-hourly automated briefings</span>
                </div>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed text-left mb-5">
                Receive fresh AI-summarized tech, science, and anime digests directly in your inbox. Zero spam.
              </p>

              {isSubscribed ? (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono">
                  <CheckCircle2 size={16} />
                  <span>TRANSMISSION CONFIRMED! CHECK INBOX.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                  <input
                    type="email"
                    required
                    value={emailSub}
                    onChange={(e) => setEmailSub(e.target.value)}
                    placeholder="Enter your email coordinates..."
                    className="w-full px-4 py-3 glass-input text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white font-mono font-bold text-xs tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(255,0,127,0.3)]"
                  >
                    SUBSCRIBE DISPATCH
                  </button>
                </form>
              )}
            </GlassCard>

            {/* 2. Publication Hub Information */}
            <GlassCard className="p-6 bg-[#0b0814]/40 border-white/5 rounded-3xl text-left">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase tracking-wider mb-3">
                <Sparkles size={14} /> AI AUTOMATION ARCHITECTURE
              </div>
              <p className="text-gray-400 text-xs leading-relaxed space-y-2 mb-4">
                This blog runs on an autonomous news ingestor orchestrating <strong className="text-white">Google Gemini AI</strong> and <strong className="text-white">Supabase PostgreSQL</strong>.
              </p>
              <div className="flex flex-col gap-2 text-[11px] font-mono text-gray-400">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Engine:</span>
                  <span className="text-white">Next.js 16 + Gemini 2.5</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Revalidation:</span>
                  <span className="text-primary">60s ISR Real-time</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Live Articles:</span>
                  <span className="text-emerald-400 font-bold">{articles.length} Published</span>
                </div>
              </div>
            </GlassCard>

          </div>

        </div>

      </div>
    </div>
  );
}
