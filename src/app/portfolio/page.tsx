import { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';

export const metadata: Metadata = {
  title: 'Executive Portfolio & Credentials | Shouvik Das',
  description: 'Full biographical details, resume download, contact channels, and official social media portfolio for Shouvik Das.',
  openGraph: {
    title: 'Executive Portfolio & Credentials | Shouvik Das',
    description: 'Full biographical details, resume download, contact channels, and official social media portfolio for Shouvik Das.',
    url: 'https://shouvikdasportfolio.qzz.io/portfolio',
    siteName: 'Shouvik Das Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Executive Portfolio & Credentials | Shouvik Das',
    description: 'Full biographical details, resume download, contact channels, and official social media portfolio for Shouvik Das.',
  },
  alternates: {
    canonical: 'https://shouvikdasportfolio.qzz.io/portfolio',
  },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
