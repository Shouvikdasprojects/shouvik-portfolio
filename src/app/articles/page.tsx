import { getArticles } from '@/lib/db';
import BlogListing from '@/components/BlogListing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DevSyncButton from '@/components/ui/DevSyncButton';
import { Metadata } from 'next';

export const revalidate = 60; // Fetch fresh DB data every 60s (ISR)

export const metadata: Metadata = {
  title: 'Global Discoveries Blog | Shouvik Das',
  description: 'Explore dynamic, AI-powered pop-culture, science, tech, and anime articles generated in real-time by Shouvik Das\'s automated portfolio.',
  openGraph: {
    title: 'Global Discoveries Blog | Shouvik Das',
    description: 'Explore dynamic, AI-powered pop-culture, science, tech, and anime articles generated in real-time.',
    url: 'https://shouvikdas.eu.org/articles',
    type: 'website',
  },
};

export default async function ArticlesIndexPage() {
  const articles = await getArticles();
  const isDev = process.env.NODE_ENV === 'development';

  // JSON-LD Schema markup for the Blog Page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Global Discoveries Blog",
    "description": "Dynamic, AI-powered tech, anime, pop-culture, and science articles aggregated in real-time.",
    "url": "https://shouvikdas.eu.org/articles",
    "publisher": {
      "@type": "Person",
      "name": "Shouvik Das"
    }
  };

  return (
    <>
      <Navbar />
      
      {/* JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative min-h-screen pt-32 pb-24 overflow-hidden">
        {/* Glow ambient background assets */}
        <div className="ambient-glow -top-48 -left-48 bg-primary/15" />
        <div className="ambient-glow top-1/2 -right-48 bg-secondary/10" />

        {/* Page title and headers */}
        <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10 text-center lg:text-left flex flex-col gap-3">
          <span className="text-xs font-bold text-primary font-mono tracking-widest uppercase">
            AI-POWERED KNOWLEDGE HUB
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Global <span className="gradient-text-primary">Discoveries</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Bi-hourly automated global updates. This section crawls live news channels across Tech, Entertainment, Science, and Anime, structures raw reports, and lets Google Gemini compose engaging, SEO-rich analyses.
          </p>
          <div className="w-20 h-[3px] bg-gradient-to-r from-primary to-secondary rounded-full mt-2 mx-auto lg:mx-0" />
        </div>

        {/* Dynamic Interactive Blog Grid */}
        <BlogListing articles={articles} />
      </section>

      {/* Conditionally rendered Developer Manual Sync Button */}
      {isDev && <DevSyncButton />}

      <Footer />
    </>
  );
}
