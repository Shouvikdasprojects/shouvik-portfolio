'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Sparkles, 
  ExternalLink, 
  FileText, 
  Download, 
  Printer, 
  Mail, 
  Volume2, 
  VolumeX, 
  Compass, 
  Film, 
  Layers, 
  ChevronRight,
  Command,
  ArrowRight,
  Bot,
  Terminal,
  Calendar
} from 'lucide-react';
import { projectsList, socialLinks, youtubeChannels, personalInfo } from '@/lib/realData';
import { sfx } from '@/lib/soundEffects';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Projects' | 'Socials & Media' | 'Actions';
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Sync mute state on mount
  useEffect(() => {
    setIsMuted(sfx.getMuted());
  }, [isOpen]);

  // Global keydown listener for Cmd+K / Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) sfx.playWarp();
          return !prev;
        });
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      sfx.playWarp();
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setSelectedIndex(0);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // All searchable commands
  const allCommands = useMemo<CommandItem[]>(() => {
    const list: CommandItem[] = [
      // 1. Actions
      {
        id: 'action-book-call',
        title: 'Schedule a 1-on-1 Call',
        subtitle: 'Open 1-Click Discovery Call Scheduler (IST, EST, PST, GMT)',
        category: 'Actions',
        icon: <Calendar size={16} className="text-cyan-400" />,
        action: () => {
          setIsOpen(false);
          window.dispatchEvent(new CustomEvent('open-booking-modal'));
        },
        badge: '1-CLICK'
      },
      {
        id: 'action-ai-assistant',
        title: 'Ask AI Portfolio Assistant',
        subtitle: 'Interactive AI chat about Shouvik’s skills, projects & availability',
        category: 'Actions',
        icon: <Bot size={16} className="text-primary animate-pulse" />,
        action: () => {
          setIsOpen(false);
          window.dispatchEvent(new CustomEvent('open-ai-chat'));
        },
        badge: 'AI LIVE'
      },
      {
        id: 'action-developer-terminal',
        title: 'Open CyberOS Developer Terminal',
        subtitle: 'Interactive retro terminal shell (Shortcut: ~)',
        category: 'Actions',
        icon: <Terminal size={16} className="text-emerald-400" />,
        action: () => {
          setIsOpen(false);
          window.dispatchEvent(new CustomEvent('open-terminal'));
        },
        badge: 'CLI ~'
      },
      {
        id: 'action-resume-view',
        title: 'Open Executive Resume / CV',
        subtitle: 'View full interactive resume and verified credentials',
        category: 'Actions',
        icon: <FileText size={16} className="text-primary" />,
        action: () => { router.push('/resume'); setIsOpen(false); },
        badge: 'HOT'
      },
      {
        id: 'action-resume-download',
        title: 'Download Resume PDF',
        subtitle: 'Save Shouvik_Das_Resume.pdf to your device',
        category: 'Actions',
        icon: <Download size={16} className="text-emerald-400" />,
        action: () => {
          const a = document.createElement('a');
          a.href = personalInfo.resumeUrl;
          a.download = 'Shouvik_Das_Resume.pdf';
          a.click();
          setIsOpen(false);
        },
        badge: 'PDF'
      },
      {
        id: 'action-copy-email',
        title: 'Copy Email Address',
        subtitle: personalInfo.email,
        category: 'Actions',
        icon: <Mail size={16} className="text-cyan-400" />,
        action: () => {
          navigator.clipboard.writeText(personalInfo.email);
          sfx.playChime();
          alert(`📋 Copied: ${personalInfo.email}`);
          setIsOpen(false);
        }
      },
      {
        id: 'action-toggle-sound',
        title: isMuted ? 'Turn Sound FX ON' : 'Mute Sound FX',
        subtitle: 'Cyberpunk Web Audio synthesizer',
        category: 'Actions',
        icon: isMuted ? <VolumeX size={16} className="text-gray-400" /> : <Volume2 size={16} className="text-primary animate-pulse" />,
        action: () => {
          const newState = sfx.toggleMute();
          setIsMuted(newState);
        },
        badge: isMuted ? 'MUTED' : 'ACTIVE'
      },

      // 2. Navigation
      {
        id: 'nav-home',
        title: 'Home',
        subtitle: 'Landing page & Hero Section',
        category: 'Navigation',
        icon: <Compass size={16} className="text-pink-500" />,
        action: () => { router.push('/'); setIsOpen(false); }
      },
      {
        id: 'nav-about',
        title: 'About Shouvik',
        subtitle: 'Creative journey, hobbies, travel logs & skills',
        category: 'Navigation',
        icon: <Sparkles size={16} className="text-yellow-400" />,
        action: () => { router.push('/about'); setIsOpen(false); }
      },
      {
        id: 'nav-projects',
        title: 'Projects Showcase',
        subtitle: 'Explore 3D Web & Full-Stack builds',
        category: 'Navigation',
        icon: <Layers size={16} className="text-secondary" />,
        action: () => { router.push('/projects'); setIsOpen(false); }
      },
      {
        id: 'nav-articles',
        title: 'Tech Discoveries Blog',
        subtitle: 'Real-time AI & tech articles',
        category: 'Navigation',
        icon: <FileText size={16} className="text-blue-400" />,
        action: () => { router.push('/articles'); setIsOpen(false); }
      },
      {
        id: 'nav-uploads',
        title: 'Latest Uploads Stream',
        subtitle: 'Videos, vlogs, and reels feed',
        category: 'Navigation',
        icon: <Film size={16} className="text-red-400" />,
        action: () => { router.push('/uploads'); setIsOpen(false); }
      },
      {
        id: 'nav-contact',
        title: 'Contact / Hire Me',
        subtitle: 'Send direct inquiry or collaborate',
        category: 'Navigation',
        icon: <Mail size={16} className="text-primary" />,
        action: () => { router.push('/contact'); setIsOpen(false); }
      },

      // 3. Projects
      ...projectsList.map((p) => ({
        id: `proj-${p.title}`,
        title: p.title,
        subtitle: p.description,
        category: 'Projects' as const,
        icon: <Layers size={16} className="text-primary" />,
        action: () => {
          if (p.demoUrl) window.open(p.demoUrl, '_blank');
          else router.push('/projects');
          setIsOpen(false);
        },
        badge: 'LAUNCH'
      })),

      // 4. Socials & YouTube
      ...youtubeChannels.map((yt) => ({
        id: `yt-${yt.name}`,
        title: yt.name,
        subtitle: `${yt.focus} • ${yt.subscribers}`,
        category: 'Socials & Media' as const,
        icon: <Film size={16} className="text-red-500" />,
        action: () => {
          if (yt.url) window.open(yt.url, '_blank');
          setIsOpen(false);
        },
        badge: 'YOUTUBE'
      })),
      ...socialLinks.map((s) => ({
        id: `soc-${s.name}`,
        title: s.name,
        subtitle: `${s.username} • ${s.description}`,
        category: 'Socials & Media' as const,
        icon: <ExternalLink size={16} className="text-cyan-400" />,
        action: () => {
          if (s.url) window.open(s.url, '_blank');
          setIsOpen(false);
        },
        badge: s.type.toUpperCase()
      }))
    ];

    return list;
  }, [router, isMuted]);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    const clean = query.toLowerCase().trim();
    return allCommands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(clean) ||
        (cmd.subtitle && cmd.subtitle.toLowerCase().includes(clean)) ||
        cmd.category.toLowerCase().includes(clean)
    );
  }, [allCommands, query]);

  // Handle arrow key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      sfx.playHover();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      sfx.playHover();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        sfx.playClick();
        filteredCommands[selectedIndex].action();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#040209]/80 backdrop-blur-2xl"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            className="relative w-full max-w-2xl bg-[#090614]/95 border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(255,0,127,0.25)] overflow-hidden flex flex-col max-h-[75vh]"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Ambient inner glows */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary/20 rounded-full filter blur-3xl pointer-events-none" />

            {/* Search Input Bar */}
            <div className="relative flex items-center gap-3 px-5 py-4 border-b border-white/10 shrink-0">
              <Search size={18} className="text-primary animate-pulse shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command, project, channel, or page... (↑↓ to navigate)"
                className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none font-mono"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-gray-500 hover:text-white text-xs font-mono p-1"
                >
                  CLEAR
                </button>
              )}
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] font-mono text-gray-400 shrink-0">
                <span>ESC</span>
              </div>
            </div>

            {/* Results List */}
            <div className="overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-white/10 flex-1">
              {filteredCommands.length === 0 ? (
                <div className="text-center py-12 text-gray-500 font-mono text-xs">
                  No commands or projects match &ldquo;{query}&rdquo;
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={cmd.id}
                      onClick={() => {
                        sfx.playClick();
                        cmd.action();
                      }}
                      onMouseEnter={() => {
                        setSelectedIndex(idx);
                        sfx.playHover();
                      }}
                      className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? 'bg-gradient-to-r from-primary/20 via-secondary/15 to-transparent border border-primary/40 shadow-[0_0_15px_rgba(255,0,127,0.15)] translate-x-1'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-primary/20 text-white' : 'bg-white/5 text-gray-400'}`}>
                          {cmd.icon}
                        </div>
                        <div className="min-w-0">
                          <span className={`text-xs font-bold font-mono block truncate ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                            {cmd.title}
                          </span>
                          {cmd.subtitle && (
                            <span className="text-[10px] text-gray-500 font-mono block truncate">
                              {cmd.subtitle}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {cmd.badge && (
                          <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            cmd.badge === 'HOT' ? 'bg-primary text-white' :
                            cmd.badge === 'PDF' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            'bg-white/5 text-gray-400 border border-white/10'
                          }`}>
                            {cmd.badge}
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-gray-500 hidden sm:inline-block">
                          {cmd.category}
                        </span>
                        <ChevronRight size={12} className={`transition-transform ${isSelected ? 'text-primary translate-x-0.5' : 'text-gray-600'}`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="px-4 py-3 bg-[#06040d] border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500 shrink-0">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="bg-white/10 px-1.5 py-0.5 rounded text-gray-300">↑↓</span> to navigate
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-white/10 px-1.5 py-0.5 rounded text-gray-300">↵</span> to execute
                </span>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Sparkles size={10} />
                <span>COMMAND CENTER</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
