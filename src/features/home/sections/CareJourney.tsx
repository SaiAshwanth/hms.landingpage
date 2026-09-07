import React from 'react';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { GlassPanel } from '../../../components/ui/GlassPanel';
import { Reveal } from '../../../components/ui/Reveal';
import { Search, UserCheck, Activity, ShieldCheck, Heart, RefreshCw } from 'lucide-react';

export const CareJourneySection: React.FC = () => {
  const STEPS = [
    {
      step: '01',
      title: 'Discover',
      subtitle: 'Digital Triage & Specialty Matching',
      description: 'Search symptoms or specialities online or via emergency hotline for immediate specialist triage.',
      icon: Search,
      color: 'text-cyan-400',
    },
    {
      step: '02',
      title: 'Consult',
      subtitle: 'Chair Specialist Evaluation',
      description: 'In-person or high-definition tele-consultation with leading consultant physicians.',
      icon: UserCheck,
      color: 'text-emerald-400',
    },
    {
      step: '03',
      title: 'Diagnose',
      subtitle: '3.0T MRI & Genomic Labs',
      description: 'Rapid diagnostic imaging and pathology reporting within hours to establish exact clinical direction.',
      icon: Activity,
      color: 'text-indigo-400',
    },
    {
      step: '04',
      title: 'Treat',
      subtitle: 'Robotic & Minimal Surgery',
      description: 'Sub-millimeter surgical execution or targeted therapeutic protocols led by multidisciplinary tumor/care boards.',
      icon: ShieldCheck,
      color: 'text-blue-400',
    },
    {
      step: '05',
      title: 'Recover',
      subtitle: 'Acoustic Suite Healing',
      description: 'Laminar-airflow private rooms with 1:1 dedicated nursing, custom nutrition, and daily rehabilitation.',
      icon: Heart,
      color: 'text-rose-400',
    },
    {
      step: '06',
      title: 'Follow-up',
      subtitle: 'Continuous Bio-Telemetry',
      description: 'Remote monitoring apps and scheduled wellness checkups ensure long-term health continuity.',
      icon: RefreshCw,
      color: 'text-amber-400',
    },
  ];

  return (
    <section className="py-24 relative z-10 bg-[#06080F] overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <Reveal>
          <SectionHeading
            badgeText="CARE THAT MOVES WITH YOU"
            badgeVariant="cyan"
            title="A continuous, coordinated patient journey."
            subtitle="Healthcare should never feel fragmented. Aurelia Nova connects every milestone—from your initial consultation through recovery and lifelong wellness."
          />
        </Reveal>

        {/* Horizontal Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative">
          
          {/* Connecting background line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-emerald-500/20 -translate-y-6 z-0" />

          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.step} delay={idx * 0.08}>
                <GlassPanel
                  variant="subtle"
                  hoverEffect
                  className="p-5 flex flex-col justify-between h-full border-white/5 relative z-10"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <span className="text-xl font-extrabold font-mono-numbers text-cyan-400/80">
                        {item.step}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-white">{item.title}</h4>
                    <div className="text-[11px] text-cyan-300 font-mono mt-0.5">{item.subtitle}</div>
                    <p className="text-xs text-slate-400 font-light mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </GlassPanel>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
