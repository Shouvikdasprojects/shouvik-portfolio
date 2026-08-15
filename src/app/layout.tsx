import type { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';
import Background3D from '@/components/3d/Background3D';
import ConsoleGuard from '@/components/ui/ConsoleGuard';
import CommandPalette from '@/components/CommandPalette';
import FloatingActionDock from '@/components/FloatingActionDock';

export const metadata: Metadata = {
  metadataBase: new URL('https://shouvikdasportfolio.qzz.io'),
  title: {
    default: 'Shouvik Das | Visionary UI/UX Architect & Spatial Web3D Developer',
    template: '%s | Shouvik Das',
  },
  description: 'Welcome to the official 3D portfolio of Shouvik Das — Visionary UI/UX Architect, Spatial Web3D Developer, and Digital Media Creator specializing in hardware-accelerated web ecosystems.',
  keywords: [
    'Shouvik Das',
    'Shouvik Das portfolio',
    'Shouvik Das developer',
    '3D Portfolio',
    'Next.js'
  ],
  authors: [{ name: 'Shouvik Das', url: 'https://shouvikdasportfolio.qzz.io' }],
  creator: 'Shouvik Das',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Shouvik Das | 3D Portfolio & Content Creator',
    description: 'Welcome to my official 3D portfolio website. I am Shouvik Das, a Next.js frontend developer and digital content creator specializing in interactive web experiences.',
    url: 'https://shouvikdasportfolio.qzz.io',
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
    description: 'Welcome to my official 3D portfolio website. I am Shouvik Das, a Next.js frontend developer and digital content creator specializing in interactive web experiences.',
    creator: '@shouvikdas155',
    images: ['https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&auto=format&fit=crop&q=80'],
  },
  verification: {
    google: 'wlSD6-PTK-u0iUrOjISyX4u0xX3PQMMXllSrNZ_vVEs',
  },
  alternates: {
    canonical: 'https://shouvikdasportfolio.qzz.io',
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
        "@id": "https://shouvikdasportfolio.qzz.io/#website",
        "url": "https://shouvikdasportfolio.qzz.io/",
        "name": "Shouvik Das",
        "description": "Interactive 3D Personal Portfolio & AI Products Showcase",
        "publisher": {
          "@id": "https://shouvikdasportfolio.qzz.io/#person"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://shouvikdasportfolio.qzz.io/articles?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "en-US"
      },
      {
        "@type": "Person",
        "@id": "https://shouvikdasportfolio.qzz.io/#person",
        "name": "Shouvik Das",
        "image": "https://shouvikdasportfolio.qzz.io/favicon.ico",
        "description": "Visionary UI/UX Architect, Spatial Web3D Developer, and Digital Media Creator.",
        "sameAs": [
          "https://www.instagram.com/shouvik_das_official",
          "https://x.com/shouvikdas155",
          "https://heylink.me/ShouvikDas/"
        ],
        "jobTitle": "Visionary UI/UX Architect & Spatial Web3D Developer",
        "email": "shouvikdaswork@gmail.com",
        "knowsAbout": [
          "Three.js",
          "React Three Fiber",
          "Next.js 16",
          "UI/UX Architecture",
          "Tailwind CSS",
          "Digital Storytelling",
          "Artificial Intelligence"
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
      <body className="antialiased font-sans bg-transparent">
        {/* Intercepts and silences three-party deprecations */}
        <ConsoleGuard />

        {/* Global Continuous 3D WebGL cosmos fixed in the background */}
        <Suspense fallback={null}>
          <Background3D />
        </Suspense>

        {/* Global Standout Features */}
        <CommandPalette />
        <FloatingActionDock />
        
        {/* Main layout contents */}
        {children}
      </body>
    </html>
  );
}
