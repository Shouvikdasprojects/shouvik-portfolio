'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Socials', href: '/socials' },
  { name: 'Blog', href: '/articles' },
  { name: 'Uploads', href: '/uploads' }, // Point to Uploads Stream
  { name: 'Portfolio', href: '/portfolio' }, // Dedicated details page
  { name: 'Contact', href: '/contact' }, // Standalone Contact page
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-[#06040d]/70 backdrop-blur-xl border-b border-white/5 py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Glowing Brand Logo */}
          <Link href="/" className="relative group">
            <span className="text-xl font-black tracking-widest font-mono text-white transition-colors duration-300">
              S<span className="text-[#ff007f] transition-colors duration-300">D</span>.
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-[#ff007f] to-[#8b5cf6] group-hover:w-full transition-all duration-300 shadow-[0_0_10px_#ff007f]" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`text-sm font-semibold tracking-wide relative group transition-all duration-300 ${
                    isActive 
                      ? 'text-[#ff007f] drop-shadow-[0_0_8px_rgba(255,0,127,0.5)] font-bold' 
                      : 'text-gray-300 hover:text-[#ff007f]'
                  }`}
                >
                  {link.name}
                  {/* Glowing active bar animated via framer-motion */}
                  {isActive ? (
                    <motion.span 
                      layoutId="activeNavUnderline"
                      className="absolute -bottom-1 left-0 w-full h-[2.5px] bg-[#ff007f] shadow-[0_0_10px_#ff007f] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#ff007f]/40 group-hover:w-full transition-all duration-300" />
                  )}
                </Link>
              );
            })}
            
            {/* Glowing neon pink "Hire Me" button */}
            <Link 
              href="/contact"
              className="px-6 py-2.5 rounded-lg border border-[#ff007f]/40 hover:border-[#ff007f] bg-[#ff007f]/10 hover:bg-[#ff007f] text-white hover:text-white font-bold text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,0,127,0.35)] hover:shadow-[0_0_25px_rgba(255,0,127,0.6)] cursor-pointer"
            >
              HIRE ME <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Mobile Menu Toggle button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 w-full h-screen bg-[#06040d]/98 backdrop-blur-2xl z-40 md:hidden flex flex-col justify-center items-center gap-8"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-gray-300 hover:text-white p-2"
            >
              <X size={28} />
            </button>

            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-2xl font-bold transition-all duration-300 ${
                    isActive 
                      ? 'text-[#ff007f] drop-shadow-[0_0_8px_rgba(255,0,127,0.5)]' 
                      : 'text-gray-200 hover:text-[#ff007f]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="px-8 py-3.5 rounded-lg bg-[#ff007f] text-white font-bold tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,0,127,0.5)] cursor-pointer"
            >
              HIRE ME <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
