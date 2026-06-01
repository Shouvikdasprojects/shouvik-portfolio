'use client';

import { motion } from 'framer-motion';
import ModernDigitalClock from './ModernDigitalClock';

interface HeroTextProps {
  name: string;
  bio: string;
}

export default function HeroText({ name, bio }: HeroTextProps) {
  // Staggered reveal animations container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 80,
        damping: 14,
        mass: 0.8
      },
    },
  } as const;

  const badgeVariants = {
    hidden: { scale: 0.85, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 110,
        damping: 15,
      },
    },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 text-left relative z-10"
    >
      {/* 1. Header Badges Row */}
      <div className="flex flex-wrap items-center gap-4 relative z-10">
        <motion.div 
          variants={badgeVariants}
          className="px-3.5 py-1.5 rounded-full bg-[#ff007f]/10 border border-[#ff007f]/25 text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] text-[#ff007f] uppercase shadow-[0_0_15px_rgba(255,0,127,0.15)] flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff007f] animate-ping" />
          🌟 WELCOME TO MY WORLD
        </motion.div>
        
        <motion.div variants={badgeVariants}>
          <ModernDigitalClock />
        </motion.div>
      </div>
      
      {/* 2. Main Title - reveal lines from bottom */}
      <motion.h1 
        variants={itemVariants}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-black tracking-tight text-white leading-[1.12]"
      >
        Hi, I'm <span className="gradient-text-primary">{name}</span>
        <br />
        a Passionate <span className="text-white">UI/UX Designer</span> 
        <br className="hidden sm:inline" />
        <span className="text-gray-300"> & </span>
        <span className="gradient-text-glow font-black">Web3D Developer</span>.
      </motion.h1>

      {/* 3. Bio Paragraph Reveal */}
      <motion.p 
        variants={itemVariants}
        className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl"
      >
        {bio} I craft high-performance websites, travel diaries, and digital anime edit platforms. Experienced in photography, videography, video editing, and thumbnail designs.
      </motion.p>
    </motion.div>
  );
}
