import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/ui/GlassCard';
import { Scale, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Shouvik Das',
  description: 'Terms of service agreement for using the Shouvik Das 3D Interactive Portfolio website.',
};

export default function TermsPage() {
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
              LEGAL TERMS
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Terms of <span className="gradient-text-primary">Service</span>
            </h1>
            <div className="w-16 h-[3px] bg-gradient-to-r from-[#ff007f] to-[#8b5cf6] rounded-full mt-2" />
            <span className="text-xs text-gray-500 font-mono flex items-center gap-1.5 mt-2">
              <Calendar size={12} /> Last Updated: June 1, 2026
            </span>
          </div>

          {/* Terms Document */}
          <GlassCard className="bg-[#0b0814]/65 border-white/5 p-8 md:p-10 text-left leading-relaxed text-gray-300 space-y-6">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
              <Scale className="text-[#ff007f]" size={24} />
              <h2 className="text-lg md:text-xl font-bold text-white">Terms of Website Utilization</h2>
            </div>

            <p className="text-sm md:text-base">
              By accessing and using this 3D Interactive Portfolio website of <strong>Shouvik Das</strong>, you agree to comply with and be bound by the following Terms of Service. If you do not agree to all of these terms, please do not use this site.
            </p>

            <div className="space-y-4">
              <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-wider font-mono">1. Creative Intellectual Property</h3>
              <p className="text-xs md:text-sm text-gray-400">
                All visual contents, customized WebGL source code, custom-compiled shaders, custom CSS transition rules, portfolio imagery, thumbnail assets, anime edits, and website design templates are the exclusive intellectual property of <strong>Shouvik Das</strong>, unless otherwise noted. 
              </p>
              <p className="text-xs md:text-sm text-gray-400">
                You may view and share links to this portfolio. However, copying, replicating, or redistributing the Three.js camera scroll pathways or custom scraping wrappers for commercial usage is strictly prohibited without explicit written consent.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-wider font-mono">2. Prohibited Website Activity</h3>
              <p className="text-xs md:text-sm text-gray-400">
                When using this portfolio, you agree strictly not to:
              </p>
              <ul className="list-disc pl-5 text-xs md:text-sm text-gray-400 space-y-1.5">
                <li>Submit spam or malicious payloads to the SMTP Inquiry contact engine.</li>
                <li>Execute automated bots, spiders, or scrapers that exceed normal viewport loading limits to DDOS database pools.</li>
                <li>Inject cross-site scripting (XSS) or remote codes into search query input streams.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-wider font-mono">3. Disclaimer of Liability</h3>
              <p className="text-xs md:text-sm text-gray-400">
                This site is provided on an "as is" and "as available" basis without warranties of any kind. While I endeavor to keep all scraping data, database upserts, and WebGL starfields running at native 60fps speeds across all viewports, I do not guarantee that the site will be error-free or uninterrupted.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-wider font-mono">4. Modifications to Terms</h3>
              <p className="text-xs md:text-sm text-gray-400">
                I reserve the right to revise or update these terms at any time without prior notice. By continuing to use the site after amendments are published, you accept and agree to the modified terms.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 mt-8">
              <p className="text-xs text-gray-500">
                If you have any questions regarding these terms, please contact <a href="mailto:shouvikdaswork@gmail.com" className="text-primary hover:underline">shouvikdaswork@gmail.com</a>.
              </p>
            </div>
          </GlassCard>

        </div>
      </section>

      <Footer />
    </>
  );
}
