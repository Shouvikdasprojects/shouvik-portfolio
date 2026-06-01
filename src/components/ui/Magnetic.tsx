'use client';

import { useRef, MouseEvent } from 'react';
import { motion, useSpring } from 'framer-motion';

interface MagneticProps {
  children: React.ReactElement;
  range?: number;
  strength?: number;
}

export default function Magnetic({ children, range = 60, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Spring configurations for buttery smooth magnetic pull
  const springX = useSpring(0, { stiffness: 120, damping: 15, mass: 0.8 });
  const springY = useSpring(0, { stiffness: 120, damping: 15, mass: 0.8 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate center of element
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Distance from mouse to center
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    // Distance calculation
    const distance = Math.hypot(distanceX, distanceY);
    
    if (distance < range) {
      // Pull element towards mouse based on strength
      springX.set(distanceX * strength);
      springY.set(distanceY * strength);
    } else {
      // Return to center
      springX.set(0);
      springY.set(0);
    }
  };

  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
