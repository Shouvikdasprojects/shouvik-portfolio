'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Article } from '@/lib/db';
import ArticleCard from '@/components/ui/ArticleCard';
import GlassCard from '@/components/ui/GlassCard';
import FeaturedArticleHero from '@/components/ui/FeaturedArticleHero';
import { 
  Search, Mail, Sparkles, Filter, ChevronLeft, ChevronRight, 
  CheckCircle2, Bookmark, Flame, Zap, Globe, ExternalLink, 
  Clock, Wifi, Loader2, X, Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sfx } from '@/lib/soundEffects';
import { getSavedArticleSlugs } from '@/lib/bookmarkStore';

interface BlogListingProps {
  articles: Article[];
}

interface LiveResult {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  image: string;
  category: string;
}

const CATEGORIES = ["All", "Technology", "Science", "Global Innovations", "Entertainment", "Anime"];
const TRENDING_TAGS = ["#NextJS16", "#SpatialWeb3D", "#AIInnovations", "#AnimeLore", "#GlobalScience", "#VFXMotion"];
const ITEMS_PER_PAGE = 12;

function timeAgo(dateString: string) {
  const now = Date.now();
  const past = new Date(dateString).getTime();
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

function LiveResultSkeleton() {
  return (
    <div className="flex gap-3 p-4 rounded-2xl bg-white/3 border border-white/5 animate-pulse">
      <div className="w-16 h-16 rounded-xl bg-white/8 shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 bg-white/8 rounded-full w-3/4" />
        <div className="h-2.5 bg-white/5 rounded-full w-full" />
        <div className="h-2 bg-white/5 rounded-full w-1/2" />
      </div>
    </div>
  );
}

export default function BlogListing({ articles }: BlogListingProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [emailSub, setEmailSub] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Live internet search state
  const [liveResults, setLiveResults] = useState<LiveResult[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState(false);
  const [lastSearchedQuery, setLastSearchedQuery] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSavedSlugs(getSavedArticleSlugs());
    const handleBookmarkSync = () => setSavedSlugs(getSavedArticleSlugs());
    window.addEventListener('bookmarks-updated', handleBookmarkSync);
    return () => window.removeEventListener('bookmarks-updated', handleBookmarkSync);
  }, []);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, activeCategory, showBookmarksOnly]);

  // Debounced live internet search
  const triggerLiveSearch = useCallback((query: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    if (!query.trim() || query.trim().length < 2) {
      setLiveResults([]);
      setLiveLoading(false);
      return;
    }

    setLiveLoading(true);
    setLiveError(false);

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/live-search?q=${encodeURIComponent(query.trim())}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setLiveResults(data.results || []);
        setLastSearchedQuery(query.trim());
      } catch (err) {
        setLiveError(true);
        setLiveResults([]);
      } finally {
        setLiveLoading(false);
      }
    }, 600);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    triggerLiveSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setLiveResults([]);
    setLiveLoading(false);
    setLiveError(false);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  };

  const filteredArticles = useMemo(() => {
    const sorted = [...articles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    const clean = searchTerm.toLowerCase().trim();

    return sorted.filter(art => {
      if (showBookmarksOnly && !savedSlugs.includes(art.slug)) return false;
      const matchesSearch = !clean ||
        art.title.toLowerCase().includes(clean) || 
        art.description.toLowerCase().includes(clean) || 
        art.content.toLowerCase().includes(clean) ||
        art.category.toLowerCase().includes(clean) ||
        art.source.toLowerCase().includes(clean);
      const matchesCategory = activeCategory === "All" || 
        art.category.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchTerm, activeCategory, showBookmarksOnly, savedSlugs]);

  const featuredArticle = useMemo(() => {
    if (searchTerm || activeCategory !== "All" || showBookmarksOnly || articles.length === 0) return null;
    return articles[0];
  }, [articles, searchTerm, activeCategory, showBookmarksOnly]);

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
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 }, colors: ['#ff007f', '#8b5cf6', '#0ea5e9'] });
    setEmailSub("");
  };

  const showLiveSection = searchTerm.trim().length >= 2;

  return (
    <div className="w-full">
      
      {/* 1. FEATURED COVER STORY */}
      {featuredArticle && !searchTerm && (
        <FeaturedArticleHero article={featuredArticle} />
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
        {/* 2. SEARCH HUD — PREMIUM INTERNET-CONNECTED SEARCH */}
        <div className="relative mb-10 group">
          {/* Glowing background ring */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20 rounded-3xl blur-lg opacity-0 group-focus-within:opacity-100 transition-all duration-500" />

          <div className="relative flex flex-col gap-5 p-6 rounded-3xl bg-[#080514]/80 border border-white/8 backdrop-blur-xl">
            
            {/* Search Row */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {liveLoading ? (
                    <Loader2 size={18} className="text-primary animate-spin" />
                  ) : (
                    <Search size={18} className="text-gray-500 group-focus-within:text-primary transition-colors" />
                  )}
                  {showLiveSection && !liveLoading && (
                    <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                      <Wifi size={8} className="animate-pulse" /> LIVE
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search the internet + your discoveries... (try 'anime 2026', 'Next.js', 'quantum')"
                  className="w-full pl-14 pr-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition-all font-light"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap justify-center lg:justify-end items-center gap-2">
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
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                        isActive 
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_12px_rgba(255,0,127,0.35)]' 
                          : 'bg-white/5 border border-white/8 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {cat === "All" ? "ALL" : cat === "Global Innovations" ? "GLOBAL" : cat.toUpperCase()}
                    </button>
                  );
                })}
                <button
                  onClick={() => {
                    sfx.playClick();
                    setShowBookmarksOnly(!showBookmarksOnly);
                  }}
                  onMouseEnter={() => sfx.playHover()}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                    showBookmarksOnly 
                      ? 'bg-primary text-white shadow-[0_0_12px_rgba(255,0,127,0.4)]' 
                      : 'bg-white/5 border border-white/8 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Bookmark size={11} fill={showBookmarksOnly ? "currentColor" : "none"} />
                  SAVED ({savedSlugs.length})
                </button>
              </div>
            </div>

            {/* Trending Tags Row */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/6">
              <span className="text-[10px] font-mono font-bold text-gray-500 flex items-center gap-1.5 shrink-0">
                <Flame size={11} className="text-primary" /> TRENDING:
              </span>
              {TRENDING_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    sfx.playClick();
                    handleSearchChange(tag.replace('#', ''));
                  }}
                  onMouseEnter={() => sfx.playHover()}
                  className="px-2.5 py-1 rounded-lg bg-white/4 hover:bg-primary/12 border border-white/6 hover:border-primary/25 text-[11px] font-mono text-gray-400 hover:text-primary transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. MAIN CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Articles Column */}
          <div className="lg:col-span-8 flex flex-col gap-10">

            {/* LIVE INTERNET SEARCH RESULTS SECTION */}
            <AnimatePresence>
              {showLiveSection && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col gap-5"
                >
                  {/* Section Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                        <Globe size={16} className="text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          Live from Internet
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                            <Wifi size={8} className="animate-pulse" /> REAL-TIME
                          </span>
                        </h3>
                        <p className="text-xs font-mono text-gray-500">
                          {liveLoading ? 'Searching the internet...' : liveError ? 'Search unavailable' : `${liveResults.length} live results for "${lastSearchedQuery}"`}
                        </p>
                      </div>
                    </div>
                    {!liveLoading && liveResults.length > 0 && (
                      <span className="text-[10px] font-mono text-gray-500">
                        via Google News RSS
                      </span>
                    )}
                  </div>

                  {/* Live Results */}
                  <div className="flex flex-col gap-3">
                    {liveLoading ? (
                      Array.from({ length: 4 }).map((_, i) => <LiveResultSkeleton key={i} />)
                    ) : liveError ? (
                      <div className="p-4 rounded-2xl bg-red-500/8 border border-red-500/20 text-xs font-mono text-red-400 flex items-center gap-2">
                        <X size={14} /> Live internet search temporarily unavailable. Browse local discoveries below.
                      </div>
                    ) : liveResults.length === 0 ? (
                      <div className="p-4 rounded-2xl bg-white/4 border border-white/8 text-xs font-mono text-gray-400 text-center">
                        No live results found for &ldquo;{searchTerm}&rdquo;. Try a broader search term.
                      </div>
                    ) : (
                      liveResults.map((result) => (
                        <motion.a
                          key={result.id}
                          href={result.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          onClick={() => sfx.playClick()}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-3 p-4 rounded-2xl bg-[#080514]/60 border border-white/6 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 group cursor-pointer"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-white/8">
                            <img
                              src={result.image}
                              alt={result.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=60';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                                {result.category}
                              </span>
                              <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                                <Clock size={9} /> {timeAgo(result.publishedAt)}
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors leading-tight line-clamp-2 mb-1">
                              {result.title}
                            </h4>
                            <p className="text-gray-400 text-xs leading-relaxed line-clamp-1 mb-1.5">{result.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-gray-500 truncate">{result.source}</span>
                              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                Open <ExternalLink size={9} />
                              </span>
                            </div>
                          </div>
                        </motion.a>
                      ))
                    )}
                  </div>

                  {/* Divider between live and local */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex-1 h-px bg-white/8" />
                    <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/4 border border-white/8">
                      <Sparkles size={10} className="text-primary" /> YOUR DISCOVERIES
                    </span>
                    <div className="flex-1 h-px bg-white/8" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LOCAL ARTICLES GRID */}
            <AnimatePresence mode="popLayout">
              {paginatedArticles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-12 text-center flex flex-col items-center gap-4 rounded-3xl bg-[#0b0814]/40 border border-white/5"
                >
                  <Filter size={32} className="text-primary animate-pulse" />
                  <span className="font-mono text-white text-sm font-bold tracking-widest uppercase">
                    {showBookmarksOnly ? "NO SAVED ARTICLES" : "NO LOCAL ARTICLES FOUND"}
                  </span>
                  <p className="text-gray-400 text-xs max-w-sm leading-relaxed">
                    {showBookmarksOnly 
                      ? "You haven't bookmarked any discoveries yet. Click the 🔖 icon on any article to save it."
                      : `No local articles match "${searchTerm}". Check the live internet results above!`
                    }
                  </p>
                  {(searchTerm || showBookmarksOnly) && (
                    <button
                      onClick={() => {
                        sfx.playClick();
                        clearSearch();
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
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-7">
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 pt-6 border-t border-white/8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    sfx.playClick();
                    setCurrentPage(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/8 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 text-white transition-all cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="font-mono text-xs text-gray-400 px-4 py-2 rounded-xl bg-white/4 border border-white/8">
                  PAGE <strong className="text-white">{currentPage}</strong> OF <strong className="text-white">{totalPages}</strong>
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    sfx.playClick();
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/8 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 text-white transition-all cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-28">
            
            {/* Newsletter Box */}
            <GlassCard className="p-6 bg-[#0b0814]/50 border-white/5 rounded-3xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/8 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2.5 rounded-xl bg-primary/20 text-primary border border-primary/30 shadow-[0_0_12px_rgba(255,0,127,0.3)]">
                  <Mail size={18} />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-white leading-tight">Neural Dispatch</h3>
                  <span className="text-[10px] font-mono text-gray-400">Bi-hourly automated briefings</span>
                </div>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed text-left mb-5">
                Fresh AI-summarized tech, science, and anime digests. Zero spam, unsubscribe instantly.
              </p>

              {isSubscribed ? (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono">
                  <CheckCircle2 size={16} />
                  <span>TRANSMISSION CONFIRMED!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                  <input
                    type="email"
                    required
                    value={emailSub}
                    onChange={(e) => setEmailSub(e.target.value)}
                    placeholder="Enter your email coordinates..."
                    className="w-full px-4 py-3 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
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

            {/* AI Architecture Info */}
            <GlassCard className="p-6 bg-[#0b0814]/50 border-white/5 rounded-3xl text-left">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase tracking-wider mb-4">
                <Sparkles size={14} className="animate-pulse" /> LIVE AI ARCHITECTURE
              </div>
              <div className="flex flex-col gap-2 text-[11px] font-mono text-gray-400">
                {[
                  { label: 'Engine', value: 'Next.js 16 + Gemini 2.5', color: 'text-white' },
                  { label: 'Internet Search', value: 'Google News RSS Live', color: 'text-emerald-400' },
                  { label: 'Revalidation', value: '60s ISR Real-time', color: 'text-primary' },
                  { label: 'Published Articles', value: `${articles.length} Verified`, color: 'text-blue-400' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-1.5 border-b border-white/5 last:border-0">
                    <span>{item.label}:</span>
                    <span className={`${item.color} font-bold`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Live Search Tip card */}
            <GlassCard className="p-5 bg-emerald-500/5 border-emerald-500/15 rounded-3xl">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                  <Globe size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">Live Internet Search</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Type any keyword in the search bar to instantly fetch <strong className="text-emerald-400">live global news</strong> from across the internet — just like your browser.
                  </p>
                </div>
              </div>
            </GlassCard>

          </div>
        </div>

      </div>
    </div>
  );
}
