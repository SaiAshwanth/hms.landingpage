import React, { useState } from 'react';
import { HOSPITAL_INFO } from '../../../constants/hospital';
import type { CampusZone } from '../../../types/common';
import { Campus3DMap } from '../../../components/visual/Campus3DMap';
import { TextReveal } from '../../../components/motion/TextReveal';
import { ScrollBackgroundText } from '../../../components/motion/ScrollBackgroundText';
import { ScrollSlideIn } from '../../../components/motion/ScrollSlideIn';
import { MapPin, Car, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

const CAMPUS_BUILDINGS: CampusZone[] = [
  {
    id: 'clinical-tower',
    name: '01 CLINICAL TOWER',
    code: 'BUILDING 01',
    building: 'Central Tower • Floors 1-10',
    floor: 'Ground & Upper Floors',
    description: 'Central Inpatient suites, chief consultant clinics, and central welcome atrium.',
    keyUnits: ['Central Atrium Lobby', 'Executive Healing Suites', 'Inpatient Wards'],
    coordinates: { x: 50, y: 35 },
  },
  {
    id: 'diagnostics-hub',
    name: '02 DIAGNOSTICS HUB',
    code: 'BUILDING 02',
    building: 'Wing C • Ground & Basement',
    floor: 'Ground & Basement',
    description: '3.0T Spectral MRI, 256-Slice CT, PET-CT scan suites, and micro-pathology lab.',
    keyUnits: ['3.0T MRI Suite', 'PET-CT Scan Suite', 'Automated Pathology Lab'],
    coordinates: { x: 75, y: 35 },
  },
  {
    id: 'heart-institute',
    name: '03 HEART INSTITUTE',
    code: 'BUILDING 03',
    building: 'Tower D • Floors 1-3',
    floor: 'Floors 1 to 3',
    description: 'Hybrid catheterization labs, electro-physiology suites, and dedicated cardiac ICU.',
    keyUnits: ['Hybrid Cath Labs', 'Cardiac ICU', '3D Echo Bay'],
    coordinates: { x: 30, y: 65 },
  },
  {
    id: 'neuroscience-center',
    name: '04 NEUROSCIENCE CENTER',
    code: 'BUILDING 04',
    building: 'Tower E • Floors 2-4',
    floor: 'Floors 2 to 4',
    description: 'Intraoperative MRI suite, video EEG telemetry, and stroke resuscitation bay.',
    keyUnits: ['Intraoperative MRI', 'Stroke Bay', 'EEG Telemetry'],
    coordinates: { x: 70, y: 65 },
  },
  {
    id: 'childrens-centre',
    name: "05 CHILDREN'S CENTRE",
    code: 'BUILDING 05',
    building: 'Building F • Floor 1',
    floor: 'Floor 1 Direct Access',
    description: 'Level IV NICU, Paediatric intensive care, and child-centric healing suites.',
    keyUnits: ['Level IV NICU', 'PICU Suite', 'Child Play Therapy Garden'],
    coordinates: { x: 50, y: 70 },
  },
  {
    id: 'emergency-trauma',
    name: '07 EMERGENCY & TRAUMA',
    code: 'BUILDING 07',
    building: 'Building A • Ground Level',
    floor: 'Direct Ramp Access',
    description: 'Level 1 Trauma resuscitation bays with direct ambulance dispatch ramp and trauma CT.',
    keyUnits: ['Resuscitation Bays', 'Ambulance Dispatch Ramp', 'Trauma CT Bay'],
    coordinates: { x: 20, y: 35 },
  },
];

export const CampusSection: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<CampusZone>(CAMPUS_BUILDINGS[0]);

  return (
    <section id="campus" className="py-32 bg-soft-ivory text-graphite relative z-10 border-t border-graphite/10 overflow-hidden">
      {/* Background Scrolling Kinetic Text */}
      <ScrollBackgroundText text="AURELIA MEDICAL BOULEVARD • FINANCIAL DISTRICT" direction="left" topOffset="top-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollSlideIn from="right" className="mb-16">
          <div className="text-xs font-mono tracking-widest text-deep-forest uppercase mb-3 font-bold">
            06 / CAMPUS BLUEPRINT
          </div>
          <TextReveal
            text="EXPLORE THE CAMPUS."
            as="h2"
            className="font-section-title font-extrabold tracking-tighter text-graphite uppercase font-sans"
          />
          <p className="font-body-editorial text-graphite/70 font-light mt-3 max-w-xl">
            Interactive 3D architectural campus model of Aurelia Nova, Financial District, Hyderabad.
          </p>
        </ScrollSlideIn>

        {/* 3D Architectural Model & Building Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 3D WebGL Campus Model */}
          <div className="lg:col-span-7 bg-graphite text-clinical p-6 border border-black/10 relative min-h-[460px] flex flex-col justify-between overflow-hidden shadow-2xl rounded-sm">
            <div className="relative z-10 flex items-center justify-between text-xs font-mono text-warm-stone">
              <span>ARCHITECTURAL 3D MODEL</span>
              <span className="text-aurelia-green font-bold">{selectedBuilding.code}</span>
            </div>

            {/* 3D Canvas */}
            <Campus3DMap
              selectedZoneId={selectedBuilding.id}
              onSelectZone={(id) => {
                const found = CAMPUS_BUILDINGS.find((b) => b.id === id);
                if (found) setSelectedBuilding(found);
              }}
            />

            <div className="relative z-10 text-[10px] font-mono text-warm-stone flex justify-between pt-3 border-t border-white/10">
              <span>FINANCIAL DISTRICT · GACHIBOWLI</span>
              <span>CLICK 3D BUILDING TO INSPECT</span>
            </div>
          </div>

          {/* Right Selected Building Inspector Info */}
          <motion.div
            key={selectedBuilding.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 space-y-6"
          >
            <div>
              <div className="text-xs font-mono text-aurelia-green uppercase font-bold">{selectedBuilding.code}</div>
              <h3 className="font-card-title font-extrabold text-graphite uppercase tracking-tight mt-0.5 font-sans">
                {selectedBuilding.name}
              </h3>
              <p className="text-xs font-mono text-graphite/70 mt-1">{selectedBuilding.building}</p>
              <p className="font-body-editorial text-graphite/80 font-light mt-3 leading-relaxed">
                {selectedBuilding.description}
              </p>
            </div>

            <div className="p-4 bg-graphite text-clinical space-y-2 rounded-sm shadow-md">
              <div className="text-xs font-mono text-aurelia-green uppercase font-bold">Key Units & Services:</div>
              <ul className="space-y-1 text-xs text-warm-stone">
                {selectedBuilding.keyUnits.map((unit) => (
                  <li key={unit} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-aurelia-green" />
                    <span>{unit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 border border-graphite/15 space-y-3 text-xs font-mono text-graphite/80 bg-clinical rounded-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-deep-forest shrink-0 mt-0.5" />
                <span>{HOSPITAL_INFO.location.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-deep-forest shrink-0" />
                <span>500+ Automated Underground Visitor Parking Bays</span>
              </div>
            </div>

            <a
              href="#emergency"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-graphite text-clinical text-xs font-mono font-bold uppercase tracking-wider hover:bg-aurelia-green hover:text-graphite transition-all duration-300 cursor-pointer shadow-md rounded-sm group"
            >
              <Navigation className="w-4 h-4 transition-transform group-hover:rotate-45" />
              <span>Get Directions To Campus</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
