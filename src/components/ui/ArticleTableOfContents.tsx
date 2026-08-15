'use client';

import { useState, useEffect } from 'react';
import { List, ChevronRight, BookOpen } from 'lucide-react';
import { sfx } from '@/lib/soundEffects';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface ArticleTableOfContentsProps {
  content: string;
}

export default function ArticleTableOfContents({ content }: ArticleTableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // 1. Scan the article container in DOM for real headings or construct from content
    const headingElements = Array.from(document.querySelectorAll('article h2, article h3'));
    
    if (headingElements.length > 0) {
      const items: TOCItem[] = headingElements.map((el, idx) => {
        if (!el.id) {
          el.id = `section-${idx + 1}-${el.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) || 'heading'}`;
        }
        return {
          id: el.id,
          text: el.textContent || `Section ${idx + 1}`,
          level: el.tagName === 'H2' ? 2 : 3,
        };
      });
      setHeadings(items);
      setActiveId(items[0]?.id || '');
    } else {
      // Fallback: generate synthesized outline points based on paragraphs
      setHeadings([
        { id: 'article-overview', text: 'Executive Overview', level: 2 },
        { id: 'article-body', text: 'Deep Analysis & Insights', level: 2 },
        { id: 'article-takeaways', text: 'Future Trajectory & Takeaways', level: 2 },
      ]);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    headingElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [content]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    sfx.playClick();
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="rounded-2xl bg-[#0c0818]/80 border border-white/10 p-5 backdrop-blur-xl shadow-xl">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-xs font-mono font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10 cursor-pointer"
      >
        <span className="flex items-center gap-2 text-primary">
          <BookOpen size={14} /> TABLE OF CONTENTS
        </span>
        <span className="text-gray-400 text-[10px]">{isOpen ? 'COLLAPSE' : 'EXPAND'}</span>
      </button>

      {isOpen && (
        <nav className="mt-4 flex flex-col gap-2">
          {headings.map((h) => {
            const isActive = activeId === h.id;
            return (
              <button
                key={h.id}
                onClick={() => scrollToHeading(h.id)}
                className={`text-left text-xs font-mono transition-all py-1 px-2.5 rounded-lg flex items-center gap-2 cursor-pointer ${
                  h.level === 3 ? 'ml-3 text-[11px]' : ''
                } ${
                  isActive
                    ? 'bg-primary/20 text-primary font-bold border-l-2 border-primary shadow-[0_0_10px_rgba(255,0,127,0.2)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ChevronRight size={12} className={isActive ? 'text-primary' : 'text-gray-600'} />
                <span className="line-clamp-1">{h.text}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
