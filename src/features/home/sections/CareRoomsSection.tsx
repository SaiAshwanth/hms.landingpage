import React, { useRef } from 'react';
import { useUIStore } from '../../../stores/uiStore';
import { TextReveal } from '../../../components/motion/TextReveal';
import { ScrollBackgroundText } from '../../../components/motion/ScrollBackgroundText';
import { ScrollSlideIn } from '../../../components/motion/ScrollSlideIn';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CARE_ROOMS = [
  {
    number: '01',
    name: 'HEART ROOM',
    title: 'Cardiology & Cardiac Sciences',
    specialityId: 'cardiology',
    description: 'Equipped with hybrid electro-physiology labs, 3D echocardiography, and sub-millimeter coronary surgical suites.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    capacity: '40 Cardiac Beds',
  },
  {
    number: '02',
    name: 'MIND ROOM',
    title: 'Neurology & Neurosciences',
    specialityId: 'neurology',
    description: 'Featuring 3.0T functional intraoperative MRI, neuro-vascular intervention, and video EEG telemetry.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    capacity: '35 Neuro Beds',
  },
  {
    number: '03',
    name: 'MOTION ROOM',
    title: 'Orthopedics & Sports Medicine',
    specialityId: 'orthopaedics',
    description: 'Robotic arm navigation systems for joint reconstruction, sports ligament restoration, and spine fusion.',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
    capacity: '50 Joint Beds',
  },
  {
    number: '04',
    name: 'BEGINNING ROOM',
    title: "Women's & Children's Health",
    specialityId: 'obstetrics',
    description: 'Acoustic-insulated birthing suites, 4D fetal ultrasonography, and 24/7 neonatal intensive care.',
    image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1200&q=80',
    capacity: '35 Maternity Suites',
  },
  {
    number: '05',
    name: 'VISION ROOM',
    title: 'Ophthalmology & Refractive Care',
    specialityId: 'oncology',
    description: 'Precision femtosecond laser suites, micro-incisional cataract surgery, and retinal angiography.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    capacity: 'Laser Surgery Suite',
  },
  {
    number: '06',
    name: 'RECOVERY ROOM',
    title: 'Rehabilitation & Inpatient Care',
    specialityId: 'gastroenterology',
    description: 'Light-filled healing suites with private garden views, dedicated clinical nutritionists, and physical therapy.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    capacity: 'Private Inpatient Suites',
  },
];

export const CareRoomsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { openAppointmentModal, setCursorMode } = useUIStore();

  return (
    <section id="care-rooms" className="py-32 bg-soft-ivory text-graphite relative z-10 border-t border-graphite/10 overflow-hidden">
      {/* Background Kinetic Text */}
      <ScrollBackgroundText text="SPACES OF HEALING • RECOVERY SUITES" direction="right" topOffset="top-16" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollSlideIn from="right" className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-mono tracking-widest text-deep-forest uppercase mb-3 font-bold">
              03 / CARE ROOMS
            </div>
            <TextReveal
              text="SPACES OF HEALING"
              as="h2"
              className="font-section-title font-extrabold tracking-tighter text-graphite uppercase font-sans"
            />
          </div>

          <div className="text-xs font-mono text-graphite/60 flex items-center gap-2">
            <span>SWIPE / SCROLL HORIZONTALLY</span>
            <ChevronRight className="w-4 h-4 text-aurelia-green animate-pulse" />
          </div>
        </ScrollSlideIn>

        {/* Horizontal Scroll Environment Sequence Container */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setCursorMode('drag')}
          onMouseLeave={() => setCursorMode('default')}
          className="flex gap-6 overflow-x-auto pb-8 scrollbar-none cursor-grab active:cursor-grabbing snap-x snap-mandatory"
        >
          {CARE_ROOMS.map((room, idx) => (
            <motion.div
              key={room.number}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="min-w-[82vw] sm:min-w-[420px] lg:min-w-[480px] bg-graphite text-clinical p-6 sm:p-8 flex flex-col justify-between h-[480px] sm:h-[520px] snap-start relative overflow-hidden shadow-2xl group flex-shrink-0 rounded-lg border border-white/10"
            >
              <img
                src={room.image}
                alt={room.name}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/60 to-transparent" />

              <div className="relative z-10 flex items-center justify-between text-xs font-mono text-aurelia-green">
                <span className="font-bold">{room.number} / 06</span>
                <span className="bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full">{room.capacity}</span>
              </div>

              <div className="relative z-10 space-y-4">
                <span className="text-xs font-mono text-aurelia-green uppercase font-bold tracking-wider">
                  {room.title}
                </span>
                <h3 className="font-card-title font-extrabold text-clinical uppercase tracking-tight font-sans text-2xl">
                  {room.name}
                </h3>
                <p className="font-body-editorial text-warm-stone/90 font-light leading-relaxed text-sm">
                  {room.description}
                </p>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => openAppointmentModal({ specialityId: room.specialityId })}
                    className="text-xs font-mono font-bold uppercase text-aurelia-green hover:text-white flex items-center gap-1 cursor-pointer group-hover:translate-x-1 transition-transform"
                  >
                    <span>Consult Room Specialist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
