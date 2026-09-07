import type { Facility } from '../../../types/common';

export const FACILITIES_DATA: Facility[] = [
  {
    id: 'trauma-er',
    name: 'Emergency & Level 1 Trauma Wing',
    category: 'Critical Care',
    description: '30 high-acuity resuscitation bays with dedicated point-of-care CT scanner, rapid blood bank access, and direct ambulance ramp.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    features: ['Direct Helipad & Ambulance Ramp', 'Point-of-Care FAST Ultrasound', 'Negative-Pressure Isolation Bays'],
    operatingHours: '24/7 • 365 Days',
  },
  {
    id: 'advanced-icu',
    name: 'Advanced Modular Intensive Care Unit',
    category: 'Critical Care',
    description: '50 private single-bed ICU suites with HEPA laminar air filtration, smart telemetry, and 1:1 nurse-to-patient monitoring.',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    features: ['Laminar Air Filtration Class 100', 'Extracorporeal Membrane Oxygenation (ECMO)', 'Family Overnight Lounge'],
    operatingHours: '24/7 Continuous Monitoring',
  },
  {
    id: 'operation-theatres',
    name: 'Robotic & Hybrid Operation Theatres',
    category: 'Surgical Suites',
    description: '14 state-of-the-art modular operating rooms equipped with intraoperative 3.0T MRI, robotic arms, and 4K surgical video routing.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    features: ['Intraoperative 3.0T MRI Integration', 'Seamless Anti-Microbial Glass Walls', '3D Surgical Tele-Consultation'],
    operatingHours: '24/7 Surgical Readiness',
  },
  {
    id: 'diagnostic-imaging',
    name: 'Integrated Diagnostic Imaging Hub',
    category: 'Diagnostics',
    description: 'All-under-one-roof imaging suite including 3.0T MRI, 256-Slice Cardiac CT, SPECT Nuclear Imaging, and Digital Mammography.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    features: ['Zero-Wait Urgent Scans', 'Low-Radiation Dose Protocol', 'Instant Digital PACs Portal'],
    operatingHours: '24/7 Diagnostics Desk',
  },
  {
    id: 'patient-suites',
    name: 'Executive & Private Healing Suites',
    category: 'Inpatient Care',
    description: 'Quiet, light-filled private suites with panoramic city views, ergonomic guest sofas, ambient acoustic insulation, and 24/7 nursing call.',
    image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80',
    features: ['Acoustic Soundproofing & Ambient Lighting', 'Dedicated Clinical Nutritionist', 'Private Executive Lounge Access'],
    operatingHours: '24/7 Inpatient Service',
  },
];
