'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShapeProps {
  position: [number, number, number];
  args: any;
  type: 'torus' | 'octahedron' | 'icosahedron' | 'box';
  color: string;
  speed: number;
}

function FloatingShape({ position, args, type, color, speed }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create unique initial offsets for varied movement
  const offsets = useMemo(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 100,
    rotX: Math.random() * 0.02,
    rotY: Math.random() * 0.02,
    rotZ: Math.random() * 0.02,
  }), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime() * speed;
    
    // Slow rotational drift
    meshRef.current.rotation.x += offsets.rotX;
    meshRef.current.rotation.y += offsets.rotY;

    // React to the mouse coordinates smoothly (state.mouse ranges from -1 to +1)
    const targetX = position[0] + (state.mouse.x * 2.5);
    const targetY = position[1] + (state.mouse.y * 2.5);
    const targetZ = position[2] + Math.sin(time + offsets.z) * 0.5;

    // Interpolate (lerp) for ultra-smooth movement
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.05);
  });

  return (
    <mesh ref={meshRef} position={position}>
      {type === 'torus' && <torusGeometry args={args} />}
      {type === 'octahedron' && <octahedronGeometry args={args} />}
      {type === 'icosahedron' && <icosahedronGeometry args={args} />}
      {type === 'box' && <boxGeometry args={args} />}
      
      {/* High-quality metallic glassmorphic material */}
      <meshPhysicalMaterial
        color={color}
        roughness={0.15}
        metalness={0.8}
        transmission={0.6} // glass-like transparency
        thickness={1.2}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

export default function FloatingElements() {
  // Specifying precise positions and styling parameters
  const items = useMemo<ShapeProps[]>(() => [
    {
      position: [-5, 3, -4],
      args: [0.7, 0.25, 16, 32],
      type: 'torus',
      color: '#8b5cf6', // Violet
      speed: 0.5,
    },
    {
      position: [6, -2, -3],
      args: [0.8, 0],
      type: 'octahedron',
      color: '#0ea5e9', // Electric Blue
      speed: 0.7,
    },
    {
      position: [-4, -3, -5],
      args: [0.75, 0],
      type: 'icosahedron',
      color: '#ec4899', // Pink
      speed: 0.6,
    },
    {
      position: [4, 4, -4],
      args: [0.8, 0.8, 0.8],
      type: 'box',
      color: '#a855f7', // Purple Accent
      speed: 0.4,
    },
    {
      position: [0, -4, -6],
      args: [0.9, 0.3, 12, 24],
      type: 'torus',
      color: '#06b6d4', // Cyan
      speed: 0.8,
    }
  ], []);

  return (
    <group>
      {items.map((item, idx) => (
        <FloatingShape key={idx} {...item} />
      ))}
    </group>
  );
}
