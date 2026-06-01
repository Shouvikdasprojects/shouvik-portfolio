import type { Metadata } from 'next';
import { Outfit, Fira_Code } from 'next/font/google';
import './globals.css';
import Background3D from '@/components/3d/Background3D';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://shouvikdas.eu.org'),
  title: {
    default: 'Shouvik Das | 3D Portfolio & Content Creator',
    template: '%s | Shouvik Das',
  },
  description: 'Welcome to my official 3D portfolio website. I am Shouvik Das, a Next.js frontend developer, web designer, and digital content creator specializing in interactive web experiences, anime/manga community hubs, and high-performance applications.',
  keywords: [
    'Shouvik Das',
    'Shouvik Das portfolio',
    'Shouvik Das developer',
    '3D Portfolio',
    'Next.js developer',
    'Three.js',
    'Tailwind CSS'
  ],
  authors: [{ name: 'Shouvik Das', url: 'https://shouvikdas.eu.org' }],
  creator: 'Shouvik Das',
  openGraph: {
    title: 'Shouvik Das | 3D Portfolio & Content Creator',
    description: 'Welcome to my official 3D portfolio website. I am Shouvik Das, a Next.js frontend developer, web designer, and digital content creator specializing in interactive web experiences, anime/manga community hubs, and high-performance applications.',
    url: 'https://shouvikdas.eu.org',
    siteName: 'Shouvik Das',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Shouvik Das 3D Showcase',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shouvik Das | 3D Portfolio & Content Creator',
    description: 'Welcome to my official 3D portfolio website. I am Shouvik Das, a Next.js frontend developer, web designer, and digital content creator specializing in interactive web experiences, anime/manga community hubs, and high-performance applications.',
    creator: '@shouvikdas155',
    images: ['https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&auto=format&fit=crop&q=80'],
  },
  alternates: {
    canonical: 'https://shouvikdas.eu.org',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // Advanced Google Sitelinks Search Schema (Graph format linking Website to Person)
  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://shouvikdas.eu.org/#website",
        "url": "https://shouvikdas.eu.org/",
        "name": "Shouvik Das",
        "description": "Interactive 3D Personal Portfolio & AI Products Showcase",
        "publisher": {
          "@id": "https://shouvikdas.eu.org/#person"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://shouvikdas.eu.org/articles?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "en-US"
      },
      {
        "@type": "Person",
        "@id": "https://shouvikdas.eu.org/#person",
        "name": "Shouvik Das",
        "image": "https://shouvikdas.eu.org/favicon.ico",
        "description": "Expert Full-Stack Web3D Developer, UI/UX Designer, and SEO Specialist.",
        "sameAs": [
          "https://www.instagram.com/shouvik_das_official",
          "https://x.com/shouvikdas155",
          "https://github.com"
        ],
        "jobTitle": "Full-Stack Web3D Developer",
        "email": "contact@shouvikdas.eu.org",
        "knowsAbout": [
          "Three.js",
          "React Three Fiber",
          "Next.js",
          "Tailwind CSS",
          "Artificial Intelligence",
          "Search Engine Optimization (SEO)"
        ]
      }
    ]
  };

  return (
    <html lang="en" className="scroll-smooth bg-[#040209]" data-scroll-behavior="smooth">
      <head>
        {/* Dynamic Sitelinks Search Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body className={`${outfit.variable} ${firaCode.variable} antialiased font-sans bg-transparent`}>
        {/* Global Continuous 3D WebGL cosmos fixed in the background */}
        <Background3D />
        
        {/* Main layout contents */}
        {children}
      </body>
    </html>
  );
}
