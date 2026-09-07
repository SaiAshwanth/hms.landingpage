import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Technology3DViewerProps {
  activeTechId: string;
}

export const Technology3DViewer: React.FC<Technology3DViewerProps> = ({ activeTechId }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeTechRef = useRef(activeTechId);
  activeTechRef.current = activeTechId;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0D110E, 0.05);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 1.5, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Dark World Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x79CFCB, 2.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x7DB99A, 3, 10);
    pointLight.position.set(-4, -2, 3);
    scene.add(pointLight);

    // Group for active machine
    const machineGroup = new THREE.Group();

    // 1. MRI Scanner Geometry
    const mriGroup = new THREE.Group();
    const outerRingGeo = new THREE.TorusGeometry(1.8, 0.4, 32, 64);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0x151A17,
      metalness: 0.8,
      roughness: 0.2,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);

    const innerRingGeo = new THREE.TorusGeometry(1.3, 0.05, 16, 64);
    const innerRingMat = new THREE.MeshBasicMaterial({ color: 0x79CFCB });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);

    const bedGeo = new THREE.BoxGeometry(1.2, 0.1, 4);
    const bedMat = new THREE.MeshStandardMaterial({ color: 0xFAFBF8, roughness: 0.1 });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.set(0, -0.6, 0);

    mriGroup.add(outerRing);
    mriGroup.add(innerRing);
    mriGroup.add(bed);

    // 2. Robotic Surgery Arm Geometry
    const roboticGroup = new THREE.Group();
    const baseGeo = new THREE.CylinderGeometry(0.8, 1, 0.4, 32);
    const armGeo1 = new THREE.CylinderGeometry(0.12, 0.12, 1.8, 16);
    const armGeo2 = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 16);
    const headGeo = new THREE.ConeGeometry(0.2, 0.5, 16);

    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1B201D, metalness: 0.9, roughness: 0.1 });
    const aquaMat = new THREE.MeshBasicMaterial({ color: 0x79CFCB });

    const base = new THREE.Mesh(baseGeo, darkMat);
    base.position.y = -1.2;

    const arm1 = new THREE.Mesh(armGeo1, darkMat);
    arm1.position.set(0, -0.3, 0);
    arm1.rotation.z = Math.PI / 6;

    const arm2 = new THREE.Mesh(armGeo2, aquaMat);
    arm2.position.set(0.6, 0.8, 0);
    arm2.rotation.z = -Math.PI / 4;

    const toolHead = new THREE.Mesh(headGeo, aquaMat);
    toolHead.position.set(1.2, 1.3, 0);
    toolHead.rotation.z = Math.PI / 2;

    roboticGroup.add(base);
    roboticGroup.add(arm1);
    roboticGroup.add(arm2);
    roboticGroup.add(toolHead);

    machineGroup.add(mriGroup);
    machineGroup.add(roboticGroup);
    scene.add(machineGroup);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const currentTech = activeTechRef.current;
      if (currentTech === 'mri') {
        mriGroup.visible = true;
        roboticGroup.visible = false;
        mriGroup.rotation.y += 0.008;
      } else {
        mriGroup.visible = false;
        roboticGroup.visible = true;
        roboticGroup.rotation.y += 0.008;
      }

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
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);

      outerRingGeo.dispose();
      outerRingMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
      bedGeo.dispose();
      bedMat.dispose();
      baseGeo.dispose();
      armGeo1.dispose();
      armGeo2.dispose();
      headGeo.dispose();
      darkMat.dispose();
      aquaMat.dispose();
      renderer.dispose();
    };
  }, [activeTechId]);

  return <div ref={mountRef} className="w-full h-[400px] relative pointer-events-none" />;
};
