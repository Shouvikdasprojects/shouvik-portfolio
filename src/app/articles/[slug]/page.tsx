import { getArticleBySlug } from '@/lib/db';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReadingProgressBar from '@/components/ui/ReadingProgressBar';
import ArticleCard from '@/components/ui/ArticleCard';
import ArticleSharePanel from '@/components/ui/ArticleSharePanel';
import { ArrowLeft, Clock, Calendar, Bookmark, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Dynamic dynamic SEO metadata generator
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
      url: `https://shouvikdas.eu.org/articles/${article.slug}`,
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
      "jobTitle": "Web3D Developer & Designer",
      "url": "https://shouvikdas.eu.org"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Shouvik Das Portfolio",
      "logo": {
        "@type": "ImageObject",
        "url": "https://shouvikdas.eu.org/favicon.ico"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://shouvikdas.eu.org/articles/${article.slug}`
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

      <article className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-[#06040d]">
        {/* Glow ambient panels */}
        <div className="ambient-glow -top-48 -left-48 bg-[#ff007f]/10" />
        <div className="ambient-glow top-1/2 -right-48 bg-[#8b5cf6]/5" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          
          {/* Back button */}
          <Link 
            href="/articles" 
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-400 hover:text-[#ff007f] mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> BACK TO DISCOVERIES
          </Link>

          {/* Category & Date Info */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-500 mb-6">
            <span className="bg-[#ff007f]/10 border border-[#ff007f]/20 text-[#ff007f] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(255,0,127,0.1)]">
              {article.category}
            </span>
            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#ff007f]" /> {new Date(article.publishedAt).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}</span>
            <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#8b5cf6]" /> 3 min read</span>
            <span className="flex items-center gap-1.5"><Bookmark size={12} className="text-cyan-400" /> via {article.source}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-8">
            {article.title}
          </h1>

          {/* Large Hero Banner */}
          <div className="relative w-full h-[30vh] md:h-[45vh] rounded-2xl overflow-hidden mb-12 bg-slate-900 border border-white/5 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.01]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Layout wrapper with relative positioning for sticky share */}
          <div className="relative w-full">
            
            {/* Sticky Share Panel */}
            <ArticleSharePanel slug={article.slug} title={article.title} />

            {/* Dynamic Article HTML Content */}
            <div 
              className="prose prose-invert max-w-none text-gray-300 mb-16 leading-relaxed
                prose-h3:text-2xl prose-h3:font-black prose-h3:text-white prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-sm prose-p:md:text-base prose-p:mb-6 prose-p:leading-relaxed prose-p:text-gray-300
                prose-strong:text-white prose-strong:font-bold
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:space-y-2
                prose-li:text-gray-300"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Discover Style Interaction card at the bottom */}
          <div className="border-t border-white/5 pt-12 mt-12">
            <h3 className="text-sm font-mono font-bold text-gray-500 uppercase tracking-widest mb-6 text-center flex items-center justify-center gap-1.5">
              <Sparkles size={14} className="text-[#ff007f] animate-pulse" /> Engage with this discovery
            </h3>
            
            <div className="max-w-md mx-auto">
              <ArticleCard article={article} />
            </div>
          </div>

        </div>
      </article>

      <Footer />
    </>
  );
}
