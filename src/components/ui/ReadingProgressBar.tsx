'use client';

import { useState, useEffect } from 'react';

export default function ReadingProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const scrolled = (window.scrollY / totalScroll) * 100;
        setScrollProgress(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 h-[3.5px] bg-gradient-to-r from-primary via-accent to-secondary z-50 transition-all duration-75 ease-out shadow-[0_0_10px_rgba(139,92,246,0.6)]"
      style={{ width: `${scrollProgress}%` }}
    />
  );
}
