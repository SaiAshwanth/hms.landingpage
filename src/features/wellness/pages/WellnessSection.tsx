import React from 'react';
import { WELLNESS_PACKAGES } from '../data/packages';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { GlassPanel } from '../../../components/ui/GlassPanel';
import { Reveal } from '../../../components/ui/Reveal';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { useUIStore } from '../../../stores/uiStore';
import { formatPrice } from '../../../utils/format';
import { CheckCircle2, Calendar } from 'lucide-react';

export const WellnessSection: React.FC = () => {
  const { openAppointmentModal } = useUIStore();

  return (
    <section id="wellness" className="py-24 relative z-10 bg-[#06080F] overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <Reveal>
          <SectionHeading
            badgeText="PREVENTIVE HEALTHCARE"
            badgeVariant="cyan"
            title="Know your health before it asks for attention."
            subtitle="Comprehensive diagnostic screening packages engineered to detect metabolic, cardiovascular, and endocrine risk factors at early stages."
          />
        </Reveal>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WELLNESS_PACKAGES.map((pkg, idx) => (
            <Reveal key={pkg.id} delay={idx * 0.08}>
              <GlassPanel
                variant={pkg.isPopular ? 'glow' : 'subtle'}
                hoverEffect
                className="p-6 flex flex-col justify-between h-full border-white/10 relative"
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="cyan" size="sm">MOST REQUESTED</Badge>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" size="sm">{pkg.duration}</Badge>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {pkg.testsCount}+ Biomarkers
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white">{pkg.name}</h3>
                  <p className="text-xs text-slate-400 font-light mt-1">{pkg.tagline}</p>

                  <div className="my-4 p-3 rounded-lg bg-slate-900/80 border border-white/5">
                    <div className="text-[10px] text-slate-500 font-mono uppercase">Ideal For</div>
                    <div className="text-xs text-slate-300 font-light mt-0.5">{pkg.idealFor}</div>
                  </div>

                  {/* Included Tests List */}
                  <div className="space-y-2 mb-6">
                    <div className="text-xs font-semibold text-slate-200">Includes:</div>
                    {pkg.includedTests.map((test) => (
                      <div key={test} className="text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{test}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-baseline justify-between font-mono-numbers">
                    <span className="text-xs text-slate-400">Package Fee:</span>
                    <span className="text-xl font-black text-white text-gradient-cyan">
                      {formatPrice(pkg.price)}
                    </span>
                  </div>

                  <Button
                    variant={pkg.isPopular ? 'primary' : 'outline'}
                    className="w-full"
                    icon={<Calendar className="w-4 h-4" />}
                    onClick={() => openAppointmentModal()}
                  >
                    Schedule Screening
                  </Button>
                </div>

              </GlassPanel>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
};
