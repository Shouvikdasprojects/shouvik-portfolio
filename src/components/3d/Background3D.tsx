'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

const CosmosScene = dynamic(() => import('./CosmosScene'), {
  ssr: false,
  loading: () => null,
});

interface PropType {
  position: [number, number, number];
  type: 'torus' | 'octahedron' | 'icosahedron' | 'dodecahedron';
  color: string;
  speed: number;
}

export default function Background3D() {
  const [mounted, setMounted] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>('neon-pink');

  // Monitor resize, scroll, and theme change events
  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem('shouvik_cyber_theme') || 'neon-pink';
    setCurrentTheme(saved);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const scrolled = window.scrollY / totalHeight;
        setScrollPercent(scrolled);
      }
    };

    const handleThemeChanged = (e: CustomEvent<string>) => {
      if (e.detail) {
        setCurrentTheme(e.detail);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('theme-changed', handleThemeChanged as EventListener);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('theme-changed', handleThemeChanged as EventListener);
    };
  }, []);

  // Float nodes distributed down the travel lane of the camera with theme-reactive colors
  const nodes = useMemo<PropType[]>(() => {
    let c1 = '#8b5cf6';
    let c2 = '#0ea5e9';
    let c3 = '#ec4899';
    let c4 = '#a855f7';

    if (currentTheme === 'cyber-cyan') {
      c1 = '#00f0ff';
      c2 = '#3b82f6';
      c3 = '#a855f7';
      c4 = '#06b6d4';
    } else if (currentTheme === 'matrix-emerald') {
      c1 = '#00e676';
      c2 = '#10b981';
      c3 = '#059669';
      c4 = '#22c55e';
    } else if (currentTheme === 'sunset-gold') {
      c1 = '#f59e0b';
      c2 = '#f97316';
      c3 = '#e11d48';
      c4 = '#fbbf24';
    } else if (currentTheme === 'hyper-violet') {
      c1 = '#a855f7';
      c2 = '#ec4899';
      c3 = '#6366f1';
      c4 = '#d946ef';
    } else if (currentTheme === 'crimson-red') {
      c1 = '#ff003c';
      c2 = '#e11d48';
      c3 = '#f43f5e';
      c4 = '#fda4af';
    } else if (currentTheme === 'toxic-lime') {
      c1 = '#ccff00';
      c2 = '#84cc16';
      c3 = '#10b981';
      c4 = '#a3e635';
    } else if (currentTheme === 'ice-arctic') {
      c1 = '#38bdf8';
      c2 = '#818cf8';
      c3 = '#c084fc';
      c4 = '#7dd3fc';
    }

    const baseNodes: PropType[] = [
      // Hero Zone (Z = -2 to -10)
      { position: [-4, 2, -6], type: 'torus', color: c1, speed: 0.5 },
      { position: [4.5, -2.5, -9], type: 'octahedron', color: c2, speed: 0.7 },
      
      // Projects Zone (Z = -15 to -28)
      { position: [-5, -2, -18], type: 'dodecahedron', color: c3, speed: 0.4 },
      { position: [5.2, 3, -24], type: 'torus', color: c4, speed: 0.6 },
      
      // Social Hub Zone (Z = -30 to -42)
      { position: [-4.2, 2.5, -34], type: 'octahedron', color: c2, speed: 0.8 },
      { position: [4.8, -3, -38], type: 'icosahedron', color: c1, speed: 0.5 },

      // Contact/Footer Zone (Z = -45 to -55)
      { position: [-2, -2.8, -48], type: 'torus', color: c3, speed: 0.7 }
    ];
    return isMobile ? baseNodes.filter((_, idx) => idx % 2 === 0) : baseNodes;
  }, [isMobile, currentTheme]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-screen -z-10 bg-[#040209] overflow-hidden select-none pointer-events-none transition-colors duration-500">
      <CosmosScene isMobile={isMobile} scrollPercent={scrollPercent} nodes={nodes} theme={currentTheme} />
    </div>
  );
}
