import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../stores/uiStore';
import { Search, X, User, HeartPulse, Cpu, Building2, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import type { QuickSearchItem } from '../../types/common';

const SEARCH_ITEMS: QuickSearchItem[] = [
  { id: '1', title: 'Cardiology & Cardiac Surgery', subtitle: 'Advanced Intervention & Electrophysiology', category: 'Department', linkId: 'departments' },
  { id: '2', title: 'Neurology & Neurosurgery', subtitle: 'Brain, Spine & Stroke Care Unit', category: 'Department', linkId: 'departments' },
  { id: '3', title: 'Orthopaedics & Joint Replacement', subtitle: 'Robotic Surgery & Rehabilitation', category: 'Department', linkId: 'departments' },
  { id: '4', title: 'Oncology & Radiation Therapy', subtitle: 'Comprehensive Targeted Cancer Care', category: 'Department', linkId: 'departments' },
  
  { id: '5', title: 'Dr. Arjun Mehra', subtitle: 'Chief Cardiologist • 18+ Yrs Exp', category: 'Doctor', linkId: 'doctors' },
  { id: '6', title: 'Dr. Maya Rao', subtitle: 'Consultant Neurologist • 14+ Yrs Exp', category: 'Doctor', linkId: 'doctors' },
  { id: '7', title: 'Dr. Kabir Anand', subtitle: 'Senior Orthopaedic Surgeon • 16+ Yrs Exp', category: 'Doctor', linkId: 'doctors' },
  { id: '8', title: 'Dr. Ananya Iyer', subtitle: 'Consultant Obstetrician & Gynaecologist • 12+ Yrs Exp', category: 'Doctor', linkId: 'doctors' },

  { id: '9', title: 'AI-Assisted Spectral MRI 3.0T', subtitle: 'High-Resolution Diagnostic Visualizer', category: 'Technology', linkId: 'technology' },
  { id: '10', title: 'Robotic Microsurgical Suite', subtitle: 'Sub-Millimeter Precision Surgery', category: 'Technology', linkId: 'technology' },
  
  { id: '11', title: 'Executive Wellness Health Package', subtitle: 'Comprehensive 85+ Biomarker Diagnostics', category: 'Package', linkId: 'wellness' },
  { id: '12', title: 'Cardiac Screening Package', subtitle: 'Advanced Echo, TMT & Lipid Analysis', category: 'Package', linkId: 'wellness' },

  { id: '13', title: '24/7 Trauma & Emergency Centre', subtitle: 'Level 1 Trauma Care & Ambulance Fleet', category: 'Emergency', linkId: 'emergency' },
];

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, openAppointmentModal } = useUIStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  const filteredItems = SEARCH_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: QuickSearchItem) => {
    setCommandPaletteOpen(false);
    if (item.category === 'Doctor') {
      openAppointmentModal();
    } else {
      const el = document.getElementById(item.linkId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Doctor': return <User className="w-4 h-4 text-cyan-400" />;
      case 'Department': return <HeartPulse className="w-4 h-4 text-indigo-400" />;
      case 'Technology': return <Cpu className="w-4 h-4 text-emerald-400" />;
      case 'Facility': return <Building2 className="w-4 h-4 text-amber-400" />;
      case 'Emergency': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      default: return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Palette Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#0B0F19] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden z-10"
          >
            {/* Input Header */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-slate-900/60">
              <Search className="w-5 h-5 text-cyan-400 shrink-0 mr-3" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Aurelia Nova (Doctors, Departments, Packages, Technology)..."
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:outline-none"
              />
              <button
                onClick={() => setCommandPaletteOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-md bg-slate-800/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Result List */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm font-light">
                  No medical record or service matching "{query}"
                </div>
              ) : (
                filteredItems.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                      selectedIndex === idx
                        ? 'bg-cyan-950/40 border border-cyan-500/30 text-white'
                        : 'bg-transparent text-slate-300 border border-transparent hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-900 border border-white/5">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white flex items-center gap-2">
                          {item.title}
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono-numbers bg-slate-800 text-slate-300">
                            {item.category}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{item.subtitle}</div>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
                  </button>
                ))
              )}
            </div>

            {/* Palette Footer */}
            <div className="px-4 py-2.5 bg-slate-950 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-3 font-mono">
                <span><kbd className="bg-slate-800 px-1 py-0.5 rounded">↑↓</kbd> Navigate</span>
                <span><kbd className="bg-slate-800 px-1 py-0.5 rounded">↵</kbd> Select</span>
                <span><kbd className="bg-slate-800 px-1 py-0.5 rounded">ESC</kbd> Close</span>
              </div>
              <span className="text-cyan-400 font-mono">AURELIA NOVA Core Engine</span>
            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};
