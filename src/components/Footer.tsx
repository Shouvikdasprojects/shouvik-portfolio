'use client';

import Link from 'next/link';
import { ArrowUp, Mail, Globe, ChevronDown } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/5 bg-[#06040d]/95 pt-20 pb-16 overflow-hidden z-20">
      {/* Dynamic ambient background glow */}
      <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Scroll to Top - elegant placement */}
        <div className="absolute top-0 right-6 -translate-y-1/2">
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full border border-white/10 hover:border-primary/50 bg-[#06040d] hover:bg-primary/10 text-gray-400 hover:text-white flex items-center justify-center transition-all group cursor-pointer shadow-lg"
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* 4-Column Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
          
          {/* Column 1: Brand Info (Spans 4 columns) */}
          <div className="lg:col-span-4 flex flex-col items-start gap-4 text-left">
            <span className="text-xl font-black tracking-widest text-white font-mono">
              SHOUVIK <span className="text-primary">DAS</span>
            </span>
            <p className="text-gray-400 text-xs max-w-sm leading-relaxed">
              I'm a UI/UX Designer, Web3D Developer, and digital content creator from India. I craft high-performance, immersive web environments. Beyond coding, I'm an avid reader of Manga and Manhwa, and I manage 3 active YouTube channels dedicated to Anime explanations and visual storytelling. I'm also an absolute foodie and travel enthusiast!
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3 mt-2">
              {/* Facebook */}
              <a 
                href="https://www.facebook.com/share/1EWixcZYDr/" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 hover:text-white flex items-center justify-center text-gray-400 transition-all cursor-pointer"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a 
                href="https://x.com/shouvikdas155" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 hover:text-white flex items-center justify-center text-gray-400 transition-all cursor-pointer"
                aria-label="Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/shouvik_das_official" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 hover:text-white flex items-center justify-center text-gray-400 transition-all cursor-pointer"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* Email */}
              <a 
                href="mailto:shouvikdaswork@gmail.com" 
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 hover:text-white flex items-center justify-center text-gray-400 transition-all cursor-pointer"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (Spans 2 columns) */}
          <div className="lg:col-span-2 flex flex-col items-start gap-4 text-left">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Quick Links</span>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-300">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-300">About</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-300">Projects</Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-300">Blog</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-300">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Policies (Spans 2 columns) */}
          <div className="lg:col-span-2 flex flex-col items-start gap-4 text-left">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Legal</span>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-400">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-300">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-300">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: FAQ (Spans 4 columns) */}
          <div className="lg:col-span-4 flex flex-col items-start gap-4 text-left">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Frequently Asked Questions</span>
            
            <div className="flex flex-col gap-3 w-full">
              {/* FAQ 1 */}
              <details className="group border-b border-white/5 pb-2.5 cursor-pointer w-full">
                <summary className="text-xs font-bold text-gray-300 hover:text-white flex justify-between items-center list-none outline-none select-none transition-colors py-1">
                  <span className="pr-4">Open to collabs?</span>
                  <ChevronDown size={14} className="text-primary group-open:rotate-180 transition-transform duration-300 shrink-0" />
                </summary>
                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed pr-6 pl-1 transition-all duration-300">
                  Yes! I am always open to creative visual collaborations, spatial Web3D contracts, and next-gen frontend products. Let's build!
                </p>
              </details>

              {/* FAQ 2 */}
              <details className="group border-b border-white/5 pb-2.5 cursor-pointer w-full">
                <summary className="text-xs font-bold text-gray-300 hover:text-white flex justify-between items-center list-none outline-none select-none transition-colors py-1">
                  <span className="pr-4">What is your tech stack?</span>
                  <ChevronDown size={14} className="text-primary group-open:rotate-180 transition-transform duration-300 shrink-0" />
                </summary>
                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed pr-6 pl-1 transition-all duration-300">
                  My core stack includes Next.js, React, Three.js (React Three Fiber), Tailwind CSS, Framer Motion, and Supabase for real-time relational persistence.
                </p>
              </details>

              {/* FAQ 3 */}
              <details className="group border-b border-white/5 pb-2.5 cursor-pointer w-full">
                <summary className="text-xs font-bold text-gray-300 hover:text-white flex justify-between items-center list-none outline-none select-none transition-colors py-1">
                  <span className="pr-4">How to contact?</span>
                  <ChevronDown size={14} className="text-primary group-open:rotate-180 transition-transform duration-300 shrink-0" />
                </summary>
                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed pr-6 pl-1 transition-all duration-300">
                  You can drop me an inquiry through the Contact page form or directly email me at shouvikdaswork@gmail.com. I usually respond in less than 24 hours.
                </p>
              </details>
            </div>
          </div>

        </div>

        {/* Bottom Banner with nice subtle border separated from the main columns */}
        <div className="border-t border-gray-800/50 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-mono">
          <p>© {new Date().getFullYear()} Shouvik Das. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/portfolio" className="hover:text-primary transition-colors">Portfolio</Link>
            <Link href="/articles" className="hover:text-primary transition-colors">Tech Discover Blog</Link>
            <a href="https://heylink.me/ShouvikDas/" className="hover:text-primary transition-colors flex items-center gap-0.5"><Globe size={10} /> heylink.me/ShouvikDas</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
