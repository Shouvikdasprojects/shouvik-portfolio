import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Shouvik Das | UI/UX Architect & Spatial Web3D Developer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #05020c 0%, #0c071d 50%, #030108 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
          border: '4px solid rgba(255, 0, 127, 0.4)',
        }}
      >
        {/* Glow ambient circle */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255, 0, 127, 0.25)',
            filter: 'blur(100px)',
          }}
        />

        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#ff007f',
              boxShadow: '0 0 20px #ff007f',
            }}
          />
          <span
            style={{
              color: '#ff007f',
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            SHOUVIK DAS // PORTFOLIO
          </span>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            UI/UX Architect &amp;
            <span
              style={{
                display: 'block',
                color: '#ff007f',
              }}
            >
              Spatial Web3D Developer
            </span>
          </h1>
          <p
            style={{
              fontSize: '24px',
              color: '#94a3b8',
              maxWidth: '850px',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Crafting hardware-accelerated 3D web experiences with Next.js 16, Three.js &amp; WebGL. 25K+ creator audience across India.
          </p>
        </div>

        {/* Bottom Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              background: 'rgba(255, 0, 127, 0.15)',
              border: '1px solid rgba(255, 0, 127, 0.4)',
              padding: '10px 22px',
              borderRadius: '999px',
              color: '#ff007f',
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            Next.js 16
          </div>
          <div
            style={{
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              padding: '10px 22px',
              borderRadius: '999px',
              color: '#a78bfa',
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            Three.js / WebGL
          </div>
          <div
            style={{
              background: 'rgba(14, 165, 233, 0.15)',
              border: '1px solid rgba(14, 165, 233, 0.4)',
              padding: '10px 22px',
              borderRadius: '999px',
              color: '#38bdf8',
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            Cloudflare Workers
          </div>
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              padding: '10px 22px',
              borderRadius: '999px',
              color: '#34d399',
              fontSize: '16px',
              fontWeight: 700,
              marginLeft: 'auto',
            }}
          >
            🟢 Available for Hire
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
