'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import * as THREE from 'three';
import InteractiveText from './InteractiveText';
import FloatingElements from './FloatingElements';

// Spotlight component that tracks the mouse cursor to cast premium reflective glares
function MouseLight() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    // Map mouse coordinates to matching light positions
    lightRef.current.position.x = state.mouse.x * 6;
    lightRef.current.position.y = state.mouse.y * 6;
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 4]}
      intensity={8.0}
      distance={15}
      color="#a855f7" // Purple glowing reflections
    />
  );
}

export default function HeroCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Beautiful loading skeleton to preserve layout and prevent layout shifts
    return (
      <div className="w-full h-full flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-muted-foreground font-mono text-sm tracking-widest animate-pulse">
            LOADING 3D WORLD...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative z-10 select-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.4} />
        
        {/* Colorful scene lighting */}
        <directionalLight position={[5, 5, 2]} intensity={1.5} color="#0ea5e9" /> {/* Cyan */}
        <directionalLight position={[-5, 5, 2]} intensity={1.2} color="#ec4899" /> {/* Pink */}
        <directionalLight position={[0, -5, 2]} intensity={0.8} color="#8b5cf6" /> {/* Violet */}
        
        {/* Dynamic spot cursor lighting */}
        <MouseLight />
        
        <Suspense fallback={null}>
          <group position={[0, 0.5, 0]}>
            <InteractiveText />
          </group>
          <FloatingElements />
        </Suspense>
        
        {/* Disable auto-rotation/zoom to allow the page cursor to do the heavy lifting */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2} 
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
