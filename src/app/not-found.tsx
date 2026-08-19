import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent px-6">
        {/* Ambient glows */}
        <div className="ambient-glow -top-48 -left-48 bg-primary/20 pointer-events-none" />
        <div className="ambient-glow -bottom-48 -right-48 bg-secondary/15 pointer-events-none" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/60 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 rounded-full bg-secondary/60 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/6 w-1 h-1 rounded-full bg-cyan-400/60 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />

        <div className="relative z-10 text-center flex flex-col items-center gap-8 max-w-2xl">
          {/* Big 404 */}
          <div className="relative">
            <h1
              className="text-[12rem] sm:text-[16rem] font-black leading-none select-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,0,127,0.15) 0%, rgba(139,92,246,0.15) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 60px rgba(255,0,127,0.3))',
              }}
            >
              404
            </h1>
            {/* Glitch line effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </div>
          </div>

          {/* Badge */}
          <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 border border-primary/25 px-4 py-2 rounded-full uppercase tracking-widest">
            SECTOR NOT FOUND
          </span>

          <div className="flex flex-col gap-3">
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              You&apos;ve drifted into{' '}
              <span className="gradient-text-primary">deep space</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
              The page you&apos;re looking for doesn&apos;t exist or has been moved to another galaxy. Navigate back to safety.
            </p>
          </div>

          {/* Terminal style hint */}
          <div className="bg-[#05030e]/80 border border-white/8 rounded-2xl px-6 py-4 font-mono text-xs text-left w-full max-w-sm">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-gray-500 text-[10px] ml-1">error.log</span>
            </div>
            <p className="text-gray-500"><span className="text-primary">$</span> route <span className="text-red-400">NOT_FOUND</span></p>
            <p className="text-gray-500"><span className="text-primary">$</span> status <span className="text-yellow-400">404</span></p>
            <p className="text-gray-500"><span className="text-primary">$</span> suggest <span className="text-emerald-400">&quot;/&quot;</span></p>
          </div>

          {/* Navigation links */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(255,0,127,0.4)] hover:shadow-[0_0_30px_rgba(255,0,127,0.6)] cursor-pointer"
            >
              ← Return Home
            </Link>
            <Link
              href="/projects"
              className="px-6 py-3 rounded-xl border border-white/15 hover:border-primary/50 bg-white/5 hover:bg-primary/10 text-white font-bold text-xs tracking-wider transition-all cursor-pointer"
            >
              View Projects
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl border border-white/15 hover:border-primary/50 bg-white/5 hover:bg-primary/10 text-white font-bold text-xs tracking-wider transition-all cursor-pointer"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
