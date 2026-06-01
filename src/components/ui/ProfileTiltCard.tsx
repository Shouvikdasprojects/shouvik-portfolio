'use client';

import { useRef, MouseEvent, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ProfileTiltCardProps {
  avatarUrl: string;
  name: string;
}

export default function ProfileTiltCard({ avatarUrl, name }: ProfileTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Framer Motion values for tracking cursor coords
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Buttery-smooth spring values
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [16, -16]), {
    damping: 30,
    stiffness: 120,
    mass: 0.6,
  });
  
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-16, 16]), {
    damping: 30,
    stiffness: 120,
    mass: 0.6,
  });

  // Dynamic light effects matching cursor coords
  const glowX = useSpring(useTransform(x, [-0.5, 0.5], ['20%', '80%']), { damping: 25, stiffness: 150 });
  const glowY = useSpring(useTransform(y, [-0.5, 0.5], ['20%', '80%']), { damping: 25, stiffness: 150 });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalized coordinates (-0.5 to 0.5)
    const mouseX = (event.clientX - rect.left) / width - 0.5;
    const mouseY = (event.clientY - rect.top) / height - 0.5;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 50,
        damping: 20,
        delay: 0.3,
      }}
      className="w-full max-w-[380px] p-[3px] rounded-2xl relative group bg-[#0e0a1b]/40 backdrop-blur-xl border border-white/5 shadow-2xl cursor-pointer"
    >
      {/* Dynamic Cursor-Tracking Ambient Neon Glow Border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(circle 220px at ${glowX.get()} ${glowY.get()}, rgba(255,0,127,0.7), rgba(139,92,246,0.3) 40%, transparent)`,
          padding: '2px',
        }}
      />

      {/* Embedded 3D Parallax Card Content */}
      <div 
        style={{ transform: 'translateZ(35px)' }}
        className="photo-glow-border overflow-hidden rounded-xl bg-slate-950 border border-white/10 aspect-[4/5] relative z-10 w-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={avatarUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110" 
        />
        
        {/* Sleek bottom dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        {/* Ambient floating 3D neon particles inside the frame */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#ff007f] blur-[1px] animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="absolute top-1/2 right-1/4 w-3.5 h-3.5 rounded-full bg-[#8b5cf6] blur-[2px] animate-pulse" style={{ animationDelay: '0.6s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-[#0ea5e9] blur-[0.5px] animate-pulse" style={{ animationDelay: '0s' }} />
        </div>
      </div>

      {/* Under-card shadow glow that dynamically pops up on hover */}
      <div className="absolute -inset-2 bg-gradient-to-r from-[#ff007f]/30 to-[#8b5cf6]/30 rounded-2xl filter blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500 pointer-events-none z-[-1]" />
    </motion.div>
  );
}
