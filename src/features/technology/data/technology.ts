import type { TechnologyItem } from '../../../types/common';

export const TECHNOLOGY_DATA: TechnologyItem[] = [
  {
    id: 'mri-3t',
    name: 'AI-Assisted Spectral MRI 3.0T',
    category: 'Diagnostic Imaging',
    description: 'High-resolution diagnostic imaging system with AI signal reconstruction designed to assist clinicians in evaluating complex neurology and cardiac tissue.',
    clinicalImpact: 'Sub-millimeter spatial resolution with 45% faster acquisition time and reduced patient claustrophobia.',
    iconName: 'Cpu',
    visualType: 'mri',
    stats: [
      { label: 'Field Strength', value: '3.0 Tesla' },
      { label: 'Spatial Resolution', value: '0.2 mm' },
      { label: 'Scan Time Reduction', value: '45%' },
    ],
  },
  {
    id: 'robotic-surgery',
    name: 'Robotic Sub-Millimeter Surgical Suite',
    category: 'Surgical Innovation',
    description: 'Computer-assisted robotic arm system providing surgeons with 3D high-definition vision and 7-degrees-of-freedom wristed instrumentation.',
    clinicalImpact: 'Enables micro-precise minimally invasive dissections with minimal blood loss and faster postoperative recovery.',
    iconName: 'Activity',
    visualType: 'robotic',
    stats: [
      { label: 'Articulation', value: '540° Wrist' },
      { label: '3D Magnification', value: '15x HD' },
      { label: 'Incision Size', value: '8-10 mm' },
    ],
  },
  {
    id: 'ai-pathology',
    name: 'Pathfinder AI Pathology Engine',
    category: 'Laboratory Science',
    description: 'Deep-learning image analysis algorithms designed to assist pathologists in scanning whole-slide histology specimens for rare cellular anomalies.',
    clinicalImpact: 'Accelerates diagnostic reporting turn-around for biopsy evaluations while maintaining clinical rigor.',
    iconName: 'Microscope',
    visualType: 'pathology',
    stats: [
      { label: 'Slide Processing', value: '60 sec/slide' },
      { label: 'Cell Biomarkers', value: '120+' },
      { label: 'Diagnostic Speed', value: '3x Faster' },
    ],
  },
  {
    id: 'telemetry',
    name: 'Real-Time Bio-Telemetry Network',
    category: 'Patient Monitoring',
    description: 'Continuous continuous patient monitoring telemetry array connected across ICU beds and mobile inpatient rooms for immediate arrhythmia alert.',
    clinicalImpact: 'Instantly alerts critical care teams upon detecting subtle cardiac rhythm deviations.',
    iconName: 'HeartPulse',
    visualType: 'telemetry',
    stats: [
      { label: 'Latency', value: '< 200 ms' },
      { label: 'Telemetry Channels', value: '12-Lead ECG' },
      { label: 'Uptime Guarantee', value: '99.999%' },
    ],
  },
];
