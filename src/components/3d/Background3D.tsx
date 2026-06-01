'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

const CosmosScene = dynamic(() => import('./CosmosScene'), {
  ssr: false,
  loading: () => null, // Renders a blank canvas layer during asynchronous Three.js loading
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

  // Monitor resize and scroll events
  useEffect(() => {
    setMounted(true);

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

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Float nodes distributed down the travel lane of the camera
  const nodes = useMemo<PropType[]>(() => {
    // Fewer float nodes on mobile for maximum GPU optimization
    const baseNodes: PropType[] = [
      // Hero Zone (Z = -2 to -10)
      { position: [-4, 2, -6], type: 'torus', color: '#8b5cf6', speed: 0.5 },
      { position: [4.5, -2.5, -9], type: 'octahedron', color: '#0ea5e9', speed: 0.7 },
      
      // Projects Zone (Z = -15 to -28)
      { position: [-5, -2, -18], type: 'dodecahedron', color: '#ec4899', speed: 0.4 },
      { position: [5.2, 3, -24], type: 'torus', color: '#a855f7', speed: 0.6 },
      
      // Social Hub Zone (Z = -30 to -42)
      { position: [-4.2, 2.5, -34], type: 'octahedron', color: '#06b6d4', speed: 0.8 },
      { position: [4.8, -3, -38], type: 'icosahedron', color: '#8b5cf6', speed: 0.5 },

      // Contact/Footer Zone (Z = -45 to -55)
      { position: [-2, -2.8, -48], type: 'torus', color: '#ec4899', speed: 0.7 }
    ];
    return isMobile ? baseNodes.filter((_, idx) => idx % 2 === 0) : baseNodes;
  }, [isMobile]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-screen -z-10 bg-[#040209] overflow-hidden select-none pointer-events-none">
      <CosmosScene isMobile={isMobile} scrollPercent={scrollPercent} nodes={nodes} />
    </div>
  );
}
