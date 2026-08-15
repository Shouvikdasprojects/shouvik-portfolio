import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { recentUploadsList as baseUploads } from '@/lib/realData';
import { getSocialPosts } from '@/lib/db';
import UploadsClient from './UploadsClient';

export const metadata = {
  title: 'My Latest Uploads & Activities | Shouvik Das',
  description: 'Stay updated with my latest anime music edits, travel vlogs, food photography, and digital art uploads across YouTube, Facebook, and Instagram.',
};

export default async function UploadsPage() {
  const dbPosts = await getSocialPosts(50);
  const dynamicUploads = dbPosts.length > 0 ? dbPosts : baseUploads;

  return (
    <>
      <Navbar />

      <section className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-transparent">
        <div className="ambient-glow -top-48 -left-48 bg-primary/15 pointer-events-none" />
        <div className="ambient-glow top-1/2 -right-48 bg-secondary/10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16 gap-3">
            <span className="text-xs font-bold text-primary font-mono tracking-widest uppercase animate-pulse">
              REAL-TIME UPLOAD STREAM
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Latest Uploads & <span className="gradient-text-primary">Activities Feed</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
              Whenever I release a new travel vlog, anime art synchronisation, or Instagram post, it updates directly in this visual feed.
            </p>
            <div className="w-20 h-[3px] bg-gradient-to-r from-primary to-secondary rounded-full mt-2" />
          </div>

          {/* Client component handles filtering */}
          <UploadsClient uploads={dynamicUploads} />
        </div>
      </section>

      <Footer />
    </>
  );
}
