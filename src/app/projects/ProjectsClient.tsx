'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TiltCard from '@/components/ui/TiltCard';
import { projectsList as staticProjects } from '@/lib/realData';
import { ExternalLink, Sparkles, X, CheckCircle2, Layers, Cpu, Database, Terminal, Globe, ChevronRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '@/lib/soundEffects';

const FILTER_TABS = [
  { label: 'All', key: 'all' },
  { label: '🌐 Web3D', key: 'web3d' },
  { label: '⚛ Frontend', key: 'frontend' },
  { label: '🎌 Anime', key: 'anime' },
  { label: '🛠 Tools', key: 'tools' },
];

function matchFilter(project: typeof staticProjects[number], key: string): boolean {
  if (key === 'all') return true;
  const titleLower = project.title.toLowerCase();
  const descLower = project.description.toLowerCase();
  const stackLower = project.techStack.join(' ').toLowerCase();
  if (key === 'anime') return titleLower.includes('ani') || titleLower.includes('otaku') || titleLower.includes('manga') || descLower.includes('anime');
  if (key === 'web3d') return stackLower.includes('three') || stackLower.includes('webgl') || stackLower.includes('r3f') || stackLower.includes('3d') || titleLower.includes('nexus');
  if (key === 'tools') return titleLower.includes('downloader') || titleLower.includes('aether') || titleLower.includes('svk');
  if (key === 'frontend') return stackLower.includes('next') || stackLower.includes('react') || stackLower.includes('typescript');
  return true;
}

export default function ProjectsClient() {
  const [projects, setProjects] = useState<typeof staticProjects>(staticProjects);
  const [selectedProject, setSelectedProject] = useState<typeof staticProjects[number] | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch dynamic projects from API
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.projects) {
          setProjects(data.projects);
        }
      })
      .catch(err => console.error("Error fetching projects from API:", err));
  }, []);

  // Prevent background scroll when modal is active
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredProjects = projects.filter(p => matchFilter(p, activeFilter));

  return (
    <>
      <Navbar />

      <section className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-transparent">
        {/* Colorful ambient background blobs */}
        <div className="ambient-glow -top-48 -left-48 bg-primary/15 pointer-events-none" />
        <div className="ambient-glow top-1/2 -right-48 bg-secondary/10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-10 gap-3">
            <span className="text-xs font-bold text-primary font-mono tracking-widest uppercase animate-pulse">
              CREATIVE BUILDS &amp; DESIGNS
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              My Featured <span className="gradient-text-primary">Applications</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
              Explore a collection of highly optimized anime media hubs, custom stream downloader web utilities, and immersive 3D physical showroom portals.
            </p>
            <div className="w-20 h-[3px] bg-gradient-to-r from-primary to-secondary rounded-full mt-2" />
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
            {[
              { value: `${projects.length}`, label: 'Total Projects' },
              { value: `${projects.filter(p => p.featured).length}`, label: 'Featured' },
              { value: '8+', label: 'Tech Stacks Used' },
              { value: '100%', label: 'Production Ready' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 text-xs font-mono">
                <span className="text-primary font-black text-base">{stat.value}</span>
                <span className="text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            <Filter size={12} className="text-gray-500 mr-1" />
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { sfx.playClick(); setActiveFilter(tab.key); }}
                onMouseEnter={() => sfx.playHover()}
                className={`px-4 py-2 rounded-full text-xs font-bold font-mono border transition-all duration-300 cursor-pointer ${
                  activeFilter === tab.key
                    ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-primary/40 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <span className="text-[10px] text-gray-600 font-mono ml-2">{filteredProjects.length} found</span>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
              >
              <TiltCard key={idx} className="flex flex-col h-full bg-[#0b0814]/40 border-white/5 p-6 rounded-2xl group">
                <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6 bg-slate-900 border border-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  {/* Dark scrim on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 pointer-events-none" />

                  {/* Neon Featured Ribbon */}
                  {project.featured && (
                    <div className="neon-ribbon">★ FEATURED</div>
                  )}

                  {/* Top-right: External link quick launch */}
                  <a
                    href={project.demoUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 backdrop-blur border border-white/10 hover:border-primary hover:bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    title="Open live app"
                  >
                    <ExternalLink size={11} className="text-white" />
                  </a>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                  {project.title}
                  {project.title.toLowerCase().includes('anime') && <Sparkles size={14} className="text-primary" />}
                </h3>
                
                <p className="text-gray-400 text-xs md:text-sm mb-5 leading-relaxed flex-grow">
                  {project.description}
                </p>

                {/* Animated tech stack badges — fan out on hover */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.techStack.map((tech, tIdx) => (
                    <span 
                      key={tech} 
                      className="text-[10px] font-semibold font-mono bg-white/5 text-gray-400 border border-white/8 px-2 py-0.5 rounded hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200 cursor-default"
                      style={{ transitionDelay: `${tIdx * 20}ms` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action row */}
                <div className="flex gap-3 border-t border-white/5 pt-4 mt-auto">
                  {project.details ? (
                    <>
                      <button 
                        onClick={() => {
                          sfx.playWarp();
                          setSelectedProject(project);
                        }}
                        onMouseEnter={() => sfx.playHover()}
                        className="flex-grow py-2.5 text-center text-xs font-bold border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/15 text-white rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(255,0,127,0.1)] hover:shadow-[0_0_18px_rgba(255,0,127,0.25)]"
                      >
                        View Full Specs <Sparkles size={12} className="text-primary animate-pulse" />
                      </button>
                      <a 
                        href={project.demoUrl || '#'} 
                        target="_blank" 
                        rel="noreferrer" 
                        onClick={() => sfx.playClick()}
                        onMouseEnter={() => sfx.playHover()}
                        className="px-4 py-2.5 text-center text-xs font-bold bg-primary hover:bg-primary/90 text-white rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,0,127,0.3)] cursor-pointer"
                        title="Launch Application"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </>
                  ) : (
                    <a 
                      href={project.demoUrl || '#'} 
                      target="_blank" 
                      rel="noreferrer" 
                      onClick={() => sfx.playClick()}
                      onMouseEnter={() => sfx.playHover()}
                      className="w-full py-2.5 text-center text-xs font-bold bg-primary hover:bg-primary/90 text-white rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,0,127,0.3)] cursor-pointer"
                    >
                      Explore Application <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </TiltCard>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 3D transition details modal overlay */}
      <AnimatePresence>
        {selectedProject && selectedProject.details && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#040209]/80 backdrop-blur-2xl overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-full max-w-4xl bg-[#090611]/90 border border-white/10 rounded-2xl p-6 md:p-8 my-auto shadow-[0_0_60px_rgba(255,0,127,0.25)] overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background Ambient Glow inside modal */}
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/20 rounded-full filter blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-secondary/20 rounded-full filter blur-[80px] pointer-events-none" />

              {/* Close Button */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-primary hover:bg-primary/10 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer z-20 group"
                aria-label="Close modal"
              >
                <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Header section */}
              <div className="relative z-10 mb-8 pb-6 border-b border-white/5">
                <span className="text-[9px] font-bold font-mono tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded uppercase mb-3 inline-block">
                  System Architecture & Overview
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2 mb-2">
                  {selectedProject.title}
                  <Sparkles size={20} className="text-primary animate-pulse" />
                </h2>
                <p className="text-primary font-mono text-xs md:text-sm font-bold tracking-wide italic">
                  &ldquo;{selectedProject.details.tagline}&rdquo;
                </p>
              </div>

              {/* Body Content */}
              <div className="relative z-10 space-y-8 text-left">
                {/* 1. Overview */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <ChevronRight size={14} className="text-primary" /> Project Overview
                  </h3>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-5">
                    {selectedProject.details.overview}
                  </p>
                </div>

                {/* 2. Core Features */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <ChevronRight size={14} className="text-primary" /> Core Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.details.features.map((feature, fIdx) => (
                      <div key={fIdx} className="bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all duration-300 hover:translate-y-[-2px] group">
                        <h4 className="font-bold text-white text-xs md:text-sm mb-1.5 flex items-center gap-2 group-hover:text-primary transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_#ff007f]" />
                          {feature.title}
                        </h4>
                        <p className="text-gray-400 text-[11px] md:text-xs leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Tech Stack HUD */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <ChevronRight size={14} className="text-primary" /> Tech Stack Integrations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-5 md:p-6">
                    {selectedProject.details.techStack.frontend && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold font-mono text-gray-500 uppercase flex items-center gap-1.5">
                          <Layers size={10} className="text-primary" /> Frontend Core
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.details.techStack.frontend.map((tech) => (
                            <span key={tech} className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">{tech}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedProject.details.techStack.styling && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold font-mono text-gray-500 uppercase flex items-center gap-1.5">
                          <Terminal size={10} className="text-secondary" /> Styling & 3D
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.details.techStack.styling.map((tech) => (
                            <span key={tech} className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">{tech}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedProject.details.techStack.backend && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold font-mono text-gray-500 uppercase flex items-center gap-1.5">
                          <Database size={10} className="text-cyan-400" /> Backend & DB
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.details.techStack.backend.map((tech) => (
                            <span key={tech} className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">{tech}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedProject.details.techStack.apis && (
                      <div className="space-y-2 sm:mt-4 md:mt-0">
                        <span className="text-[10px] font-bold font-mono text-gray-500 uppercase flex items-center gap-1.5">
                          <Cpu size={10} className="text-emerald-400" /> External APIs
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.details.techStack.apis.map((tech) => (
                            <span key={tech} className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">{tech}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedProject.details.techStack.deployment && (
                      <div className="space-y-2 sm:mt-4 md:mt-0">
                        <span className="text-[10px] font-bold font-mono text-gray-500 uppercase flex items-center gap-1.5">
                          <Globe size={10} className="text-amber-400" /> Infrastructure
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.details.techStack.deployment.map((tech) => (
                            <span key={tech} className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">{tech}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Technical Achievements */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <ChevronRight size={14} className="text-primary" /> Key Technical Achievements
                  </h3>
                  <ul className="space-y-3 bg-white/[0.01] border border-white/5 rounded-2xl p-4 md:p-5">
                    {selectedProject.details.achievements.map((achievement, aIdx) => (
                      <li key={aIdx} className="flex gap-3 items-start">
                        <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-xs md:text-sm leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="relative z-10 flex flex-col sm:flex-row gap-3 border-t border-white/5 pt-6 mt-8">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="sm:w-28 py-3 text-center text-xs font-bold border border-white/10 hover:border-white/20 bg-white/5 text-white rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
                <a 
                  href={`/projects/${selectedProject.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')}`}
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-3 text-center text-xs font-bold border border-primary/40 hover:border-primary bg-primary/10 hover:bg-primary/20 text-white rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(255,0,127,0.2)]"
                >
                  Full Case Study <Sparkles size={13} className="text-primary" />
                </a>
                <a 
                  href={selectedProject.demoUrl || "#"} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 py-3 text-center text-xs font-bold bg-primary hover:bg-primary/90 text-white rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(255,0,127,0.4)] hover:shadow-[0_0_30px_rgba(255,0,127,0.7)] cursor-pointer"
                >
                  Launch Live Application <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
