import * as THREE from 'three';
import { ORBITING_ANATOMY_NODES, type OrbitingNodeDefinition } from '../../features/departments/data/anatomyNodes';

export interface OrbitingNodeState {
  definition: OrbitingNodeDefinition;
  screenPos: { x: number; y: number };
}

export interface OrbitingSystemInstance {
  group: THREE.Group;
  update: (elapsedTime: number, delta: number) => void;
  onPointerMove: (
    normalizedX: number,
    normalizedY: number,
    _clientX?: number,
    _clientY?: number
  ) => OrbitingNodeState | null;
  onPointerDown: () => OrbitingNodeDefinition | null;
  setReducedMotion: (reduced: boolean) => void;
  setViewportWidth: (width: number) => void;
  dispose: () => void;
}

/**
 * Loads an organ image and keys out the pure black background into clean transparency
 * Ensures 100% standard WebGL compatibility across all GPUs without shader compiler crashes
 */
function loadTransparentOrganTexture(
  imagePath: string,
  onLoaded?: () => void
): { texture: THREE.CanvasTexture; canvas: HTMLCanvasElement } {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const img = new Image();
  img.src = imagePath;
  img.onload = () => {
    if (!ctx) return;
    canvas.width = img.naturalWidth || 512;
    canvas.height = img.naturalHeight || 512;
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Smooth alpha threshold on black background
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const maxVal = Math.max(r, g, b);

      if (maxVal < 18) {
        data[i + 3] = 0;
      } else if (maxVal < 60) {
        data[i + 3] = Math.floor(((maxVal - 18) / 42) * 255);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    texture.needsUpdate = true;
    onLoaded?.();
  };

  return { texture, canvas };
}

/**
 * Creates a crisp anatomical label badge texture (e.g. "EYE", "LUNGS", "KIDNEY", "BRAIN", "SPINE")
 */
function createOrganLabelTexture(label: string, colorHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 256, 64);
    // Pill background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(16, 12, 224, 40, 20);
    ctx.fill();

    // Border
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label.toUpperCase(), 128, 32);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Builds dashed elliptical orbit track line
 */
function createEllipticalOrbitLine(
  xRadius: number,
  yRadius: number,
  color: number,
  opacity: number
): { line: THREE.Line; glowLine: THREE.Line; geometry: THREE.BufferGeometry } {
  const segments = 160;
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(theta) * xRadius, Math.sin(theta) * yRadius, 0));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const lineDistances: number[] = [0];
  for (let i = 1; i < points.length; i++) {
    const dist = points[i].distanceTo(points[i - 1]);
    lineDistances.push(lineDistances[i - 1] + dist);
  }
  geometry.setAttribute('lineDistance', new THREE.Float32BufferAttribute(lineDistances, 1));

  const dashedMaterial = new THREE.LineDashedMaterial({
    color,
    dashSize: 0.24,
    gapSize: 0.16,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const line = new THREE.Line(geometry, dashedMaterial);

  const glowMaterial = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: opacity * 0.35,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const glowLine = new THREE.Line(geometry, glowMaterial);

  return { line, glowLine, geometry };
}

interface OrganMeshEntry {
  def: OrbitingNodeDefinition;
  organGroup: THREE.Group;
  organMesh: THREE.Mesh;
  labelSprite: THREE.Sprite;
  glowDisc: THREE.Mesh;
  hitTarget: THREE.Mesh;
  currentScale: number;
  targetScale: number;
  initialAngle: number;
}

/**
 * Factory for creating and managing the 3D Orbiting Anatomy System
 * Directly mounts realistic human body parts (Eye, Lungs, Kidney, Brain, Spine)
 */
export function createOrbitingAnatomySystem(
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer
): OrbitingSystemInstance {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'OrbitingAnatomySystem';

  // Align tilt with the central heart's halo ring (60 degrees)
  rootGroup.rotation.x = Math.PI / 3;
  rootGroup.position.set(0, 0.1, -0.2);

  // Concentric Elliptical Orbit Rings
  // Inner ring: a = 2.45, b = 1.95 (Brain, Lungs)
  // Outer ring: a = 3.85, b = 3.10 (Eye, Kidney, Spine)
  const innerRingGroup = new THREE.Group();
  const outerRingGroup = new THREE.Group();
  rootGroup.add(innerRingGroup);
  rootGroup.add(outerRingGroup);

  const innerRadiusX = 2.45;
  const innerRadiusY = 1.95;
  const outerRadiusX = 3.85;
  const outerRadiusY = 3.10;

  const innerOrbit = createEllipticalOrbitLine(innerRadiusX, innerRadiusY, 0x0284c7, 0.38);
  innerRingGroup.add(innerOrbit.line);
  innerRingGroup.add(innerOrbit.glowLine);

  const outerOrbit = createEllipticalOrbitLine(outerRadiusX, outerRadiusY, 0x0d9488, 0.34);
  outerRingGroup.add(outerOrbit.line);
  outerRingGroup.add(outerOrbit.glowLine);

  const entries: OrganMeshEntry[] = [];
  const disposables: { dispose: () => void }[] = [
    innerOrbit.geometry,
    innerOrbit.line.material as THREE.Material,
    innerOrbit.glowLine.material as THREE.Material,
    outerOrbit.geometry,
    outerOrbit.line.material as THREE.Material,
    outerOrbit.glowLine.material as THREE.Material,
  ];

  // Organ plane geometry (~1.1 x 1.1 prominent size, clearly visible realistic body part)
  const organPlaneGeo = new THREE.PlaneGeometry(1.15, 1.15, 8, 8);
  const glowDiscGeo = new THREE.RingGeometry(0.55, 0.65, 32);
  const hitSphereGeo = new THREE.SphereGeometry(0.65, 8, 8);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });

  disposables.push(organPlaneGeo, glowDiscGeo, hitSphereGeo, hitMat);

  ORBITING_ANATOMY_NODES.forEach((nodeDef: OrbitingNodeDefinition) => {
    const isInner = nodeDef.ring === 'inner';
    const a = isInner ? innerRadiusX : outerRadiusX;
    const b = isInner ? innerRadiusY : outerRadiusY;

    const organGroup = new THREE.Group();
    organGroup.name = `OrganGroup_${nodeDef.id}`;

    // Position along ellipse
    const x = Math.cos(nodeDef.initialAngle) * a;
    const y = Math.sin(nodeDef.initialAngle) * b;
    organGroup.position.set(x, y, 0);

    // 1. Transparent Organ Texture & Material
    const { texture } = loadTransparentOrganTexture(nodeDef.imagePath);
    disposables.push(texture);

    const organMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    disposables.push(organMat);

    const organMesh = new THREE.Mesh(organPlaneGeo, organMat);
    organMesh.userData = { nodeDefId: nodeDef.id };
    organGroup.add(organMesh);

    // 2. Glowing Halo Disc around each organ
    const glowDiscMat = new THREE.MeshBasicMaterial({
      color: nodeDef.accentColor,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    disposables.push(glowDiscMat);

    const glowDisc = new THREE.Mesh(glowDiscGeo, glowDiscMat);
    glowDisc.position.set(0, 0, -0.05);
    organGroup.add(glowDisc);

    // 3. Anatomical Label Badge (e.g. "BRAIN", "LUNGS", "EYE", "KIDNEY", "SPINE")
    const labelText = nodeDef.id.toUpperCase();
    const labelTexture = createOrganLabelTexture(labelText, nodeDef.accentHex);
    disposables.push(labelTexture);

    const labelSpriteMat = new THREE.SpriteMaterial({
      map: labelTexture,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    disposables.push(labelSpriteMat);

    const labelSprite = new THREE.Sprite(labelSpriteMat);
    labelSprite.scale.set(0.65, 0.18, 1);
    labelSprite.position.set(0, -0.65, 0.05);
    organGroup.add(labelSprite);

    // 4. Raycast Hit Target
    const hitTarget = new THREE.Mesh(hitSphereGeo, hitMat);
    hitTarget.userData = { nodeDefId: nodeDef.id };
    organGroup.add(hitTarget);

    if (isInner) {
      innerRingGroup.add(organGroup);
    } else {
      outerRingGroup.add(organGroup);
    }

    entries.push({
      def: nodeDef,
      organGroup,
      organMesh,
      labelSprite,
      glowDisc,
      hitTarget,
      currentScale: 1.0,
      targetScale: 1.0,
      initialAngle: nodeDef.initialAngle,
    });
  });

  // State
  let reducedMotion = false;
  let viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  let hoveredNodeId: string | null = null;
  let innerRotation = 0;
  let outerRotation = 0;

  // Speeds:
  // Inner ring: ~55s/rev
  // Outer ring: ~80s/rev
  const innerSpeed = (Math.PI * 2) / 55;
  const outerSpeed = (Math.PI * 2) / 80;

  const raycaster = new THREE.Raycaster();
  const mouse2D = new THREE.Vector2();
  const screenVec = new THREE.Vector3();

  // Animation Update
  const update = (elapsedTime: number, delta: number) => {
    const safeDelta = Number.isFinite(delta) ? Math.min(Math.max(delta, 0), 0.05) : 0.016;

    if (!reducedMotion) {
      const isInnerHovered = entries.some(
        (e) => e.def.id === hoveredNodeId && e.def.ring === 'inner'
      );
      const isOuterHovered = entries.some(
        (e) => e.def.id === hoveredNodeId && e.def.ring === 'outer'
      );

      if (!isInnerHovered) {
        innerRotation += safeDelta * innerSpeed;
        innerRingGroup.rotation.z = innerRotation;
      }
      if (!isOuterHovered) {
        outerRotation += safeDelta * outerSpeed;
        outerRingGroup.rotation.z = outerRotation;
      }
    }

    // Organ Breathing / Pulse Animation (~2.2s gentle sinus loop)
    const organPulse = Math.sin(elapsedTime * 2.8) * 0.04;

    entries.forEach((entry, idx) => {
      if (viewportWidth < 640) {
        entry.organGroup.visible = false;
        return;
      }
      if (viewportWidth < 768 && idx > 2) {
        entry.organGroup.visible = false;
        return;
      }
      entry.organGroup.visible = true;

      const isHovered = entry.def.id === hoveredNodeId;
      entry.targetScale = isHovered ? 1.35 : 1.0 + organPulse;
      entry.currentScale += (entry.targetScale - entry.currentScale) * 0.14;

      entry.organGroup.scale.setScalar(entry.currentScale);

      // Make organ mesh face the camera upright without gimbal roll
      entry.organMesh.quaternion.copy(camera.quaternion);

      // Pulse glow disc
      entry.glowDisc.rotation.z += 0.01;
      const glowMat = entry.glowDisc.material as THREE.MeshBasicMaterial;
      glowMat.opacity = isHovered ? 0.9 : 0.45 + Math.sin(elapsedTime * 2.5 + idx) * 0.15;
    });
  };

  // Pointer Interaction
  const onPointerMove = (
    normalizedX: number,
    normalizedY: number,
    _clientX?: number,
    _clientY?: number
  ): OrbitingNodeState | null => {
    if (viewportWidth < 640) return null;

    mouse2D.set(normalizedX, normalizedY);
    raycaster.setFromCamera(mouse2D, camera);

    const activeTargets = entries
      .filter((e) => e.organGroup.visible)
      .map((e) => e.hitTarget);

    const intersects = raycaster.intersectObjects(activeTargets, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const hitId = hit.object.userData.nodeDefId as string;
      const matched = entries.find((e) => e.def.id === hitId);

      if (matched) {
        hoveredNodeId = hitId;

        // Project 3D organ center to 2D screen coordinates
        matched.organGroup.getWorldPosition(screenVec);
        screenVec.project(camera);

        const canvasRect = renderer.domElement.getBoundingClientRect();
        const screenX = ((screenVec.x + 1) / 2) * canvasRect.width + canvasRect.left;
        const screenY = ((-screenVec.y + 1) / 2) * canvasRect.height + canvasRect.top;

        return {
          definition: matched.def,
          screenPos: { x: screenX, y: screenY },
        };
      }
    }

    hoveredNodeId = null;
    return null;
  };

  const onPointerDown = (): OrbitingNodeDefinition | null => {
    if (!hoveredNodeId) return null;
    const matched = entries.find((e) => e.def.id === hoveredNodeId);
    return matched ? matched.def : null;
  };

  const setReducedMotion = (reduced: boolean) => {
    reducedMotion = reduced;
  };

  const setViewportWidth = (width: number) => {
    viewportWidth = width;
  };

  const dispose = () => {
    disposables.forEach((d) => d.dispose());
    rootGroup.clear();
  };

  return {
    group: rootGroup,
    update,
    onPointerMove,
    onPointerDown,
    setReducedMotion,
    setViewportWidth,
    dispose,
  };
}
