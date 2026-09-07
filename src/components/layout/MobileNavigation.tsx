import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MAIN_NAV_ITEMS } from '../../constants/navigation';
import { HOSPITAL_INFO } from '../../constants/hospital';
import { useUIStore } from '../../stores/uiStore';
import { Button } from '../ui/Button';
import { X, Calendar, PhoneCall, Search, Activity, ShieldAlert, ChevronRight } from 'lucide-react';

export const MobileNavigation: React.FC = () => {
  const { isMobileNavOpen, setMobileNavOpen, openAppointmentModal, toggleCommandPalette } = useUIStore();

  return (
    <AnimatePresence>
      {isMobileNavOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden"
          />

          {/* Full Screen Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#06080F]/95 backdrop-blur-2xl border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto lg:hidden"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 border border-cyan-500/30">
                    <Activity className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">AURELIA NOVA</div>
                    <div className="text-[10px] text-cyan-400 font-mono-numbers uppercase">Medical Drawer</div>
                  </div>
                </div>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Actions Bar */}
              <div className="my-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setMobileNavOpen(false);
                    toggleCommandPalette();
                  }}
                  className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-left hover:border-cyan-500/40"
                >
                  <Search className="w-4 h-4 text-cyan-400 mb-1" />
                  <div className="text-xs font-semibold text-slate-200">Search Care</div>
                  <div className="text-[10px] text-slate-400">Doctors & Specialties</div>
                </button>
                <button
                  onClick={() => {
                    setMobileNavOpen(false);
                    openAppointmentModal();
                  }}
                  className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-left hover:border-cyan-400/60"
                >
                  <Calendar className="w-4 h-4 text-cyan-400 mb-1" />
                  <div className="text-xs font-semibold text-cyan-200">Book Visit</div>
                  <div className="text-[10px] text-cyan-400/80">Instant Booking</div>
                </button>
              </div>

              {/* Main Nav Links */}
              <div className="space-y-1 my-4">
                {MAIN_NAV_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-xl text-slate-200 hover:text-cyan-300 hover:bg-slate-900/60 border border-transparent hover:border-white/5 transition-all text-sm font-medium"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </a>
                ))}
              </div>
            </div>

            {/* Drawer Footer Emergency Call */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    Emergency Helpline
                  </div>
                  <div className="text-sm font-mono-numbers font-bold text-white mt-1">
                    {HOSPITAL_INFO.emergencyNumber}
                  </div>
                </div>
                <a href={`tel:${HOSPITAL_INFO.emergencyNumber}`}>
                  <Button variant="emergency" size="sm" icon={<PhoneCall className="w-3.5 h-3.5" />}>
                    Call
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
