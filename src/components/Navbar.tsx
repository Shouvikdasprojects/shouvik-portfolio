'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Search, Volume2, VolumeX, Command, Calendar } from 'lucide-react';
import { sfx } from '@/lib/soundEffects';
import ThemeAccentSwitcher from '@/components/ThemeAccentSwitcher';
import AmbientAudioPlayer from '@/components/AmbientAudioPlayer';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Resume', href: '/resume' }, // Dedicated Executive CV
  { name: 'Socials', href: '/socials' },
  { name: 'Blog', href: '/articles' },
  { name: 'Uploads', href: '/uploads' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    setIsMuted(sfx.getMuted());
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const next = sfx.toggleMute();
    setIsMuted(next);
  };

  const openCommandPalette = () => {
    sfx.playWarp();
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  const openBookingModal = () => {
    sfx.playWarp();
    window.dispatchEvent(new CustomEvent('open-booking-modal'));
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
          <nav className="glass-panel px-6 py-3 rounded-full flex items-center justify-between shadow-2xl relative border border-white/10 bg-[#080515]/80 backdrop-blur-xl">
          
          {/* Brand Logo */}
          <Link 
            href="/" 
            className="relative group flex items-center gap-2"
            onClick={() => sfx.playClick()}
            onMouseEnter={() => sfx.playHover()}
          >
            <span className="text-xl font-black tracking-widest font-mono text-white transition-colors duration-300">
              S<span className="text-primary transition-colors duration-300">D</span>.
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300 shadow-[0_0_10px_rgba(255,0,127,0.8)]" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => sfx.playClick()}
                  onMouseEnter={() => sfx.playHover()}
                  className={`text-sm font-semibold tracking-wide relative group transition-all duration-300 ${
                    isActive 
                      ? 'text-primary drop-shadow-[0_0_8px_rgba(255,0,127,0.5)] font-bold' 
                      : 'text-gray-300 hover:text-primary'
                  }`}
                >
                  {link.name}
                  {isActive ? (
                    <motion.span 
                      layoutId="activeNavUnderline"
                      className="absolute -bottom-1 left-0 w-full h-[2.5px] bg-primary shadow-[0_0_10px_rgba(255,0,127,0.8)] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary/40 group-hover:w-full transition-all duration-300" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Hub: Color Switcher + Ambient Audio + Cmd Palette + Book Call + Hire Me */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Cyber Accent Color Theme Switcher */}
            <ThemeAccentSwitcher />

            {/* Ambient Synth Audio Player */}
            <AmbientAudioPlayer />

            {/* Command Palette Trigger */}
            <button
              onClick={openCommandPalette}
              onMouseEnter={() => sfx.playHover()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-xs font-mono transition-all cursor-pointer"
              title="Search & Commands (⌘K)"
            >
              <Search size={12} className="text-primary" />
              <kbd className="text-[9px] bg-black/40 px-1 py-0.5 rounded text-gray-400 border border-white/10">⌘K</kbd>
            </button>

            {/* 1-Click Book a Call Button */}
            <button
              onClick={openBookingModal}
              onMouseEnter={() => sfx.playHover()}
              className="px-3 py-1.5 rounded-xl border border-white/10 hover:border-primary/40 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Schedule a 1-on-1 Discovery Call"
            >
              <Calendar size={12} className="text-cyan-400" />
              <span className="hidden xl:inline">Book Call</span>
            </button>

            {/* Hire Me CTA */}
            <Link 
              href="/contact"
              onClick={() => sfx.playClick()}
              onMouseEnter={() => sfx.playHover()}
              className="px-4 py-1.5 rounded-xl border border-primary/40 hover:border-primary bg-primary/10 hover:bg-primary text-white hover:text-white font-bold text-xs tracking-wider transition-all duration-300 flex items-center gap-1 shadow-[0_0_15px_rgba(255,0,127,0.35)] hover:shadow-[0_0_25px_rgba(255,0,127,0.6)] cursor-pointer neon-border"
            >
              HIRE ME <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Mobile Navigation Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={openCommandPalette}
              className="p-2 text-gray-400 hover:text-white rounded-lg bg-white/5 border border-white/10"
              title="Search"
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => {
                sfx.playClick();
                setIsOpen(!isOpen);
              }}
              className="text-gray-300 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>
    </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 w-full h-screen bg-[#06040d]/98 backdrop-blur-2xl z-40 md:hidden flex flex-col justify-center items-center gap-6 px-6"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-gray-300 hover:text-white p-2"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>

            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    sfx.playClick();
                    setIsOpen(false);
                  }}
                  className={`text-xl font-bold transition-all duration-300 ${
                    isActive 
                      ? 'text-primary drop-shadow-[0_0_8px_rgba(255,0,127,0.5)]' 
                      : 'text-gray-200 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <div className="flex gap-4 mt-4 w-full max-w-xs justify-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  openCommandPalette();
                }}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Search size={14} /> SEARCH
              </button>

              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-xs tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(255,0,127,0.5)] cursor-pointer"
              >
                HIRE ME <ArrowUpRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
