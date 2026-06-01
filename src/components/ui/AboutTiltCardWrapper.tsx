'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import TiltCard with ssr: false inside a Client Component wrapper
const TiltCard = dynamic(() => import('./TiltCard'), {
  ssr: false,
});

interface AboutTiltCardWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function AboutTiltCardWrapper({ children, className = '' }: AboutTiltCardWrapperProps) {
  return (
    <Suspense fallback={
      <div className="w-full max-w-[380px] aspect-[4/5] rounded-xl bg-[#0b0814]/65 border border-white/5 flex items-center justify-center shadow-2xl relative">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff007f]"></div>
      </div>
    }>
      <TiltCard className={className}>
        {children}
      </TiltCard>
    </Suspense>
  );
}
