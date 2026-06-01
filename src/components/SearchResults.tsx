'use client';

import { useState, useMemo } from 'react';
import { Article } from '@/lib/db';
import ArticleCard from '@/components/ui/ArticleCard';
import { Search, Filter, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface SearchResultsProps {
  articles: Article[];
  initialQuery: string;
}

const categories = ["All", "Technology", "Science", "Global Innovations", "Entertainment", "Anime"];
const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Most Popular (Likes)", value: "likes" },
  { label: "Alphabetical (A-Z)", value: "alphabetical" }
];

export default function SearchResults({ articles, initialQuery }: SearchResultsProps) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Live filter, search, and sort logic in real-time as the user types!
  const processedArticles = useMemo(() => {
    let result = [...articles];

    // Live Search Filter (partial-string, case-insensitive across title, description, content, source, category)
    if (searchTerm.trim()) {
      const clean = searchTerm.toLowerCase().trim();
      result = result.filter(art => 
        art.title.toLowerCase().includes(clean) || 
        art.description.toLowerCase().includes(clean) || 
        art.content.toLowerCase().includes(clean) ||
        art.category.toLowerCase().includes(clean) ||
        art.source.toLowerCase().includes(clean)
      );
    }

    // Category Filter
    if (activeCategory !== "All") {
      result = result.filter(art => art.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Sort Logic
    if (sortBy === "likes") {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "alphabetical") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // "newest" - sort by date
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    return result;
  }, [articles, searchTerm, activeCategory, sortBy]);

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 text-left">
      
      {/* 1. Header controls section */}
      <div className="glass-panel p-6 md:p-8 bg-[#0b0814]/40 border-white/5 rounded-2xl mb-12 flex flex-col gap-6">
        
        {/* Search bar and title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold font-mono tracking-widest text-[#ff007f] uppercase block mb-1">
              SEARCH RESULTS ENGINE
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              Showing Results for <span className="text-[#ff007f] italic">&ldquo;{initialQuery}&rdquo;</span>
            </h2>
          </div>
          
          {/* Active Search Query Input with instantaneous dynamic updates */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-xs shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Live search articles..."
              className="w-full pl-11 pr-4 py-2.5 glass-input text-xs"
            />
          </form>
        </div>

        {/* Filters and Sorting Controls Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pt-6 border-t border-white/5">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#ff007f] to-[#8b5cf6] text-white shadow-[0_0_12px_rgba(255,0,127,0.25)]' 
                      : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <span className="text-[10px] font-mono font-bold text-gray-500 flex items-center gap-1 uppercase">
              <ArrowUpDown size={12} className="text-[#ff007f]" /> Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input px-3 py-2 text-[10px] font-mono font-bold text-gray-300 bg-[#090611] focus:border-[#ff007f] border-white/5 rounded-lg outline-none cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#090611] text-gray-300">
                  {opt.label.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* 2. Grid Display Area */}
      <AnimatePresence mode="popLayout">
        {processedArticles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-panel p-16 text-center flex flex-col items-center gap-4 bg-[#0b0814]/40 border-white/5"
          >
            <AlertTriangle size={36} className="text-gray-500 animate-pulse" />
            <span className="font-mono text-gray-400 text-sm tracking-widest">
              NO MATCHES FOUND
            </span>
            <p className="text-gray-500 text-xs max-w-sm leading-relaxed">
              We couldn't find any articles matching your query &ldquo;{searchTerm}&rdquo; under the category {activeCategory}. Try adjusting your keywords or exploring other categories!
            </p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {processedArticles.map((art) => (
              <motion.div
                key={art.slug}
                variants={itemVariants}
                layout
              >
                <ArticleCard article={art} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
