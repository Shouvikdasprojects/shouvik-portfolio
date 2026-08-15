'use client';

import { useState, useMemo, useEffect } from 'react';
import { Article } from '@/lib/db';
import ArticleCard from '@/components/ui/ArticleCard';
import SafeImage from '@/components/ui/SafeImage';
import GlassCard from '@/components/ui/GlassCard';
import { 
  Search, 
  Filter, 
  Layers, 
  Film, 
  Share2, 
  Globe, 
  Sparkles, 
  ExternalLink, 
  ArrowRight, 
  Flame, 
  History, 
  X, 
  Tag,
  Tv
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { sfx } from '@/lib/soundEffects';

const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

interface Project {
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  demoUrl?: string;
  featured?: boolean;
}

interface Social {
  name: string;
  url: string;
  username: string;
  description: string;
  avatar: string;
  followers?: string;
  gradient?: string;
  type: string;
}

interface Channel {
  name: string;
  url: string;
  subscribers?: string;
  focus: string;
  avatar: string;
  recentVideo?: {
    title: string;
    thumbnail: string;
    views: string;
    published: string;
  };
}

interface Upload {
  title: string;
  description: string;
  source: string;
  url?: string;
  imageUrl?: string;
  type?: string;
}

interface SearchResultsProps {
  articles: Article[];
  projects: Project[];
  socials: Social[];
  channels: Channel[];
  uploads: Upload[];
  initialQuery: string;
}

const SEARCH_HISTORY_KEY = 'shouvik_omnisearch_history';
const TRENDING_QUERIES = ['Otaku Insider', 'Next.js 16', 'Three.js', 'AniSpectra', 'Anime Nation India', 'Neon Postgres'];

// Helper to highlight matching text in strings
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim() || !text) return <span>{text}</span>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-primary/30 text-primary font-bold px-0.5 rounded border border-primary/40">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export default function SearchResults({ 
  articles, 
  projects, 
  socials, 
  channels, 
  uploads, 
  initialQuery 
}: SearchResultsProps) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'articles' | 'projects' | 'channels' | 'uploads'>('all');
  const [articleCategory, setArticleCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [history, setHistory] = useState<string[]>([]);
  const router = useRouter();

  // Load and save recent search history
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const saveQueryToHistory = (q: string) => {
    const clean = q.trim();
    if (!clean) return;
    try {
      const updated = [clean, ...history.filter(h => h.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
      setHistory(updated);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearHistory = () => {
    sfx.playClick();
    setHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch {
      // ignore
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      sfx.playClick();
      saveQueryToHistory(searchTerm.trim());
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handlePillClick = (queryText: string) => {
    sfx.playClick();
    setSearchTerm(queryText);
    saveQueryToHistory(queryText);
    router.push(`/search?query=${encodeURIComponent(queryText)}`);
  };

  // 1. FILTERED ARTICLES
  const matchedArticles = useMemo(() => {
    const clean = searchTerm.toLowerCase().trim();
    let result = [...articles];

    if (clean) {
      result = result.filter(art =>
        art.title.toLowerCase().includes(clean) ||
        art.description.toLowerCase().includes(clean) ||
        art.content.toLowerCase().includes(clean) ||
        art.category.toLowerCase().includes(clean) ||
        art.source.toLowerCase().includes(clean)
      );
    }

    if (articleCategory !== 'All') {
      result = result.filter(art => art.category.toLowerCase() === articleCategory.toLowerCase());
    }

    if (sortBy === 'likes') {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    return result;
  }, [articles, searchTerm, articleCategory, sortBy]);

  // 2. FILTERED PROJECTS
  const matchedProjects = useMemo(() => {
    const clean = searchTerm.toLowerCase().trim();
    if (!clean) return projects;
    return projects.filter(p =>
      p.title.toLowerCase().includes(clean) ||
      p.description.toLowerCase().includes(clean) ||
      p.techStack.some(t => t.toLowerCase().includes(clean))
    );
  }, [projects, searchTerm]);

  // 3. FILTERED CHANNELS & SOCIALS
  const matchedSocials = useMemo(() => {
    const clean = searchTerm.toLowerCase().trim();
    const allChannelsAndSocials = [
      ...channels.map(c => ({
        name: c.name,
        url: c.url,
        username: c.subscribers ? `${c.subscribers} Subscribers` : 'YouTube Channel',
        description: c.focus,
        avatar: c.avatar,
        type: 'YouTube'
      })),
      ...socials
    ];

    if (!clean) return allChannelsAndSocials;
    return allChannelsAndSocials.filter(s =>
      s.name.toLowerCase().includes(clean) ||
      s.username.toLowerCase().includes(clean) ||
      s.description.toLowerCase().includes(clean) ||
      s.type.toLowerCase().includes(clean)
    );
  }, [channels, socials, searchTerm]);

  // 4. FILTERED UPLOADS
  const matchedUploads = useMemo(() => {
    const clean = searchTerm.toLowerCase().trim();
    if (!clean) return uploads;
    return uploads.filter(u =>
      u.title.toLowerCase().includes(clean) ||
      u.description.toLowerCase().includes(clean) ||
      u.source.toLowerCase().includes(clean)
    );
  }, [uploads, searchTerm]);

  const totalResultsCount = 
    matchedArticles.length + 
    matchedProjects.length + 
    matchedSocials.length + 
    matchedUploads.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 relative z-10 text-left">
      
      {/* 1. HERO SEARCH HUD CONTROLS */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0c0818]/90 via-[#090614]/90 to-[#120a22]/90 border border-primary/25 p-6 sm:p-10 mb-10 shadow-[0_0_60px_rgba(255,0,127,0.12)] backdrop-blur-xl">
        
        {/* Title Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,0,127,0.3)]">
              <Sparkles size={13} className="animate-pulse" /> GLOBAL OMNISEARCH ENGINE
            </span>
            <span className="text-xs font-mono text-gray-400">
              Cross-Resource Real-time Index
            </span>
          </div>

          <div className="text-xs font-mono text-gray-400">
            FOUND <strong className="text-primary font-bold text-sm">{totalResultsCount}</strong> TOTAL MATCHES
          </div>
        </div>

        {/* Omnisearch Input Field */}
        <form onSubmit={handleSearchSubmit} className="relative w-full mb-6">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={22} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search across all projects, AI discoveries, anime channels, and uploads..."
            className="w-full pl-14 pr-24 py-4 rounded-2xl bg-white/5 border border-white/15 text-white text-base placeholder-gray-500 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 shadow-inner transition-all font-mono"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                sfx.playClick();
                setSearchTerm('');
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Clear Query"
            >
              <X size={16} />
            </button>
          )}
        </form>

        {/* History and Trending Quick Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs font-mono">
          
          {/* Trending Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-500 flex items-center gap-1 font-bold">
              <Flame size={12} className="text-primary" /> TRENDING:
            </span>
            {TRENDING_QUERIES.map((tq) => (
              <button
                key={tq}
                onClick={() => handlePillClick(tq)}
                onMouseEnter={() => sfx.playHover()}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                {tq}
              </button>
            ))}
          </div>

          {/* Recent History */}
          {history.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-500 flex items-center gap-1 font-bold">
                <History size={12} className="text-secondary" /> RECENT:
              </span>
              {history.map((hq) => (
                <button
                  key={hq}
                  onClick={() => handlePillClick(hq)}
                  className="px-2 py-0.5 rounded-md bg-secondary/10 border border-secondary/25 text-secondary hover:text-white transition-all cursor-pointer text-[11px]"
                >
                  {hq}
                </button>
              ))}
              <button
                onClick={clearHistory}
                className="text-[10px] text-gray-500 hover:text-red-400 ml-1 transition-colors cursor-pointer"
                title="Clear History"
              >
                ✕
              </button>
            </div>
          )}

        </div>

      </div>

      {/* 2. RESOURCE NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'ALL RESULTS', count: totalResultsCount, icon: <Globe size={13} /> },
            { id: 'articles', label: 'DISCOVERIES', count: matchedArticles.length, icon: <Sparkles size={13} /> },
            { id: 'projects', label: 'SHIPPED BUILDS', count: matchedProjects.length, icon: <Layers size={13} /> },
            { id: 'channels', label: 'CHANNELS & SOCIALS', count: matchedSocials.length, icon: <YoutubeIcon size={13} /> },
            { id: 'uploads', label: 'RECENT UPLOADS', count: matchedUploads.length, icon: <Film size={13} /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sfx.playClick();
                  setActiveTab(tab.id as any);
                }}
                onMouseEnter={() => sfx.playHover()}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-[0_0_15px_rgba(255,0,127,0.35)]'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px]">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Article Sorting Dropdown (when on All or Articles tab) */}
        {(activeTab === 'all' || activeTab === 'articles') && (
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span>SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                sfx.playClick();
                setSortBy(e.target.value);
              }}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-primary/50 cursor-pointer"
            >
              <option value="newest" className="bg-[#0b0814]">Newest First</option>
              <option value="likes" className="bg-[#0b0814]">Most Popular</option>
              <option value="alphabetical" className="bg-[#0b0814]">Alphabetical (A-Z)</option>
            </select>
          </div>
        )}

      </div>

      {/* 3. MULTI-RESOURCE RESULTS DISPLAY */}
      {totalResultsCount === 0 ? (
        <div className="rounded-3xl bg-[#0c0818]/60 border border-white/10 p-12 text-center flex flex-col items-center gap-4 my-8">
          <Filter size={36} className="text-primary animate-pulse" />
          <h3 className="text-xl font-bold text-white">No Matching Resources Found</h3>
          <p className="text-gray-400 text-xs max-w-md leading-relaxed">
            We couldn't find any projects, discoveries, or creator channels matching &ldquo;<strong className="text-white">{searchTerm}</strong>&rdquo;. Try searching for &ldquo;Otaku Insider&rdquo;, &ldquo;Next.js&rdquo;, or &ldquo;Anime&rdquo;.
          </p>
          <button
            onClick={() => {
              sfx.playClick();
              setSearchTerm('');
              setActiveTab('all');
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-mono font-bold text-xs tracking-wider cursor-pointer shadow-lg"
          >
            SHOW ALL RESOURCES
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-16">
          
          {/* SECTION A: SHIPPED BUILDS & APPS */}
          {(activeTab === 'all' || activeTab === 'projects') && matchedProjects.length > 0 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-primary/15 text-primary border border-primary/30">
                    <Layers size={18} />
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-white">Shipped Builds & Web Applications</h3>
                    <span className="text-xs font-mono text-gray-400">{matchedProjects.length} projects match &ldquo;{searchTerm || 'all'}&rdquo;</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedProjects.map((p) => (
                  <GlassCard key={p.title} className="flex flex-col justify-between p-6 bg-[#0b0814]/40 border-white/5 rounded-3xl hover:border-primary/40 transition-all group">
                    <div>
                      <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-slate-900 border border-white/10">
                        <SafeImage
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          fallbackSrc="/assets/anispectra-logo.png"
                        />
                        {p.featured && (
                          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-primary text-white text-[9px] font-mono font-bold tracking-wider">
                            FEATURED
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                        <HighlightText text={p.title} query={searchTerm} />
                      </h4>
                      <p className="text-gray-300 text-xs leading-relaxed line-clamp-3 mt-2 mb-4">
                        <HighlightText text={p.description} query={searchTerm} />
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.techStack.map((tech) => (
                          <span key={tech} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {p.demoUrl && (
                        <a
                          href={p.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => sfx.playWarp()}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 hover:brightness-110 transition-all cursor-pointer shadow-md"
                        >
                          LAUNCH DEMO <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* SECTION B: BLOG ARTICLES & DISCOVERIES */}
          {(activeTab === 'all' || activeTab === 'articles') && matchedArticles.length > 0 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-secondary/15 text-secondary border border-secondary/30">
                    <Sparkles size={18} />
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-white">Articles & AI Discoveries</h3>
                    <span className="text-xs font-mono text-gray-400">{matchedArticles.length} publications match &ldquo;{searchTerm || 'all'}&rdquo;</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {matchedArticles.map((art) => (
                  <ArticleCard key={art.slug} article={art} />
                ))}
              </div>
            </div>
          )}

          {/* SECTION C: YOUTUBE CHANNELS & SOCIAL HUBS */}
          {(activeTab === 'all' || activeTab === 'channels') && matchedSocials.length > 0 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
                    <YoutubeIcon size={18} />
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-white">Creator Channels & Social Handles</h3>
                    <span className="text-xs font-mono text-gray-400">{matchedSocials.length} creator channels match &ldquo;{searchTerm || 'all'}&rdquo;</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedSocials.map((s) => (
                  <GlassCard key={s.name} className="flex flex-col justify-between p-6 bg-[#0b0814]/40 border-white/5 rounded-3xl hover:scale-[1.02] transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shrink-0">
                        <SafeImage
                          src={s.avatar}
                          alt={s.name}
                          className="w-full h-full object-cover"
                          fallbackSrc="/assets/shouvik.jpg"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          <HighlightText text={s.name} query={searchTerm} />
                        </h4>
                        <span className="text-xs font-mono text-primary font-bold block mt-0.5">
                          {s.username}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-xs leading-relaxed mb-5">
                      <HighlightText text={s.description} query={searchTerm} />
                    </p>

                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => sfx.playClick()}
                      className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      VISIT PROFILE <ExternalLink size={12} />
                    </a>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* SECTION D: RECENT UPLOADS */}
          {(activeTab === 'all' || activeTab === 'uploads') && matchedUploads.length > 0 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    <Film size={18} />
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-white">Recent Media Uploads & Shorts</h3>
                    <span className="text-xs font-mono text-gray-400">{matchedUploads.length} videos match &ldquo;{searchTerm || 'all'}&rdquo;</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedUploads.map((u, i) => (
                  <GlassCard key={i} className="flex flex-col justify-between p-5 bg-[#0b0814]/40 border-white/5 rounded-3xl">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full inline-block mb-3">
                        {u.source}
                      </span>
                      <h4 className="text-sm font-bold text-white mb-2 line-clamp-2">
                        <HighlightText text={u.title} query={searchTerm} />
                      </h4>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4">
                        <HighlightText text={u.description} query={searchTerm} />
                      </p>
                    </div>

                    {u.url && (
                      <a
                        href={u.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => sfx.playClick()}
                        className="py-2 px-4 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                      >
                        WATCH VIDEO <ExternalLink size={12} />
                      </a>
                    )}
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
