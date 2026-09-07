import React from 'react';
import { HOSPITAL_INFO } from '../../constants/hospital';
import { FOOTER_QUICK_LINKS, FOOTER_PATIENT_SERVICES } from '../../constants/navigation';
import { Activity, PhoneCall, Mail, MapPin, ArrowUp, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { useUIStore } from '../../stores/uiStore';

export const Footer: React.FC = () => {
  const { openAppointmentModal } = useUIStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#04060A] text-slate-400 pt-20 pb-12 border-t border-white/10 overflow-hidden">
      {/* Glow gradient background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-cyan-950/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header CTA Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-16 border-b border-white/10 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30">
                <Activity className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">AURELIA NOVA</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Medicine, reimagined around you.
            </h3>
            <p className="mt-2 text-sm text-slate-400 font-light">
              Institute of Advanced Multispeciality Care • Fictional Demo Interface
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="#emergency">
              <Button variant="emergency" icon={<PhoneCall className="w-4 h-4" />}>
                Emergency 24/7
              </Button>
            </a>
            <Button
              variant="primary"
              icon={<Calendar className="w-4 h-4" />}
              onClick={() => openAppointmentModal()}
            >
              Book Appointment
            </Button>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-16">
          
          {/* Column 1: Hospital Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono-numbers text-cyan-400 tracking-wider uppercase font-semibold">
              Medical Institute
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Next-generation multispeciality medical hub combining specialist clinical teams, AI-assisted diagnostics, and patient-centered environments.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{HOSPITAL_INFO.location.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{HOSPITAL_INFO.email}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-mono-numbers text-cyan-400 tracking-wider uppercase font-semibold mb-4">
              Explore Care
            </h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-cyan-300 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Patient Services */}
          <div>
            <h4 className="text-xs font-mono-numbers text-cyan-400 tracking-wider uppercase font-semibold mb-4">
              Patient Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_PATIENT_SERVICES.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-cyan-300 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Emergency Contacts */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono-numbers text-rose-400 tracking-wider uppercase font-semibold">
              Emergency & Trauma Care
            </h4>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400">24/7 Direct Ambulance Dispatch</div>
              <div className="text-lg font-mono-numbers font-bold text-white text-gradient-cyan">
                {HOSPITAL_INFO.emergencyNumber}
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Ambulance Fleet Active
              </div>
            </div>
          </div>

        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <p className="max-w-3xl leading-relaxed text-slate-500 font-light">
            {HOSPITAL_INFO.disclaimer}
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <span>© {new Date().getFullYear()} Aurelia Nova Care.</span>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
