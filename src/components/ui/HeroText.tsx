'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ModernDigitalClock from './ModernDigitalClock';

interface HeroTextProps {
  name: string;
  bio: string;
}

const ROLES = [
  'UI/UX Architect',
  'Spatial Web3D Developer',
  'Anime Content Director',
  'Cinematographer & Editor',
  'Next.js 16 Specialist',
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
    let timeoutId: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setGlitching(true);
      timeoutId = setTimeout(() => setGlitching(false), 300);
    }, 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
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
      <motion.div
        variants={itemVariants}
        className="relative p-5 rounded-2xl bg-white/[0.025] border border-white/6 backdrop-blur-sm"
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-t-2xl" />
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          An innovative{' '}
          <span className="text-white font-semibold">UI/UX Architect</span>,{' '}
          <span className="text-white font-semibold">Web3D Developer</span>, and{' '}
          <span className="text-white font-semibold">digital media director</span>{' '}
          from India. I specialize in building ultra-performant, hardware-accelerated{' '}
          <span className="text-primary/90">spatial web experiences</span>{' '}
          powered by Next.js, Three.js, and bespoke design systems. Beyond engineering, I orchestrate a{' '}
          <span className="text-primary/90">25,000+ follower</span>{' '}
          creator ecosystem — directing immersive{' '}
          <span className="text-secondary/90">anime storytelling</span>{' '}
          and visual media. An avid connoisseur of Manga, Manhwa, and international gastronomy.
        </p>
      </motion.div>
    </motion.div>
  );
}
