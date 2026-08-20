import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shouvik Das | UI/UX Architect & Web3D Developer',
    short_name: 'Shouvik Das',
    description: 'Official 3D Portfolio & Spatial Web Application Showcase of Shouvik Das.',
    start_url: '/',
    display: 'standalone',
    background_color: '#040209',
    theme_color: '#ff007f',
    icons: [
      {
        src: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
