import React from 'react';
import { Reveal } from '../../../components/ui/Reveal';
import { AppointmentWizard } from '../components/AppointmentWizard';

export const AppointmentSection: React.FC = () => {
  return (
    <section id="appointment" className="py-32 bg-[#FAFAF7] text-[#0B0D0C] relative z-10 border-t border-[#A7AAA4]/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <Reveal>
          <div className="mb-16 text-center">
            <div className="text-xs font-mono tracking-widest text-[#151816] uppercase mb-3 font-bold">
              05 / ONLINE SCHEDULER
            </div>
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-[#0B0D0C] uppercase font-sans">
              LET'S TAKE THE NEXT STEP.
            </h2>
            <p className="text-base text-[#151816]/70 font-light mt-3 max-w-xl mx-auto">
              Select your speciality faculty, consultant physician, and date slot. Instant reservation confirmation.
            </p>
          </div>
        </Reveal>

        {/* 5-Step Minimal Appointment Wizard */}
        <Reveal delay={0.1}>
          <AppointmentWizard />
        </Reveal>

      </div>
    </section>
  );
};
