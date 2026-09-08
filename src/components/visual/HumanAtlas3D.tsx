import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HumanAtlas3DProps {
  selectedOrganId: string;
  onSelectOrgan: (id: string) => void;
}

interface OrganPoint {
  id: string;
  name: string;
  position: [number, number, number];
}

// Precise anatomical node coordinates matching the AI 3D Human Body Figure
const ORGAN_NODES: OrganPoint[] = [
  { id: 'neurology', name: 'Brain & Neurosciences', position: [0, 2.05, 0.2] },
  { id: 'ophthalmology', name: 'Ophthalmic Precision', position: [0.08, 1.95, 0.22] },
  { id: 'cardiology', name: 'Heart & Cardiovascular', position: [-0.07, 1.15, 0.25] },
  { id: 'pulmonology', name: 'Lungs & Respiratory', position: [0.24, 1.18, 0.22] },
  { id: 'gastroenterology', name: 'Digestive & Metabolic', position: [0, 0.50, 0.22] },
  { id: 'orthopedics', name: 'Spine & Musculoskeletal', position: [0, 0.30, -0.15] },
  { id: 'womens-health', name: "Women's Health", position: [0, -0.05, 0.22] },
  { id: 'pediatrics', name: "Children's Health", position: [0.24, 0.20, 0.22] },
];

export const HumanAtlas3D: React.FC<HumanAtlas3DProps> = ({ selectedOrganId, onSelectOrgan }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(selectedOrganId);

  useEffect(() => {
    selectedRef.current = selectedOrganId;
  }, [selectedOrganId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.4, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x0D9488, 2.2);
    dirLight1.position.set(4, 6, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0284C7, 1.8);
    dirLight2.position.set(-4, -2, 4);
    scene.add(dirLight2);

    // Main 3D Human Anatomy Group
    const humanGroup = new THREE.Group();

    // --- A. Realistic AI 3D Human Anatomy Person Shader Mesh ---
    const textureLoader = new THREE.TextureLoader();
    const personTexture = textureLoader.load('/assets/realistic_human_person.jpg');
    personTexture.colorSpace = THREE.SRGBColorSpace;

    // GPU Fragment Shader for Clean Background Removal
    const personShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: personTexture },
        uHighlight: { value: 0.0 },
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
        uniform float uHighlight;
        varying vec2 vUv;

        void main() {
          vec4 tex = texture2D(uTexture, vUv);

          // Calculate brightness and color saturation to key out off-white/grey background
          float avg = (tex.r + tex.g + tex.b) / 3.0;
          float maxDiff = max(max(abs(tex.r - tex.g), abs(tex.g - tex.b)), abs(tex.r - tex.b));

          float alpha = 1.0;
          if (avg > 0.72 && maxDiff < 0.14) {
            alpha = smoothstep(0.92, 0.72, avg);
          }

          // Strict boundary cutoff to eliminate all background shadows/vignettes
          vec2 centerDist = vUv - vec2(0.5);
          float dist = length(centerDist);
          if (dist > 0.44) {
            alpha *= smoothstep(0.48, 0.42, dist);
          }

          if (alpha <= 0.02) discard;

          vec3 glow = vec3(0.05, 0.58, 0.53) * uHighlight * 0.3;

          gl_FragColor = vec4(tex.rgb + glow, tex.a * alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const personGeo = new THREE.PlaneGeometry(3.4, 4.8, 32, 32);
    const realisticPersonMesh = new THREE.Mesh(personGeo, personShaderMaterial);
    realisticPersonMesh.position.set(0, 0.2, 0);
    humanGroup.add(realisticPersonMesh);

    // --- B. Interactive Organ Nodes & Glowing Rings ---
    const nodeMeshes: { id: string; mesh: THREE.Mesh; ring: THREE.Mesh }[] = [];

    ORGAN_NODES.forEach((organ) => {
      const isSelected = organ.id === selectedRef.current;

      const nodeGeo = new THREE.SphereGeometry(0.09, 24, 24);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xF43F5E : 0x0D9488,
        emissive: isSelected ? 0xF43F5E : 0x059669,
        emissiveIntensity: isSelected ? 1.6 : 0.9,
        roughness: 0.1,
      });

      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(...organ.position);

      const ringGeo = new THREE.TorusGeometry(0.16, 0.012, 16, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xF43F5E : 0x0284C7,
        transparent: true,
        opacity: isSelected ? 0.95 : 0.4,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(...organ.position);
      ringMesh.rotation.x = Math.PI / 2;

      humanGroup.add(nodeMesh);
      humanGroup.add(ringMesh);
      nodeMeshes.push({ id: organ.id, mesh: nodeMesh, ring: ringMesh });
    });

    humanGroup.position.set(0, -0.2, 0);
    scene.add(humanGroup);

    // --- C. Raycaster for Organ Click Selection ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));

      if (intersects.length > 0) {
        const hit = nodeMeshes.find((n) => n.mesh === intersects[0].object);
        if (hit) onSelectOrgan(hit.id);
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('click', handleClick);

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));

        if (intersects.length > 0) {
          const hit = nodeMeshes.find((n) => n.mesh === intersects[0].object);
          if (hit) onSelectOrgan(hit.id);
        }
      }
    };
    domElem.addEventListener('touchstart', handleTouch, { passive: true });

    // --- D. Smooth Animation Loop ---
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating physics for anatomical figure
      humanGroup.rotation.y = Math.sin(elapsedTime * 0.4) * 0.04;
      humanGroup.position.y = -0.2 + Math.sin(elapsedTime * 0.8) * 0.02;

      // Update active selected organ node colors and glowing ring animations
      const currentSelected = selectedRef.current;
      nodeMeshes.forEach((item) => {
        const isSelected = item.id === currentSelected;
        const nodeMat = item.mesh.material as THREE.MeshStandardMaterial;
        const ringMat = item.ring.material as THREE.MeshBasicMaterial;

        nodeMat.color.setHex(isSelected ? 0xF43F5E : 0x0D9488);
        nodeMat.emissive.setHex(isSelected ? 0xF43F5E : 0x059669);
        nodeMat.emissiveIntensity = isSelected ? 1.6 + Math.sin(elapsedTime * 4.0) * 0.5 : 0.9;

        ringMat.color.setHex(isSelected ? 0xF43F5E : 0x0284C7);
        ringMat.opacity = isSelected ? 0.95 : 0.4;

        if (isSelected) {
          item.ring.rotation.z += 0.04;
          item.ring.scale.setScalar(1.0 + Math.sin(elapsedTime * 3.5) * 0.15);
        } else {
          item.ring.scale.setScalar(1.0);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      domElem.removeEventListener('click', handleClick);
      domElem.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('resize', handleResize);
      if (container && domElem) container.removeChild(domElem);

      personGeo.dispose();
      personShaderMaterial.dispose();
      personTexture.dispose();
      renderer.dispose();
    };
  }, [onSelectOrgan]);

  return <div ref={containerRef} className="w-full h-[380px] sm:h-[480px] relative cursor-pointer" />;
};
