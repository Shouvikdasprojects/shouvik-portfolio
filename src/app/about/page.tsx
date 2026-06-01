import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/ui/GlassCard';
import TiltCard from '@/components/ui/TiltCard';
import GlowButton from '@/components/ui/GlowButton';
import SafeImage from '@/components/ui/SafeImage';
import { personalInfo } from '@/lib/realData';
import { getRealTimeSocialRegistry } from '@/lib/socialSync';
import { Mail, Compass, Star, Heart, Camera, Film, Palette, MapPin, Link2 } from 'lucide-react';

export const metadata = {
  title: 'About Shouvik Das | Web3D Developer & UI/UX Designer',
  description: 'Get to know Shouvik Das—an India-based UI/UX Designer, Web3D Developer, and content creator. Discover my hobbies, traveling logs, anime content, photography, and follow all 12 of my official social channels.',
};

export default async function AboutPage() {
  const { socialLinks: dynamicSocials, youtubeChannels: dynamicYoutube } = await getRealTimeSocialRegistry();
  
  return (
    <>
      <Navbar />

      <section className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-transparent">
        {/* Ambient background styling */}
        <div className="ambient-glow -top-48 -left-48 bg-[#ff007f]/15 pointer-events-none" />
        <div className="ambient-glow top-1/2 -right-48 bg-[#8b5cf6]/10 pointer-events-none" />
        <div className="ambient-glow bottom-0 left-1/4 bg-blue-500/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16 gap-3">
            <span className="text-xs font-bold text-[#ff007f] font-mono tracking-[0.2em] uppercase animate-pulse">
              GET TO KNOW ME
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              About <span className="gradient-text-primary">Shouvik Das</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
              A passionate UI/UX Designer & Web3D Developer based in India. Exploring the world, creating anime universes, and crafting next-generation spatial web experiences.
            </p>
            <div className="w-24 h-[3px] bg-gradient-to-r from-[#ff007f] via-pink-500 to-[#8b5cf6] rounded-full mt-4" />
          </div>

          {/* Core Profile & Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            
            {/* Left Column: Portrait Card with premium 3D Tilt */}
            <div className="lg:col-span-5 flex justify-center">
              <TiltCard className="w-full max-w-[380px] p-4 bg-[#0b0814]/65 border-white/5 shadow-2xl relative group">
                <div className="photo-glow-border overflow-hidden rounded-xl bg-slate-900 border border-white/10 aspect-[4/5] relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={personalInfo.avatarUrl} 
                    alt={personalInfo.name} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />
                  
                  {/* Location badge on the picture */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs text-white font-semibold">
                    <MapPin size={12} className="text-[#ff007f]" />
                    {personalInfo.aboutDetails.location}
                  </div>
                </div>
              </TiltCard>
            </div>

            {/* Right Column: In-depth Biography & Passion Chronicles */}
            <div className="lg:col-span-7 flex flex-col gap-8 text-left">
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  <Compass className="text-[#ff007f]" size={24} /> My Creative Journey & Passions
                </h2>
                <div className="w-16 h-[2px] bg-[#ff007f]" />
              </div>

              <div className="flex flex-col gap-4 text-gray-300 text-sm md:text-base leading-relaxed space-y-4">
                <p>
                  Hi, I'm Shouvik Das, a tech enthusiast, visual storyteller, and Web3D developer from India. My work lies at the intersection of stunning visual design and interactive frontend technologies. I build high-performance, immersive environments that run smoothly across devices.
                </p>
                <p>
                  My heart belongs to three things: Adventure, Anime, and Gastronomy. I love traveling to scenic spots, exploring new cultures, and dreaming about visiting foreign countries. I am an avid reader of Manga and Manhwa, and the mind behind 3 active anime YouTube channels. There, I create in-depth manga explanation videos, custom edits, synchronization layers, and digital graphics.
                </p>
                <p>
                  As a creator, I am highly proficient in Photography & Videography, crafting high-end Video Editing sequences, and designing viral YouTube Thumbnails that grab attention instantly. And yes—I'm an absolute foodie who loves exploring local food joints and trying out new cuisines!
                </p>
              </div>

              {/* Hobbies / Passions Row */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">THINGS I ABSOLUTELY LOVE:</span>
                <div className="flex flex-wrap gap-2.5">
                  {personalInfo.aboutDetails.hobbies.map((hobby, idx) => (
                    <div 
                      key={idx} 
                      className="px-4 py-2 rounded-full border border-white/5 bg-white/5 hover:border-[#ff007f]/40 hover:bg-[#ff007f]/5 text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Heart size={12} className="text-[#ff007f]" /> {hobby}
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Row */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">CREATIVE SKILLS ENGINE:</span>
                <div className="flex flex-wrap gap-2.5">
                  <div className="px-3.5 py-1.5 rounded-lg bg-[#ff007f]/10 border border-[#ff007f]/25 text-white text-xs font-mono flex items-center gap-1">
                    <Palette size={12} className="text-[#ff007f]" /> UI/UX Design
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/25 text-white text-xs font-mono flex items-center gap-1">
                    <Compass size={12} className="text-[#8b5cf6]" /> Web3D (Three.js/R3F)
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/25 text-white text-xs font-mono flex items-center gap-1">
                    <Camera size={12} className="text-blue-400" /> Photography
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-green-500/10 border border-green-500/25 text-white text-xs font-mono flex items-center gap-1">
                    <Film size={12} className="text-green-400" /> Video Editing
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/25 text-white text-xs font-mono flex items-center gap-1">
                    <Star size={12} className="text-orange-400" /> Thumbnail Art
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Social Platforms & Pages Directory */}
          <div className="border-t border-white/5 pt-20">
            <div className="flex flex-col items-center text-center mb-16 gap-3">
              <span className="text-xs font-bold text-[#ff007f] font-mono tracking-widest uppercase">
                COMPLETE PLATFORMS DIRECTORY
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white">
                All My <span className="gradient-text-glow">12 Social Channels</span>
              </h2>
              <p className="text-gray-400 text-sm max-w-xl">
                I maintain active communities, vlogging spaces, and galleries. Here is the direct map to every single profile, with custom avatars and live feed links.
              </p>
              <div className="w-16 h-[2.5px] bg-[#ff007f] rounded-full mt-2" />
            </div>

            {/* Grid display of all 10 profiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* YouTube Channels (4 entries) */}
              {dynamicYoutube.map((channel, idx) => (
                <GlassCard key={channel.name} className="flex flex-col bg-[#0b0814]/40 border-white/5 p-6 hover:scale-[1.02] transition-transform">
                  <div className="flex items-center gap-4 justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="photo-glow-border w-14 h-14 overflow-hidden relative rounded-full aspect-square bg-slate-900 border border-white/10 shrink-0">
                        <SafeImage 
                          src={channel.avatar} 
                          alt={channel.name} 
                          className="w-full h-full object-cover" 
                          fallbackSrc={channel.name.includes("Anime Nation India") ? "/assets/animenation.jpg" : "/assets/shouvik.jpg"}
                        />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-black text-white leading-snug">{channel.name}</h3>
                        <span className="text-[9px] font-mono text-red-500 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider block w-max mt-1">
                          YouTube
                        </span>
                      </div>
                    </div>

                  </div>

                  <p className="text-gray-400 text-xs leading-relaxed text-left flex-grow">
                    {channel.focus}
                  </p>

                  <a 
                    href={channel.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full mt-6 py-2 text-center text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    Watch Channel <svg className="w-3.5 h-3.5 fill-current inline-block ml-1" viewBox="0 0 24 24"><path d="M23.498 6.163c-.272-1.016-1.07-1.815-2.086-2.086C19.57 3.5 12 3.5 12 3.5s-7.57 0-9.412.514C1.57 4.29 0.772 5.088.5 6.103.045 7.919.045 12 .045 12s0 4.081.455 5.897c.272 1.016 1.07 1.815 2.086 2.086 1.842.514 9.412.514 9.412.514s7.57 0 9.412-.514c1.016-.272 1.815-1.07 2.086-2.086.455-1.816.455-5.897.455-5.897s0-4.081-.455-5.897zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                </GlassCard>
              ))}

              {/* Instagram Profiles (2 entries) */}
              {dynamicSocials.filter(s => s.type === 'Instagram').map((social) => (
                <GlassCard key={social.name} className="flex flex-col bg-[#0b0814]/40 border-white/5 p-6 hover:scale-[1.02] transition-transform">
                  <div className="flex items-center gap-4 justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="photo-glow-border w-14 h-14 overflow-hidden relative rounded-full aspect-square bg-slate-900 border border-white/10 shrink-0">
                        <SafeImage 
                          src={social.avatar} 
                          alt={social.name} 
                          className="w-full h-full object-cover" 
                          fallbackSrc={social.name.includes("Anime Nation India") ? "/assets/animenation.jpg" : "/assets/shouvik.jpg"}
                        />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-black text-white leading-snug">{social.name}</h3>
                        <span className="text-[9px] font-mono text-[#ff007f] bg-[#ff007f]/10 border border-[#ff007f]/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider block w-max mt-1">
                          Instagram
                        </span>
                      </div>
                    </div>

                  </div>

                  <p className="text-gray-400 text-xs leading-relaxed text-left flex-grow">
                    {social.description}
                  </p>

                  <a 
                    href={social.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full mt-6 py-2 text-center text-xs font-bold rounded-lg border border-white/10 hover:border-[#ff007f] bg-white/5 hover:bg-[#ff007f] text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    Visit Profile <svg className="w-3.5 h-3.5 stroke-current fill-none inline-block ml-1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </a>
                </GlassCard>
              ))}

              {/* Facebook Accounts (3 entries) */}
              {dynamicSocials.filter(s => s.type === 'Facebook').map((social) => (
                <GlassCard key={social.name} className="flex flex-col bg-[#0b0814]/40 border-white/5 p-6 hover:scale-[1.02] transition-transform">
                  <div className="flex items-center gap-4 justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="photo-glow-border w-14 h-14 overflow-hidden relative rounded-full aspect-square bg-slate-900 border border-white/10 shrink-0">
                        <SafeImage 
                          src={social.avatar} 
                          alt={social.name} 
                          className="w-full h-full object-cover" 
                          fallbackSrc={social.name.includes("Anime Nation India") ? "/assets/animenation.jpg" : "/assets/shouvik.jpg"}
                        />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-black text-white leading-snug">{social.name}</h3>
                        <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider block w-max mt-1">
                          Facebook
                        </span>
                      </div>
                    </div>

                  </div>

                  <p className="text-gray-400 text-xs leading-relaxed text-left flex-grow">
                    {social.description}
                  </p>

                  <a 
                    href={social.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full mt-6 py-2 text-center text-xs font-bold rounded-lg border border-white/10 hover:border-blue-500 bg-white/5 hover:bg-blue-600 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    Visit Profile <svg className="w-3.5 h-3.5 fill-current inline-block ml-1" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                  </a>
                </GlassCard>
              ))}

              {/* HeyLink Hub (1 entry) */}
              {dynamicSocials.filter(s => s.type === 'HeyLink').map((social) => (
                <GlassCard key={social.name} className="flex flex-col bg-[#0b0814]/40 border-white/5 p-6 hover:scale-[1.02] transition-transform">
                  <div className="flex items-center gap-4 justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="photo-glow-border w-14 h-14 overflow-hidden relative rounded-full aspect-square bg-slate-900 border border-white/10 shrink-0">
                        <SafeImage 
                          src={social.avatar} 
                          alt={social.name} 
                          className="w-full h-full object-cover" 
                          fallbackSrc="/assets/shouvik.jpg"
                        />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-black text-white leading-snug">{social.name}</h3>
                        <span className="text-[9px] font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider block w-max mt-1">
                          Web Hub
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-green-400 font-mono block">
                        HeyLink
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-xs leading-relaxed text-left flex-grow">
                    {social.description}
                  </p>

                  <a 
                    href={social.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full mt-6 py-2 text-center text-xs font-bold rounded-lg border border-white/10 hover:border-green-500 bg-white/5 hover:bg-green-600 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    Open LinkTree <Link2 size={14} />
                  </a>
                </GlassCard>
              ))}

            </div>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
