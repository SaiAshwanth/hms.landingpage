import React from 'react';
import { useUIStore } from '../../../stores/uiStore';
import { UserCheck, Calendar, HeartPulse, Activity, ShieldCheck, PhoneCall, ChevronRight } from 'lucide-react';
import { GlassPanel } from '../../../components/ui/GlassPanel';

export const QuickCareSection: React.FC = () => {
  const { openAppointmentModal, toggleCommandPalette } = useUIStore();

  const QUICK_ACTIONS = [
    {
      id: 'doctor',
      label: 'Find a Doctor',
      subtitle: 'Browse 120+ Specialists',
      icon: UserCheck,
      color: 'text-cyan-400',
      action: () => {
        const el = document.getElementById('doctors');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'appointment',
      label: 'Book Appointment',
      subtitle: 'Instant Online Slot',
      icon: Calendar,
      color: 'text-emerald-400',
      action: () => openAppointmentModal(),
    },
    {
      id: 'department',
      label: 'Find Department',
      subtitle: '38 Speciality Faculties',
      icon: HeartPulse,
      color: 'text-indigo-400',
      action: () => {
        const el = document.getElementById('departments');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'diagnostics',
      label: 'Advanced Diagnostics',
      subtitle: '3.0T MRI & Path Labs',
      icon: Activity,
      color: 'text-blue-400',
      action: () => {
        const el = document.getElementById('technology');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'packages',
      label: 'Health Packages',
      subtitle: 'Executive Screenings',
      icon: ShieldCheck,
      color: 'text-amber-400',
      action: () => {
        const el = document.getElementById('wellness');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'emergency',
      label: 'Emergency Care',
      subtitle: '24/7 Dispatch Unit',
      icon: PhoneCall,
      color: 'text-rose-400',
      action: () => {
        const el = document.getElementById('emergency');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  return (
    <section id="quick-care" className="relative z-20 -mt-10 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <GlassPanel variant="glow" className="p-4 sm:p-6 border-cyan-500/30">
        
        {/* Command Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-mono-numbers uppercase tracking-wider font-semibold text-slate-200">
              What do you need today?
            </h3>
          </div>
          <button
            onClick={toggleCommandPalette}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
          >
            <span>Command Search (⌘K)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_ACTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="group p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/80 transition-all text-left flex flex-col justify-between cursor-pointer min-h-[96px]"
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 font-light truncate mt-0.5">
                    {item.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </GlassPanel>
    </section>
  );
};
