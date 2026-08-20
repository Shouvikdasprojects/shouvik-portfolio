import TiltCard from '@/components/ui/TiltCard';
import { Suspense } from 'react';
import GlowButton from '@/components/ui/GlowButton';
import GlassCard from '@/components/ui/GlassCard';
import HeroText from '@/components/ui/HeroText';
import ProfileTiltCard from '@/components/ui/ProfileTiltCard';
import Magnetic from '@/components/ui/Magnetic';
import ModernDigitalClock from '@/components/ui/ModernDigitalClock';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import SafeImage from '@/components/ui/SafeImage';
import TechStack from '@/components/TechStack';
import GitHubActivity from '@/components/GitHubActivity';
import LiveTrafficIndicator from '@/components/LiveTrafficIndicator';
import HeroInteractive3D from '@/components/3d/HeroInteractive3D';
import { personalInfo, projectsList, socialLinks as baseSocials, youtubeChannels as baseYoutube, recentUploadsList as baseUploads } from '@/lib/realData';
import { getArticles, getSocialStats, getSocialPosts } from '@/lib/db';
import { 
  Mail, 
  Download, 
  ArrowRight, 
  ExternalLink,
  Film,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Layers,
  Users,
  Activity,
  Zap,
  Code2,
  Globe,
  Box,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60; // Revalidate page data every 60 seconds (ISR)

export default async function Portfolio() {
  // Fetch dynamic news articles on the server for optimal Google indexing!
  const allArticles = await getArticles();

  // Fetch real-time social stats and active uploads stream from Supabase
  const dbStats = await getSocialStats();
  const dbPosts = await getSocialPosts(8);

  let dynamicSocials = baseSocials;
  let dynamicYoutube = baseYoutube;
  let dynamicUploads = dbPosts.length > 0 ? dbPosts : baseUploads;

  if (dbStats.length > 0) {
    // Hydrate YouTube channels with live stats
    dynamicYoutube = baseYoutube.map(ch => {
      let chId = "";
      if (ch.name.includes("Vlogs")) chId = "youtube_vlogs";
      else if (ch.name.includes("Manga")) chId = "youtube_manga";
      else if (ch.name.includes("X Anime")) chId = "youtube_xanime";
      else if (ch.name.includes("Senpai")) chId = "youtube_senpai";
      else chId = "youtube_animenation";
      
      const dbMatch = dbStats.find(s => s.id === chId);
      return {
        ...ch,
        avatar: dbMatch ? dbMatch.avatar : ch.avatar,
        subscribers: dbMatch ? dbMatch.followers : ch.subscribers
      };
    });

    // Hydrate Social links with live stats
    dynamicSocials = baseSocials.map(s => {
      let sId = "";
      if (s.name === "Personal Instagram") sId = "instagram_personal";
      else if (s.name === "Anime Nation India (Insta)") sId = "instagram_anime";
      else if (s.name === "Personal Vlogging (FB Page)") sId = "facebook_vlogs";
      else if (s.name === "Anime Nation India (FB Page)") sId = "facebook_anime";
      else if (s.name === "Shouvik Das Canvas") sId = "facebook_canvas";
      else if (s.name === "Personal Facebook") sId = "facebook_personal";
      else return s;
      
      const dbMatch = dbStats.find(stat => stat.id === sId);
      return {
        ...s,
        avatar: dbMatch ? dbMatch.avatar : s.avatar,
        followers: dbMatch ? dbMatch.followers : s.followers
      };
    });
  }

  // Slices for clean homepage presentation
  const homeProjects = projectsList.slice(0, 4); // Display 4 flagship featured projects
  const homeSocials = dynamicSocials.filter(s => s.type !== "HeyLink").slice(0, 3);
  const homeYoutube = dynamicYoutube.slice(0, 4);
  const homeArticles = allArticles.slice(0, 6);
  const homeUploads = dynamicUploads.slice(0, 4);

  return (
    <>
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-20 overflow-hidden">
        {/* Soft Background Ambient Light Glows that respond to active theme */}
        <div className="ambient-glow top-1/4 -left-32 pointer-events-none" />
        <div className="ambient-glow bottom-1/3 -right-32 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Bio & Calls to Action */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
              
              {/* Status pill & Digital Clock HUD */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-300 tracking-wide">
                    Available for Q3/Q4 Projects
                  </span>
                </div>

                <ModernDigitalClock />
              </div>

              {/* Main Heading with Glitch Name Effect */}
              <div className="flex flex-col gap-3">
                <span className="text-xs sm:text-sm font-mono font-bold text-primary tracking-widest uppercase">
                  Full-Stack Architect & Digital Media Strategist
                </span>

                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.06]">
                  Hi, I&apos;m{' '}
                  <span className="glitch-name gradient-text-primary" data-text={personalInfo.name}>
                    {personalInfo.name}
                  </span>
                </h1>
              </div>

              {/* Subheading / Narrative */}
              <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed font-normal">
                Architecting high-performance web applications, edge systems, immersive <span className="text-white font-semibold">Web3D experiences</span>, and scaling viral media networks reaching millions.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <GlowButton href="/projects" className="gap-2.5">
                  <Sparkles size={16} />
                  <span>Explore Case Studies</span>
                </GlowButton>

                <Link
                  href="/resume"
                  className="px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/40 text-white font-bold text-sm tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105"
                >
                  <FileText size={16} className="text-primary" />
                  <span>View Executive Resume</span>
                </Link>

                <a
                  href={`mailto:${personalInfo.email}`}
                  className="px-4 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/40 text-gray-300 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer"
                  title="Direct Email"
                  aria-label="Direct Email"
                >
                  <Mail size={16} />
                </a>
              </div>

              {/* Quick Social Badges */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Connect Directly:</span>
                <div className="flex gap-3 text-gray-400">
                  <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors" title="GitHub">
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  </a>
                  <a href="https://youtube.com/@shouvikdasvlogss?si=JxiajbZVf-s12mMU" target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors" title="YouTube Channel">
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/shouvik_das_official" target="_blank" rel="noreferrer" className="hover:text-pink-500 transition-colors" title="Instagram">
                    <svg className="w-4.5 h-4.5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </a>
                  <a href="https://heylink.me/ShouvikDas/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors" title="HeyLink Hub">
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V5.8H7c-3.42 0-6.2 2.78-6.2 6.2s2.78 6.2 6.2 6.2h4v-3.1H7c-1.71 0-3.1-1.39-3.1-3.1zM8.9 13.6h6.2v-3.1H8.9v3.1zm9.3-7.8h-4v3.1h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4v3.1h4c3.42 0 6.2-2.78 6.2-6.2s-2.78-6.2-6.2-6.2z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Interactive Profile Card + floating tech badges */}
            <div className="lg:col-span-5 order-first lg:order-last flex items-center justify-center relative">
              <ProfileTiltCard avatarUrl={personalInfo.avatarUrl} name={personalInfo.name} />

              {/* Floating tech badge chips — orbit around the card */}
              <div className="absolute inset-0 pointer-events-none hidden lg:block">
                {[
                  { label: 'Next.js 16', color: 'bg-white/8 border-white/15 text-white', top: '8%', left: '-8%', icon: '▲', delay: '0s' },
                  { label: 'Three.js', color: 'bg-white/8 border-white/15 text-emerald-300', top: '18%', right: '-10%', icon: '◆', delay: '-1.5s' },
                  { label: 'React 19', color: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300', bottom: '30%', left: '-12%', icon: '⚛', delay: '-3s' },
                  { label: 'Tailwind', color: 'bg-sky-500/10 border-sky-500/25 text-sky-300', bottom: '12%', right: '-8%', icon: '✦', delay: '-4.2s' },
                ].map((badge) => (
                  <div
                    key={badge.label}
                    className={`orbit-badge absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full ${badge.color} border backdrop-blur-md text-[10px] font-mono font-bold whitespace-nowrap shadow-lg`}
                    style={{
                      top: badge.top,
                      left: (badge as { left?: string }).left,
                      right: (badge as { right?: string }).right,
                      bottom: badge.bottom,
                      animationDelay: badge.delay,
                    }}
                  >
                    <span className="text-xs">{badge.icon}</span>
                    {badge.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Marquee Strip */}
        <div className="absolute bottom-0 left-0 right-0 py-3.5 border-t border-white/5 bg-[#040209]/80 backdrop-blur-md z-20">
          <div className="skills-marquee-wrap">
            <div className="skills-marquee-track">
              {[
                '⚡ UI/UX Architecture', '🌐 Web3D & Three.js', '🎌 Anime Content Empire',
                '📸 Cinematography & Photos', '🎬 High-End Video Editing', '🖼️ Viral Thumbnail Design', '✈️ Travel & Gastronomy',
                '⚡ UI/UX Architecture', '🌐 Web3D & Three.js', '🎌 Anime Content Empire',
                '📸 Cinematography & Photos', '🎬 High-End Video Editing', '🖼️ Viral Thumbnail Design', '✈️ Travel & Gastronomy',
              ].map((skill, i) => (
                <span
                  key={i}
                  className="px-6 py-1 text-xs font-mono font-bold text-gray-400 border-r border-white/5 whitespace-nowrap hover:text-primary transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE METRICS & GLOBAL TELEMETRY HUD BAR */}
      <section className="relative z-20 py-10 bg-[#04020a]/90 border-b border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          {/* Live Global Visitor & Telemetry Activity Heartbeat */}
          <div className="flex items-center justify-center mb-8">
            <LiveTrafficIndicator />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Users, value: '25K+', label: 'Audience & Subscribers', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
              { icon: Layers, value: '8+', label: 'Production Builds Shipped', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
              { icon: Activity, value: '12+', label: 'Creator Touchpoints', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
              { icon: Zap, value: '<50ms', label: 'ISR & Web3D Latency', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
            ].map(({ icon: Icon, value, label, color, bg, border }, i) => (
              <div key={i} className="stats-card-ring flex items-center gap-4 p-5 rounded-2xl bg-white/[0.025] border border-white/6 hover:bg-white/[0.04] transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl ${bg} ${border} border flex items-center justify-center ${color} shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} />
                </div>
                <div>
                  <span className={`text-2xl sm:text-3xl font-black font-mono block ${color}`}>{value}</span>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide leading-tight block mt-0.5">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.5 INTERACTIVE 3D WEBGL LAB */}
      <section className="py-12 relative overflow-hidden bg-transparent border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={12} /> HARDWARE-ACCELERATED LAB
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Interactive <span className="gradient-text-glow">WebGL 3D Core</span>
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm max-w-md">
              Drag to spin the real-time shaded icosahedron core. Demonstrating client-side Three.js performance and physical materials.
            </p>
          </div>

          <HeroInteractive3D />
        </div>
      </section>

      {/* 3. FEATURED ENGINEERING PROJECTS & CASE STUDIES */}
      <section id="projects" className="py-24 relative overflow-hidden">
        <div className="ambient-glow top-1/2 -left-48 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-16">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
              <span className="text-xs font-bold text-primary font-mono uppercase tracking-widest animate-pulse">FLAGSHIP BUILDS</span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-none">
                Engineering <span className="gradient-text-primary">Case Studies</span>
              </h2>
              <div className="w-20 h-[3px] bg-gradient-to-r from-primary to-secondary rounded-full mt-2" />
            </div>

            <Link 
              href="/projects" 
              className="px-6 py-2.5 rounded-xl border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/20 text-white font-bold text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5 group cursor-pointer"
            >
              Explore All Projects <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {homeProjects.map((project) => {
              const projectSlug = project.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
              return (
                <TiltCard key={project.title} className="flex flex-col h-full bg-[#0b0814]/60 border-white/10 hover:border-primary/50 group">
                  <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden mb-6 bg-slate-900 border border-white/5">
                    <SafeImage 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      fallbackSrc="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07050f] via-transparent to-transparent opacity-80" />
                    
                    {/* Live Tech Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {project.techStack.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-gray-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-primary">{project.details?.tagline || 'Production Build'}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                      <Link 
                        href={`/projects/${projectSlug}`}
                        className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-white text-xs font-bold font-mono transition-all flex items-center gap-1.5 group cursor-pointer"
                      >
                        Case Study <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform text-primary" />
                      </Link>

                      {project.demoUrl && (
                        <a 
                          href={project.demoUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          Live Preview <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. ARCHITECTURAL TECH STACK SHOWCASE */}
      <div className="section-divider" />
      <TechStack />

      {/* 4.5 GITHUB ACTIVITY STREAM */}
      <div className="section-divider" />
      <GitHubActivity />

      {/* 5. CREATOR ECOSYSTEM & YOUTUBE HUB */}
      <section className="py-24 relative overflow-hidden bg-transparent border-t border-white/5">
        <div className="ambient-glow top-1/3 -right-48 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-16">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
              <span className="text-xs font-bold text-primary font-mono uppercase tracking-widest animate-pulse">DIGITAL MEDIA DOMINANCE</span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-none">
                Creator <span className="gradient-text-primary">Ecosystem</span>
              </h2>
              <div className="w-20 h-[3px] bg-gradient-to-r from-primary to-secondary rounded-full mt-2" />
            </div>

            <Link 
              href="/socials" 
              className="px-6 py-2.5 rounded-xl border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/20 text-white font-bold text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5 group cursor-pointer"
            >
              Explore Media Hub <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Summary Banner */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-[#090518]/70 border-white/10 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">Multi-Channel Network</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-3 leading-snug">
                  25,000+ Dedicated Followers Across India & Global Platforms
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Producing viral anime analyses, cinematic edits, high-conversion thumbnails, and community hubs with millions of combined video impressions.
                </p>

                <div className="flex flex-col gap-3 pt-4 border-t border-white/5 text-xs font-mono">
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Anime Nation India:</span>
                    <span className="text-white font-bold">25,000+ Community</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Video Impressions:</span>
                    <span className="text-primary font-bold">10M+ Organic Views</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Content Pipelines:</span>
                    <span className="text-emerald-400 font-bold">YouTube, Reels, Shorts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: YouTube Channel Cards */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {homeYoutube.map((channel) => (
                  <GlassCard key={channel.name} className="flex flex-col justify-between bg-[#0b0814]/50 border-white/5 hover:border-red-500/40 p-5 rounded-2xl">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0">
                          <SafeImage 
                            src={channel.avatar} 
                            alt={channel.name} 
                            className="w-full h-full object-cover"
                            fallbackSrc="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">{channel.name}</h4>
                          <span className="text-[10px] font-mono text-red-400 font-semibold">{channel.subscribers}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                        {channel.focus}
                      </p>

                      {/* YouTube Video Mockup */}
                      <div className="relative rounded-xl overflow-hidden mb-4 border border-white/5">
                        <SafeImage 
                          src={channel.recentVideo.thumbnail} 
                          alt={channel.recentVideo.title} 
                          className="w-full h-24 object-cover" 
                          fallbackSrc={channel.name.includes("Anime Nation India") ? "/assets/animenation.jpg" : "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=60"}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] font-semibold text-gray-200 line-clamp-1 mb-1 leading-tight">
                        {channel.recentVideo.title}
                      </p>
                      <div className="flex gap-2 text-[8px] text-gray-500 font-mono mb-4">
                        <span>{channel.recentVideo.views}</span>
                        <span>•</span>
                        <span>{channel.recentVideo.published}</span>
                      </div>
                    </div>

                    <a 
                      href={channel.url || "/socials"} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-full py-2 text-center text-xs font-bold bg-red-600/10 hover:bg-red-600 text-white rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Watch Channel <ExternalLink size={12} />
                    </a>
                  </GlassCard>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. CONTENT STREAM CTA */}
      <section className="py-14 relative overflow-hidden bg-transparent border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-r from-[#0d0820] via-[#0a0618] to-[#0d0820] border border-primary/20 overflow-hidden shadow-[0_0_30px_var(--primary-glow)]">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <span className="text-xs font-bold text-primary font-mono uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start mb-2">
                  <Film size={13} className="text-primary" /> CONTENT STREAM
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-1.5">
                  Latest <span className="gradient-text-primary">Uploads & Motion Media</span>
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm max-w-lg leading-relaxed">
                  Reels, anime edits, design breakdowns, and creative uploads live across YouTube, Instagram & Facebook.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link 
                  href="/uploads" 
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs tracking-wider transition-all flex items-center gap-2 shadow-[0_0_20px_var(--primary-glow)] cursor-pointer whitespace-nowrap"
                >
                  View All Uploads <ArrowRight size={14} />
                </Link>
                <Link 
                  href="/socials" 
                  className="px-6 py-3 rounded-xl border border-white/15 hover:border-primary/50 bg-white/5 hover:bg-primary/10 text-white font-bold text-xs tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  All Creator Channels <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TECH DISCOVERIES & PUBLISHED ARTICLES */}
      <section className="py-24 relative overflow-hidden bg-transparent">
        <div className="ambient-glow top-1/2 -right-48 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-16">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
              <span className="text-xs font-bold text-primary font-mono uppercase tracking-widest animate-pulse">AUTONOMOUS BLOG FEED</span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-none">
                Global <span className="gradient-text-primary">Discoveries</span>
              </h2>
              <div className="w-20 h-[3px] bg-gradient-to-r from-primary to-secondary rounded-full mt-2" />
            </div>

            <Link 
              href="/articles" 
              className="px-6 py-2.5 rounded-xl border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/20 text-white font-bold text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5 group cursor-pointer"
            >
              Explore All Articles <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeArticles.map((article) => (
              <GlassCard key={article.slug} className="flex flex-col h-full bg-[#0b0814]/40 border-white/5 hover:scale-[1.01] transition-transform duration-300 p-5 rounded-2xl">
                <div className="w-full h-44 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-white/5 mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-bold font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                        {article.category}
                      </span>
                      <span className="text-[9px] font-mono text-gray-500">
                        {new Date(article.publishedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>

                    <Link href={`/articles/${article.slug}`}>
                      <h3 className="text-base font-bold text-white hover:text-primary transition-colors line-clamp-2 leading-snug cursor-pointer mb-2">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed mb-4">
                      {article.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/5 pt-4 text-[10px] font-mono text-gray-500 mt-auto">
                    <span>via {article.source}</span>
                    <Link 
                      href={`/articles/${article.slug}`} 
                      className="text-primary hover:text-secondary font-bold flex items-center gap-0.5 group cursor-pointer"
                    >
                      Read Full <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

        </div>
      </section>

      {/* 8. HIGH-IMPACT CONTACT & DIRECT BOOKING ENGINE */}
      <section id="contact" className="py-24 relative overflow-hidden bg-transparent border-t border-white/5">
        <div className="ambient-glow top-1/2 -left-48 pointer-events-none" />
        <div className="ambient-glow bottom-0 -right-48 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">

          <div className="flex flex-col items-center text-center mb-14 gap-3">
            <span className="text-xs font-bold text-primary font-mono uppercase tracking-widest animate-pulse">GET IN TOUCH</span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-none">
              Let&apos;s Build <span className="gradient-text-glow">Something Epic</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-md mt-1 leading-relaxed">
              Have a project in mind, want to collaborate, or need next-gen UI/UX and 3D web development? Let&apos;s talk!
            </p>
            <div className="w-20 h-[3px] bg-gradient-to-r from-primary via-accent to-secondary rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            {/* Left Info Panel */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {[
                { icon: '📧', label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}`, color: 'border-primary/20 hover:border-primary/50' },
                { icon: '📍', label: 'Location', value: 'West Bengal, India (IST)', href: null, color: 'border-white/8 hover:border-white/15' },
                { icon: '🔗', label: 'HeyLink Hub', value: 'heylink.me/ShouvikDas', href: 'https://heylink.me/ShouvikDas/', color: 'border-emerald-500/20 hover:border-emerald-500/40' },
              ].map((item) => (
                <div key={item.label} className={`p-5 rounded-2xl bg-white/[0.025] border ${item.color} transition-all duration-300 flex items-center gap-4`}>
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest block">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="text-white hover:text-primary text-sm font-semibold transition-colors truncate block" target="_blank" rel="noreferrer">{item.value}</a>
                    ) : (
                      <span className="text-white text-sm font-semibold block">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Availability badge */}
              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Open for Projects</span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Currently accepting Web3D development, UI/UX architecture, and media partnerships for 2026.
                </p>
              </div>

              {/* Response SLA */}
              <div className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-2xl font-black text-primary font-mono">&lt; 12 Hours</span>
                <p className="text-gray-500 text-[10px] font-mono uppercase tracking-wider mt-1">Guaranteed Response SLA</p>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
