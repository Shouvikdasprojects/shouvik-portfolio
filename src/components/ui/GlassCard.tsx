import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverGlow?: boolean;
}

export default function GlassCard({ 
  children, 
  className = '', 
  hoverGlow = true 
}: GlassCardProps) {
  return (
    <div
      className={`glass-panel p-6 overflow-hidden relative group ${
        hoverGlow ? 'card-hover-glow' : ''
      } ${className}`}
    >
      {/* Dynamic border highlighting on hover */}
      <div className="absolute inset-0 border border-transparent group-hover:border-primary/20 rounded-[inherit] pointer-events-none transition-all duration-500" />
      {children}
    </div>
  );
}
