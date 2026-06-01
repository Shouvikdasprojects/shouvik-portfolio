'use client';

import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
  download?: string | boolean;
  disabled?: boolean;
  target?: string;
  rel?: string;
}

export default function GlowButton({ 
  children, 
  onClick, 
  className = '', 
  href, 
  download, 
  disabled = false,
  target,
  rel
}: GlowButtonProps) {
  
  const handleClick = () => {
    if (disabled) return;
    
    // Beautiful premium confetti burst!
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#a855f7', '#0ea5e9', '#ec4899', '#ffffff'],
      disableForReducedMotion: true
    });

    if (onClick) onClick();
  };

  const buttonContent = (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={handleClick}
      disabled={disabled}
      className={`relative group px-8 py-3.5 rounded-full font-bold text-white tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] overflow-hidden ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {/* 1. Neon glowing border wrapper */}
      <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary animate-gradient bg-[length:200%_auto] rounded-full p-[2px]">
        <span className="absolute inset-0 bg-[#07050f] rounded-full transition-opacity duration-300 group-hover:opacity-0" />
      </span>

      {/* 2. Glassmorphic internal contents */}
      <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-[#07050f] font-semibold text-sm tracking-wider">
        {children}
      </span>
      
      {/* 3. Glowing backdrop flare */}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[200%] bg-gradient-to-r from-primary to-secondary rounded-full filter blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none" />
    </motion.button>
  );

  if (href) {
    return (
      <a 
        href={href} 
        download={download} 
        target={target}
        rel={rel}
        className="inline-block"
        onClick={handleClick}
      >
        {buttonContent}
      </a>
    );
  }

  return buttonContent;
}
