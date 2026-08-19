'use client';

import { useRef, useEffect } from 'react';

const techStack = [
  // Frontend
  { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', color: 'text-white', cat: 'Frontend' },
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: 'text-cyan-400', cat: 'Frontend' },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', color: 'text-blue-400', cat: 'Frontend' },
  { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', color: 'text-cyan-300', cat: 'Styling' },
  // 3D / Creative
  { name: 'Three.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg', color: 'text-white', cat: '3D & Creative' },
  { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', color: 'text-pink-400', cat: '3D & Creative' },
  // Backend / DB
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', color: 'text-green-400', cat: 'Backend' },
  { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg', color: 'text-emerald-400', cat: 'Backend' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', color: 'text-green-500', cat: 'Backend' },
  { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg', color: 'text-orange-400', cat: 'Backend' },
  // Tools
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', color: 'text-orange-500', cat: 'Tools' },
  { name: 'Vercel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg', color: 'text-white', cat: 'Tools' },
  // Mobile
  { name: 'Kotlin', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg', color: 'text-purple-400', cat: 'Mobile' },
  { name: 'Swift', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg', color: 'text-orange-400', cat: 'Mobile' },
  // Extra
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: 'text-yellow-400', cat: 'Backend' },
  { name: 'GraphQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg', color: 'text-pink-500', cat: 'Frontend' },
];

const categories = ['All', 'Frontend', '3D & Creative', 'Backend', 'Mobile', 'Styling', 'Tools'];

export default function TechStack() {
  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      <div className="ambient-glow top-1/2 -right-48 bg-secondary/8 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14 gap-3">
          <span className="text-xs font-bold text-primary font-mono uppercase tracking-widest">
            TECHNOLOGY ARSENAL
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            My <span className="gradient-text-primary">Tech Stack</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
            Battle-tested tools I use to craft spatial web experiences, mobile apps, and scalable backends.
          </p>
          <div className="w-20 h-[3px] bg-gradient-to-r from-primary to-secondary rounded-full mt-1" />
        </div>

        {/* Tech grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white/[0.025] border border-white/6 hover:bg-white/[0.05] hover:border-primary/30 hover:scale-110 transition-all duration-300 cursor-default"
              title={tech.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tech.icon}
                alt={tech.name}
                className="w-8 h-8 object-contain filter brightness-90 group-hover:brightness-110 transition-all"
                loading="lazy"
              />
              <span className="text-[9px] font-mono font-bold text-gray-500 group-hover:text-gray-300 transition-colors text-center leading-tight">
                {tech.name}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-gray-600 text-[10px] font-mono mt-8">
          + Framer Motion · GSAP · Cloudflare Workers · Drizzle ORM · FFmpeg · Express.js · PWA
        </p>
      </div>
    </section>
  );
}
