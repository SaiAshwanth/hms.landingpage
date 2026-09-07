import React from 'react';
import { Reveal } from '../../../components/ui/Reveal';
import type { VisitStep } from '../../../types/common';

const VISIT_STEPS: VisitStep[] = [
  { step: '01', time: '09:20', title: 'ARRIVE', subtitle: 'Valet & Main Atrium Entry', description: 'Automated underground parking check-in with greeter assistance at Central Atrium.', location: 'Atrium Level 0' },
  { step: '02', time: '09:32', title: 'CHECK-IN', subtitle: 'Digital Kiosk Triage', description: 'Instant contactless registration via mobile token or digital kiosk with zero waiting queue.', location: 'Block B Desk' },
  { step: '03', time: '09:47', title: 'CONSULTATION', subtitle: 'Specialist Evaluation', description: 'Comprehensive consultation in acoustic private rooms with senior clinical chair physician.', location: 'Clinic 204' },
  { step: '04', time: '10:25', title: 'DIAGNOSTICS', subtitle: '3.0T MRI & Lab Array', description: 'Priority radiologic imaging or lab blood specimen collection processed within 45 minutes.', location: 'Wing C' },
  { step: '05', time: '11:10', title: 'CARE PLAN', subtitle: 'Multidisciplinary Briefing', description: 'Review diagnostic results with consulting doctor and receive tailored treatment strategy.', location: 'Consult Room' },
  { step: '06', time: '11:35', title: 'FOLLOW-UP', subtitle: 'Digital Telemetry & Care Portal', description: 'Discharge with digital medical records synced to patient app for continuous remote tracking.', location: 'Mobile Portal' },
];

export const VisitReimaginedSection: React.FC = () => {
  return (
    <section className="py-32 bg-[#FAFAF7] text-[#0B0D0C] relative z-10 border-t border-[#A7AAA4]/20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <Reveal>
          <div className="mb-20">
            <div className="text-xs font-mono tracking-widest text-[#151816] uppercase mb-3 font-bold">
              05 / CONCEPTUAL PATIENT EXPERIENCE
            </div>
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-[#0B0D0C] uppercase font-sans">
              YOUR VISIT, REIMAGINED.
            </h2>
            <p className="text-base text-[#151816]/70 font-light mt-3 max-w-xl">
              A frictionless patient journey engineered for clarity, zero wasted time, and compassionate coordination.
            </p>
          </div>
        </Reveal>

        {/* Continuous Journey Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative">
          
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#0B0D0C]/15 -translate-y-6 z-0" />

          {VISIT_STEPS.map((step, idx) => (
            <Reveal key={step.step} delay={idx * 0.08}>
              <div className="p-6 bg-[#0B0D0C] text-[#FAFAF7] flex flex-col justify-between h-full space-y-4 relative z-10 border-t-2 border-t-[#8CC8A3]">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#8CC8A3]">
                    <span>STEP {step.step}</span>
                    <span>{step.time}</span>
                  </div>

                  <h3 className="text-xl font-bold uppercase tracking-tight text-white mt-3 font-sans">
                    {step.title}
                  </h3>

                  <div className="text-[11px] font-mono text-[#A7AAA4] mt-0.5">
                    {step.subtitle}
                  </div>

                  <p className="text-xs text-[#A7AAA4] font-light mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 text-[10px] font-mono text-[#8CC8A3]">
                  {step.location}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
};
