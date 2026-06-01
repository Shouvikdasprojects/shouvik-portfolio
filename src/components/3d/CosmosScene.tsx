'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Text } from '@react-three/drei';
import * as THREE from 'three';

// 1. High density, GPU accelerated Particle Starfield (scroll-linked and highly bright!)
function StarField({ isMobile, scrollPercent }: { isMobile: boolean; scrollPercent: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate stars distributed across a large depth volume (fewer on mobile)
  const [positions, colors] = useMemo(() => {
    const count = isMobile ? 1200 : 3500; // Increased star density for a richer feel!
    const posArray = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color('#8b5cf6'), // Violet
      new THREE.Color('#0ea5e9'), // Electric Blue
      new THREE.Color('#ec4899'), // Pink
      new THREE.Color('#ffffff'), // White
    ];

    for (let i = 0; i < count; i++) {
      // Wide dispersion
      posArray[i * 3] = (Math.random() - 0.5) * 90;     // X
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 90; // Y
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 160 - 50; // Z depth spanning -210 to 30

      // Color variation
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
    }

    return [posArray, colorArray];
  }, [isMobile]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    // Ambient slow rotation + scroll-depth responsive spin!
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
        size={isMobile ? 0.16 : 0.22} // Slightly larger, glow-like particle sizes
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending} // Brilliant additive blend glow!
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
    
    // Smooth rotational speed
    meshRef.current.rotation.x += offsets.rotX;
    meshRef.current.rotation.y += offsets.rotY;

    // Slight floating float drift
    meshRef.current.position.y = position[1] + Math.sin(time + offsets.y) * 0.4;
    meshRef.current.position.x = position[0] + Math.cos(time + offsets.x) * 0.2;
  });

  return (
    <mesh ref={meshRef} position={position}>
      {type === 'torus' && <torusGeometry args={[1.0, 0.3, 16, 32]} />}
      {type === 'octahedron' && <octahedronGeometry args={[1.1, 0]} />}
      {type === 'icosahedron' && <icosahedronGeometry args={[1.2, 0]} />}
      {type === 'dodecahedron' && <dodecahedronGeometry args={[1.0, 0]} />}
      
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.25} // Brilliant glowing shape surfaces!
        roughness={0.1}
        metalness={0.95}
        transmission={0.4}
        thickness={1.5}
        clearcoat={1.0}
        clearcoatRoughness={0.05}
      />
    </mesh>
  );
}

// 3. Volumetric 3D Text Overlay floating inside the 3D grid
function HeroVolumeText({ isMobile }: { isMobile: boolean }) {
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!textRef.current) return;
    // Interactive mouse rotation
    const targetX = state.mouse.y * 0.3;
    const targetY = state.mouse.x * 0.3;
    textRef.current.rotation.x = THREE.MathUtils.lerp(textRef.current.rotation.x, targetX, 0.05);
    textRef.current.rotation.y = THREE.MathUtils.lerp(textRef.current.rotation.y, targetY, 0.05);
  });

  // Layer configuration for extruded 3D effect (single layer on mobile for high speed performance)
  const layers = isMobile ? [0] : [0, 0.05, 0.1, 0.15];

  return (
    <group ref={textRef} position={[0, 0.8, -8]}>
      <Center>
        {layers.map((zOffset, index) => {
          const isFront = index === layers.length - 1;
          return (
            <group key={index} position={[0, 0, zOffset]}>
              <Text
                font="https://fonts.gstatic.com/s/outfit/v11/QGYsz_o60UM_ZC9dZG4.woff2"
                fontSize={1.6}
                textAlign="center"
                lineHeight={1.1}
                letterSpacing={0.06}
              >
                {`SHOUVIK\nDAS`}
                
                {isFront ? (
                  <meshPhysicalMaterial
                    color="#ffffff"
                    roughness={0.05}
                    metalness={0.9}
                    clearcoat={1.0}
                    emissive="#8b5cf6"
                    emissiveIntensity={0.2}
                  />
                ) : (
                  <meshStandardMaterial
                    color={index % 2 === 0 ? '#6366f1' : '#06b6d4'}
                    roughness={0.3}
                    metalness={0.7}
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

// 4. Scroll and Cursor controller linking camera parameters
function CameraController({ scrollPercent }: { scrollPercent: number }) {
  useFrame((state) => {
    // A. Smoothly travel deep into the Z axis as you scroll!
    // Start at Z=8 (top), travel past shapes down to Z=-55 (bottom)
    const targetZ = 8 - (scrollPercent * 63);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.06);

    // B. Reactive camera look-around (look left/right/up/down reacting to cursor coordinates)
    const targetX = state.mouse.x * 2.8;
    const targetY = state.mouse.y * 2.8;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    
    // Lock look-at target slightly in front of the camera path
    state.camera.lookAt(new THREE.Vector3(0, 0, targetZ - 10));
  });

  return null;
}

interface CosmosSceneProps {
  isMobile: boolean;
  scrollPercent: number;
  nodes: PropType[];
}

export default function CosmosScene({ isMobile, scrollPercent, nodes }: CosmosSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      dpr={isMobile ? 1 : [1, 2]}
      gl={{ antialias: !isMobile, alpha: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={['#040209']} />
      
      {/* Colorful cinematic lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#8b5cf6" /> {/* Purple */}
      <directionalLight position={[-10, 10, 10]} intensity={1.2} color="#0ea5e9" /> {/* Cyan */}
      <directionalLight position={[0, -10, 5]} intensity={0.8} color="#ec4899" />  {/* Pink */}

      <Suspense fallback={null}>
        {/* Particles Starfield spanning depth (optimized for mobile) */}
        <StarField isMobile={isMobile} scrollPercent={scrollPercent} />
        
        {/* Volumetric Brand Text positioned relative to Hero depth (optimized for mobile) */}
        <HeroVolumeText isMobile={isMobile} />
        
        {/* Floating nodes arranged sequentially */}
        {nodes.map((node, idx) => (
          <FloatingNode key={idx} {...node} />
        ))}
      </Suspense>

      {/* Scroll-driven Camera Controller */}
      <CameraController scrollPercent={scrollPercent} />
    </Canvas>
  );
}
