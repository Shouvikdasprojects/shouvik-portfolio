'use client';

import { useRef, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function TiltCard({ children, className = '' }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Framer Motion values for tracking cursor coords
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Apply spring-physics for buttery-smooth responsiveness
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), {
    damping: 25,
    stiffness: 150,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), {
    damping: 25,
    stiffness: 150,
  });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate normalized cursor coordinates (-0.5 to +0.5)
    const mouseX = (event.clientX - rect.left) / width - 0.5;
    const mouseY = (event.clientY - rect.top) / height - 0.5;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    // Reset back to center smoothly
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`glass-panel tilt-element cursor-pointer overflow-hidden p-6 ${className}`}
    >
      <div 
        style={{ transform: 'translateZ(30px)' }} 
        className="tilt-inner w-full h-full relative z-10"
      >
        {children}
      </div>
      
      {/* Background glare glow that matches cursor coordinates */}
      <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}
