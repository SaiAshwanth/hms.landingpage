import React from 'react';
import { HOSPITAL_INFO } from '../../../constants/hospital';
import { PhoneCall, Navigation, ShieldAlert } from 'lucide-react';

export const EmergencySection: React.FC = () => {
  return (
    <section id="emergency" className="py-24 bg-gradient-to-r from-rose-50 via-red-50 to-orange-50 text-slate-900 relative z-20 border-y-2 border-rose-400 overflow-hidden shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl space-y-8">
          
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-rose-600 text-white rounded-full text-xs font-mono font-bold tracking-widest uppercase shadow-md shadow-rose-600/30">
            <ShieldAlert className="w-4 h-4 text-white animate-bounce" />
            <span>24 / 7 LEVEL 1 TRAUMA & CARDIAC DISPATCH</span>
          </div>

          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-slate-900 uppercase leading-[0.95] font-sans">
            WHEN EVERY SECOND <br /> <span className="text-rose-600">MATTERS MOST.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-700 font-normal max-w-2xl leading-relaxed">
            Immediate emergency trauma & cardiac resuscitation with zero triage delay. Supported by mobile telemetry ambulances and dedicated 24/7 CT resuscitation bays.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={`tel:${HOSPITAL_INFO.emergencyNumber}`}
              className="px-8 py-4 bg-gradient-to-r from-rose-600 to-red-600 text-white font-mono font-bold text-xs uppercase tracking-widest hover:from-rose-700 hover:to-red-700 transition-all cursor-pointer flex items-center gap-3 rounded-lg shadow-lg shadow-rose-600/30 group"
            >
              <PhoneCall className="w-4 h-4 group-hover:scale-110 transition-transform animate-pulse" />
              <span>CALL EMERGENCY ({HOSPITAL_INFO.emergencyNumber})</span>
            </a>

            <a
              href="#campus"
              className="px-8 py-4 bg-white/90 border border-rose-300 text-rose-900 font-mono font-bold text-xs uppercase tracking-widest hover:bg-rose-100/60 transition-colors cursor-pointer flex items-center gap-2 rounded-lg shadow-sm"
            >
              <Navigation className="w-4 h-4 text-rose-600" />
              <span>GET EMERGENCY DIRECTIONS</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

