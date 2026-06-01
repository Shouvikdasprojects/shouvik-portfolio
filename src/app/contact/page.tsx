'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Mail, Sparkles, PhoneCall } from 'lucide-react';
import { personalInfo } from '@/lib/realData';

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <section className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-transparent">
        {/* Colorful ambient background glows */}
        <div className="ambient-glow -top-48 -left-48 bg-[#ff007f]/15" />
        <div className="ambient-glow top-1/2 -right-48 bg-[#8b5cf6]/10" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-12 gap-3">
            <span className="text-xs font-bold text-[#ff007f] font-mono tracking-widest uppercase animate-pulse">
              GET IN TOUCH
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Let's Build <span className="gradient-text-glow">Something Epic</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mt-2 leading-relaxed">
              Have a project in mind, want to collaborate, or just want to talk tech? Drop a message below and I will get back to you!
            </p>
            <div className="w-20 h-[3px] bg-gradient-to-r from-[#ff007f] to-[#8b5cf6] rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
            <div className="bg-[#0b0814]/40 border border-white/5 p-5 rounded-xl flex items-center gap-4 hover:border-white/10 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-[#ff007f]/10 border border-[#ff007f]/25 flex items-center justify-center text-[#ff007f] shrink-0">
                <Mail size={16} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold font-mono text-gray-500 uppercase tracking-wider block">Write Me Email</span>
                <a href={`mailto:${personalInfo.email}`} className="text-white hover:text-[#ff007f] font-semibold text-xs md:text-sm transition-colors block truncate">{personalInfo.email}</a>
              </div>
            </div>

            <div className="bg-[#0b0814]/40 border border-white/5 p-5 rounded-xl flex items-center gap-4 hover:border-white/10 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/25 flex items-center justify-center text-[#8b5cf6] shrink-0">
                <Sparkles size={16} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold font-mono text-gray-500 uppercase tracking-wider block">Primary Role</span>
                <span className="text-white font-semibold text-xs md:text-sm block truncate">{personalInfo.role}</span>
              </div>
            </div>

            <div className="bg-[#0b0814]/40 border border-white/5 p-5 rounded-xl flex items-center gap-4 hover:border-white/10 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shrink-0">
                <PhoneCall size={16} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold font-mono text-gray-500 uppercase tracking-wider block">Location Hub</span>
                <span className="text-white font-semibold text-xs md:text-sm block truncate">West Bengal, India</span>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <ContactForm />

        </div>
      </section>

      <Footer />
    </>
  );
}
