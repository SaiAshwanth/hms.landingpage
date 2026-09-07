import React from 'react';
import { AnimatedNumber } from '../../../components/ui/AnimatedNumber';
import { TextReveal } from '../../../components/motion/TextReveal';
import { ScrollBackgroundText } from '../../../components/motion/ScrollBackgroundText';
import { ScrollSlideIn } from '../../../components/motion/ScrollSlideIn';
import { motion } from 'framer-motion';

export const HospitalOverviewSection: React.FC = () => {
  const METRICS = [
    { number: 38, suffix: '', label: 'MEDICAL SPECIALITIES', description: 'Multispeciality clinical faculties led by board-certified chairs.', color: 'from-teal-500 to-emerald-600', badge: 'bg-teal-100 text-teal-800' },
    { number: 120, suffix: '+', label: 'SPECIALIST CONSULTANTS', description: 'Consultant physicians with extensive international subspeciality training.', color: 'from-cyan-500 to-blue-600', badge: 'bg-cyan-100 text-cyan-800' },
    { number: 250, suffix: '+', label: 'INPATIENT BEDS', description: 'Includes 50 acoustic private ICU suites with HEPA laminar filtration.', color: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-100 text-emerald-800' },
    { number: 24, suffix: ' / 7', label: 'EMERGENCY & TRAUMA CARE', description: 'Immediate level 1 resuscitation with zero triage delay.', color: 'from-rose-500 to-pink-600', badge: 'bg-rose-100 text-rose-800' },
    { number: 15, suffix: '+', label: 'ADVANCED DIAGNOSTIC UNITS', description: '3.0T Spectral MRI, 256-Slice CT & Robotic Surgery Suites.', color: 'from-amber-500 to-orange-600', badge: 'bg-amber-100 text-amber-800' },
    { number: 50, suffix: 'K+', label: 'PATIENTS SERVED', description: 'Delivering compassionate human care across complex clinical conditions.', color: 'from-indigo-500 to-purple-600', badge: 'bg-indigo-100 text-indigo-800' },
  ];

  return (
    <section id="at-a-glance" className="py-24 bg-gradient-to-b from-[#FAFBF8] via-[#F0FDFA] to-[#FAFBF8] text-slate-900 relative z-10 border-t border-teal-500/20 overflow-hidden">
      {/* Background Horizontal Kinetic Scrolling Text */}
      <ScrollBackgroundText text="AURELIA NOVA • HEALTHCARE ENGINEERING" direction="left" topOffset="top-12" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollSlideIn from="right" className="mb-16">
          <div className="inline-block text-xs font-mono tracking-widest text-teal-700 font-bold uppercase mb-3 px-3 py-1 bg-teal-100/80 rounded-md border border-teal-300">
            01 / HOSPITAL AT A GLANCE
          </div>
          <TextReveal
            text="Healthcare engineering built around life."
            as="h2"
            className="font-section-title font-extrabold tracking-tight text-slate-900 uppercase font-sans max-w-4xl"
          />
        </ScrollSlideIn>

        {/* Refined 2-Column Editorial Grid for Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {METRICS.map((metric, idx) => (
            <ScrollSlideIn
              key={metric.label}
              from={idx % 2 === 0 ? 'right' : 'left'}
              delay={idx * 0.08}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="p-8 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl flex flex-col justify-between space-y-4 group hover:border-teal-400 hover:shadow-xl hover:shadow-teal-500/10 transition-all shadow-md relative overflow-hidden"
              >
                {/* Subtle Color Strip Top Border */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${metric.color}`} />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-mono text-slate-400 font-bold">0{idx + 1}</span>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${metric.badge}`}>
                    ACTIVE UNIT
                  </span>
                </div>

                <div>
                  <div className={`text-5xl sm:text-6xl font-extrabold font-mono tracking-tight leading-none bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                    <AnimatedNumber value={metric.number} suffix={metric.suffix} />
                  </div>
                  <div className="text-base sm:text-lg font-bold tracking-wide uppercase text-slate-900 mt-3">
                    {metric.label}
                  </div>
                </div>

                <p className="font-body-editorial text-xs sm:text-sm text-slate-600 font-normal leading-relaxed border-t border-slate-100 pt-3">
                  {metric.description}
                </p>
              </motion.div>
            </ScrollSlideIn>
          ))}
        </div>
      </div>
    </section>
  );
};

