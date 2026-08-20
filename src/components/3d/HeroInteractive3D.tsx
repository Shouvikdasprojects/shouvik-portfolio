'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, RotateCw, Eye } from 'lucide-react';
import { sfx } from '@/lib/soundEffects';

export default function HeroInteractive3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wireframeOnly, setWireframeOnly] = useState(false);
  const [theme, setTheme] = useState('neon-pink');
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0.005, y: 0.008 });

  useEffect(() => {
    const saved = localStorage.getItem('shouvik_cyber_theme') || 'neon-pink';
    setTheme(saved);

    const handleThemeChanged = (e: CustomEvent<string>) => {
      if (e.detail) {
        setTheme(e.detail);
      }
    };

    window.addEventListener('theme-changed', handleThemeChanged as EventListener);
    return () => window.removeEventListener('theme-changed', handleThemeChanged as EventListener);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 280;
    const height = container.clientHeight || 280;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for object + wireframe
    const group = new THREE.Group();
    scene.add(group);

    // Core Icosahedron Geometry
    const geometry = new THREE.IcosahedronGeometry(1.6, 1);

    // Theme color mappings
    let meshColor = 0x8b5cf6;
    let emissiveColor = 0xff007f;
    let wireColor = 0x00f0ff;
    let light1Color = 0xff007f;
    let light2Color = 0x00f0ff;

    if (theme === 'cyber-cyan') {
      meshColor = 0x0070f3;
      emissiveColor = 0x00f0ff;
      wireColor = 0xa855f7;
      light1Color = 0x00f0ff;
      light2Color = 0x3b82f6;
    } else if (theme === 'matrix-emerald') {
      meshColor = 0x10b981;
      emissiveColor = 0x00e676;
      wireColor = 0x00ff88;
      light1Color = 0x00e676;
      light2Color = 0x059669;
    } else if (theme === 'sunset-gold') {
      meshColor = 0xf97316;
      emissiveColor = 0xf59e0b;
      wireColor = 0xff6b00;
      light1Color = 0xf59e0b;
      light2Color = 0xe11d48;
    } else if (theme === 'hyper-violet') {
      meshColor = 0x6366f1;
      emissiveColor = 0xa855f7;
      wireColor = 0xec4899;
      light1Color = 0xa855f7;
      light2Color = 0xec4899;
    } else if (theme === 'crimson-red') {
      meshColor = 0x9f1239;
      emissiveColor = 0xff003c;
      wireColor = 0xf43f5e;
      light1Color = 0xff003c;
      light2Color = 0xe11d48;
    } else if (theme === 'toxic-lime') {
      meshColor = 0x65a30d;
      emissiveColor = 0xccff00;
      wireColor = 0xa3e635;
      light1Color = 0xccff00;
      light2Color = 0x84cc16;
    } else if (theme === 'ice-arctic') {
      meshColor = 0x0284c7;
      emissiveColor = 0x38bdf8;
      wireColor = 0xc084fc;
      light1Color = 0x38bdf8;
      light2Color = 0x818cf8;
    }

    // Outer Glass/Iridescent Mesh
    const material = new THREE.MeshPhysicalMaterial({
      color: meshColor,
      emissive: emissiveColor,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: wireframeOnly,
      transparent: true,
      opacity: 0.85,
    });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    // Wireframe Glow Overlay
    const wireframeGeo = new THREE.WireframeGeometry(geometry);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: wireColor,
      transparent: true,
      opacity: 0.7,
    });
    const wireframeLine = new THREE.LineSegments(wireframeGeo, wireframeMat);
    group.add(wireframeLine);

    // Inner Glowing Core
    const coreGeo = new THREE.OctahedronGeometry(0.7, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: emissiveColor,
      wireframe: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(light1Color, 3.5, 20);
    pointLight1.position.set(4, 4, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(light2Color, 3.5, 20);
    pointLight2.position.set(-4, -4, 4);
    scene.add(pointLight2);

    // Pointer events for drag-to-spin
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;
      rotationVelocityRef.current = { x: deltaY * 0.005, y: deltaX * 0.005 };
      group.rotation.x += deltaY * 0.008;
      group.rotation.y += deltaX * 0.008;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch events for mobile drag
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseRef.current.x;
      const deltaY = e.touches[0].clientY - prevMouseRef.current.y;
      rotationVelocityRef.current = { x: deltaY * 0.005, y: deltaX * 0.005 };
      group.rotation.x += deltaY * 0.008;
      group.rotation.y += deltaX * 0.008;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onMouseUp);

    // Render loop with inertia
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDraggingRef.current) {
        group.rotation.x += rotationVelocityRef.current.x;
        group.rotation.y += rotationVelocityRef.current.y;
        coreMesh.rotation.y -= 0.02;
        coreMesh.rotation.z += 0.01;

        // Smooth damping
        rotationVelocityRef.current.x = THREE.MathUtils.lerp(rotationVelocityRef.current.x, 0.004, 0.05);
        rotationVelocityRef.current.y = THREE.MathUtils.lerp(rotationVelocityRef.current.y, 0.007, 0.05);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [wireframeOnly, theme]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 rounded-3xl bg-[#090518]/60 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_var(--primary-glow)] group">
      {/* Top Tag */}
      <div className="absolute top-3 left-4 flex items-center gap-1.5 text-[9px] font-mono font-bold text-primary">
        <Sparkles size={10} />
        <span>INTERACTIVE 3D WEBGL</span>
      </div>

      <div className="absolute top-3 right-4 flex items-center gap-1">
        <button
          onClick={() => {
            sfx.playClick();
            setWireframeOnly(!wireframeOnly);
          }}
          className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 cursor-pointer"
          title="Toggle Wireframe Shader"
        >
          {wireframeOnly ? 'Solid Mode' : 'Wireframe'}
        </button>
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-[240px] h-[240px] cursor-grab active:cursor-grabbing select-none touch-none"
        title="Click & Drag to Rotate 3D Model"
      />

      {/* Bottom Hint */}
      <div className="text-[10px] font-mono text-gray-500 flex items-center gap-1.5 mt-1">
        <RotateCw size={11} className="text-primary animate-spin" style={{ animationDuration: '6s' }} />
        <span>Drag to rotate • Real-time WebGL</span>
      </div>
    </div>
  );
}
