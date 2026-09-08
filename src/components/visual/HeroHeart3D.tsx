import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroHeart3DProps {
  scrollProgress?: number;
}

export const HeroHeart3D: React.FC<HeroHeart3DProps> = ({ scrollProgress = 0 }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollProgressRef = useRef(scrollProgress);

  // Keep scrollProgressRef in sync without triggering effect re-runs
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

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

    // --- C2. 3D Orbiting Anatomical Organs System (Eyes, Lungs, Kidney, Brain, Liver, Nervous System) ---
    // Refined, sleek medical badge texture generator
    function createOrganBadgeTexture(label: string, colorHex: string): THREE.CanvasTexture {
      const canvas = document.createElement('canvas');
      canvas.width = 384;
      canvas.height = 76;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 384, 76);

        // Glassmorphic dark slate pill container
        ctx.fillStyle = 'rgba(11, 19, 36, 0.88)';
        ctx.beginPath();
        ctx.roundRect(8, 8, 368, 60, 30);
        ctx.fill();

        // Subtle gradient highlight
        const grad = ctx.createLinearGradient(0, 8, 0, 68);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
        ctx.fillStyle = grad;
        ctx.fill();

        // Colored luminous perimeter border
        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = colorHex;
        ctx.shadowBlur = 9;
        ctx.stroke();

        // Glowing indicator pulse dot
        ctx.shadowBlur = 12;
        ctx.fillStyle = colorHex;
        ctx.beginPath();
        ctx.arc(38, 38, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Label text in crisp monospace
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px "JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, 58, 39);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    interface OrbitingOrganDef {
      id: string;
      name: string;
      badgeLabel: string;
      imagePath: string;
      accentColor: number;
      accentHex: string;
      initialAngle: number;
    }

    const ORBITING_ORGANS: OrbitingOrganDef[] = [
      {
        id: 'brain',
        name: 'Human Brain',
        badgeLabel: 'BRAIN',
        imagePath: '/assets/realistic_brain.jpg',
        accentColor: 0x0284C7,
        accentHex: '#0284C7',
        initialAngle: 0,
      },
      {
        id: 'eye',
        name: 'Human Eye',
        badgeLabel: 'EYES',
        imagePath: '/assets/realistic_eye.jpg',
        accentColor: 0x06B6D4,
        accentHex: '#06B6D4',
        initialAngle: (Math.PI * 2) / 6,
      },
      {
        id: 'lungs',
        name: 'Human Lungs',
        badgeLabel: 'LUNGS',
        imagePath: '/assets/realistic_lungs.jpg',
        accentColor: 0x0D9488,
        accentHex: '#0D9488',
        initialAngle: ((Math.PI * 2) / 6) * 2,
      },
      {
        id: 'liver',
        name: 'Human Liver',
        badgeLabel: 'LIVER',
        imagePath: '/assets/realistic_liver.jpg',
        accentColor: 0xF59E0B,
        accentHex: '#F59E0B',
        initialAngle: ((Math.PI * 2) / 6) * 3,
      },
      {
        id: 'kidney',
        name: 'Human Kidney',
        badgeLabel: 'KIDNEY',
        imagePath: '/assets/realistic_kidney.jpg',
        accentColor: 0xE11D48,
        accentHex: '#E11D48',
        initialAngle: ((Math.PI * 2) / 6) * 4,
      },
      {
        id: 'nervous_system',
        name: 'Nervous System',
        badgeLabel: 'NERVOUS SYSTEM',
        imagePath: '/assets/realistic_nervous_system.jpg',
        accentColor: 0x8B5CF6,
        accentHex: '#8B5CF6',
        initialAngle: ((Math.PI * 2) / 6) * 5,
      },
    ];

    // Tilted 3D Orbit System Group attached to heartGroup (shares heart center)
    const orbitSystemGroup = new THREE.Group();
    orbitSystemGroup.name = 'OrbitingAnatomySystem';
    orbitSystemGroup.position.set(0, 0.1, -0.2);
    orbitSystemGroup.rotation.x = Math.PI / 3.2;
    heartGroup.add(orbitSystemGroup);

    // Glowing 3D Elliptical Orbit Track Lines (Primary dashed + soft outer glow)
    const orbitRadiusX = 3.35;
    const orbitRadiusY = 2.65;
    const orbitTrackSegments = 160;
    const orbitTrackPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= orbitTrackSegments; i++) {
      const theta = (i / orbitTrackSegments) * Math.PI * 2;
      orbitTrackPoints.push(
        new THREE.Vector3(
          Math.cos(theta) * orbitRadiusX,
          Math.sin(theta) * orbitRadiusY,
          Math.sin(theta * 2) * 0.12
        )
      );
    }
    const orbitTrackGeo = new THREE.BufferGeometry().setFromPoints(orbitTrackPoints);

    // Compute line distances for crisp dashed styling
    const lineDistances: number[] = [0];
    for (let i = 1; i < orbitTrackPoints.length; i++) {
      lineDistances.push(lineDistances[i - 1] + orbitTrackPoints[i].distanceTo(orbitTrackPoints[i - 1]));
    }
    orbitTrackGeo.setAttribute('lineDistance', new THREE.Float32BufferAttribute(lineDistances, 1));

    const orbitDashedMat = new THREE.LineDashedMaterial({
      color: 0x0284C7,
      dashSize: 0.18,
      gapSize: 0.12,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const orbitTrackLine = new THREE.Line(orbitTrackGeo, orbitDashedMat);
    orbitSystemGroup.add(orbitTrackLine);

    const orbitGlowMat = new THREE.LineBasicMaterial({
      color: 0x0D9488,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const orbitGlowLine = new THREE.Line(orbitTrackGeo, orbitGlowMat);
    orbitSystemGroup.add(orbitGlowLine);

    // Subtle telemetry guide particles streaming smoothly along orbit track
    const guideCount = 42;
    const guidePositions = new Float32Array(guideCount * 3);
    for (let i = 0; i < guideCount; i++) {
      const theta = (i / guideCount) * Math.PI * 2;
      guidePositions[i * 3] = Math.cos(theta) * orbitRadiusX;
      guidePositions[i * 3 + 1] = Math.sin(theta) * orbitRadiusY;
      guidePositions[i * 3 + 2] = Math.sin(theta * 2) * 0.12;
    }
    const guideGeo = new THREE.BufferGeometry();
    guideGeo.setAttribute('position', new THREE.BufferAttribute(guidePositions, 3));
    const guideMat = new THREE.PointsMaterial({
      color: 0x06B6D4,
      size: 0.055,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const guidePoints = new THREE.Points(guideGeo, guideMat);
    orbitSystemGroup.add(guidePoints);

    // Refined, decreased geometries for sleek proportional balance (~0.84 units)
    const organPlaneGeo = new THREE.PlaneGeometry(0.84, 0.84, 16, 16);
    const auraRingGeo = new THREE.RingGeometry(0.38, 0.46, 32);
    const hitSphereGeo = new THREE.SphereGeometry(0.55, 8, 8);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });

    interface OrganEntry {
      def: OrbitingOrganDef;
      organAnchor: THREE.Group;
      organMesh: THREE.Mesh;
      auraMesh: THREE.Mesh;
      auraMat: THREE.MeshBasicMaterial;
      organMaterial: THREE.ShaderMaterial;
      badgeSprite: THREE.Sprite;
      hitTarget: THREE.Mesh;
      targetScale: number;
      currentScale: number;
      hoverVal: number;
    }

    const organEntries: OrganEntry[] = [];
    const hitTargets: THREE.Mesh[] = [];
    const disposables: { dispose: () => void }[] = [
      orbitTrackGeo,
      orbitDashedMat,
      orbitGlowMat,
      guideGeo,
      guideMat,
      organPlaneGeo,
      auraRingGeo,
      hitSphereGeo,
      hitMat,
    ];

    ORBITING_ORGANS.forEach((organDef) => {
      const organAnchor = new THREE.Group();
      organAnchor.name = `OrganAnchor_${organDef.id}`;
      orbitSystemGroup.add(organAnchor);

      const organTexture = textureLoader.load(organDef.imagePath);
      organTexture.colorSpace = THREE.SRGBColorSpace;
      disposables.push(organTexture);

      const organMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: organTexture },
          uHover: { value: 0.0 },
          uAccentColor: { value: new THREE.Color(organDef.accentColor) },
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
          uniform float uHover;
          uniform vec3 uAccentColor;
          varying vec2 vUv;

          void main() {
            vec4 tex = texture2D(uTexture, vUv);

            // Cleanly key out black background with smooth transition
            float brightness = max(max(tex.r, tex.g), tex.b);
            float alpha = smoothstep(0.04, 0.22, brightness);

            // Smooth circular edge vignette to eliminate square image borders
            vec2 centerDist = vUv - vec2(0.5);
            float dist = length(centerDist);
            if (dist > 0.44) {
              alpha *= smoothstep(0.50, 0.42, dist);
            }

            if (alpha <= 0.02) discard;

            // Outer rim lighting glow, amplified on mouse hover
            float rim = smoothstep(0.22, 0.48, dist);
            vec3 rimGlow = uAccentColor * (0.16 + uHover * 0.55) * rim;

            gl_FragColor = vec4(tex.rgb + rimGlow, tex.a * alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      disposables.push(organMaterial);

      const organMesh = new THREE.Mesh(organPlaneGeo, organMaterial);
      organAnchor.add(organMesh);

      // Glowing aura disc behind organ
      const auraMat = new THREE.MeshBasicMaterial({
        color: organDef.accentColor,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      disposables.push(auraMat);

      const auraMesh = new THREE.Mesh(auraRingGeo, auraMat);
      auraMesh.position.set(0, 0, -0.02);
      organAnchor.add(auraMesh);

      // Anatomical Label Badge Sprite - decreased, elegant proportions
      const badgeTexture = createOrganBadgeTexture(organDef.badgeLabel, organDef.accentHex);
      disposables.push(badgeTexture);

      const badgeSpriteMat = new THREE.SpriteMaterial({
        map: badgeTexture,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
      });
      disposables.push(badgeSpriteMat);

      const badgeSprite = new THREE.Sprite(badgeSpriteMat);
      badgeSprite.scale.set(0.58, 0.13, 1.0);
      badgeSprite.position.set(0, -0.50, 0.04);
      organAnchor.add(badgeSprite);

      // Hit Target for interactive hover
      const hitTarget = new THREE.Mesh(hitSphereGeo, hitMat);
      hitTarget.userData = { organId: organDef.id };
      organAnchor.add(hitTarget);
      hitTargets.push(hitTarget);

      organEntries.push({
        def: organDef,
        organAnchor,
        organMesh,
        auraMesh,
        auraMat,
        organMaterial,
        badgeSprite,
        hitTarget,
        targetScale: 1.0,
        currentScale: 1.0,
        hoverVal: 0.0,
      });
    });

    // Position overall heart group and setup responsive framing
    const updateLayout = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const aspect = w / h;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      // Responsive positioning and scaling
      if (w >= 1024) {
        // Desktop: Positioned on the right matching flagship design
        heartGroup.position.set(1.8, 0.1, -0.6);
        heartGroup.scale.setScalar(1.0);
      } else if (w >= 768) {
        // Tablet: Scaled down and positioned slightly right/center
        heartGroup.position.set(0.6, 0.15, -0.6);
        heartGroup.scale.setScalar(0.78);
      } else {
        // Mobile portrait: Centered and scaled so all 6 orbiting organs and badges fit completely on-screen
        const mobileScale = Math.min(0.55, Math.max(0.40, (aspect / 0.52) * 0.48));
        heartGroup.position.set(0, 0.35, -0.4);
        heartGroup.scale.setScalar(mobileScale);
      }
    };

    updateLayout();
    scene.add(heartGroup);

    // --- D. Mouse & Touch Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = x * 0.9;
      mouseRef.current.targetY = y * 0.6;
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        mouseRef.current.targetX = x * 0.9;
        mouseRef.current.targetY = y * 0.6;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchstart', handleTouch, { passive: true });

    const handleResize = () => {
      updateLayout();
    };

    window.addEventListener('resize', handleResize);

    // --- E. Realistic Cardiac Heartbeat Double-Pulse Loop (Lub-Dub) & 3D Orbital Motion ---
    let animFrameId: number;
    let isRunning = true;
    const clock = new THREE.Clock();
    const raycaster = new THREE.Raycaster();
    const mouseRayVec = new THREE.Vector2();
    const parentQuat = new THREE.Quaternion();
    const invParentQuat = new THREE.Quaternion();

    const animate = () => {
      if (!isRunning) return;
      animFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Realistic Lub-Dub Heartbeat Rhythm (UNCHANGED)
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

      // Apply cardiac heartbeat contraction scale (UNCHANGED)
      realisticHeartMesh.scale.set(pulseScale, pulseScale * 1.02, 1.0);

      // Pulse shader emissive glow with heartbeat rhythm (UNCHANGED)
      heartShaderMaterial.uniforms.uEmissiveIntensity.value = emissivePulse;
      heartPointLight.intensity = 3.5 + emissivePulse * 3.5;

      // Gentle floating animation & mouse depth parallax (UNCHANGED)
      heartGroup.rotation.y = Math.sin(elapsedTime * 0.25) * 0.06 + mouseRef.current.x * 0.2;
      heartGroup.rotation.x = Math.sin(elapsedTime * 0.35) * 0.03 - mouseRef.current.y * 0.15;
      heartGroup.rotation.z = Math.cos(elapsedTime * 0.2) * 0.02;

      haloRing.rotation.z += 0.005;
      vascularParticles.rotation.y += 0.0012;

      // --- Update 3D Circular Orbital Motion of Organs around Heart ---
      const orbitSpeed = 0.11; // smooth, graceful circular revolution
      guidePoints.rotation.z = -elapsedTime * 0.02; // subtle telemetry particle drift

      mouseRayVec.set(mouseRef.current.x, mouseRef.current.y);
      raycaster.setFromCamera(mouseRayVec, camera);
      const intersects = raycaster.intersectObjects(hitTargets, false);
      const hoveredId = intersects.length > 0 ? (intersects[0].object.userData.organId as string) : null;

      // Sympathetic heartbeat ripple from the central heart to orbiting nodes
      const sympatheticPulse = (emissivePulse - 0.2) * 0.045;

      // Hover effect & sympathetic heartbeat pulse
      const isMobile = window.innerWidth < 1024;
      const autoFocusIndex = isMobile && !hoveredId ? Math.floor((elapsedTime / 3.0) % organEntries.length) : -1;

      organEntries.forEach((entry, idx) => {
        const angle = entry.def.initialAngle + elapsedTime * orbitSpeed;
        const x = Math.cos(angle) * orbitRadiusX;
        const y = Math.sin(angle) * orbitRadiusY;
        // Organic 3D wave harmonic with micro-gravity floating drift
        const z = Math.sin(angle * 2.0) * 0.14 + Math.sin(elapsedTime * 1.5 + idx * 1.05) * 0.05;
        entry.organAnchor.position.set(x, y, z);

        // Billboarding: keep organ mesh & badge facing the camera upright
        entry.organAnchor.getWorldQuaternion(parentQuat);
        invParentQuat.copy(parentQuat).invert();
        entry.organMesh.quaternion.copy(invParentQuat).multiply(camera.quaternion);
        entry.auraMesh.quaternion.copy(entry.organMesh.quaternion);

        // Slow aura ring rotation for a living ethereal energy effect
        entry.auraMesh.rotation.z += 0.008;

        // Hover effect & sympathetic heartbeat pulse
        const isHovered = entry.def.id === hoveredId || idx === autoFocusIndex;
        const respiration = Math.sin(elapsedTime * 2.0 + idx * 0.85) * 0.02;
        entry.targetScale = isHovered ? 1.22 : 1.0 + respiration + sympatheticPulse;
        entry.currentScale += (entry.targetScale - entry.currentScale) * 0.08;
        entry.organAnchor.scale.setScalar(entry.currentScale);

        // Buttery-smooth interpolation of hover lighting
        const targetHover = isHovered ? 1.0 : 0.0;
        entry.hoverVal += (targetHover - entry.hoverVal) * 0.08;
        entry.organMaterial.uniforms.uHover.value = entry.hoverVal;
        entry.auraMat.opacity = isHovered ? 0.92 : 0.40 + Math.sin(elapsedTime * 2.2 + idx) * 0.12 + (emissivePulse - 0.2) * 0.25;
      });

      // Update camera depth with scroll progress (read via ref to avoid stale closure)
      const scrollDepth = scrollProgressRef.current * 3.0;
      camera.position.z = 8.2 - scrollDepth;
      camera.position.x = mouseRef.current.x * 0.9;
      camera.position.y = (isMobile ? 0.35 : 0.2) + mouseRef.current.y * 0.45;
      camera.lookAt(0, isMobile ? 0.35 : 0.1, 0);

      renderer.render(scene, camera);
    };

    // --- F. Visibility Change Handler — pause rAF when tab is hidden, resume when visible ---
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animFrameId);
        clock.stop();
      } else if (!isRunning) {
        isRunning = true;
        clock.start();
        animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // --- G. WebGL Context Loss / Restore Handlers ---
    const canvas = renderer.domElement;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      isRunning = false;
      cancelAnimationFrame(animFrameId);
    };
    const handleContextRestored = () => {
      isRunning = true;
      clock.start();
      animate();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    animate();

    // Clean up
    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      disposables.forEach((d) => d.dispose());
      heartGeo.dispose();
      heartShaderMaterial.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      heartTexture.dispose();
      renderer.dispose();
    };
  }, []); // Empty — scene is built once; scrollProgress is read via ref

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-95" />;
};
