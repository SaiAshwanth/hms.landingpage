import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroHeart3DProps {
  scrollProgress?: number;
}

export const HeroHeart3D: React.FC<HeroHeart3DProps> = ({ scrollProgress = 0 }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 8.2);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const heartPointLight = new THREE.PointLight(0xFF2E63, 4.5, 18);
    heartPointLight.position.set(0, 0.4, 3);
    scene.add(heartPointLight);

    const cyanLight = new THREE.DirectionalLight(0x02C39A, 2.5);
    cyanLight.position.set(-8, 10, 8);
    scene.add(cyanLight);

    const amberLight = new THREE.DirectionalLight(0xF59E0B, 1.8);
    amberLight.position.set(8, -5, 6);
    scene.add(amberLight);

    // 5. Main Heart Group
    const heartGroup = new THREE.Group();

    // --- A. GPU Chroma-Key ShaderMaterial to Erase Image Background Box ---
    const textureLoader = new THREE.TextureLoader();
    const heartTexture = textureLoader.load('/assets/realistic_heart_cross_section.jpg');
    heartTexture.colorSpace = THREE.SRGBColorSpace;

    const heartShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: heartTexture },
        uEmissiveIntensity: { value: 0.2 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uEmissiveIntensity;
        varying vec2 vUv;

        void main() {
          vec4 tex = texture2D(uTexture, vUv);

          // Calculate brightness and color saturation
          float avg = (tex.r + tex.g + tex.b) / 3.0;
          float maxDiff = max(max(abs(tex.r - tex.g), abs(tex.g - tex.b)), abs(tex.r - tex.b));

          // Key out background pixels where color is light grey/off-white (background box)
          float alpha = 1.0;
          if (avg > 0.65 && maxDiff < 0.16) {
            alpha = smoothstep(0.85, 0.65, avg);
          }

          // Elliptical edge cutoff to eliminate outer image border
          vec2 centerDist = vUv - vec2(0.5);
          float dist = length(centerDist);
          if (dist > 0.42) {
            alpha *= smoothstep(0.49, 0.40, dist);
          }

          // Discard fully transparent pixels so no background box is drawn
          if (alpha <= 0.02) discard;

          // Cardiac pulse glow overlay
          vec3 pulseGlow = vec3(0.9, 0.15, 0.25) * uEmissiveIntensity * smoothstep(0.45, 0.0, dist);

          gl_FragColor = vec4(tex.rgb + pulseGlow, tex.a * alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const heartGeo = new THREE.PlaneGeometry(4.8, 4.8, 32, 32);
    const realisticHeartMesh = new THREE.Mesh(heartGeo, heartShaderMaterial);
    realisticHeartMesh.position.set(0, 0.1, 0);
    heartGroup.add(realisticHeartMesh);

    // --- B. Cardiac Vascular Flow Particles ---
    const particleCount = 160;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorCrimson = new THREE.Color(0xE11D48);
    const colorCyan = new THREE.Color(0x0284C7);
    const colorTeal = new THREE.Color(0x0D9488);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * 14;
      particlePositions[idx + 1] = (Math.random() - 0.5) * 9 + 0.2;
      particlePositions[idx + 2] = (Math.random() - 0.5) * 10;

      const mixVal = Math.random();
      const c = mixVal < 0.5 ? colorCrimson : mixVal < 0.85 ? colorCyan : colorTeal;
      particleColors[idx] = c.r;
      particleColors[idx + 1] = c.g;
      particleColors[idx + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const vascularParticles = new THREE.Points(particleGeo, particleMat);
    heartGroup.add(vascularParticles);

    // --- C. Glowing Orbiting Halo Pulse Ring ---
    const ringGeo = new THREE.TorusGeometry(3.1, 0.018, 16, 120);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x0D9488,
      emissive: 0x0D9488,
      emissiveIntensity: 1.1,
      transparent: true,
      opacity: 0.75,
    });
    const haloRing = new THREE.Mesh(ringGeo, ringMat);
    haloRing.rotation.x = Math.PI / 3;
    haloRing.position.set(0, 0.1, -0.2);
    heartGroup.add(haloRing);

    // Position overall heart group on the right side matching reference image
    const isDesktop = window.innerWidth >= 1024;
    heartGroup.position.set(isDesktop ? 1.8 : 0, 0.1, -0.6);
    scene.add(heartGroup);

    // --- D. Mouse & Window Resize Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = x * 0.9;
      mouseRef.current.targetY = y * 0.6;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // --- E. Realistic Cardiac Heartbeat Double-Pulse Loop (Lub-Dub) ---
    let animFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Realistic Lub-Dub Heartbeat Rhythm
      const cycle = (elapsedTime * 1.12) % 1.0;
      let pulseScale = 1.0;
      let emissivePulse = 0.2;

      if (cycle < 0.12) {
        // Systole 1 (Lub - Atrial Contraction)
        const progress = cycle / 0.12;
        pulseScale = 1.0 + Math.sin(progress * Math.PI) * 0.11;
        emissivePulse = 0.2 + Math.sin(progress * Math.PI) * 0.55;
      } else if (cycle > 0.16 && cycle < 0.32) {
        // Systole 2 (Dub - Ventricular Ejection)
        const progress = (cycle - 0.16) / 0.16;
        pulseScale = 1.0 + Math.sin(progress * Math.PI) * 0.18;
        emissivePulse = 0.2 + Math.sin(progress * Math.PI) * 0.85;
      } else {
        // Diastole (Relaxation Phase)
        pulseScale = 1.0 + Math.sin((cycle - 0.32) * Math.PI) * 0.02;
      }

      // Apply cardiac heartbeat contraction scale
      realisticHeartMesh.scale.set(pulseScale, pulseScale * 1.02, 1.0);

      // Pulse shader emissive glow with heartbeat rhythm
      heartShaderMaterial.uniforms.uEmissiveIntensity.value = emissivePulse;
      heartPointLight.intensity = 3.5 + emissivePulse * 3.5;

      // Gentle floating animation & mouse depth parallax
      heartGroup.rotation.y = Math.sin(elapsedTime * 0.25) * 0.06 + mouseRef.current.x * 0.2;
      heartGroup.rotation.x = Math.sin(elapsedTime * 0.35) * 0.03 - mouseRef.current.y * 0.15;
      heartGroup.rotation.z = Math.cos(elapsedTime * 0.2) * 0.02;

      haloRing.rotation.z += 0.005;
      vascularParticles.rotation.y += 0.0012;

      // Update camera depth with scroll progress
      const scrollDepth = scrollProgress * 3.0;
      camera.position.z = 8.2 - scrollDepth;
      camera.position.x = mouseRef.current.x * 0.9;
      camera.position.y = 0.2 + mouseRef.current.y * 0.45;
      camera.lookAt(0, 0.1, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      heartGeo.dispose();
      heartShaderMaterial.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      heartTexture.dispose();
      renderer.dispose();
    };
  }, [scrollProgress]);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-95" />;
};
