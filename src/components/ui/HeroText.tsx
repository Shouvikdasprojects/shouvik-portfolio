'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import ModernDigitalClock from './ModernDigitalClock';

interface HeroTextProps {
  name: string;
  bio: string;
}

const ROLES = [
  'UI/UX Designer',
  'Web3D Developer',
  'Anime Content Creator',
  'Travel Photographer',
  'Video Editor',
];

function TypewriterRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex]);

  return (
    <span className="gradient-text-primary font-black">
      {displayed}
      <span className="animate-pulse text-primary ml-0.5">|</span>
    </span>
  );
}

function GlitchName({ name }: { name: string }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${glitching ? 'glitch-name' : ''}`} data-text={name}>
      <span className="gradient-text-primary">{name}</span>
    </span>
  );
}

export default function HeroText({ name, bio }: HeroTextProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.13, delayChildren: 0.05 },
    },
  } as const;

  const itemVariants = {
    hidden: { y: 32, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 75, damping: 14, mass: 0.8 },
    },
  } as const;

  const badgeVariants = {
    hidden: { scale: 0.85, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 110, damping: 15 },
    },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 text-left relative z-10"
    >
      {/* Badge row */}
      <div className="flex flex-wrap items-center gap-3">
        <motion.div
          variants={badgeVariants}
          className="px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] text-primary uppercase shadow-[0_0_15px_rgba(255,0,127,0.15)] flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          🌟 AVAILABLE FOR HIRE
        </motion.div>
        <motion.div variants={badgeVariants}>
          <ModernDigitalClock />
        </motion.div>
      </div>

      {/* Main title */}
      <motion.h1
        variants={itemVariants}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-black tracking-tight text-white leading-[1.12]"
      >
        Hi, I'm <GlitchName name={name} />
        <br />
        a <TypewriterRole />
      </motion.h1>

      {/* Bio */}
      <motion.p
        variants={itemVariants}
        className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl"
      >
        {bio}
      </motion.p>
    </motion.div>
  );
}
