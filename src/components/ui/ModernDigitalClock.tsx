'use client';

import { useEffect, useState } from 'react';

export default function ModernDigitalClock() {
  const [timeStr, setTimeStr] = useState<string>('');
  const [secPulse, setSecPulse] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    
    const updateClock = () => {
      const now = new Date();
      
      // Parse strictly in Indian Standard Time (IST)
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      const parts = formatter.formatToParts(now);
      const hour = parts.find((p) => p.type === 'hour')?.value || '00';
      const minute = parts.find((p) => p.type === 'minute')?.value || '00';
      const second = parts.find((p) => p.type === 'second')?.value || '00';
      const dayPeriod = parts.find((p) => p.type === 'dayPeriod')?.value || 'AM';

      setTimeStr(`${hour}:${minute}:${second} ${dayPeriod}`);
      setSecPulse((prev) => !prev);
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!mounted || !timeStr) {
    // Plain skeleton placeholder to prevent Cumulative Layout Shifts (CLS)
    return (
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-5 py-1.5 text-xs font-semibold tracking-wider w-fit flex items-center gap-2 select-none opacity-50">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
        <span className="text-gray-400 font-mono">00:00:00 AM IST</span>
      </div>
    );
  }

  // Parse strings to create pulsing neon separators
  const [hms, period] = timeStr.split(' ');
  const [h, m, s] = hms.split(':');

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-5 py-1.5 text-xs font-semibold tracking-wider w-fit flex items-center gap-2 select-none hover:border-[#ff007f]/30 hover:bg-[#ff007f]/5 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
      {/* Dynamic pulsing glowing dot */}
      <span className={`w-1.5 h-1.5 rounded-full transition-opacity duration-500 ${
        secPulse ? 'bg-[#ff007f] shadow-[0_0_8px_#ff007f]' : 'bg-[#ff007f]/40 shadow-[0_0_3px_#ff007f]/20'
      }`} />
      
      {/* Ticking Digital Time Display */}
      <span className="font-mono text-gray-300 flex items-center gap-0.5">
        <span className="text-white drop-shadow-[0_0_6px_rgba(255,0,127,0.3)]">{h}</span>
        <span className={`text-[#ff007f] font-bold ${secPulse ? 'opacity-100' : 'opacity-30'} transition-opacity duration-300`}>:</span>
        <span className="text-white drop-shadow-[0_0_6px_rgba(255,0,127,0.3)]">{m}</span>
        <span className={`text-[#ff007f] font-bold ${secPulse ? 'opacity-100' : 'opacity-30'} transition-opacity duration-300`}>:</span>
        <span className="text-white drop-shadow-[0_0_6px_rgba(255,0,127,0.3)]">{s}</span>
        <span className="ml-1 text-[10px] text-[#8b5cf6] font-bold tracking-normal drop-shadow-[0_0_4px_rgba(139,92,246,0.2)]">{period}</span>
        <span className="ml-1 text-[9px] text-gray-500 font-bold">IST</span>
      </span>
    </div>
  );
}
