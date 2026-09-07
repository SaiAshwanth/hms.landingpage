import React, { useState } from 'react';
import { DOCTORS_DATA } from '../data/doctors';
import { useUIStore } from '../../../stores/uiStore';
import { ScrollBackgroundText } from '../../../components/motion/ScrollBackgroundText';
import { ScrollSlideIn } from '../../../components/motion/ScrollSlideIn';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DoctorsPreviewSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { openAppointmentModal } = useUIStore();
  const currentDoctor = DOCTORS_DATA[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DOCTORS_DATA.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DOCTORS_DATA.length) % DOCTORS_DATA.length);
  };

  return (
    <section id="doctors" className="py-24 bg-gradient-to-b from-[#FAFBF8] via-[#F0FDFA] to-[#FAFBF8] text-slate-900 relative z-10 border-t border-teal-500/20 overflow-hidden">
      {/* Kinetic Background Scrolling Text */}
      <ScrollBackgroundText text="WORLD CLASS CONSULTANTS • CLINICAL LEADERSHIP" direction="left" topOffset="top-8" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <ScrollSlideIn from="right">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-block text-xs font-mono tracking-widest text-teal-700 font-bold uppercase mb-3 px-3 py-1 bg-teal-100/80 rounded-md border border-teal-300">
                03 / PEOPLE
              </div>
              <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-slate-900 uppercase font-sans">
                THE PEOPLE BEHIND <br /> <span className="text-teal-600">THE MEDICINE.</span>
              </h2>
            </div>

            {/* Slide Navigation Controls */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-teal-900 font-bold mr-2 bg-teal-50 px-3 py-1.5 rounded-md border border-teal-200">
                0{currentIndex + 1} / 0{DOCTORS_DATA.length}
              </span>
              <button
                onClick={handlePrev}
                className="p-3 bg-white border border-teal-300 text-teal-800 hover:bg-teal-600 hover:text-white rounded-lg transition-colors cursor-pointer shadow-sm active:scale-95"
                aria-label="Previous consultant"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 bg-white border border-teal-300 text-teal-800 hover:bg-teal-600 hover:text-white rounded-lg transition-colors cursor-pointer shadow-sm active:scale-95"
                aria-label="Next consultant"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </ScrollSlideIn>

        {/* Full Editorial Doctor Magazine Feature */}
        <div className="relative min-h-[480px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDoctor.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white/95 text-slate-900 p-8 sm:p-12 shadow-2xl rounded-2xl border border-teal-200 relative overflow-hidden"
            >
              
              {/* Top Color Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-rose-500" />

              {/* Left Large Portrait */}
              <div className="lg:col-span-5 relative h-96 sm:h-[460px] rounded-xl overflow-hidden shadow-lg border border-teal-100 group">
                <img
                  src={currentDoctor.image}
                  alt={currentDoctor.name}
                  className="w-full h-full object-cover object-top group-hover:scale-108 transition-all duration-700"
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-3.5 py-1 text-xs font-mono font-bold uppercase rounded-md shadow-md">
                  {currentDoctor.speciality.split('&')[0]}
                </div>
              </div>

              {/* Right Profile & Details */}
              <div className="lg:col-span-7 space-y-6 flex flex-col justify-between h-full">
                
                <div className="space-y-4">
                  <div className="text-xs font-mono text-teal-700 uppercase tracking-widest font-bold bg-teal-50 px-3 py-1 rounded-md inline-block border border-teal-200">
                    {currentDoctor.title}
                  </div>

                  <h3 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight font-sans">
                    {currentDoctor.name}
                  </h3>

                  <blockquote className="text-lg sm:text-xl font-medium italic text-teal-800 border-l-4 border-l-teal-500 pl-4 my-4 bg-teal-50/50 py-2 rounded-r-md">
                    "{currentDoctor.quote}"
                  </blockquote>

                  <p className="text-sm text-slate-700 font-normal leading-relaxed max-w-xl">
                    {currentDoctor.bio}
                  </p>

                  {/* Experience & Qualifications */}
                  <div className="pt-4 grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <span className="text-emerald-700 block font-extrabold text-base font-mono">
                        {currentDoctor.experience}+ YEARS
                      </span>
                      <span className="text-slate-600 font-bold">Clinical Leadership</span>
                    </div>
                    <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                      <span className="text-cyan-800 block font-extrabold text-xs">
                        {currentDoctor.languages.join(', ')}
                      </span>
                      <span className="text-slate-600 font-bold">Languages Spoken</span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="pt-6 border-t border-teal-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs font-mono text-slate-600">
                    Outpatient Days: <strong className="text-teal-800 font-bold">{currentDoctor.availableDays.join(' • ')}</strong>
                  </div>

                  <button
                    onClick={() => openAppointmentModal({ doctorId: currentDoctor.id, specialityId: currentDoctor.specialityId })}
                    className="px-6 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-mono font-bold uppercase tracking-wider hover:from-teal-700 hover:to-emerald-700 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 rounded-lg shadow-md shadow-teal-500/20"
                  >
                    <Calendar className="w-4 h-4 text-white" />
                    <span>Request Visit With Doctor</span>
                  </button>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

