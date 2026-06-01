import { searchArticles } from '@/lib/db';
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
    title: query ? `Search results for "${query}" | Shouvik Das` : 'Search Articles | Shouvik Das',
    description: `Real-time AI articles and tech developments matching search term: ${query || ''}`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { query } = await searchParams;
  const results = await searchArticles(query || '');

  return (
    <>
      <Navbar />
      
      <section className="relative min-h-screen pt-32 pb-24 overflow-hidden">
        {/* Glow ambient background assets */}
        <div className="ambient-glow -top-48 -left-48 bg-primary/15" />
        <div className="ambient-glow top-1/2 -right-48 bg-secondary/10" />

        <SearchResults articles={results} initialQuery={query || ''} />
      </section>

      <Footer />
    </>
  );
}
