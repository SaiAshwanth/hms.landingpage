import React, { useState } from 'react';
import { ScrollBackgroundText } from '../../../components/motion/ScrollBackgroundText';
import { ScrollSlideIn } from '../../../components/motion/ScrollSlideIn';
import { motion, AnimatePresence } from 'framer-motion';

const DAY_TIMELINE = [
  { time: '07:00', title: 'The Hospital Wakes.', subtitle: 'ICU Rounds & Handover', description: 'Multidisciplinary physician teams complete morning patient rounds across 50 ICU suites and acute wards.', lighting: 'bg-slate-900 text-white border-teal-500/30', badge: 'MORNING PHASE' },
  { time: '09:30', title: 'Outpatient Care Begins.', subtitle: '120+ Specialist Consultations', description: 'Consultant physicians begin scheduled outpatient evaluations across 38 clinical subspecialities.', lighting: 'bg-slate-100 text-slate-900 border-slate-300', badge: 'DAYTIME PHASE' },
  { time: '12:15', title: 'Diagnostics In Motion.', subtitle: '3.0T MRI & Genomic Array', description: 'Radiology and micro-pathology labs process urgent scans with AI image reconstruction.', lighting: 'bg-teal-950 text-teal-50 border-teal-500/40', badge: 'MIDDAY PHASE' },
  { time: '15:40', title: 'Surgical Precision.', subtitle: 'Robotic Operating Theatres', description: 'Computer-assisted robotic operating rooms execute complex joint reconstructions and cardiac interventions.', lighting: 'bg-emerald-900 text-emerald-50 border-emerald-500/40', badge: 'AFTERNOON PHASE' },
  { time: '19:20', title: 'Families Reconnect.', subtitle: 'Caregiver Update Lounges', description: 'Physicians update patient families in acoustic briefing lounges during evening visiting hours.', lighting: 'bg-slate-950 text-slate-100 border-slate-700', badge: 'EVENING PHASE' },
  { time: '02:10', title: 'Emergency Never Sleeps.', subtitle: '24/7 Level 1 Resuscitation', description: 'Mobile telemetry ambulances dispatch while trauma suites operate with zero triage delay throughout the night.', lighting: 'bg-rose-950 text-rose-50 border-rose-500/40', badge: 'NIGHT PHASE' },
];

export const DayAtAureliaSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const currentEvent = DAY_TIMELINE[activeStep];

  return (
    <section id="day-at-aurelia" className="py-32 bg-[#FAFBF8] text-[#1B201D] relative z-10 border-t border-[#1B201D]/10 overflow-hidden">
      {/* Background Kinetic Scrolling Text */}
      <ScrollBackgroundText text="24 HOUR CLINICAL PULSE • CONTINUOUS CARE" direction="right" topOffset="top-12" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollSlideIn from="left" className="mb-20">
          <div>
            <div className="text-xs font-mono tracking-widest text-[#7DB99A] uppercase mb-3 font-bold">
              04 / CONTINUOUS ECOSYSTEM
            </div>
            <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-[#1B201D] uppercase font-sans">
              A DAY INSIDE AURELIA NOVA
            </h2>
            <p className="text-base text-[#1B201D]/70 font-light mt-3 max-w-xl">
              24 hours inside a living medical ecosystem operating continuously for human health.
            </p>
          </div>
        </ScrollSlideIn>

        {/* Environmental Lighting Interactive Timeline Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Time Selector Column */}
          <div className="lg:col-span-5">
            <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 scrollbar-none snap-x snap-mandatory">
              {DAY_TIMELINE.map((item, idx) => {
                const isSelected = idx === activeStep;
                return (
                  <button
                    key={item.time}
                    onClick={() => setActiveStep(idx)}
                    className={`flex-shrink-0 min-w-[140px] lg:w-full text-left p-3.5 lg:p-5 transition-all duration-300 cursor-pointer border lg:border-b lg:border-t-0 lg:border-x-0 border-slate-200/80 rounded-xl lg:rounded-lg flex items-center justify-between snap-start ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                        : 'bg-white/80 lg:bg-transparent text-[#1B201D]/70 hover:bg-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 lg:gap-4">
                      <span className="text-base lg:text-xl font-bold font-mono text-teal-500">
                        {item.time}
                      </span>
                      <div>
                        <div className="text-xs lg:text-sm font-bold uppercase leading-tight">{item.title}</div>
                        <div className="text-[9px] lg:text-[10px] font-mono opacity-60 leading-tight mt-0.5">{item.subtitle}</div>
                      </div>
                    </div>
                    {isSelected && <span className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-teal-400 animate-pulse shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Environmental Lighting Display Box */}
          <div className="lg:col-span-7 relative min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -15 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className={`p-8 sm:p-14 border transition-colors duration-500 min-h-[420px] flex flex-col justify-between shadow-2xl rounded-2xl ${currentEvent.lighting}`}
              >
                
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold tracking-widest px-3 py-1 bg-white/10 rounded-full">{currentEvent.badge}</span>
                  <span className="text-xl font-extrabold font-mono">{currentEvent.time} HAS</span>
                </div>

                <div className="my-auto space-y-4 py-6">
                  <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-bold">
                    {currentEvent.subtitle}
                  </span>
                  <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-sans">
                    {currentEvent.title}
                  </h3>
                  <p className="text-sm sm:text-base font-light opacity-90 leading-relaxed max-w-xl">
                    {currentEvent.description}
                  </p>
                </div>

                <div className="text-[10px] font-mono opacity-60 flex justify-between border-t border-current/20 pt-4">
                  <span>AURELIA 24-HOUR CLINICAL PULSE</span>
                  <span>PHASE 0{activeStep + 1} / 06</span>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
