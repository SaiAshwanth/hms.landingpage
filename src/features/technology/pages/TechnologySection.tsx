import React, { useState } from 'react';
import { TECHNOLOGY_DATA } from '../data/technology';
import type { TechnologyItem } from '../../../types/common';
import { AureliaPulse } from '../../../components/visual/AureliaPulse';
import { Technology3DViewer } from '../../../components/visual/Technology3DViewer';
import { TextReveal } from '../../../components/motion/TextReveal';
import { Cpu, Activity, Microscope, HeartPulse, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const NETWORK_NODES = [
  { id: 'patient', label: 'Patient Triage' },
  { id: 'diagnostics', label: 'Diagnostics' },
  { id: 'imaging', label: '3.0T Imaging' },
  { id: 'intelligence', label: 'Clinical AI Engine' },
  { id: 'specialist', label: 'Chair Specialist' },
  { id: 'care-plan', label: 'Targeted Plan' },
  { id: 'recovery', label: 'Recovery Telemetry' },
];

export const TechnologySection: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<TechnologyItem>(TECHNOLOGY_DATA[0]);

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Cpu': return Cpu;
      case 'Activity': return Activity;
      case 'Microscope': return Microscope;
      case 'HeartPulse': return HeartPulse;
      default: return Sparkles;
    }
  };

  return (
    <section id="technology" className="py-32 bg-dark-obsidian text-clinical relative z-10 border-t border-white/10 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#79cfcb08_1px,transparent_1px),linear-gradient(to_bottom,#79cfcb08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-16">
          <div className="text-xs font-mono tracking-widest text-medical-aqua uppercase mb-3 font-bold">
            04 / DARK WORLD · MEDICAL INTELLIGENCE
          </div>
          <TextReveal
            text="INSIDE THE INTELLIGENCE OF AURELIA."
            as="h2"
            className="font-section-title font-extrabold tracking-tighter text-clinical uppercase font-sans"
          />
          <p className="font-body-editorial text-warm-stone/70 font-light mt-3 max-w-xl">
            How computer-assisted surgical suites, AI pathology, and real-time telemetry support clinician decision-making.
          </p>
        </div>

        {/* Interconnected Patient Intelligence Network Visualization */}
        <div className="p-6 bg-dark-graphite border border-white/10 mb-16 space-y-4 rounded-sm shadow-xl">
          <div className="text-xs font-mono text-medical-aqua font-bold uppercase tracking-wider">
            Interconnected Clinical Care Network Flow
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            {NETWORK_NODES.map((node, idx) => (
              <React.Fragment key={node.id}>
                <div className="px-3.5 py-2 bg-dark-obsidian border border-medical-aqua/30 text-xs font-mono font-bold text-white flex items-center gap-1.5 rounded-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-medical-aqua animate-pulse" />
                  <span>{node.label}</span>
                </div>
                {idx < NETWORK_NODES.length - 1 && (
                  <span className="hidden md:inline-block text-medical-aqua/50 font-mono">→</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <AureliaPulse variant="intelligence" />
        </div>

        {/* Interactive Technology Node Selector & 3D WebGL Machine Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Tech Node List */}
          <div className="lg:col-span-5 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-warm-stone/70 mb-4 font-bold">
              Select Medical Intelligence System
            </div>
            {TECHNOLOGY_DATA.map((tech) => {
              const Icon = getIcon(tech.iconName);
              const isSelected = tech.id === selectedTech.id;
              return (
                <button
                  key={tech.id}
                  onClick={() => setSelectedTech(tech)}
                  className={`w-full text-left p-5 transition-all duration-300 cursor-pointer border-b border-white/10 flex items-center justify-between rounded-sm ${
                    isSelected
                      ? 'bg-dark-graphite text-medical-aqua pl-6 border-l-2 border-l-medical-aqua shadow-lg'
                      : 'text-warm-stone/70 hover:text-clinical hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-medical-aqua" />
                    <div>
                      <div className="text-sm font-bold uppercase font-sans tracking-wide">
                        {tech.name}
                      </div>
                      <div className="text-[11px] font-mono text-warm-stone/60">
                        {tech.category}
                      </div>
                    </div>
                  </div>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-medical-aqua animate-pulse" />}
                </button>
              );
            })}
          </div>

          {/* Technical Drawing & 3D Machine Viewer */}
          <div className="lg:col-span-7 bg-dark-graphite border border-white/10 p-8 sm:p-10 relative min-h-[480px] flex flex-col justify-between shadow-2xl rounded-sm">
            <div className="relative z-10 flex items-center justify-between text-xs font-mono text-warm-stone/60">
              <span>SYSTEM SPECIFICATION: {selectedTech.id.toUpperCase()}</span>
              <span className="text-medical-aqua font-bold">{selectedTech.category}</span>
            </div>

            {/* 3D WebGL Machine Canvas */}
            <Technology3DViewer activeTechId={selectedTech.id} />

            <motion.div
              key={selectedTech.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 space-y-4"
            >
              <h3 className="font-card-title font-extrabold text-clinical uppercase tracking-tight font-sans">
                {selectedTech.name}
              </h3>

              <p className="font-body-editorial text-warm-stone/80 font-light leading-relaxed max-w-xl">
                {selectedTech.description}
              </p>

              <div className="p-4 bg-dark-obsidian border border-white/10 rounded-sm">
                <div className="text-[10px] font-mono text-medical-aqua uppercase font-bold">Clinical Impact</div>
                <p className="text-xs text-clinical mt-0.5">{selectedTech.clinicalImpact}</p>
              </div>

              {/* Technical Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 font-mono pt-2 border-t border-white/10">
                {selectedTech.stats.map((s) => (
                  <div key={s.label} className="p-3 bg-dark-obsidian border border-white/5 rounded-sm">
                    <div className="text-sm font-bold text-medical-aqua">{s.value}</div>
                    <div className="text-[10px] text-warm-stone/60 font-sans mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="relative z-10 text-[10px] font-mono text-warm-stone/60 flex justify-between pt-4 border-t border-white/10 mt-4">
              <span>MEDICAL SIGNAL: ACTIVE</span>
              <span>AURELIA MEDICAL AI VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
