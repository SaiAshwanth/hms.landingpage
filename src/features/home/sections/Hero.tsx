import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useUIStore } from '../../../stores/uiStore';
import { HeroHeart3D } from '../../../components/visual/HeroHeart3D';
import { ScrollBackgroundText } from '../../../components/motion/ScrollBackgroundText';
import { ArrowRight, Users, Shield, Heart, TrendingUp } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { openAppointmentModal, setCursorMode } = useUIStore();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const textYProgress = useTransform(scrollYProgress, [0, 1], [0, -60]);

  // Live heart rate simulation for stats display
  const [bpm, setBpm] = useState(72);
  useEffect(() => {
    const interval = setInterval(() => {
      setBpm(prev => 70 + Math.floor(Math.random() * 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-6 overflow-hidden bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white"
    >
      {/* 3D Animated Anatomical Human Heart Canvas */}
      <HeroHeart3D scrollProgress={0} />

      {/* Kinetic Background Scrolling Watermark Text */}
      <ScrollBackgroundText text="AURELIA NOVA • MEDICINE REIMAGINED" direction="right" topOffset="top-36" />

      {/* Soft Vignette / Lighting Gradient Overlays for High-End Hospital Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50/90 via-slate-50/40 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50/80 pointer-events-none z-0" />

      {/* FLOATING TELEMETRY & BACKGROUND WATERMARKS (Right & Center Background) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Center Telemetry Label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-28 left-[42%] hidden lg:flex flex-col gap-0.5 text-[10px] font-mono tracking-[0.25em] text-slate-500 font-medium uppercase"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/70" />
            <span>PRECISION</span>
          </div>
          <div className="pl-3.5">PEOPLE</div>
          <div className="pl-3.5">POSSIBILITIES</div>
          <div className="mt-1 w-12 h-[1px] bg-slate-300/60" />
        </motion.div>

        {/* Upper Right Headline Telemetry */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.75, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute top-36 right-16 hidden lg:flex flex-col text-right text-[11px] font-mono tracking-[0.2em] text-slate-500 uppercase leading-snug font-semibold"
        >
          <span>HEALTHIER</span>
          <span>HEARTS</span>
          <span>BRIGHTER</span>
          <span>TOMORROWS</span>
        </motion.div>

        {/* Far Right Wall Watermark */}
        <div className="absolute top-[48%] right-8 hidden lg:flex flex-col text-right text-[12px] font-mono tracking-[0.3em] text-slate-300/80 uppercase leading-relaxed font-light">
          <span>SCIENCE</span>
          <span>KINDNESS</span>
          <span>HUMANITY</span>
          <span>ALWAYS</span>
        </div>

        {/* Center Wall Background Watermark */}
        <div className="absolute bottom-[32%] left-[42%] hidden lg:flex flex-col text-[11px] font-mono tracking-[0.2em] text-slate-400/60 uppercase leading-tight font-medium">
          <span className="font-bold text-slate-500/70">AURELIA NOVA</span>
          <span>HEALING LIVES</span>
          <span>INSPIRING TOMORROWS</span>
        </div>

        {/* Live Vitals Diagnostic Telemetry Box (Bottom Right) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-28 right-12 hidden md:block bg-white/75 backdrop-blur-md border border-slate-200/80 p-3.5 rounded-sm shadow-xs text-[11px] font-mono text-slate-600 min-w-[170px]"
        >
          <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
            <span className="text-slate-400 uppercase">HR</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              {bpm} <span className="text-[9px] text-slate-400 font-normal">bpm</span>
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
            <span className="text-slate-400 uppercase">SpO₂</span>
            <span className="font-bold text-slate-900">
              98 <span className="text-[9px] text-slate-400 font-normal">%</span>
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
            <span className="text-slate-400 uppercase">BP</span>
            <span className="font-bold text-slate-900">
              120/80 <span className="text-[9px] text-slate-400 font-normal">mmHg</span>
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400 uppercase">TEMP</span>
            <span className="font-bold text-slate-900">
              36.6 <span className="text-[9px] text-slate-400 font-normal">°C</span>
            </span>
          </div>
        </motion.div>

        {/* Bottom Right Corner Watermark */}
        <div className="absolute bottom-10 right-12 hidden md:block text-right text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase font-light">
          A BRIGHTER, HEALTHIER YOU
        </div>
      </div>

      {/* MAIN CONTAINER (Left Editorial Column) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto pt-4 pb-12">
        <motion.div style={{ y: textYProgress }} className="max-w-2xl space-y-6">
          
          {/* Eyebrow Label with Dash Accent */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3"
          >
            <div className="flex flex-col">
              <span className="text-[11px] font-mono tracking-[0.25em] text-slate-900 font-bold uppercase">
                AURELIA NOVA
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-[0.2em] text-slate-500 font-medium uppercase">
                  ADVANCED MULTISPECIALITY CARE
                </span>
                <span className="w-8 h-[1px] bg-slate-400 inline-block" />
              </div>
            </div>
          </motion.div>

          {/* Headline Matching Exact Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="space-y-1"
          >
            <h1 className="font-sans font-extrabold text-5xl sm:text-6xl lg:text-[72px] tracking-tight leading-[0.98] text-[#0F172A] uppercase">
              MEDICINE,
              <br />
              REIMAGINED
              <br />
              <span className="text-[#0F172A]">AROUND YOU.</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-slate-600 text-base sm:text-lg font-normal max-w-lg leading-relaxed pt-1"
          >
            World-class expertise. Human-first care.
            <br />
            A healthier tomorrow, built for you today.
          </motion.p>

          {/* Pill Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-wrap items-center gap-4 pt-3"
          >
            <button
              onClick={() => openAppointmentModal()}
              onMouseEnter={() => setCursorMode('book')}
              onMouseLeave={() => setCursorMode('default')}
              className="px-7 py-3.5 bg-[#1B494D] hover:bg-[#13383C] text-white font-mono text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer shadow-md flex items-center gap-3 rounded-full group"
            >
              <span>BOOK AN APPOINTMENT</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href="#at-a-glance"
              onMouseEnter={() => setCursorMode('explore')}
              onMouseLeave={() => setCursorMode('default')}
              className="px-7 py-3.5 bg-white/90 hover:bg-slate-100 border border-slate-300 text-slate-800 font-mono text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer flex items-center gap-3 rounded-full group shadow-xs"
            >
              <span>EXPLORE AURELIA</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>

          {/* 4 Feature Badges Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200/80 max-w-xl"
          >
            <div className="flex items-center gap-2.5 pr-2 sm:border-r border-slate-200">
              <Users className="w-4 h-4 text-slate-700 shrink-0" />
              <span className="text-[11px] font-medium text-slate-700 leading-tight">
                Expert<br />Specialists
              </span>
            </div>

            <div className="flex items-center gap-2.5 pr-2 sm:border-r border-slate-200">
              <Shield className="w-4 h-4 text-slate-700 shrink-0" />
              <span className="text-[11px] font-medium text-slate-700 leading-tight">
                Advanced<br />Technology
              </span>
            </div>

            <div className="flex items-center gap-2.5 pr-2 sm:border-r border-slate-200">
              <Heart className="w-4 h-4 text-slate-700 shrink-0" />
              <span className="text-[11px] font-medium text-slate-700 leading-tight">
                Compassionate<br />Patient Care
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-slate-700 shrink-0" />
              <span className="text-[11px] font-medium text-slate-700 leading-tight">
                Better<br />Tomorrows
              </span>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* BOTTOM BLUEPRINT LINE & FOOTER STRIP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pt-4 border-t border-slate-200/60 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.2em] text-slate-500 uppercase font-medium">
          <span className="w-6 h-[1px] bg-slate-400" />
          <span>PEOPLE</span>
          <span className="text-slate-300">|</span>
          <span>SCIENCE</span>
          <span className="text-slate-300">|</span>
          <span>A HEALTHIER TOMORROW</span>
        </div>
      </div>
    </section>
  );
};



