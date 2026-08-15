'use client';

import { useState, useMemo } from 'react';
import TiltCard from '@/components/ui/TiltCard';
import SafeImage from '@/components/ui/SafeImage';
import { ExternalLink, Sparkles, Film, Image as ImageIcon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Upload {
  title: string;
  description: string;
  source: string;
  url?: string;
  imageUrl?: string;
  type: string;
}

interface Props {
  uploads: Upload[];
}

const YtIcon = () => (
  <svg className="w-3 h-3 fill-red-500" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
);
const IgIcon = () => (
  <svg className="w-3 h-3 fill-none stroke-pink-500" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
const FbIcon = () => (
  <svg className="w-3 h-3 fill-blue-400" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
);

const PLATFORM_FILTERS = [
  { label: 'All', icon: <Globe size={12} />, matcher: () => true },
  { label: 'YouTube', icon: <YtIcon />, matcher: (s: string) => s.toLowerCase().includes('yt') || s.toLowerCase().includes('youtube') },
  { label: 'Instagram', icon: <IgIcon />, matcher: (s: string) => s.toLowerCase().includes('insta') || s.toLowerCase().includes('instagram') },
  { label: 'Facebook', icon: <FbIcon />, matcher: (s: string) => s.toLowerCase().includes('fb') || s.toLowerCase().includes('facebook') },
];

function getPlatformBorder(source: string) {
  const s = source.toLowerCase();
  if (s.includes('yt') || s.includes('youtube')) return 'border-red-500/30 hover:border-red-500/60';
  if (s.includes('insta')) return 'border-pink-500/30 hover:border-pink-500/60';
  if (s.includes('fb') || s.includes('facebook')) return 'border-blue-500/30 hover:border-blue-500/60';
  return 'border-white/5 hover:border-white/10';
}

function getTypeBadgeColor(type: string) {
  if (type === 'Video' || type === 'Vlog') return 'text-red-400';
  if (type === 'Artwork') return 'text-purple-400';
  return 'text-primary';
}

export default function UploadsClient({ uploads }: Props) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = useMemo(() => {
    const filter = PLATFORM_FILTERS.find(f => f.label === activeFilter);
    if (!filter || activeFilter === 'All') return uploads;
    return uploads.filter(u => filter.matcher(u.source));
  }, [uploads, activeFilter]);

  return (
    <div>
      {/* Platform Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {PLATFORM_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setActiveFilter(f.label)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer border ${
              activeFilter === f.label
                ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-[0_0_15px_rgba(255,0,127,0.35)]'
                : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {f.icon} {f.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-gray-500 font-mono text-sm"
          >
            No uploads found for this platform.
          </motion.div>
        ) : (
          <motion.div
            layout
            className="masonry-grid"
          >
            {filtered.map((post, idx) => (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="masonry-item"
              >
                <TiltCard className={`flex flex-col bg-[#0b0814]/40 border p-5 rounded-2xl transition-all duration-300 ${getPlatformBorder(post.source)}`}>
                  {/* Thumbnail */}
                  <div className="relative w-full rounded-xl overflow-hidden mb-5 bg-slate-900 border border-white/5 group">
                    <div className={`aspect-video`}>
                      <SafeImage 
                        src={post.imageUrl ?? ''} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                        fallbackSrc={post.source.includes("Anime Nation India") ? "/assets/animenation.jpg" : "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=60"}
                      />
                    </div>
                    
                    {/* Media Type Badge */}
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[9px] font-bold font-mono px-2.5 py-1 rounded flex items-center gap-1">
                      {post.type === 'Video' || post.type === 'Vlog' 
                        ? <Film size={10} className={getTypeBadgeColor(post.type)} /> 
                        : <ImageIcon size={10} className={getTypeBadgeColor(post.type)} />}
                      {post.type.toUpperCase()}
                    </div>

                    {/* Platform source tag */}
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur text-white font-mono text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {post.source.replace(' (YT)', '').replace(' (Insta)', '').replace(' (FB)', '')}
                    </div>

                    {/* Hover play overlay for video */}
                    {(post.type === 'Video' || post.type === 'Vlog') && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/30">
                        <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                          <svg className="w-5 h-5 fill-white ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5 leading-snug">
                    {post.title}
                    {post.title.toLowerCase().includes('anime') && <Sparkles size={12} className="text-primary shrink-0" />}
                  </h3>
                  
                  <p className="text-gray-400 text-xs mb-5 leading-relaxed flex-grow">
                    {post.description}
                  </p>

                  {/* CTA */}
                  <a 
                    href={post.url || "#"} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full py-2.5 text-center text-xs font-bold bg-primary/10 hover:bg-primary text-white rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md group cursor-pointer"
                  >
                    View Post / Video <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
