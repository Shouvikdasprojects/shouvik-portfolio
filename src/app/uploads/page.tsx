import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TiltCard from '@/components/ui/TiltCard';
import SafeImage from '@/components/ui/SafeImage';
import { recentUploadsList as baseUploads } from '@/lib/realData';
import { getSocialPosts } from '@/lib/db';
import { ExternalLink, Sparkles, Film, Image as ImageIcon } from 'lucide-react';

export const metadata = {
  title: 'My Latest Uploads & Activities | Shouvik Das',
  description: 'Stay updated with my latest anime music edits, travel vlogs, food photography, and digital art uploads across YouTube, Facebook, and Instagram.',
};

export default async function UploadsPage() {
  const dbPosts = await getSocialPosts(50); // Fetch top 50 uploads
  const dynamicUploads = dbPosts.length > 0 ? dbPosts : baseUploads;

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
            <span className="text-xs font-bold text-[#ff007f] font-mono tracking-widest uppercase">
              REAL-TIME UPLOAD STREAM
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Latest Uploads & <span className="gradient-text-primary">Activities Feed</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
              Stay in the loop! Whenever I release a new travel vlog, anime art synchronisation, or Instagram post, it updates directly in this visual feed.
            </p>
            <div className="w-20 h-[3px] bg-gradient-to-r from-[#ff007f] to-[#8b5cf6] rounded-full mt-2" />
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dynamicUploads.map((post, idx) => (
              <TiltCard key={idx} className="flex flex-col h-full bg-[#0b0814]/40 border-white/5 p-6">
                
                {/* Visual Cover Thumbnail */}
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-6 bg-slate-900 border border-white/5">
                  <SafeImage 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                    fallbackSrc={post.source.includes("Anime Nation India") ? "/assets/animenation.jpg" : "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=60"}
                  />
                  
                  {/* Media Type Badge */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold font-mono px-2.5 py-1 rounded flex items-center gap-1">
                    {post.type === 'Video' || post.type === 'Vlog' ? <Film size={10} className="text-red-500" /> : <ImageIcon size={10} className="text-[#ff007f]" />}
                    {post.type.toUpperCase()}
                  </div>

                  {/* Channel Tag */}
                  <div className="absolute bottom-3 right-3 bg-[#ff007f]/90 text-white font-mono text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {post.source}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-1.5 leading-snug">
                  {post.title}
                  {post.title.toLowerCase().includes('anime') && <Sparkles size={12} className="text-[#ff007f] shrink-0" />}
                </h3>
                
                <p className="text-gray-400 text-xs md:text-sm mb-6 leading-relaxed flex-grow">
                  {post.description}
                </p>

                {/* Direct Action Link */}
                <div className="flex gap-4 border-t border-white/5 pt-4 mt-auto">
                  <a 
                    href={post.url || "#"} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full py-2 text-center text-xs font-bold bg-[#ff007f]/10 hover:bg-[#ff007f] text-white rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md group cursor-pointer"
                  >
                    View Post / Video <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </TiltCard>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
