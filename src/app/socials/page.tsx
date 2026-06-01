import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/ui/GlassCard';
import SafeImage from '@/components/ui/SafeImage';
import { personalInfo, socialLinks as baseSocials, youtubeChannels as baseYoutube } from '@/lib/realData';
import { getSocialStats } from '@/lib/db';
import { ExternalLink, Sparkles, Link2 } from 'lucide-react';

export const metadata = {
  title: 'Social Hub & YouTube Channels | Shouvik Das',
  description: 'Explore all official personal social platforms, vlogging channels, and communities managed by Shouvik Das, covering travel diaries, tech logs, and video edits.',
};

export default async function SocialsPage() {
  const dbStats = await getSocialStats();

  let dynamicSocials = baseSocials;
  let dynamicYoutube = baseYoutube;

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

  // Keep all YouTube channels (including Anime Nation India) as requested!
  const filteredYoutube = dynamicYoutube;
  
  // Keep all social links (including Anime Nation India) but exclude HeyLink registry card
  const filteredSocials = dynamicSocials.filter(s => s.type !== "HeyLink");

  return (
    <>
      <Navbar />

      <section className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-transparent">
        {/* Colorful ambient background blobs */}
        <div className="ambient-glow -top-48 -left-48 bg-[#ff007f]/15" />
        <div className="ambient-glow top-1/2 -right-48 bg-[#8b5cf6]/10" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16 gap-3">
            <span className="text-xs font-bold text-[#ff007f] font-mono tracking-widest uppercase animate-pulse">
              LET'S STAY CONNECTED
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              My Official <span className="gradient-text-primary">Social Channels</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
              Find and follow my personal travel vlogging, digital anime edits, creative portfolios, and tech chronicles across all platforms.
            </p>
            
            {/* HeyLink Direct Button */}
            <a 
              href={personalInfo.heylink}
              target="_blank"
              rel="noreferrer"
              className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff007f] to-[#8b5cf6] text-white font-bold text-xs tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,0,127,0.45)] cursor-pointer hover:shadow-[0_0_30px_rgba(255,0,127,0.7)] transition-all"
            >
              EXPLORE MY LINKTREE (HEYLINK) <Link2 size={14} />
            </a>

            <div className="w-20 h-[3px] bg-gradient-to-r from-[#ff007f] to-[#8b5cf6] rounded-full mt-6" />
          </div>

          {/* Social Platform Divisions */}
          <div className="flex flex-col gap-16 text-left">
            
            {/* 1. YouTube Channels Portfolio */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <svg className="w-5.5 h-5.5 fill-red-500 inline-block mr-2" viewBox="0 0 24 24"><path d="M23.498 6.163c-.272-1.016-1.07-1.815-2.086-2.086C19.57 3.5 12 3.5 12 3.5s-7.57 0-9.412.514C1.57 4.29 0.772 5.088.5 6.103.045 7.919.045 12 .045 12s0 4.081.455 5.897c.272 1.016 1.07 1.815 2.086 2.086 1.842.514 9.412.514 9.412.514s7.57 0 9.412-.514c1.016-.272 1.815-1.07 2.086-2.086.455-1.816.455-5.897.455-5.897s0-4.081-.455-5.897zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> YouTube Channels Portfolio
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {filteredYoutube.map((channel) => (
                  <GlassCard key={channel.name} className="flex flex-col bg-[#0b0814]/40 border-white/5 relative group hover:scale-[1.02] transition-all p-4">
                    {/* Platform Badge */}
                    <div className="absolute top-3 right-3 bg-red-600/90 text-white text-[8px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider shadow-md">
                      YouTube
                    </div>

                    <div className="flex flex-col items-center text-center gap-3 py-2">
                      {/* Profile Photo */}
                      <div className="photo-glow-border w-16 h-16 overflow-hidden relative rounded-full aspect-square bg-slate-900 flex items-center justify-center">
                        <SafeImage 
                          src={channel.avatar} 
                          alt={channel.name} 
                          className="w-full h-full object-cover" 
                          fallbackSrc="/assets/shouvik.jpg"
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-xs md:text-sm font-black text-white leading-tight line-clamp-1">{channel.name}</h3>
                      </div>
                      
                      <p className="text-gray-400 text-[10px] leading-relaxed max-w-[200px] h-10 overflow-hidden line-clamp-2">
                        {channel.focus}
                      </p>

                      <a 
                        href={channel.url || "#"} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full mt-2 py-2 text-center text-[10px] font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all flex items-center justify-center gap-1 shadow-lg cursor-pointer"
                      >
                        Watch Channel <ExternalLink size={10} />
                      </a>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* 2. Social Media Platforms Portfolio */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <Sparkles size={20} className="text-[#ff007f] inline-block" /> Social Media Platforms Portfolio
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSocials.map((social) => {
                  const isInstagram = social.type === 'Instagram';
                  const isFacebook = social.type === 'Facebook';
                  const isTwitterX = social.type === 'Twitter/X';

                  return (
                    <GlassCard key={social.name} className="flex flex-col bg-[#0b0814]/40 border-white/5 p-6 hover:scale-[1.01] transition-transform relative group">
                      
                      {/* Platform Logo Badge */}
                      <div className="absolute top-4 right-4 text-white text-[8px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider shadow-md">
                        {isInstagram && <span className="bg-gradient-to-r from-orange-500 to-pink-600 px-2 py-0.5 rounded text-[8px]">Instagram</span>}
                        {isFacebook && <span className="bg-blue-600 px-2 py-0.5 rounded text-[8px]">Facebook</span>}
                        {isTwitterX && <span className="bg-neutral-800 px-2 py-0.5 rounded text-[8px]">Twitter/X</span>}
                      </div>

                      <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-4">
                          {/* Profile Photo */}
                          <div className="photo-glow-border w-16 h-16 overflow-hidden relative rounded-full aspect-square bg-slate-900">
                            <SafeImage 
                              src={social.avatar} 
                              alt={social.name} 
                              className="w-full h-full object-cover" 
                              fallbackSrc="/assets/shouvik.jpg"
                            />
                          </div>
                          <div className="text-left">
                            <h3 className="text-sm md:text-base font-black text-white leading-tight flex items-center gap-1.5">
                              {isInstagram && (
                                <svg className="w-4 h-4 stroke-pink-500 fill-none" strokeWidth="2" viewBox="0 0 24 24">
                                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                                </svg>
                              )}
                              {isFacebook && (
                                <svg className="w-4 h-4 fill-blue-400" viewBox="0 0 24 24">
                                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                                </svg>
                              )}
                              {isTwitterX && (
                                <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                              )}
                              {social.name}
                            </h3>
                            <span className="text-[10px] font-mono text-gray-500 block mt-0.5">{social.username}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-400 text-xs mt-4 leading-relaxed text-left flex-grow">
                        {social.description}
                      </p>

                      <div className="flex justify-end items-center mt-6 border-t border-white/5 pt-4">
                        <a 
                          href={social.url || "#"} 
                          target="_blank" 
                          rel="noreferrer"
                          className={`py-1.5 px-4 text-center text-[10px] font-bold rounded transition-all cursor-pointer text-white ${
                            isInstagram ? 'bg-gradient-to-r from-orange-500/20 to-pink-600/20 hover:from-orange-500 hover:to-pink-600' :
                            isFacebook ? 'bg-blue-600/20 hover:bg-blue-600' :
                            'bg-neutral-800 hover:bg-neutral-900'
                          }`}
                        >
                          Visit Profile <ExternalLink size={10} className="inline-block ml-0.5" />
                        </a>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
