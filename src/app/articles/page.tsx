import { getArticles } from '@/lib/db';
import BlogListing from '@/components/BlogListing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DevSyncButton from '@/components/ui/DevSyncButton';
import { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Global Discoveries Blog | Shouvik Das',
  description: 'Explore dynamic, AI-powered pop-culture, science, tech, and anime articles generated in real-time by Shouvik Das\'s automated portfolio. Search the live internet.',
  openGraph: {
    title: 'Global Discoveries Blog | Shouvik Das',
    description: 'Explore dynamic, AI-powered pop-culture, science, tech, and anime articles generated in real-time. With live internet search.',
    url: 'https://shouvikdasportfolio.qzz.io/articles',
    type: 'website',
  },
};

export default async function ArticlesIndexPage() {
  const articles = await getArticles();
  const isDev = process.env.NODE_ENV === 'development';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Global Discoveries Blog",
    "description": "Dynamic, AI-powered tech, anime, pop-culture, and science articles aggregated in real-time with live internet search.",
    "url": "https://shouvikdasportfolio.qzz.io/articles",
    "publisher": {
      "@type": "Person",
      "name": "Shouvik Das"
    }
  };

  return (
    <>
      <Navbar />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* PREMIUM MAGAZINE HERO HEADER */}
      <section className="relative pt-28 pb-0 overflow-hidden">
        {/* Ambient glows */}
        <div className="ambient-glow -top-40 -left-40 bg-primary/15" />
        <div className="ambient-glow top-1/3 -right-40 bg-secondary/10" />

        {/* Magazine-style header */}
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden border border-white/6 bg-gradient-to-br from-[#0e0820]/90 via-[#090514]/90 to-[#06030f]/90 backdrop-blur-xl p-10 md:p-16">
            
            {/* Background decorative glow ring */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-secondary/8 rounded-full blur-[80px] pointer-events-none" />

            {/* Scan line effect */}
            <div className="absolute inset-0 scan-line-fx pointer-events-none overflow-hidden rounded-3xl opacity-30" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
              {/* Left: Title & Description */}
              <div className="flex flex-col gap-5 max-w-2xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] font-bold text-primary font-mono tracking-widest uppercase bg-primary/10 border border-primary/25 px-3 py-1.5 rounded-full">
                    AI-POWERED KNOWLEDGE HUB
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/8 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE INTERNET SEARCH ENABLED
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.05] tracking-tight">
                  Global{' '}
                  <span className="gradient-text-primary">Discoveries</span>
                </h1>

                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  Bi-hourly AI-curated news across Tech, Science, Anime & Entertainment — plus{' '}
                  <strong className="text-white">live internet search</strong> that works just like your browser. Type anything below to explore the web in real-time.
                </p>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-5 pt-2">
                  {[
                    { value: `${articles.length}`, label: 'Published Articles' },
                    { value: '6', label: 'Categories' },
                    { value: 'Live', label: 'Internet Search' },
                  ].map(({ value, label }) => (
                    <div key={label} className="flex flex-col">
                      <span className="text-xl font-black text-primary font-mono">{value}</span>
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Feature pill list */}
              <div className="flex flex-col gap-3 shrink-0">
                {[
                  { icon: '🌐', text: 'Google News RSS — Live Internet' },
                  { icon: '🤖', text: 'Gemini 2.5 AI Writing Engine' },
                  { icon: '📡', text: '60s ISR Real-time Revalidation' },
                  { icon: '🔖', text: 'Save & Bookmark Any Article' },
                  { icon: '🔊', text: 'Audio Article Player Built-in' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/4 border border-white/6 text-sm text-gray-300">
                    <span className="text-base shrink-0">{icon}</span>
                    <span className="text-xs font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom accent bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* Blog Listing with Live Search */}
      <section className="relative pb-24 overflow-hidden">
        <BlogListing articles={articles} />
      </section>

      {isDev && <DevSyncButton />}

      <Footer />
    </>
  );
}
