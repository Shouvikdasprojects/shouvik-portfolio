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
    default: 'Shouvik Das | UI/UX Architect · Web3D Developer · Anime Content Creator',
    template: '%s | Shouvik Das',
  },
  description: 'Official portfolio of Shouvik Das — India\'s leading UI/UX Architect & Spatial Web3D Developer. Creator of 8+ production apps (Next.js 16, Three.js, Cloudflare Workers). Managing 25K+ audience across anime & content creation channels.',
  keywords: [
    // Core Identity
    'Shouvik Das', 'Shouvik Das portfolio', 'Shouvik Das developer', 'Shouvik Das India',
    'Shouvik Das Web3D', 'Shouvik Das anime', 'Shouvik Das Next.js',
    // Roles
    'UI UX Architect India', 'Web3D Developer India', 'Spatial web developer', 
    'Three.js developer India', 'Next.js developer West Bengal',
    'React developer India', 'Frontend developer India', 'Creative developer portfolio',
    // Technologies
    'Next.js 16 portfolio', 'Three.js portfolio', 'React Three Fiber developer',
    'Tailwind CSS developer', 'TypeScript developer India', 'Framer Motion developer',
    'Supabase developer', 'Cloudflare Workers developer',
    // Content Creator
    'Anime content creator India', 'Anime Nation India', 'YouTube anime channel India',
    'Manga explanation YouTube', 'Anime Nation India Instagram',
    // Projects
    'Otaku Insider anime app', 'AniSpectra', 'ANI Media Online', 'AniOtakuMedia',
    'anime tracking platform', 'anime watchlist app Next.js',
    // Portfolio type
    '3D portfolio website', 'immersive portfolio', 'interactive portfolio India',
    'WebGL portfolio', 'glassmorphism portfolio', 'anime developer portfolio',
    // Hire
    'hire UI UX designer India', 'hire web developer West Bengal India',
    'freelance Next.js developer', 'freelance Three.js developer',
  ],
  authors: [{ name: 'Shouvik Das', url: 'https://shouvikdasportfolio.qzz.io' }],
  creator: 'Shouvik Das',
  publisher: 'Shouvik Das',
  category: 'Portfolio, Technology, Design',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Shouvik Das | UI/UX Architect · Web3D Developer · Anime Creator',
    description: 'India\'s premier 3D portfolio — Shouvik Das creates hardware-accelerated spatial web experiences with Next.js 16, Three.js & WebGL. 25K+ creator following across YouTube & Instagram.',
    url: 'https://shouvikdasportfolio.qzz.io',
    siteName: 'Shouvik Das',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Shouvik Das — UI/UX Architect & Web3D Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shouvik Das | UI/UX Architect · Web3D Developer',
    description: 'India\'s premier 3D portfolio — Next.js 16, Three.js, 25K+ creator audience. Open for hire.',
    creator: '@shouvikdas155',
    site: '@shouvikdas155',
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

import ScrollProgress from '@/components/ScrollProgress';
import SpotlightCursor from '@/components/SpotlightCursor';
import AIAssistant from '@/components/AIAssistant';
import DeveloperTerminal from '@/components/DeveloperTerminal';
import BookingModal from '@/components/BookingModal';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // Advanced Google Sitelinks Search Schema + FAQ + Local Person
  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://shouvikdasportfolio.qzz.io/#website",
        "url": "https://shouvikdasportfolio.qzz.io/",
        "name": "Shouvik Das",
        "description": "India's premier 3D portfolio — UI/UX Architecture, Spatial Web3D Development, and anime content creation by Shouvik Das.",
        "publisher": { "@id": "https://shouvikdasportfolio.qzz.io/#person" },
        "potentialAction": [{
          "@type": "SearchAction",
          "target": { "@type": "EntryPoint", "urlTemplate": "https://shouvikdasportfolio.qzz.io/articles?q={search_term_string}" },
          "query-input": "required name=search_term_string"
        }],
        "inLanguage": "en-US"
      },
      {
        "@type": "Person",
        "@id": "https://shouvikdasportfolio.qzz.io/#person",
        "name": "Shouvik Das",
        "givenName": "Shouvik",
        "familyName": "Das",
        "image": "https://shouvikdasportfolio.qzz.io/assets/shouvik.jpg",
        "description": "India-based UI/UX Architect, Spatial Web3D Developer, and Anime content creator managing 25,000+ followers across multiple platforms.",
        "url": "https://shouvikdasportfolio.qzz.io",
        "email": "shouvikdaswork@gmail.com",
        "jobTitle": "UI/UX Architect & Spatial Web3D Developer",
        "worksFor": { "@type": "Organization", "name": "Freelance / Self-Employed" },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "West Bengal",
          "addressCountry": "IN"
        },
        "sameAs": [
          "https://www.instagram.com/shouvik_das_official",
          "https://x.com/shouvikdas155",
          "https://www.facebook.com/share/1EWixcZYDr/",
          "https://heylink.me/ShouvikDas/",
          "https://www.youtube.com/@shouvikdasvlogss",
          "https://www.instagram.com/animenationindia"
        ],
        "knowsAbout": [
          "Three.js", "React Three Fiber", "Next.js 16", "UI/UX Architecture",
          "Tailwind CSS", "Spatial Web Development", "Anime Content Creation",
          "Video Editing", "Cinematography", "TypeScript", "Supabase"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What does Shouvik Das specialize in?",
            "acceptedAnswer": { "@type": "Answer", "text": "Shouvik Das specializes in UI/UX Architecture, Spatial Web3D Development using Three.js and React Three Fiber, and anime/digital content creation across YouTube and Instagram." }
          },
          {
            "@type": "Question",
            "name": "Is Shouvik Das available for hire?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes! Shouvik Das is available for Web3D contracts, UI/UX design collaborations, Next.js frontend projects, and creative digital media productions. Contact via shouvikdaswork@gmail.com." }
          },
          {
            "@type": "Question",
            "name": "What tech stack does Shouvik Das use?",
            "acceptedAnswer": { "@type": "Answer", "text": "Primary stack includes Next.js 16, React 19, Three.js, React Three Fiber, TypeScript, Tailwind CSS, Framer Motion, Supabase, MongoDB, Cloudflare Workers, and Drizzle ORM." }
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" className="scroll-smooth bg-[#040209]" data-scroll-behavior="smooth">
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Rich Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body className="antialiased font-sans bg-transparent">
        {/* Global scroll progress bar */}
        <ScrollProgress />

        {/* Cursor spotlight effect */}
        <SpotlightCursor />

        {/* Intercepts and silences three-party deprecations */}
        <ConsoleGuard />

        {/* Global Continuous 3D WebGL cosmos fixed in the background */}
        <Suspense fallback={null}>
          <Background3D />
        </Suspense>

        {/* Global Standout Features */}
        <CommandPalette />
        <FloatingActionDock />

        {/* 1-Click Meeting / Discovery Call Booking Modal */}
        <BookingModal />

        {/* AI Portfolio Assistant */}
        <AIAssistant />

        {/* Retro Developer Terminal (Shortcut: ` or ~) */}
        <DeveloperTerminal />
        
        {/* Main layout contents */}
        {children}
      </body>
    </html>
  );
}
