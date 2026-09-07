import React, { useState } from 'react';
import { FACILITIES_DATA } from '../data/facilities';
import { Reveal } from '../../../components/ui/Reveal';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export const FacilitiesSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeFacility = FACILITIES_DATA[activeIdx];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % FACILITIES_DATA.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + FACILITIES_DATA.length) % FACILITIES_DATA.length);
  };

  return (
    <section id="facilities" className="py-32 bg-[#FAFBF8] text-[#1B201D] relative z-10 border-t border-[#1B201D]/10 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="text-xs font-mono tracking-widest text-[#17352B] uppercase mb-3 font-bold">
                05 / ARCHITECTURAL RECOVERY
              </div>
              <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-[#1B201D] uppercase font-sans">
                DESIGNED AROUND <br /> RECOVERY.
              </h2>
            </div>

            {/* Slide Navigation Controls */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#1B201D]/60 mr-2">
                0{activeIdx + 1} / 0{FACILITIES_DATA.length}
              </span>
              <button
                onClick={handlePrev}
                className="p-3 border border-[#1B201D]/20 hover:bg-[#1B201D] hover:text-[#FAFBF8] transition-colors cursor-pointer"
                aria-label="Previous facility"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 border border-[#1B201D]/20 hover:bg-[#1B201D] hover:text-[#FAFBF8] transition-colors cursor-pointer"
                aria-label="Next facility"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Overlapping Architectural Image Showcase */}
        <Reveal key={activeFacility.id}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Main Architectural Image */}
            <div className="lg:col-span-8 relative h-[420px] sm:h-[540px] overflow-hidden shadow-2xl">
              <img
                src={activeFacility.image}
                alt={activeFacility.name}
                className="w-full h-full object-cover filter grayscale contrast-105 hover:grayscale-0 transition-all duration-700 scale-105"
              />
              <div className="absolute top-4 left-4 bg-[#1B201D] text-[#FAFBF8] px-4 py-1.5 text-xs font-mono font-bold uppercase">
                {activeFacility.category}
              </div>
            </div>

            {/* Overlapping Detail Box */}
            <div className="lg:col-span-4 bg-[#1B201D] text-[#FAFBF8] p-8 sm:p-10 space-y-6 lg:-ml-12 relative z-20 shadow-2xl border border-white/10">
              
              <div className="text-xs font-mono text-[#7DB99A] uppercase tracking-wider">
                OPERATING HOURS: {activeFacility.operatingHours}
              </div>

              <h3 className="text-3xl font-extrabold uppercase tracking-tight font-sans text-white">
                {activeFacility.name}
              </h3>

              <p className="text-xs sm:text-sm text-[#D9D8D1] font-light leading-relaxed">
                {activeFacility.description}
              </p>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-mono text-[#7DB99A] uppercase font-bold">Key Specifications:</div>
                <ul className="space-y-1.5">
                  {activeFacility.features.map((feat) => (
                    <li key={feat} className="text-xs text-[#D9D8D1] flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#7DB99A] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        </Reveal>

      </div>
    </section>
  );
};
