import React, { useState } from 'react';
import { DEPARTMENTS_DATA } from '../data/departments';
import { HumanAtlas3D } from '../../../components/visual/HumanAtlas3D';
import { TextReveal } from '../../../components/motion/TextReveal';
import { useUIStore } from '../../../stores/uiStore';
import { Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ANATOMY_REGIONS = [
  { id: 'cardiology', name: 'HEART', region: 'CARDIOVASCULAR', departmentId: 'cardiology', color: 'from-rose-500 to-pink-600' },
  { id: 'neurology', name: 'BRAIN & MIND', region: 'NEUROLOGICAL', departmentId: 'neurology', color: 'from-indigo-500 to-purple-600' },
  { id: 'orthopedics', name: 'SPINE & BONES', region: 'MUSCULOSKELETAL', departmentId: 'orthopaedics', color: 'from-teal-500 to-emerald-600' },
  { id: 'gastroenterology', name: 'DIGESTIVE SYSTEM', region: 'GASTROINTESTINAL', departmentId: 'gastroenterology', color: 'from-amber-500 to-orange-600' },
  { id: 'womens-health', name: "WOMEN'S HEALTH", region: 'MATERNAL & FETAL', departmentId: 'obstetrics', color: 'from-pink-500 to-rose-500' },
  { id: 'pediatrics', name: "CHILDREN'S HEALTH", region: 'PAEDIATRIC', departmentId: 'paediatrics', color: 'from-cyan-500 to-blue-600' },
  { id: 'ophthalmology', name: 'OPHTHALMIC PRECISION', region: 'OPHTHALMOLOGY', departmentId: 'ophthalmology', color: 'from-emerald-500 to-teal-600' },
  { id: 'pulmonology', name: 'RESPIRATORY & LUNGS', region: 'PULMONOLOGY', departmentId: 'pulmonology', color: 'from-blue-500 to-cyan-600' },
];

export const SpecialityExplorerSection: React.FC = () => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('cardiology');
  const { openAppointmentModal, setCursorMode } = useUIStore();

  const selectedRegion = ANATOMY_REGIONS.find((r) => r.id === selectedRegionId) || ANATOMY_REGIONS[0];
  const selectedDept = DEPARTMENTS_DATA.find((d) => d.id === selectedRegion.departmentId) || DEPARTMENTS_DATA[0];

  return (
    <section id="human-atlas" className="py-24 bg-gradient-to-b from-[#FAFBF8] via-[#F0FDFA] to-[#FAFBF8] text-slate-900 relative z-10 border-t border-teal-500/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-block text-xs font-mono tracking-widest text-teal-700 font-bold uppercase mb-3 px-3 py-1 bg-teal-100/80 rounded-md border border-teal-300">
            02 / SIGNATURE EXHIBIT
          </div>
          <TextReveal
            text="THE HUMAN ATLAS"
            as="h2"
            className="font-section-title font-extrabold tracking-tighter text-slate-900 uppercase font-sans"
          />
          <p className="font-body-editorial text-slate-700 font-normal mt-3 max-w-xl">
            Interactive 3D medical visualization. Select any body system to inspect faculties and clinical chairs.
          </p>
        </div>

        {/* Anatomical Museum 3D Installation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Body Systems Selector */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-teal-500/20 pb-6 lg:pb-0 lg:pr-8">
            <div className="text-xs font-mono uppercase tracking-wider text-teal-900 mb-3 font-bold flex items-center justify-between">
              <span>Select Body System</span>
              <span className="lg:hidden text-[10px] text-teal-600 font-normal">Swipe to switch</span>
            </div>
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none snap-x snap-mandatory">
              {ANATOMY_REGIONS.map((item) => {
                const isSelected = item.id === selectedRegionId;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedRegionId(item.id)}
                    onMouseEnter={() => setCursorMode('view')}
                    onMouseLeave={() => setCursorMode('default')}
                    className={`flex-shrink-0 min-w-[160px] lg:w-full text-left p-3.5 lg:p-4 transition-all duration-300 cursor-pointer flex items-center justify-between rounded-lg snap-start ${isSelected
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold pl-5 lg:pl-6 shadow-md shadow-teal-500/20'
                      : 'bg-white/80 text-slate-700 hover:bg-teal-50 hover:text-teal-900 border border-slate-200/80'
                      }`}
                  >
                    <div>
                      <div className="text-xs lg:text-sm font-bold uppercase tracking-wider">{item.name}</div>
                      <div className={`text-[9px] lg:text-[10px] font-mono mt-0.5 ${isSelected ? 'text-teal-100' : 'text-teal-700 font-semibold'}`}>
                        {item.region}
                      </div>
                    </div>
                    {isSelected && <span className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-rose-400 animate-ping shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center 3D Interactive Human Atlas WebGL Canvas */}
          <div className="lg:col-span-4 relative bg-white/90 border border-teal-200 p-6 flex flex-col items-center justify-between overflow-hidden shadow-lg rounded-xl">
            <div className="w-full flex items-center justify-between text-xs font-mono text-slate-600 z-10">
              <span className="font-bold text-teal-700">ANATOMICAL 3D NODE</span>
              <span className="text-teal-900 font-extrabold bg-teal-100 px-2 py-0.5 rounded">{selectedRegion.region}</span>
            </div>

            <HumanAtlas3D selectedOrganId={selectedRegionId} onSelectOrgan={(id) => setSelectedRegionId(id)} />

            <div className="w-full text-center text-xs font-mono font-bold text-slate-900 z-10 bg-teal-50/90 py-2 rounded-md border border-teal-200">
              {selectedRegion.name} SYSTEM · CLICK NODES TO EXPLORE
            </div>
          </div>

          {/* Right Clinical Details & Actions */}
          <motion.div
            key={selectedRegionId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 space-y-6"
          >
            <div>
              <span className="text-xs font-mono text-teal-700 uppercase tracking-wider font-bold bg-teal-100 px-2.5 py-1 rounded-md">
                {selectedDept.tagline}
              </span>
              <h3 className="font-card-title font-extrabold text-slate-900 uppercase tracking-tight mt-3 font-sans">
                {selectedDept.name}
              </h3>
              <p className="font-body-editorial text-slate-700 font-normal mt-3 leading-relaxed">
                {selectedDept.description}
              </p>
            </div>

            {/* Lead Chair */}
            <div className="p-4 bg-white/90 border border-teal-200 rounded-lg shadow-sm">
              <div className="text-[10px] font-mono text-teal-800 uppercase font-bold">Lead Clinical Chair</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{selectedDept.leadConsultant}</div>
            </div>

            {/* Key Interventions */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-900 font-bold uppercase">Key Interventions:</div>
              <ul className="space-y-2">
                {selectedDept.keyServices.map((service) => (
                  <li key={service} className="text-xs text-slate-700 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action */}
            <div className="pt-4 border-t border-teal-500/20">
              <button
                onClick={() => openAppointmentModal({ specialityId: selectedDept.id })}
                onMouseEnter={() => setCursorMode('book')}
                onMouseLeave={() => setCursorMode('default')}
                className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-mono font-bold uppercase tracking-wider hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group shadow-md shadow-teal-500/20 rounded-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Faculty Consultation</span>
                <ArrowRight className="w-4 h-4 text-teal-200 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

