import { Metadata } from 'next';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = {
  title: 'Featured Projects & System Specs | Shouvik Das',
  description: 'Explore anime tracking ecosystems, 3D WebGL portals, and high-performance stream tools built by Shouvik Das.',
  openGraph: {
    title: 'Featured Projects & System Specs | Shouvik Das',
    description: 'Explore anime tracking ecosystems, 3D WebGL portals, and high-performance stream tools built by Shouvik Das.',
    url: 'https://shouvikdasportfolio.qzz.io/projects',
    siteName: 'Shouvik Das Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Featured Projects & System Specs | Shouvik Das',
    description: 'Explore anime tracking ecosystems, 3D WebGL portals, and high-performance stream tools built by Shouvik Das.',
  },
  alternates: {
    canonical: 'https://shouvikdasportfolio.qzz.io/projects',
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
