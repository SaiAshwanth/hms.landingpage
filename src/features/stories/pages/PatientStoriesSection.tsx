import React from 'react';
import { PATIENT_STORIES } from '../data/stories';
import { ScrollWordHighlight } from '../../../components/motion/ScrollWordHighlight';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export const PatientStoriesSection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-[#FAFBF8] via-[#F0FDFA] to-[#FAFBF8] text-slate-900 relative z-10 border-t border-teal-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title with Scroll Word Activation */}
        <div className="mb-16">
          <div className="inline-block text-xs font-mono tracking-widest text-teal-700 font-bold uppercase mb-3 px-3 py-1 bg-teal-100/80 rounded-md border border-teal-300">
            05 / HUMAN OUTCOMES
          </div>
          <ScrollWordHighlight
            text="CARE IS MORE THAN MEDICINE."
            className="font-section-title font-extrabold tracking-tighter text-slate-900 uppercase font-sans"
          />
          <p className="font-body-editorial text-slate-700 font-normal mt-3 max-w-xl">
            Real patient experience narratives illustrating clinical excellence combined with deep human empathy.
          </p>
        </div>

        {/* Stories Horizontal Layout */}
        <div className="space-y-12">
          {PATIENT_STORIES.map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/90 p-6 sm:p-8 rounded-2xl border border-teal-200 shadow-lg relative overflow-hidden"
            >
              {/* Left Color Accent Border */}
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-teal-500 via-emerald-500 to-rose-500" />

              {/* Large Portrait */}
              <div className="lg:col-span-4 relative h-72 sm:h-80 overflow-hidden rounded-xl group shadow-md border border-teal-100">
                <img
                  src={story.image}
                  alt={story.patientName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-3 py-1 text-xs font-mono font-bold uppercase rounded-md shadow-md">
                  {story.department}
                </div>
              </div>

              {/* Narrative Quote & Text */}
              <div className="lg:col-span-8 space-y-4">
                <Quote className="w-8 h-8 text-rose-500 fill-rose-100" />

                <blockquote className="font-card-title font-extrabold text-slate-900 leading-snug tracking-tight font-sans">
                  "{story.quote}"
                </blockquote>

                <p className="font-body-editorial text-slate-700 font-normal leading-relaxed max-w-2xl">
                  {story.storySnippet}
                </p>

                <div className="pt-4 flex flex-wrap items-center justify-between text-xs font-mono border-t border-teal-100">
                  <div className="text-slate-700">
                    <strong className="text-slate-900 font-extrabold text-sm">{story.patientName}</strong> • <span className="text-teal-800 font-bold">{story.location}</span>
                  </div>
                  <div className="text-emerald-700 font-extrabold uppercase bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                    {story.treatment} ({story.recoveringTime})
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

