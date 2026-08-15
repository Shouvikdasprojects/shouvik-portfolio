import { searchArticles } from '@/lib/db';
import { projectsList, socialLinks, youtubeChannels, recentUploadsList } from '@/lib/realData';
import SearchResults from '@/components/SearchResults';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

interface SearchPageProps {
  searchParams: Promise<{ query?: string }>;
}

export const revalidate = 0; // Dynamic search results, always fresh

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { query } = await searchParams;
  return {
    title: query ? `Omnisearch: "${query}" | Shouvik Das` : 'Global Omnisearch Engine | Shouvik Das',
    description: `Search across all projects, AI discoveries, YouTube channels, and digital media created by Shouvik Das matching: ${query || 'all content'}`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { query } = await searchParams;
  const articles = await searchArticles(query || '');

  return (
    <>
      <Navbar />
      
      <section className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-transparent">
        {/* Glow ambient background assets */}
        <div className="ambient-glow -top-48 -left-48 bg-primary/15" />
        <div className="ambient-glow top-1/2 -right-48 bg-secondary/10" />

        <SearchResults 
          articles={articles} 
          projects={projectsList}
          socials={socialLinks}
          channels={youtubeChannels}
          uploads={recentUploadsList}
          initialQuery={query || ''} 
        />
      </section>

      <Footer />
    </>
  );
}
