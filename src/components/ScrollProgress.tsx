'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(pct);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2.5px] z-[9999] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-primary via-pink-400 to-secondary transition-all duration-75 ease-out"
        style={{ width: `${progress}%`, boxShadow: '0 0 8px rgba(255,0,127,0.8), 0 0 16px rgba(255,0,127,0.4)' }}
      />
    </div>
  );
}
