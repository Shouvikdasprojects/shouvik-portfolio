'use client';

export default function AboutLoading() {
  return (
    <div className="fixed inset-0 w-full h-screen bg-[#040209] flex flex-col items-center justify-center z-50 select-none overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-[#ff007f]/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[340px] h-[340px] rounded-full bg-[#8b5cf6]/10 blur-[80px] pointer-events-none" />

      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Pulsing visual core container */}
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Pulsing neon pink halo */}
          <div className="absolute inset-0 rounded-full border border-[#ff007f]/30 animate-[ping_2s_infinite]" />
          {/* Spinning gradient ring */}
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#ff007f] border-b-transparent border-l-transparent animate-spin" />
          {/* Core branding symbol */}
          <span className="font-sans font-black text-xl text-white tracking-widest drop-shadow-[0_0_8px_#ff007f]">SD</span>
        </div>

        {/* Status texts */}
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-sm font-bold font-sans tracking-[0.25em] text-white uppercase drop-shadow-[0_0_4px_rgba(255,255,255,0.15)] animate-pulse">
            LOADING CREATIVE HUB
          </span>
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">
            Fetching dynamic social streams...
          </span>
        </div>
      </div>
    </div>
  );
}
