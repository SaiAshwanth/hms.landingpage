import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Campus3DMapProps {
  selectedZoneId: string;
  onSelectZone: (id: string) => void;
}

interface BuildingZone {
  id: string;
  name: string;
  pos: [number, number, number];
  size: [number, number, number];
  color: number;
}

const BUILDINGS: BuildingZone[] = [
  { id: 'clinical-tower', name: 'Clinical Tower', pos: [-2, 1, -1], size: [1.8, 2.8, 1.8], color: 0x1B201D },
  { id: 'diagnostics', name: 'Diagnostics Center', pos: [1.5, 0.7, -1.5], size: [1.6, 1.4, 1.6], color: 0x17352B },
  { id: 'heart-institute', name: 'Heart Institute', pos: [-2.5, 0.8, 1.5], size: [1.5, 1.6, 1.5], color: 0x7DB99A },
  { id: 'neuroscience', name: 'Neuroscience Center', pos: [1.8, 0.9, 1.2], size: [1.7, 1.8, 1.5], color: 0x1B201D },
  { id: 'childrens', name: "Children's Centre", pos: [0, 0.6, 2.2], size: [1.4, 1.2, 1.4], color: 0xBFD8C8 },
  { id: 'wellness', name: 'Wellness Garden', pos: [0, 0.1, -2.2], size: [2.5, 0.2, 1.8], color: 0x7DB99A },
  { id: 'emergency', name: 'Emergency & Trauma', pos: [3.2, 0.5, 0], size: [1.4, 1.0, 1.4], color: 0x79CFCB },
];

export const Campus3DMap: React.FC<Campus3DMapProps> = ({ selectedZoneId, onSelectZone }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(selectedZoneId);
  selectedRef.current = selectedZoneId;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xF3F1EA, 0.04);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(6, 6, 9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x7DB99A, 1.8);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    // Ground Plane Grid
    const gridGeo = new THREE.PlaneGeometry(20, 20, 30, 30);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x1B201D,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const groundGrid = new THREE.Mesh(gridGeo, gridMat);
    groundGrid.rotation.x = -Math.PI / 2;
    scene.add(groundGrid);

    // Buildings Group
    const buildingMeshes: { id: string; mesh: THREE.Mesh; initialY: number }[] = [];

    BUILDINGS.forEach((b) => {
      const geo = new THREE.BoxGeometry(...b.size);
      const mat = new THREE.MeshStandardMaterial({
        color: b.color,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...b.pos);
      scene.add(mesh);
      buildingMeshes.push({ id: b.id, mesh, initialY: b.pos[1] });
    });

    // Click handler
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(buildingMeshes.map((bm) => bm.mesh));

      if (intersects.length > 0) {
        const hit = buildingMeshes.find((bm) => bm.mesh === intersects[0].object);
        if (hit) onSelectZone(hit.id);
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('click', handleClick);

    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Slow orbit rotation
      scene.rotation.y += 0.0015;

      const currentSelected = selectedRef.current;
      buildingMeshes.forEach((item) => {
        const isSelected = item.id === currentSelected;
        const targetY = isSelected ? item.initialY + 0.3 : item.initialY;
        item.mesh.position.y += (targetY - item.mesh.position.y) * 0.1;
        (item.mesh.material as THREE.MeshStandardMaterial).opacity = isSelected ? 1 : 0.75;
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
      window.removeEventListener('resize', handleResize);
      if (container && domElem) container.removeChild(domElem);
      gridGeo.dispose();
      gridMat.dispose();
      renderer.dispose();
    };
  }, [onSelectZone, selectedZoneId]);

  return <div ref={containerRef} className="w-full h-[440px] relative cursor-pointer" />;
};
