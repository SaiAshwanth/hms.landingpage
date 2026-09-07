import React, { useState } from 'react';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { GlassPanel } from '../../../components/ui/GlassPanel';
import { Reveal } from '../../../components/ui/Reveal';
import { ShieldCheck, Globe, FileText, CreditCard, Ambulance, Users, ChevronDown } from 'lucide-react';

export const PatientServicesSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const SERVICES = [
    {
      title: 'Insurance Assistance & Cashless Desks',
      icon: ShieldCheck,
      summary: 'Empaneled with 40+ leading health insurance providers and Third Party Administrators (TPAs).',
      details: 'Our dedicated 24/7 Insurance Desk manages pre-authorization requests, TPA documentation, cashless pre-approval, and final claim settlements directly with insurance providers to minimize out-of-pocket stress.',
    },
    {
      title: 'International Patient Concierge',
      icon: Globe,
      summary: 'Specialized assistance for international medical travelers seeking tertiary surgical care.',
      details: 'Comprehensive support including medical visa invitation letters, airport transfer arrangements, language interpreters, dietary customization, and tele-health follow-up coordination.',
    },
    {
      title: 'Diagnostic Reports & Electronic Medical Records',
      icon: FileText,
      summary: 'Instant digital access to lab results, 3.0T MRI DICOM imaging, and clinical discharge summaries.',
      details: 'Patients access secure cloud portals with 256-bit encryption for downloading lab reports, viewing high-res radiologic imaging, and sharing records with consulting doctors globally.',
    },
    {
      title: 'Transparent Billing & Financial Guidance',
      icon: CreditCard,
      summary: 'Clear package estimates and itemized daily billing counseling before major procedures.',
      details: 'Clinical financial counselors provide itemized estimates for inpatient stay, surgical fees, pharmacy consumables, and implant specifications with zero hidden charges.',
    },
    {
      title: 'Patient Transport & Mobile Tele-ICU',
      icon: Ambulance,
      summary: 'Inter-hospital critical transport equipped with ventilator support and tele-physician monitoring.',
      details: 'High-acuity mobile ICUs staffed by emergency paramedics and tele-linked to the central hospital ICU command center for continuous vital tracking during transport.',
    },
    {
      title: 'Visitor Guidelines & Caregiver Lounges',
      icon: Users,
      summary: 'Comfortable waiting lounges, acoustic family suites, and flexible visiting schedules.',
      details: 'Designed for family comfort with high-speed Wi-Fi, private quiet spaces, clinical update briefing rooms, and 24/7 cafeteria services.',
    },
  ];

  return (
    <section id="services" className="py-24 relative z-10 bg-[#06080F] overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <Reveal>
          <SectionHeading
            badgeText="INSURANCE & SERVICES"
            badgeVariant="cyan"
            title="Coordinated support for patients & families."
            subtitle="Explore our patient assistance desks—from instant cashless insurance approval to international concierge services."
          />
        </Reveal>

        {/* Expandable Accordion List */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {SERVICES.map((item, idx) => {
            const Icon = item.icon;
            const isOpen = openIndex === idx;
            return (
              <Reveal key={item.title} delay={idx * 0.05}>
                <GlassPanel
                  variant="subtle"
                  className="overflow-hidden border-white/10"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{item.title}</h3>
                        <p className="text-xs text-slate-400 font-light mt-0.5">{item.summary}</p>
                      </div>
                    </div>

                    <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-300 font-light border-t border-white/5 leading-relaxed bg-slate-950/40">
                      {item.details}
                    </div>
                  )}
                </GlassPanel>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
