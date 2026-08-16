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
  Zap
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
  const homeProjects = projectsList.slice(0, 4); // Display exactly 4 featured projects
  const homeSocials = dynamicSocials.filter(s => s.type !== "HeyLink").slice(0, 3);
  const homeYoutube = dynamicYoutube.slice(0, 4);
  const homeArticles = allArticles.slice(0, 6);
  const homeUploads = dynamicUploads.slice(0, 4);

  return (
    <>
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-12 bg-transparent">
        {/* Ambient glows */}
        <div className="ambient-glow -top-48 -left-48 bg-primary/15 pointer-events-none" />
        <div className="ambient-glow top-1/2 -right-48 bg-secondary/10 pointer-events-none" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Typography & CTAs */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left relative z-10">
              <HeroText name={personalInfo.name} bio={personalInfo.bio} />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-2 relative z-10">
                <Magnetic>
                  <GlowButton 
                    href="/resume"
                  >
                    <FileText size={16} /> VIEW EXECUTIVE RESUME
                  </GlowButton>
                </Magnetic>
                <Magnetic>
                  <Link 
                    href="/projects"
                    className="px-6 py-3.5 rounded-full border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 text-white font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 group cursor-pointer shadow-[0_0_15px_rgba(255,0,127,0.1)]"
                  >
                    Explore Projects <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Magnetic>
              </div>

              {/* Social Quick-Links */}
              <div className="flex flex-col gap-2 border-t border-white/5 pt-6 mt-2 relative z-10">
                <span className="text-[10px] font-bold font-mono tracking-widest text-gray-500 uppercase">
                  DIRECT CHANNELS & PROFILES
                </span>
                <div className="flex gap-3">
                  <a href="https://www.facebook.com/share/1EWixcZYDr/" target="_blank" rel="noreferrer" className="skill-badge-btn" aria-label="Facebook">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                  </a>
                  <a href="https://x.com/shouvikdas155" target="_blank" rel="noreferrer" className="skill-badge-btn" aria-label="Twitter/X">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/shouvik_das_official" target="_blank" rel="noreferrer" className="skill-badge-btn" aria-label="Instagram">
                    <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </a>
                  <a href={personalInfo.heylink} target="_blank" rel="noreferrer" className="skill-badge-btn" aria-label="HeyLink">
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V5.8H7c-3.42 0-6.2 2.78-6.2 6.2s2.78 6.2 6.2 6.2h4v-3.1H7c-1.71 0-3.1-1.39-3.1-3.1zM8.9 13.6h6.2v-3.1H8.9v3.1zm9.3-7.8h-4v3.1h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4v3.1h4c3.42 0 6.2-2.78 6.2-6.2s-2.78-6.2-6.2-6.2z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Interactive Profile Card */}
            <div className="lg:col-span-5 order-first lg:order-last flex items-center justify-center">
              <ProfileTiltCard avatarUrl={personalInfo.avatarUrl} name={personalInfo.name} />
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

      {/* 2. LIVE METRICS & STATS HUD BAR */}
      <section className="relative z-20 py-10 bg-[#04020a]/90 border-b border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          {/* Live status badge */}
          <div className="flex items-center justify-center mb-6">
            <span className="flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/8 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE CREATOR METRICS
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Users, value: '25K+', label: 'Audience & Subscribers', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
              { icon: Layers, value: '8+', label: 'Production Builds Shipped', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
              { icon: Activity, value: '12+', label: 'Creator Touchpoints', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
              { icon: Zap, value: '<50ms', label: 'ISR & Web3D Latency', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
            ].map(({ icon: Icon, value, label, color, bg, border }, i) => (
              <div key={i} className={`stats-card-ring flex items-center gap-4 p-5 rounded-2xl bg-white/[0.025] border border-white/6 hover:bg-white/[0.04] transition-all duration-300 group`}>
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

      {/* 3. FEATURED APPLICATIONS SHOWCASE */}
      <section id="projects" className="py-24 relative overflow-hidden bg-transparent">
        <div className="ambient-glow top-1/3 -left-96 bg-secondary/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-16">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
              <span className="text-xs font-bold text-primary font-mono uppercase tracking-widest animate-pulse">SHOWCASE PORTFOLIO</span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-none">
                Featured <span className="gradient-text-primary">Applications</span>
              </h2>
              <div className="w-20 h-[3px] bg-gradient-to-r from-primary to-secondary rounded-full mt-2" />
            </div>

            <Link 
              href="/projects" 
              className="px-6 py-2.5 rounded-xl border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/20 text-white font-bold text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5 group cursor-pointer shadow-[0_0_15px_rgba(255,0,127,0.1)]"
            >
              Go to All Projects <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {homeProjects.map((project, idx) => (
              <TiltCard key={idx} className="flex flex-col h-full bg-[#0b0814]/40 border-white/5 p-6 rounded-2xl group">
                <div className="relative w-full h-56 rounded-xl overflow-hidden mb-6 bg-slate-900 border border-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  {project.featured && (
                    <div className="neon-ribbon">★ FEATURED</div>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 backdrop-blur border border-white/10 hover:border-primary hover:bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                      title="Launch Application"
                    >
                      <ExternalLink size={13} className="text-white" />
                    </a>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                  {project.title}
                  {project.title.toLowerCase().includes('anime') && <Sparkles size={14} className="text-primary" />}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm mb-6 leading-relaxed flex-grow">
                  {project.description}
                </p>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="text-[10px] font-semibold font-mono bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Link */}
                <div className="flex gap-4 border-t border-white/5 pt-4 mt-auto">
                  <a 
                    href={project.demoUrl || "/projects"} 
                    target={project.demoUrl ? "_blank" : "_self"}
                    rel="noreferrer" 
                    className="w-full py-2.5 text-center text-xs font-bold bg-primary hover:bg-primary/90 text-white rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,0,127,0.3)] cursor-pointer"
                  >
                    Launch Live Application <ExternalLink size={12} />
                  </a>
                </div>
              </TiltCard>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Link 
              href="/projects" 
              className="px-8 py-3.5 rounded-xl border border-primary bg-primary/10 hover:bg-primary text-white font-bold text-sm tracking-wider transition-all duration-300 flex items-center gap-2 group cursor-pointer shadow-[0_0_15px_rgba(255,0,127,0.3)] hover:shadow-[0_0_25px_rgba(255,0,127,0.6)]"
            >
              Explore Full Projects Archive <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. SOCIAL MEDIA & CREATOR HUB */}
      <section id="socials" className="py-24 relative overflow-hidden bg-transparent border-t border-b border-white/5">
        <div className="ambient-glow bottom-0 -right-96 bg-primary/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">

          {/* Section Title */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-16">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
              <span className="text-xs font-bold text-primary font-mono uppercase tracking-widest animate-pulse">CREATOR ECOSYSTEM</span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-none">
                Social Media & <span className="gradient-text-glow">YouTube Hub</span>
              </h2>
              <div className="w-20 h-[3px] bg-gradient-to-r from-primary to-secondary rounded-full mt-2" />
            </div>

            <Link 
              href="/socials" 
              className="px-6 py-2.5 rounded-xl border border-primary hover:border-primary bg-primary/10 hover:bg-primary text-white font-bold text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5 group cursor-pointer shadow-[0_0_15px_rgba(255,0,127,0.35)] hover:shadow-[0_0_25px_rgba(255,0,127,0.6)]"
            >
              View All 12 Channels <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Main Grid: Split into Socials and YouTube */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Social Media Column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-gray-300 flex items-center gap-2 border-b border-white/5 pb-3">
                <Sparkles size={16} className="text-primary animate-pulse" /> Official Social Channels
              </h3>
              
              {homeSocials.map((social) => (
                <GlassCard key={social.name} className="flex flex-col gap-4 bg-[#0b0814]/40 border-white/5 p-6 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-white flex items-center gap-2">
                      {social.name.toLowerCase().includes('instagram') && (
                        <svg className="w-4.5 h-4.5 stroke-pink-500 fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                        </svg>
                      )}
                      {social.name.toLowerCase().includes('facebook') && (
                        <svg className="w-4.5 h-4.5 fill-blue-400" viewBox="0 0 24 24">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                        </svg>
                      )}
                      {social.name}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">{social.username}</span>
                  </div>

                  <p className="text-gray-400 text-xs leading-relaxed text-left">
                    {social.description}
                  </p>

                  <a 
                    href={social.url || "/socials"} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-2 py-2 text-center text-xs font-bold rounded-xl border border-white/10 hover:border-primary bg-white/5 hover:bg-primary text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    View Channel <ArrowRight size={12} />
                  </a>
                </GlassCard>
              ))}
            </div>

            {/* YouTube Channels Column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-gray-300 flex items-center gap-2 border-b border-white/5 pb-3">
                <svg className="w-5 h-5 fill-red-500" viewBox="0 0 24 24">
                  <path d="M23.498 6.163c-.272-1.016-1.07-1.815-2.086-2.086C19.57 3.5 12 3.5 12 3.5s-7.57 0-9.412.514C1.57 4.29 0.772 5.088.5 6.103.045 7.919.045 12 .045 12s0 4.081.455 5.897c.272 1.016 1.07 1.815 2.086 2.086 1.842.514 9.412.514 9.412.514s7.57 0 9.412-.514c1.016-.272 1.815-1.07 2.086-2.086.455-1.816.455-5.897.455-5.897s0-4.081-.455-5.897zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube Creator Portfolio
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {homeYoutube.map((channel) => (
                  <GlassCard key={channel.name} className="flex flex-col h-full bg-[#0b0814]/40 border-white/5 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/25 shrink-0">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M23.498 6.163c-.272-1.016-1.07-1.815-2.086-2.086C19.57 3.5 12 3.5 12 3.5s-7.57 0-9.412.514C1.57 4.29 0.772 5.088.5 6.103.045 7.919.045 12 .045 12s0 4.081.455 5.897c.272 1.016 1.07 1.815 2.086 2.086 1.842.514 9.412.514 9.412.514s7.57 0 9.412-.514c1.016-.272 1.815-1.07 2.086-2.086.455-1.816.455-5.897.455-5.897s0-4.081-.455-5.897zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm leading-tight">{channel.name}</h4>
                        <span className="text-[10px] font-mono text-red-400">{channel.subscribers}</span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-xs mb-4 leading-relaxed flex-grow">
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
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
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

      {/* 5. CONTENT STREAM CTA */}
      <section className="py-16 relative overflow-hidden bg-transparent border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#0d0820] via-[#0a0618] to-[#0d0820] border border-primary/15 overflow-hidden">
            {/* Glow accents */}
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <span className="text-xs font-bold text-primary font-mono uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start mb-2">
                  <Film size={12} className="text-primary" /> CONTENT STREAM
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                  Latest <span className="gradient-text-primary">Uploads & Activity</span>
                </h2>
                <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
                  Reels, vlogs, anime edits, thumbnails, and creative uploads live across YouTube, Instagram & Facebook — updated in real-time.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link 
                  href="/uploads" 
                  className="px-7 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs tracking-wider transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,127,0.35)] cursor-pointer whitespace-nowrap"
                >
                  View All Uploads <ArrowRight size={14} />
                </Link>
                <Link 
                  href="/socials" 
                  className="px-7 py-3 rounded-xl border border-white/15 hover:border-primary/50 bg-white/5 hover:bg-primary/10 text-white font-bold text-xs tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  All Creator Channels <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TECH DISCOVER BLOG */}
      <section className="py-24 relative overflow-hidden bg-transparent">
        <div className="ambient-glow top-1/2 -right-48 bg-primary/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header */}
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

          {/* Cards Grid */}
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

      {/* 7. CONTACT / LET'S BUILD SOMETHING EPIC */}
      <section id="contact" className="py-24 relative overflow-hidden bg-transparent border-t border-white/5">
        <div className="ambient-glow top-1/2 -right-48 bg-primary/10 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">

          {/* Title */}
          <div className="flex flex-col items-center text-center mb-16 gap-3">
            <span className="text-xs font-bold text-primary font-mono uppercase tracking-widest animate-pulse">GET IN TOUCH</span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-none">
              Let's Build <span className="gradient-text-glow">Something Epic</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-md mt-2">
              Have a project in mind, want to collaborate, or just want to talk tech? Drop a message below and I will get back to you!
            </p>
            <div className="w-20 h-[3px] bg-gradient-to-r from-primary via-accent to-secondary rounded-full mt-2" />
          </div>

          {/* Form */}
          <ContactForm />

        </div>
      </section>

      <Footer />
    </>
  );
}
