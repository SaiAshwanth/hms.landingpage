export interface OrganPoint {
  id: string;
  name: string;
  position: [number, number, number];
}

export interface OrbitingNodeDefinition {
  id: string;
  name: string;
  departmentId: string;
  regionTag: string;
  ring: 'inner' | 'outer';
  /** Base phase angle along the elliptical orbit in radians */
  initialAngle: number;
  /** Primary glow / accent color */
  accentColor: number;
  accentHex: string;
  iconType: 'brain' | 'lungs' | 'spine' | 'kidney' | 'eye';
  imagePath: string;
  summary: string;
}

// Canonical anatomical node coordinates for HumanAtlas3D
export const ORGAN_NODES: OrganPoint[] = [
  { id: 'neurology', name: 'Brain & Neurosciences', position: [0, 2.05, 0.2] },
  { id: 'ophthalmology', name: 'Ophthalmic Precision', position: [0.08, 1.95, 0.22] },
  { id: 'cardiology', name: 'Heart & Cardiovascular', position: [-0.07, 1.15, 0.25] },
  { id: 'pulmonology', name: 'Lungs & Respiratory', position: [0.24, 1.18, 0.22] },
  { id: 'gastroenterology', name: 'Digestive & Metabolic', position: [0, 0.50, 0.22] },
  { id: 'orthopedics', name: 'Spine & Musculoskeletal', position: [0, 0.30, -0.15] },
  { id: 'womens-health', name: "Women's Health", position: [0, -0.05, 0.22] },
  { id: 'pediatrics', name: "Children's Health", position: [0.24, 0.20, 0.22] },
];

// Orbiting anatomical body parts rotating around central Heart
export const ORBITING_ANATOMY_NODES: OrbitingNodeDefinition[] = [
  {
    id: 'brain',
    name: 'Human Brain (Neurology)',
    departmentId: 'neurology',
    regionTag: 'NEUROLOGICAL',
    ring: 'inner',
    initialAngle: 0.72,
    accentColor: 0x0284c7,
    accentHex: '#0284C7',
    iconType: 'brain',
    imagePath: '/assets/realistic_brain.jpg',
    summary: 'Cerebral cortex navigation, stereotactic neuro-telemetry & brain health',
  },
  {
    id: 'lungs',
    name: 'Human Lungs (Pulmonology)',
    departmentId: 'pulmonology',
    regionTag: 'PULMONOLOGY',
    ring: 'inner',
    initialAngle: 3.55,
    accentColor: 0x0d9488,
    accentHex: '#0D9488',
    iconType: 'lungs',
    imagePath: '/assets/realistic_lungs.jpg',
    summary: 'Bronchial airway micro-surgery, respiratory ICU & alveolar mechanics',
  },
  {
    id: 'eye',
    name: 'Human Eye (Ophthalmology)',
    departmentId: 'ophthalmology',
    regionTag: 'OPHTHALMIC',
    ring: 'outer',
    initialAngle: 1.85,
    accentColor: 0x06b6d4,
    accentHex: '#06B6D4',
    iconType: 'eye',
    imagePath: '/assets/realistic_eye.jpg',
    summary: 'Femtosecond refractive laser optics, corneal and micro-retinal surgery',
  },
  {
    id: 'kidney',
    name: 'Human Kidney (Renal Care)',
    departmentId: 'gastroenterology',
    regionTag: 'NEPHROLOGY & RENAL',
    ring: 'outer',
    initialAngle: 3.85,
    accentColor: 0xe11d48,
    accentHex: '#E11D48',
    iconType: 'kidney',
    imagePath: '/assets/realistic_kidney.jpg',
    summary: 'Renal filtration dynamics, living donor transplant & dialysis care',
  },
  {
    id: 'spine',
    name: 'Spine & Vertebrae (Orthopaedics)',
    departmentId: 'orthopaedics',
    regionTag: 'MUSCULOSKELETAL',
    ring: 'outer',
    initialAngle: 5.55,
    accentColor: 0x10b981,
    accentHex: '#10B981',
    iconType: 'spine',
    imagePath: '/assets/realistic_spine.jpg',
    summary: 'Sub-millimeter robotic spinal fusion, disc repair & kinetic mobility',
  },
];
