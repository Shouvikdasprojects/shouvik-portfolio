'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Text } from '@react-three/drei';
import * as THREE from 'three';

// 1. High density, GPU accelerated Particle Starfield (Dynamic Theme Reactive!)
function StarField({ isMobile, scrollPercent, theme }: { isMobile: boolean; scrollPercent: number; theme: string }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate stars distributed across a large depth volume based on active theme
  const [positions, colors] = useMemo(() => {
    const count = isMobile ? 1200 : 3500;
    const posArray = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);

    let colorHexes = ['#ff007f', '#8b5cf6', '#0ea5e9', '#ffffff'];

    if (theme === 'cyber-cyan') {
      colorHexes = ['#00f0ff', '#3b82f6', '#a855f7', '#ffffff'];
    } else if (theme === 'matrix-emerald') {
      colorHexes = ['#00e676', '#10b981', '#059669', '#ffffff'];
    } else if (theme === 'sunset-gold') {
      colorHexes = ['#f59e0b', '#f97316', '#e11d48', '#ffffff'];
    } else if (theme === 'hyper-violet') {
      colorHexes = ['#a855f7', '#ec4899', '#6366f1', '#ffffff'];
    } else if (theme === 'crimson-red') {
      colorHexes = ['#ff003c', '#e11d48', '#f43f5e', '#ffffff'];
    } else if (theme === 'toxic-lime') {
      colorHexes = ['#ccff00', '#84cc16', '#10b981', '#ffffff'];
    } else if (theme === 'ice-arctic') {
      colorHexes = ['#38bdf8', '#818cf8', '#c084fc', '#ffffff'];
    }

    const colorPalette = colorHexes.map(h => new THREE.Color(h));

    for (let i = 0; i < count; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 90;     // X
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 90; // Y
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 160 - 50; // Z depth spanning -210 to 30

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
    }

    return [posArray, colorArray];
  }, [isMobile, theme]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.012 + (scrollPercent * 0.35);
    pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.03) * 0.03 + (scrollPercent * 0.15);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.16 : 0.22}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 2. Drifting low-poly volumetric 3D meshes along Z depth
interface PropType {
  position: [number, number, number];
  type: 'torus' | 'octahedron' | 'icosahedron' | 'dodecahedron';
  color: string;
  speed: number;
}

function FloatingNode({ position, type, color, speed }: PropType) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const offsets = useMemo(() => ({
    x: Math.random() * 50,
    y: Math.random() * 50,
    rotX: (Math.random() - 0.5) * 0.01,
    rotY: (Math.random() - 0.5) * 0.01,
  }), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() * speed;
    
    meshRef.current.rotation.x += offsets.rotX;
    meshRef.current.rotation.y += offsets.rotY;
    meshRef.current.position.y = position[1] + Math.sin(time + offsets.y) * 0.4;
  });

  return (
    <mesh ref={meshRef} position={position}>
      {type === 'torus' && <torusGeometry args={[0.9, 0.25, 16, 32]} />}
      {type === 'octahedron' && <octahedronGeometry args={[0.9, 0]} />}
      {type === 'icosahedron' && <icosahedronGeometry args={[0.9, 0]} />}
      {type === 'dodecahedron' && <dodecahedronGeometry args={[0.9, 0]} />}
      
      <meshStandardMaterial
        color={color}
        wireframe={true}
        emissive={color}
        emissiveIntensity={0.6}
        transparent={true}
        opacity={0.7}
      />
    </mesh>
  );
}

// 3. Camera travel path synchronized strictly to browser scroll
function CameraTrack({ scrollPercent }: { scrollPercent: number }) {
  useFrame(({ camera }) => {
    const targetZ = 5 - (scrollPercent * 60);
    const targetY = -(scrollPercent * 8);
    const targetX = Math.sin(scrollPercent * Math.PI * 2) * 1.5;

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.08);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.08);
  });
  return null;
}

export default function CosmosScene({
  isMobile,
  scrollPercent,
  nodes,
  theme = 'neon-pink'
}: {
  isMobile: boolean;
  scrollPercent: number;
  nodes: PropType[];
  theme?: string;
}) {
  const lightColors = useMemo(() => {
    if (theme === 'cyber-cyan') return { p1: '#00f0ff', p2: '#3b82f6' };
    if (theme === 'matrix-emerald') return { p1: '#00e676', p2: '#10b981' };
    if (theme === 'sunset-gold') return { p1: '#f59e0b', p2: '#f97316' };
    if (theme === 'hyper-violet') return { p1: '#a855f7', p2: '#ec4899' };
    if (theme === 'crimson-red') return { p1: '#ff003c', p2: '#e11d48' };
    if (theme === 'toxic-lime') return { p1: '#ccff00', p2: '#84cc16' };
    if (theme === 'ice-arctic') return { p1: '#38bdf8', p2: '#818cf8' };
    return { p1: '#ff007f', p2: '#8b5cf6' };
  }, [theme]);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color={lightColors.p1} />
      <pointLight position={[-10, -10, -10]} intensity={1.2} color={lightColors.p2} />

      <Suspense fallback={null}>
        <StarField isMobile={isMobile} scrollPercent={scrollPercent} theme={theme} />
        {nodes.map((node, idx) => (
          <FloatingNode key={idx} {...node} />
        ))}
      </Suspense>

      <CameraTrack scrollPercent={scrollPercent} />
    </Canvas>
  );
}
