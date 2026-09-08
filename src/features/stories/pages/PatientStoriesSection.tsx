import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { type MotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Activity } from 'lucide-react';
import { PATIENT_STORIES } from '../data/stories';

/* ─────────────────────────────────────────────
   Scroll-word-reveal subtitle helpers
───────────────────────────────────────────── */
const ScrollWordSpan: React.FC<{
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}> = ({ word, progress, range }) => {
  const opacity = useTransform(progress, range, [0.1, 1]);
  const y = useTransform(progress, range, [16, 0]);
  const isColored = ['MORE', 'THAN', 'MEDICINE.'].includes(word);
  return (
    <motion.span
      style={{ opacity, y }}
      className={`inline-block transition-colors duration-200 ${isColored ? 'text-teal-600' : 'text-slate-900'}`}
    >
      {word}
    </motion.span>
  );
};

const ScrollTitle: React.FC<{ text: string }> = ({ text }) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.35'],
  });
  const words = text.split(' ');
  return (
    <h2
      ref={ref}
      className="font-section-title font-extrabold tracking-tighter uppercase font-sans flex flex-wrap gap-x-[0.22em] gap-y-[0.05em] leading-none"
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <ScrollWordSpan key={i} word={word} progress={scrollYProgress} range={[start, end]} />
        );
      })}
    </h2>
  );
};

/* ─────────────────────────────────────────────
   Story Card
───────────────────────────────────────────── */
const TOTAL = PATIENT_STORIES.length;

interface CardProps {
  story: (typeof PATIENT_STORIES)[0];
  offset: number; // 0 = active, 1 = right-behind, 2 = further behind
}

const StoryCard: React.FC<CardProps> = ({ story, offset }) => {
  const isActive = offset === 0;

  return (
    <motion.div
      layout
      animate={{
        x: offset === 0 ? '0%' : offset === 1 ? '8%' : '15%',
        y: offset === 0 ? '0%' : offset === 1 ? '-3%' : '-6%',
        rotateY: offset === 0 ? 0 : offset === 1 ? -8 : -14,
        scale: offset === 0 ? 1 : offset === 1 ? 0.92 : 0.84,
        opacity: offset === 0 ? 1 : offset === 1 ? 0.6 : 0.3,
        zIndex: offset === 0 ? 30 : offset === 1 ? 20 : 10,
        filter: offset === 0 ? 'blur(0px)' : `blur(${offset}px)`,
      }}
      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      className="absolute top-0 left-0 w-full h-full origin-left"
      style={{ perspective: 900, transformStyle: 'preserve-3d' }}
    >
      {/* Glass card */}
      <div
        className={`relative w-full h-full rounded-3xl overflow-hidden flex flex-col border shadow-2xl
          ${isActive
            ? 'bg-white/96 border-teal-200/80 shadow-teal-300/30'
            : 'bg-white/75 border-white/50'
          }`}
        style={{
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
        }}
      >
        {/* ── Photo header ── */}
        <div className="relative flex-1 overflow-hidden">
          <img
            src={story.image}
            alt={story.patientName}
            className={`w-full h-full object-cover object-center transition-transform duration-700 ${isActive ? 'scale-100' : 'scale-110'}`}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10" />

          {/* Department pill */}
          <motion.div
            initial={false}
            animate={{ opacity: isActive ? 1 : 0.6 }}
            className="absolute top-4 left-4 bg-teal-500 text-white text-[9px] font-extrabold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full shadow-lg"
          >
            {story.department}
          </motion.div>

          {/* Quote bubble */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 border border-teal-100 flex items-center justify-center shadow-md">
            <span className="text-teal-500 text-2xl font-black leading-none" style={{ fontFamily: 'Georgia, serif' }}>
              "
            </span>
          </div>
        </div>

        {/* ── Quote body ── */}
        <div className="flex-shrink-0 flex flex-col p-3 gap-2">
          <blockquote className="text-slate-800 font-bold text-sm leading-snug tracking-tight">
            "{story.quote}"
          </blockquote>

          {/* Attribution */}
          <div className="pt-3 border-t border-teal-100 flex items-center justify-between">
            <div>
              <p className="text-[9px] tracking-[0.22em] uppercase text-slate-400 font-mono mb-0.5">
                A Real Patient
              </p>
              <p className="text-[9px] tracking-[0.18em] uppercase text-slate-400 font-mono">
                {story.department}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-teal-200 bg-teal-50 flex items-center justify-center">
              <Activity className="w-4 h-4 text-teal-500" />
            </div>
          </div>
        </div>

        {/* Bottom gradient strip */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-300" />
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Main Section Export
───────────────────────────────────────────── */
export const PatientStoriesSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  /* Auto-play */
  useEffect(() => {
    const t = setInterval(() => setActiveIndex((p) => (p + 1) % TOTAL), 4800);
    return () => clearInterval(t);
  }, []);

  const prev = useCallback(() => setActiveIndex((p) => (p - 1 + TOTAL) % TOTAL), []);
  const next = useCallback(() => setActiveIndex((p) => (p + 1) % TOTAL), []);

  /* Scroll-driven entrance animations */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.95', 'start 0.3'],
  });
  const leftX = useTransform(scrollYProgress, [0, 1], [-70, 0]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.65], [0, 1]);
  const rightX = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const rightOpacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const rightScale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  return (
    <section
      ref={sectionRef}
      id="patient-stories"
      className="relative overflow-hidden py-6 border-t border-teal-500/20"
      style={{
        background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 45%, #f0fdf4 100%)',
      }}
    >
      {/* ── Background decorations ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Radial teal glow — top left */}
        <div
          className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(45,212,191,0.18) 0%, transparent 65%)',
          }}
        />
        {/* Radial cyan glow — bottom right */}
        <div
          className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(103,232,249,0.14) 0%, transparent 65%)',
          }}
        />
        {/* ECG heartbeat line */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full opacity-[0.08]"
          viewBox="0 0 1440 80"
          fill="none"
          preserveAspectRatio="none"
        >
          <polyline
            points="0,40 180,40 240,10 280,68 320,18 365,62 410,40 580,40 640,10 680,68 720,18 765,62 810,40 1440,40"
            stroke="#0d9488"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        {/* Stethoscope rings */}
        <div className="absolute bottom-10 left-8 w-52 h-52 rounded-full border border-teal-400/20" />
        <div className="absolute bottom-16 left-14 w-36 h-36 rounded-full border border-teal-300/15" />
        <div className="absolute bottom-22 left-20 w-20 h-20 rounded-full border border-teal-200/10" />
        {/* Floating heart */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-24 left-32 w-16 h-16 opacity-20"
        >
          <svg viewBox="0 0 64 64" fill="none">
            <path
              d="M32 56S8 38 8 22a12 12 0 0124 0 12 12 0 0124 0c0 16-24 34-24 34z"
              fill="none"
              stroke="#0d9488"
              strokeWidth="2.5"
            />
          </svg>
        </motion.div>
        {/* Neon heart with ECG */}
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/3 top-1/2 -translate-y-1/2 opacity-10 w-32 h-32 pointer-events-none"
        >
          <svg viewBox="0 0 100 100" fill="none">
            <path
              d="M50 85S15 62 15 38a18 18 0 0135 0 18 18 0 0135 0c0 24-35 47-35 47z"
              fill="none"
              stroke="#14b8a6"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
          </svg>
        </motion.div>
      </div>

      {/* ── Content grid ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">

          {/* ── LEFT: Text panel ── */}
          <motion.div
            style={{ x: leftX, opacity: leftOpacity }}
            className="flex flex-col gap-3"
          >
            {/* Eyebrow label */}
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-teal-600" />
              <span className="text-[10px] tracking-[0.3em] uppercase font-mono font-bold text-teal-700">
                Real Patient Experiences
              </span>
            </div>

            {/* Scroll-animated headline */}
            <ScrollTitle text="CARE IS MORE THAN MEDICINE." />

            {/* Subtext */}
            <p className="font-body-editorial text-slate-600 max-w-sm leading-relaxed">
              Real patient experiences illustrating clinical excellence combined with deep human empathy.
            </p>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-4 w-fit group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full border-2 border-teal-600 flex items-center justify-center bg-teal-600/10 group-hover:bg-teal-600 transition-all duration-300 shadow-md flex-shrink-0">
                <Play className="w-5 h-5 text-teal-700 group-hover:text-white fill-current transition-colors duration-300 translate-x-0.5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-extrabold text-slate-900 tracking-[0.12em] uppercase">
                  Watch Real Stories
                </p>
                <p className="text-[10px] text-slate-500 font-mono tracking-wide mt-0.5">
                  People. Care. Impact.
                </p>
              </div>
            </motion.button>

            {/* Footer labels */}
            <div className="flex items-center gap-6 pt-2 border-t border-teal-200/50">
              {['People', 'Care', 'Better Tomorrows'].map((label, i) => (
                <React.Fragment key={label}>
                  {i > 0 && <div className="w-px h-3.5 bg-teal-300/50" />}
                  <span className="text-[10px] tracking-[0.22em] uppercase font-mono text-slate-500">
                    {label}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: 3-D Card carousel ── */}
          <motion.div
            style={{ x: rightX, opacity: rightOpacity, scale: rightScale }}
            className="flex flex-col items-center gap-3 relative"
          >
            {/* Perspective container */}
            <div
              className="relative w-full max-w-[290px] sm:max-w-[340px] mx-auto"
              style={{ height: 490, perspective: 1100, perspectiveOrigin: 'center center' }}
            >
              {PATIENT_STORIES.map((story, i) => {
                let offset = i - activeIndex;
                if (offset < 0) offset += TOTAL;
                if (offset > 2) return null;
                return <StoryCard key={story.id} story={story} offset={offset} />;
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                onClick={prev}
                className="w-9 h-9 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:border-teal-500 hover:text-teal-600 transition-all shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>

              {/* Pill dots */}
              <div className="flex items-center gap-2">
                {PATIENT_STORIES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className="cursor-pointer"
                  >
                    <motion.div
                      animate={{
                        width: i === activeIndex ? 24 : 10,
                        backgroundColor: i === activeIndex ? '#0d9488' : '#cbd5e1',
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-2.5 rounded-full"
                    />
                  </button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                onClick={next}
                className="w-9 h-9 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:border-teal-500 hover:text-teal-600 transition-all shadow-sm cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* "Stories that Heal" script watermark */}
            <div className="absolute -bottom-6 right-0 pointer-events-none select-none">
              <span
                className="text-3xl font-bold text-teal-600/20"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
              >
                Stories that Heal
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

