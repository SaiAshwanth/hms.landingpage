import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Hero3DAtriumProps {
  scrollProgress?: number;
}

export const Hero3DAtrium: React.FC<Hero3DAtriumProps> = ({ scrollProgress = 0 }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xFAFBF8, 0.025);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x7DB99A, 2.2);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const pointLight = new THREE.PointLight(0x79CFCB, 3.5, 30);
    pointLight.position.set(0, 3, 2);
    scene.add(pointLight);

    // Central 3D Atrium Architecture Group
    const atriumGroup = new THREE.Group();

    // 1. Perspective Floor Architectural Grid
    const gridGeometry = new THREE.PlaneGeometry(40, 40, 50, 50);
    const gridMaterial = new THREE.MeshStandardMaterial({
      color: 0x1B201D,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
    });
    const floorGrid = new THREE.Mesh(gridGeometry, gridMaterial);
    floorGrid.rotation.x = -Math.PI / 2;
    floorGrid.position.y = -2.8;
    atriumGroup.add(floorGrid);

    // 2. Glass Architectural Beams / Pillars
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFAFBF8,
      transmission: 0.9,
      opacity: 0.95,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
      thickness: 0.8,
      metalness: 0.1,
      clearcoat: 0.6,
    });

    const pillarGeometry = new THREE.BoxGeometry(0.35, 9, 0.35);
    const pillarPositions = [
      [-5, 1.5, -2],
      [5, 1.5, -2],
      [-7, 1.5, -6],
      [7, 1.5, -6],
      [-3, 1.5, -10],
      [3, 1.5, -10],
    ];

    pillarPositions.forEach(([x, y, z]) => {
      const pillar = new THREE.Mesh(pillarGeometry, glassMaterial);
      pillar.position.set(x, y, z);
      atriumGroup.add(pillar);
    });

    // 3. Central Concentric 3D Medical Energy Rings
    const ringGroup = new THREE.Group();

    const ringGeo1 = new THREE.TorusGeometry(3.2, 0.035, 16, 120);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x7DB99A,
      emissive: 0x7DB99A,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.8,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3.2;

    const ringGeo2 = new THREE.TorusGeometry(2.4, 0.025, 16, 120);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x79CFCB,
      emissive: 0x79CFCB,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;

    const coreNodeGeo = new THREE.IcosahedronGeometry(0.6, 2);
    const coreNodeMat = new THREE.MeshStandardMaterial({
      color: 0x79CFCB,
      emissive: 0x79CFCB,
      emissiveIntensity: 1.2,
      wireframe: true,
    });
    const coreNode = new THREE.Mesh(coreNodeGeo, coreNodeMat);

    ringGroup.add(ring1);
    ringGroup.add(ring2);
    ringGroup.add(coreNode);
    ringGroup.position.set(0, 1.2, -3);
    atriumGroup.add(ringGroup);

    // 4. Ambient Floating Data Particles
    const particleCount = 160;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 20;
      particlePositions[i + 1] = (Math.random() - 0.5) * 10 + 1;
      particlePositions[i + 2] = (Math.random() - 0.5) * 20;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x7DB99A,
      size: 0.09,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    atriumGroup.add(particles);

    scene.add(atriumGroup);

    // Mouse Movement Handler for Interactive 3D Camera Tilt
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = x * 1.2;
      mouseRef.current.targetY = y * 0.8;
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

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse camera lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      // Rotate 3D rings and central medical core
      ring1.rotation.z += 0.004;
      ring2.rotation.x += 0.003;
      coreNode.rotation.y += 0.008;

      particles.rotation.y += 0.001;

      // Update camera position with mouse depth and scroll progress
      const scrollDepth = scrollProgress * 6;
      camera.position.z = 11 - scrollDepth;
      camera.position.x = mouseRef.current.x * 1.5;
      camera.position.y = 1.5 + mouseRef.current.y * 0.8;
      camera.lookAt(0, 0.8, -3);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      gridGeometry.dispose();
      gridMaterial.dispose();
      pillarGeometry.dispose();
      glassMaterial.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      coreNodeGeo.dispose();
      coreNodeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [scrollProgress]);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-95" />;
};
