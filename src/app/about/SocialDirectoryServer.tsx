import GlassCard from '@/components/ui/GlassCard';
import SafeImage from '@/components/ui/SafeImage';
import { getRealTimeSocialRegistry } from '@/lib/socialSync';
import { Link2 } from 'lucide-react';

export default async function SocialDirectoryServer() {
  const { socialLinks: dynamicSocials, youtubeChannels: dynamicYoutube } = await getRealTimeSocialRegistry();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* YouTube Channels (4 entries) */}
      {dynamicYoutube.map((channel, idx) => (
        <GlassCard key={channel.name} className="flex flex-col bg-[#0b0814]/40 border-white/5 p-6 hover:scale-[1.02] transition-transform">
          <div className="flex items-center gap-4 justify-between mb-4">
            <div className="flex items-center gap-4">
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
  );
}
