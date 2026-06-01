'use client';

import { useState, useEffect } from 'react';

export default function LiveClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ hours: '00', minutes: '00', seconds: '00', ampm: 'AM' });

  useEffect(() => {
    setMounted(true);

    const updateClock = () => {
      const date = new Date();
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).formatToParts(date);

      const hours = parts.find((p) => p.type === 'hour')?.value || '00';
      const minutes = parts.find((p) => p.type === 'minute')?.value || '00';
      const seconds = parts.find((p) => p.type === 'second')?.value || '00';
      const ampm = parts.find((p) => p.type === 'dayPeriod')?.value || 'AM';

      setTime({ hours, minutes, seconds, ampm });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 text-gray-500 font-mono text-xs w-max animate-pulse">
        <span className="flex h-1.5 w-1.5 relative shrink-0">
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gray-600"></span>
        </span>
        <span className="text-[10px] tracking-wider mr-1">IST (INDIA)</span>
        <span>--</span>
        <span className="text-gray-600">:</span>
        <span>--</span>
        <span className="text-gray-600">:</span>
        <span>--</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0b0814]/65 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(255,0,127,0.12)] text-white font-mono text-xs w-max select-none transition-all duration-300 hover:border-[#ff007f]/40 hover:shadow-[0_0_20px_rgba(255,0,127,0.25)]">
      <span className="flex h-1.5 w-1.5 relative shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff007f] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff007f]"></span>
      </span>
      
      <span className="text-gray-500 text-[9px] font-black tracking-wider uppercase">IST</span>
      
      <div className="flex items-center font-bold tracking-wide">
        <span className="text-white">{time.hours}</span>
        <span className="text-[#ff007f] px-0.5 animate-[pulse_1s_infinite] font-black">:</span>
        <span className="text-white">{time.minutes}</span>
        <span className="text-[#ff007f] px-0.5 animate-[pulse_1s_infinite] font-black">:</span>
        <span className="text-gray-400 font-normal text-[10px]">{time.seconds}</span>
      </div>
      
      <span className="text-[#8b5cf6] font-bold text-[8px] bg-[#8b5cf6]/10 px-1.5 py-0.5 rounded border border-[#8b5cf6]/20 font-mono">
        {time.ampm}
      </span>
    </div>
  );
}
