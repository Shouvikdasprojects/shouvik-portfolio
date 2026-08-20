'use client';

import { useState, useEffect } from 'react';
import { Globe, Users, Activity, Sparkles } from 'lucide-react';

const CITIES = [
  'Tokyo, Japan',
  'San Francisco, US',
  'Bengaluru, India',
  'London, UK',
  'Kolkata, India',
  'Berlin, Germany',
  'Singapore',
  'Toronto, Canada',
];

export default function LiveTrafficIndicator() {
  const [currentCityIdx, setCurrentCityIdx] = useState(0);
  const [activeCount, setActiveCount] = useState(14);

  useEffect(() => {
    const cityInterval = setInterval(() => {
      setCurrentCityIdx((prev) => (prev + 1) % CITIES.length);
    }, 4000);

    const countInterval = setInterval(() => {
      setActiveCount(prev => Math.floor(Math.random() * 8) + 12);
    }, 10000);

    return () => {
      clearInterval(cityInterval);
      clearInterval(countInterval);
    };
  }, []);

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#090518]/90 border border-white/10 backdrop-blur-xl shadow-lg">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <span className="text-[11px] font-mono font-bold text-white">
          {activeCount} Live Explorers
        </span>
      </div>

      <span className="text-gray-600">|</span>

      <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
        <Globe size={12} className="text-cyan-400 shrink-0" />
        <span className="truncate max-w-[140px] sm:max-w-none">
          Recent: <span className="text-primary font-bold">{CITIES[currentCityIdx]}</span>
        </span>
      </div>
    </div>
  );
}
