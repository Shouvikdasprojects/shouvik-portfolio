import { getArticleBySlug, getArticles } from '@/lib/db';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReadingProgressBar from '@/components/ui/ReadingProgressBar';
import ArticleCard from '@/components/ui/ArticleCard';
import ArticleSharePanel from '@/components/ui/ArticleSharePanel';
import AudioArticlePlayer from '@/components/ui/AudioArticlePlayer';
import ArticleTableOfContents from '@/components/ui/ArticleTableOfContents';
import ArticleReactions from '@/components/ui/ArticleReactions';
import SafeImage from '@/components/ui/SafeImage';
import { ArrowLeft, Clock, Calendar, Bookmark, Sparkles, User, ExternalLink, Flame, Compass } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Dynamic SEO metadata generator
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | Shouvik Das',
      description: 'The requested tech article could not be found.',
    };
  }

  return {
    title: `${article.title} | Shouvik Das Tech Discoveries`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      url: `https://shouvikdasportfolio.qzz.io/articles/${article.slug}`,
      images: [
        {
          url: article.image,
          alt: article.title,
        },
      ],
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Fetch related articles from same category with fallback
  const allArticles = await getArticles();
  let relatedArticles = allArticles
    .filter(a => a.slug !== article.slug)
    .filter(a => a.category?.toLowerCase() === article.category?.toLowerCase())
    .slice(0, 3);

  if (relatedArticles.length < 2) {
    relatedArticles = allArticles.filter(a => a.slug !== article.slug).slice(0, 3);
  }

  // Estimate reading time from words
  const words = article.content.replace(/<[^>]+>/g, '').split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.round(words / 200));

  // JSON-LD structured schemas for search index Sitelinks and Google Discover
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": article.title,
    "description": article.description,
    "image": article.image,
    "datePublished": article.publishedAt,
    "dateModified": article.publishedAt,
    "category": article.category,
    "author": {
      "@type": "Person",
      "name": "Shouvik Das",
      "jobTitle": "Visionary UI/UX Architect & Spatial Web3D Developer",
      "url": "https://shouvikdasportfolio.qzz.io"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Shouvik Das Portfolio",
      "logo": {
        "@type": "ImageObject",
        "url": "https://shouvikdasportfolio.qzz.io/favicon.ico"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://shouvikdasportfolio.qzz.io/articles/${article.slug}`
    }
  };

  return (
    <>
      <ReadingProgressBar />
      <Navbar />

      {/* Structured data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-transparent">
        {/* Glow ambient panels */}
        <div className="ambient-glow -top-48 -left-48 bg-primary/10 pointer-events-none" />
        <div className="ambient-glow top-1/2 -right-48 bg-secondary/10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          
          {/* Back button */}
          <Link 
            href="/articles" 
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-400 hover:text-primary mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> BACK TO DISCOVERIES
          </Link>

          {/* Category & Date Info */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-500 mb-6">
            <span className="bg-primary/15 border border-primary/30 text-primary font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_12px_rgba(255,0,127,0.2)]">
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 text-gray-300"><Calendar size={12} className="text-primary" /> {new Date(article.publishedAt).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}</span>
            <span className="flex items-center gap-1.5 text-gray-300"><Clock size={12} className="text-secondary" /> {readingTimeMinutes} min read</span>
            <span className="flex items-center gap-1.5 text-cyan-400"><Bookmark size={12} className="text-cyan-400" /> via {article.source}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-8">
            {article.title}
          </h1>

          {/* Author Badge Bar */}
          <div className="flex items-center gap-3.5 pb-8 mb-8 border-b border-white/10">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-primary/40 p-0.5 bg-slate-900 shrink-0">
              <SafeImage
                src="/assets/shouvik.jpg"
                alt="Shouvik Das"
                className="w-full h-full object-cover rounded-full"
                fallbackSrc="/assets/shouvik.jpg"
              />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                Shouvik Das <span className="text-[10px] text-primary font-bold">✓ Lead Editor</span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono">
                UI/UX Architect & Spatial Web3D Developer · AI Neural Dispatch
              </p>
            </div>
          </div>

          {/* Large Hero Banner */}
          <div className="relative w-full h-[32vh] sm:h-[42vh] md:h-[50vh] rounded-3xl overflow-hidden mb-8 bg-slate-900 border border-white/10 shadow-2xl">
            <SafeImage 
              src={article.image} 
              alt={article.title} 
              className="w-full h-full object-cover" 
              fallbackSrc="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* AI Voice Narration Audio Player */}
          <AudioArticlePlayer title={article.title} content={article.content} />

          {/* Layout Grid: Article Content + Sticky TOC */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative w-full my-8">
            
            {/* Main Article Body (8 cols on desktop) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* Sticky Share Panel */}
              <ArticleSharePanel slug={article.slug} title={article.title} />

              {/* Dynamic Article HTML Content */}
              <div className="bg-[#0b0814]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
                <div 
                  className="prose prose-invert max-w-none text-gray-200 leading-relaxed
                    prose-h2:text-2xl prose-h2:font-black prose-h2:text-white prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2
                    prose-h3:text-xl prose-h3:font-bold prose-h3:text-white prose-h3:mt-6 prose-h3:mb-3
                    prose-p:text-sm prose-p:md:text-base prose-p:mb-6 prose-p:leading-relaxed prose-p:text-gray-300
                    prose-strong:text-white prose-strong:font-bold
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:space-y-2
                    prose-li:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>

              {/* Live Multi-Emoji Reactions Bar */}
              <ArticleReactions slug={article.slug} />

              {/* Author Bio Box */}
              <div className="rounded-3xl bg-gradient-to-br from-[#0c0818] to-[#140b25] border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-xl">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/40 bg-slate-900 shrink-0">
                  <SafeImage
                    src="/assets/shouvik.jpg"
                    alt="Shouvik Das"
                    className="w-full h-full object-cover"
                    fallbackSrc="/assets/shouvik.jpg"
                  />
                </div>
                <div className="flex flex-col gap-1.5 text-left">
                  <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                    <User size={12} /> WRITTEN & CURATED BY
                  </span>
                  <h4 className="text-lg font-bold text-white">Shouvik Das</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Visionary UI/UX Architect, Spatial Web3D Developer, and creator of Anime Nation India. Dedicated to pushing the boundaries of web engineering, digital storytelling, and international travel.
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs font-mono">
                    <a href="https://x.com/shouvikdas155" target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                      Twitter/X <ExternalLink size={10} />
                    </a>
                    <a href="https://heylink.me/ShouvikDas/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white flex items-center gap-1">
                      HeyLink Profile <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Sticky Sidebar: Table of Contents & Discovery Tools (4 cols) */}
            <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-28">
              <ArticleTableOfContents content={article.content} />
            </aside>

          </div>

          {/* Related Articles / "Up Next" Section */}
          {relatedArticles.length > 0 && (
            <div className="border-t border-white/10 pt-16 mt-16 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                  <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                    <Compass size={14} /> KEEP EXPLORING
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    Related Discoveries
                  </h3>
                </div>
                <Link
                  href="/articles"
                  className="text-xs font-mono font-bold text-primary hover:text-white transition-colors flex items-center gap-1"
                >
                  VIEW ALL DISCOVERIES →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {relatedArticles.map((relArt) => (
                  <ArticleCard key={relArt.slug} article={relArt} />
                ))}
              </div>
            </div>
          )}

        </div>
      </article>

      <Footer />
    </>
  );
}
