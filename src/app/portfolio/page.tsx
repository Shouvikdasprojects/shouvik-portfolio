'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TiltCard from '@/components/ui/TiltCard';
import GlassCard from '@/components/ui/GlassCard';
import GlowButton from '@/components/ui/GlowButton';
import { personalInfo } from '@/lib/realData';
import { Download, Mail, ExternalLink, Sparkles, MapPin, Award, Heart, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const portfolioSocials = [
  {
    name: "Instagram Profile",
    url: "https://www.instagram.com/shouvik_das_official",
    username: "@shouvik_das_official",
    description: "Personal travel updates, lifestyle photography, and daily highlights.",
    gradient: "from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    type: "Instagram"
  },
  {
    name: "Personal Facebook",
    url: "https://www.facebook.com/share/1EWixcZYDr/",
    username: "Shouvik Das (FB Profile)",
    description: "Personal lifestyle updates, daily thoughts, and community connections.",
    gradient: "from-[#1877F2] to-[#00c6ff]",
    type: "Facebook"
  },
  {
    name: "Personal Vlogging (FB Page)",
    url: "https://www.facebook.com/share/1Dt65XRNBK/",
    username: "Shouvik Das Vlogs (FB Page)",
    description: "Travel diaries, food vlogging snippets, and high-energy lifestyle reels.",
    gradient: "from-[#1877F2] to-[#00c6ff]",
    type: "Facebook"
  },
  {
    name: "Shouvik Das Canvas (FB Page)",
    url: "https://www.facebook.com/shouvikdascanvas",
    username: "Shouvik Das Canvas",
    description: "My official Facebook page for anime content creations, visual edits, and artwork.",
    gradient: "from-[#1877F2] to-[#00c6ff]",
    type: "Facebook"
  },
  {
    name: "Twitter / X Profile",
    url: "https://x.com/shouvikdas155",
    username: "@shouvikdas155",
    description: "Anime announcements, tech discussions, design industry updates, and edits.",
    gradient: "from-[#0d0d0d] via-[#222222] to-[#111111]",
    type: "Twitter/X"
  }
];

export default function PortfolioPage() {
  return (
    <>
      <Navbar />

      <section className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-transparent">
        {/* Colorful ambient background glows */}
        <div className="ambient-glow -top-48 -left-48 bg-[#ff007f]/15" />
        <div className="ambient-glow top-1/2 -right-48 bg-[#8b5cf6]/10" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16 gap-3">
            <span className="text-xs font-bold text-[#ff007f] font-mono tracking-widest uppercase animate-pulse">
              EXECUTIVE SPECIFICATIONS
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Professional <span className="gradient-text-primary">Portfolio</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
              Discover my complete credentials, contact channels, full biographical details, and active social media touchpoints.
            </p>
            <div className="w-20 h-[3px] bg-gradient-to-r from-[#ff007f] to-[#8b5cf6] rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Profile Card & Biography details */}
            <div className="lg:col-span-5 space-y-6">
              <TiltCard className="p-6 bg-[#0b0814]/50 border-white/5 shadow-2xl relative overflow-hidden group">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff007f]/10 rounded-full filter blur-xl pointer-events-none" />

                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-6 bg-slate-900 border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={personalInfo.avatarUrl} 
                    alt={personalInfo.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-black text-white">{personalInfo.name}</h2>
                    <span className="text-xs font-mono font-bold text-[#ff007f]">{personalInfo.role}</span>
                  </div>

                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    {personalInfo.bio}
                  </p>

                  <div className="pt-4 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between">
                    <span className="text-xs text-gray-500 font-mono flex items-center gap-1.5">
                      <MapPin size={12} className="text-[#ff007f]" /> {personalInfo.aboutDetails.location}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      Active Developer
                    </span>
                  </div>

                  {/* High Glow Resume Download */}
                  <div className="pt-4">
                    <GlowButton 
                      href={personalInfo.resumeUrl} 
                      download="Shouvik_Das_Resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full justify-center"
                    >
                      <Download size={14} /> DOWNLOAD FULL RESUME
                    </GlowButton>
                  </div>
                </div>
              </TiltCard>

              {/* Email details card */}
              <GlassCard className="p-6 bg-[#0b0814]/50 border-white/5 relative overflow-hidden">
                <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-cyan-500/10 rounded-full filter blur-xl" />
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ff007f]/10 border border-[#ff007f]/25 flex items-center justify-center text-[#ff007f]">
                    <Mail size={18} />
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] font-bold font-mono text-gray-500 uppercase tracking-wider block">Direct Contact Email</span>
                    <a 
                      href={`mailto:${personalInfo.email}`}
                      className="text-white hover:text-[#ff007f] font-bold text-sm transition-colors break-all"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                  <a 
                    href={`mailto:${personalInfo.email}`} 
                    className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#ff007f] hover:bg-[#ff007f]/10 text-white transition-all"
                    title="Send Email"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </GlassCard>
            </div>

            {/* Right Column: Full Details Grid & Social Links */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Full Details & Skills */}
              <GlassCard className="p-6 md:p-8 bg-[#0b0814]/40 border-white/5 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                    <Award size={18} className="text-[#ff007f]" /> Full Biographical Details
                  </h3>
                  <div className="w-12 h-[2px] bg-[#ff007f] rounded-full" />
                </div>

                {/* Hobbies Grid */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-gray-500 uppercase flex items-center gap-1.5">
                    <Heart size={10} className="text-[#ff007f]" /> My Hobbies & Activities
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {personalInfo.aboutDetails.hobbies.map((hobby, index) => (
                      <div key={index} className="flex items-center gap-2 px-3.5 py-2 bg-white/[0.02] border border-white/5 rounded-lg text-xs text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff007f]" />
                        {hobby}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Section */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-gray-500 uppercase flex items-center gap-1.5">
                    <Sparkles size={10} className="text-[#8b5cf6]" /> Primary Skills Spectrum
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {personalInfo.aboutDetails.skills.map((skill, index) => (
                      <span key={index} className="text-xs font-semibold font-mono bg-white/5 border border-white/10 text-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* Social Media accounts list (specifically filtered to show only 5) */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                    <MessageSquare size={18} className="text-[#ff007f]" /> Connect On Social Media
                  </h3>
                  <div className="w-12 h-[2px] bg-[#ff007f] rounded-full" />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {portfolioSocials.map((social) => (
                    <motion.div 
                      key={social.name}
                      whileHover={{ y: -2 }}
                      className="group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0b0814]/40 border border-white/5 p-6 rounded-xl hover:border-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${social.gradient} p-0.5 shadow-md flex items-center justify-center text-white shrink-0`}>
                          <div className="w-full h-full bg-[#06040d] rounded-[10px] flex items-center justify-center group-hover:bg-transparent transition-all">
                            {social.type === 'Instagram' && (
                              <svg className="w-5 h-5 stroke-current fill-none group-hover:scale-110 transition-transform" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                              </svg>
                            )}
                            {social.type === 'Facebook' && (
                              <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                              </svg>
                            )}
                            {social.type === 'Twitter/X' && (
                              <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                              </svg>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm md:text-base">{social.name}</span>
                            <span className="text-[10px] font-mono text-gray-500">{social.username}</span>
                          </div>
                          <p className="text-gray-400 text-xs mt-1 leading-relaxed max-w-md">
                            {social.description}
                          </p>
                        </div>
                      </div>

                      <a 
                        href={social.url || "#"} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full sm:w-auto py-2.5 px-5 text-center text-xs font-bold rounded-lg border border-white/10 hover:border-[#ff007f] bg-white/5 hover:bg-[#ff007f] text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        Follow Channel <ExternalLink size={12} />
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
