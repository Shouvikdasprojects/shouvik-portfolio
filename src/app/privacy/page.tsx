import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/ui/GlassCard';
import { ShieldCheck, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Shouvik Das',
  description: 'Privacy policy and data governance statement for Shouvik Das 3D Interactive Portfolio.',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />

      <section className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-transparent">
        {/* Ambient background styling */}
        <div className="ambient-glow -top-48 -left-48 bg-[#ff007f]/15 pointer-events-none" />
        <div className="ambient-glow top-1/2 -right-48 bg-[#8b5cf6]/10 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-12 gap-3">
            <span className="text-xs font-bold text-[#ff007f] font-mono tracking-[0.2em] uppercase animate-pulse">
              DATA GOVERNANCE
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Privacy <span className="gradient-text-primary">Policy</span>
            </h1>
            <div className="w-16 h-[3px] bg-gradient-to-r from-[#ff007f] to-[#8b5cf6] rounded-full mt-2" />
            <span className="text-xs text-gray-500 font-mono flex items-center gap-1.5 mt-2">
              <Calendar size={12} /> Last Updated: June 1, 2026
            </span>
          </div>

          {/* Privacy Document */}
          <GlassCard className="bg-[#0b0814]/65 border-white/5 p-8 md:p-10 text-left leading-relaxed text-gray-300 space-y-6">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
              <ShieldCheck className="text-[#ff007f]" size={24} />
              <h2 className="text-lg md:text-xl font-bold text-white">Your Privacy is Paramount</h2>
            </div>

            <p className="text-sm md:text-base">
              Welcome to the official 3D Interactive Portfolio of <strong>Shouvik Das</strong>. I am fully committed to maintaining the trust and confidence of all visitors to my website. This Privacy Policy details how I handle personal data and ensure data safety across all services.
            </p>

            <div className="space-y-4">
              <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-wider font-mono">1. Information I Collect</h3>
              <p className="text-xs md:text-sm text-gray-400">
                When you interact with this website, I may collect information in two main categories:
              </p>
              <ul className="list-disc pl-5 text-xs md:text-sm text-gray-400 space-y-1.5">
                <li><strong>Inquiries & Messages:</strong> Any information you explicitly submit through the Contact Form (Name, Email, Subject, Message) is processed securely to respond to your inquiries.</li>
                <li><strong>Telemetry & Usage Data:</strong> Anonymized WebGL canvas performance benchmarks, page views, and scrolling depth logs are tracked strictly to optimize rendering speeds and particle physics count on mobile screens.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-wider font-mono">2. How I Use Your Information</h3>
              <p className="text-xs md:text-sm text-gray-400">
                I do not sell, rent, or trade email lists or user information with third-party companies. Any information collected is strictly used to:
              </p>
              <ul className="list-disc pl-5 text-xs md:text-sm text-gray-400 space-y-1.5">
                <li>Respond directly to your portfolio work inquiries or contract proposals.</li>
                <li>Deliver live notifications or coordinate content edits through secure API integrations.</li>
                <li>Dynamically adjust particle counts or Three.js parameters to improve hardware performance on your specific browser environment.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-wider font-mono">3. Cookies & LocalStorage</h3>
              <p className="text-xs md:text-sm text-gray-400">
                This site utilizes premium localStorage caching routines to ensure that dynamic articles, projects data, and layout preferences load instantly on subsequent visits without invoking repetitive, slow API requests. You can clear your browser storage at any time to purge this cache.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-wider font-mono">4. Security & Persistence</h3>
              <p className="text-xs md:text-sm text-gray-400">
                Any database transactions, social stat synchronization payloads, and contact form submissions are piped through encrypted SSL/TLS channels directly into secure Supabase cloud infrastructures.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 mt-8">
              <p className="text-xs text-gray-500">
                If you have any questions or data removal requests regarding this privacy policy, please drop a line through my contact engine or email <a href="mailto:shouvikdaswork@gmail.com" className="text-primary hover:underline">shouvikdaswork@gmail.com</a>.
              </p>
            </div>
          </GlassCard>

        </div>
      </section>

      <Footer />
    </>
  );
}
