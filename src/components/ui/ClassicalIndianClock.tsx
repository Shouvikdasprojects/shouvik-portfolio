'use client';

import { Suspense, useEffect, useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// 1. Clock Face and Decorative Ornate elements
function ClockFace() {
  // Embossed traditional temple beads (36 golden beads on the outer ring)
  const beads = useMemo(() => {
    const list = [];
    for (let i = 0; i < 36; i++) {
      const angle = (i * Math.PI) / 18;
      const x = Math.sin(angle) * 2.22;
      const y = Math.cos(angle) * 2.22;
      list.push({ x, y });
    }
    return list;
  }, []);

  // Stylized embossed golden lotus filigree (8 petals inside)
  const lotusPetals = useMemo(() => {
    const list = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      list.push(angle);
    }
    return list;
  }, []);

  // Stylized gold Devanagari numerals mapping (12 to 11)
  const numerals = ['१२', '१', '२', '३', '४', '५', '६', '७', '८', '९', '१०', '११'];

  return (
    <group>
      {/* A. Outer Copper Ring with Verdigris Patina */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[2.3, 0.08, 16, 100]} />
        <meshStandardMaterial 
          color="#b87333" // Copper
          metalness={0.95} 
          roughness={0.35} 
        />
      </mesh>

      {/* B. Outer Embossed Gold Ring border */}
      <mesh position={[0, 0, 0.02]}>
        <torusGeometry args={[2.14, 0.03, 8, 100]} />
        <meshStandardMaterial 
          color="#ffd700" // Gold
          metalness={0.9} 
          roughness={0.15} 
        />
      </mesh>

      {/* C. Embossed Traditional Temple Pattern Beads */}
      {beads.map((bead, idx) => (
        <mesh key={idx} position={[bead.x, bead.y, 0.04]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial 
            color="#ffd700" 
            metalness={0.9} 
            roughness={0.1} 
          />
        </mesh>
      ))}

      {/* D. Main Clock Face - Deep Indigo Enamel Glossy base */}
      <mesh position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.1, 2.1, 0.06, 64]} />
        <meshPhysicalMaterial 
          color="#0a122c" // Deep Indigo
          roughness={0.08} 
          metalness={0.8} 
          clearcoat={1.0} 
          clearcoatRoughness={0.05} 
        />
      </mesh>

      {/* E. Embossed Gold Devanagari Numerals */}
      {numerals.map((num, i) => {
        const angle = (i * Math.PI) / 6;
        const radius = 1.62;
        const x = Math.sin(angle) * radius;
        const y = Math.cos(angle) * radius;
        return (
          <group key={i} position={[x, y, 0.035]}>
            <Text
              fontSize={0.34}
              color="#ffd700"
              anchorX="center"
              anchorY="middle"
              // Fallback to Poppins or Rozha One woff2 which handles Devanagari font rendering
              font="https://fonts.gstatic.com/s/rozhaone/v18/nFlPaO970HBUx349-N2QQkQ.woff2"
            >
              {num}
              <meshStandardMaterial 
                color="#fcc200" 
                metalness={0.95} 
                roughness={0.15} 
              />
            </Text>
          </group>
        );
      })}

      {/* F. Inner Gold Lotus Flower Filigree */}
      {lotusPetals.map((angle, idx) => (
        <group key={idx} rotation={[0, 0, angle]}>
          <mesh position={[0, 0.42, 0.02]} rotation={[0.25, 0, 0]}>
            <coneGeometry args={[0.09, 0.42, 4]} />
            <meshStandardMaterial 
              color="#ffd700" 
              metalness={0.9} 
              roughness={0.2} 
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 2. Real-time Ticking Hands Pegged to IST (Asia/Kolkata)
function ClockHands() {
  const hourHandRef = useRef<THREE.Group>(null);
  const minuteHandRef = useRef<THREE.Group>(null);
  const secondHandRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const date = new Date();
    
    // Parse time strictly in Indian Standard Time (IST)
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(date);

    const hours = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
    const minutes = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
    const seconds = parseInt(parts.find((p) => p.type === 'second')?.value || '0', 10);

    const secRad = (seconds * Math.PI) / 30;
    const minRad = (minutes * Math.PI) / 30 + secRad / 60;
    const hrRad = ((hours % 12) * Math.PI) / 6 + minRad / 12;

    if (secondHandRef.current) secondHandRef.current.rotation.z = -secRad;
    if (minuteHandRef.current) minuteHandRef.current.rotation.z = -minRad;
    if (hourHandRef.current) hourHandRef.current.rotation.z = -hrRad;
  });

  return (
    <group>
      {/* A. Hour Hand - Stylized Brass Temple Lamp Wick (Flame shape) */}
      <group ref={hourHandRef}>
        <mesh position={[0, 0.48, 0.08]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.1, 0.95, 4]} />
          <meshStandardMaterial 
            color="#ffd700" 
            metalness={0.9} 
            roughness={0.1} 
          />
        </mesh>
        {/* Ornate tail */}
        <mesh position={[0, -0.15, 0.08]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} />
        </mesh>
      </group>

      {/* B. Minute Hand - Longer, Thinner Flame Wick */}
      <group ref={minuteHandRef}>
        <mesh position={[0, 0.68, 0.12]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.075, 1.35, 4]} />
          <meshStandardMaterial 
            color="#ffd700" 
            metalness={0.9} 
            roughness={0.1} 
          />
        </mesh>
        {/* Ornate tail */}
        <mesh position={[0, -0.22, 0.12]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} />
        </mesh>
      </group>

      {/* C. Second Hand - Elegant Slim Red Brass Needle */}
      <group ref={secondHandRef}>
        <mesh position={[0, 0.78, 0.16]}>
          <coneGeometry args={[0.02, 1.55, 4]} />
          <meshStandardMaterial 
            color="#ff007f" // Glowing brand neon pink/red
            metalness={0.8} 
            roughness={0.2} 
          />
        </mesh>
      </group>

      {/* D. Central Hub - Gold Cap set with Faceted Rubies & Emeralds */}
      <mesh position={[0, 0, 0.18]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#ffd700" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Centerpiece Faceted Ruby (Glowing Red Dodecahedron) */}
      <mesh position={[0, 0, 0.26]}>
        <dodecahedronGeometry args={[0.05, 0]} />
        <meshStandardMaterial 
          color="#ff004f" 
          roughness={0.05} 
          metalness={0.9} 
          emissive="#ff004f" 
          emissiveIntensity={0.6} 
        />
      </mesh>

      {/* Cardinal Direction Faceted Emeralds (Glowing Green Octahedrons) */}
      {[[0.14, 0], [-0.14, 0], [0, 0.14], [0, -0.14]].map((coord, idx) => (
        <mesh key={idx} position={[coord[0], coord[1], 0.22]}>
          <octahedronGeometry args={[0.032, 0]} />
          <meshStandardMaterial 
            color="#10b981" 
            roughness={0.05} 
            metalness={0.9} 
            emissive="#10b981" 
            emissiveIntensity={0.6} 
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ClassicalIndianClock() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full min-h-[340px] sm:min-h-[480px] md:min-h-[600px] flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 58 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        {/* Ornate and highly visible lighting */}
        <ambientLight intensity={1.6} />
        
        {/* Strong Headlight (Directly from Camera view) to force visibility of dark indigo and copper */}
        <directionalLight position={[0, 0, 5]} intensity={2.5} color="#ffffff" />
        
        {/* Warm Golden Key Light */}
        <directionalLight position={[5, 5, 4]} intensity={3.5} color="#ffdf7a" />
        
        {/* Cool Enamel Blue Fill Light */}
        <directionalLight position={[-5, 5, 2]} intensity={1.8} color="#8cb6ff" />
        
        {/* Ruby Emissive Backlight */}
        <pointLight position={[0, 0, 0.5]} intensity={1.2} color="#ff0055" />

        <Suspense fallback={
          <Html center>
            <div className="text-[#ff007f] font-mono text-[10px] uppercase font-bold tracking-widest whitespace-nowrap bg-black/60 px-3 py-1.5 rounded-full border border-[#ff007f]/30 animate-pulse">
              Loading Classical Clock...
            </div>
          </Html>
        }>
          <ClockFace />
          <ClockHands />
        </Suspense>
      </Canvas>
    </div>
  );
}
