'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Center } from '@react-three/drei';
import * as THREE from 'three';

export default function InteractiveText() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;

    // React rotation based on hover and mouse position
    const targetRotX = hovered ? state.mouse.y * 0.4 : state.mouse.y * 0.15;
    const targetRotY = hovered ? state.mouse.x * 0.4 : state.mouse.x * 0.15;

    // Smooth interpolation
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);

    // Floating drift
    groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.15;
  });

  // Layer configuration to build volumetric Z-extrusion manually
  // This achieves a beautiful 3D block text effect without requiring local JSON font assets!
  const layers = [0, 0.05, 0.1, 0.15, 0.2];

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Center>
        {/* Layered Volumetric Extrusion */}
        {layers.map((zOffset, index) => {
          const isFront = index === layers.length - 1;
          return (
            <group key={index} position={[0, 0, zOffset]}>
              <Text
                font="https://fonts.gstatic.com/s/outfit/v11/QGYsz_o60UM_ZC9dZG4.woff2" // Outfit Bold font
                fontSize={1.5}
                maxWidth={8}
                textAlign="center"
                lineHeight={1.1}
                letterSpacing={0.05}
              >
                {`SHOUVIK\nDAS`}
                
                {isFront ? (
                  // Front Face: Glossy glowing glass/metal
                  <meshPhysicalMaterial
                    color="#ffffff"
                    roughness={0.1}
                    metalness={0.9}
                    clearcoat={1.0}
                    clearcoatRoughness={0.1}
                    emissive="#8b5cf6"
                    emissiveIntensity={0.15}
                  />
                ) : (
                  // Extrusion Layers: Deep violet to cyan transition gradient
                  <meshStandardMaterial
                    color={index % 2 === 0 ? '#6366f1' : '#06b6d4'}
                    roughness={0.4}
                    metalness={0.6}
                  />
                )}
              </Text>
            </group>
          );
        })}
      </Center>
    </group>
  );
}
