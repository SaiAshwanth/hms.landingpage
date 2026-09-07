import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../stores/uiStore';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const OpeningLoader: React.FC = () => {
  const { isLoaderFinished, setLoaderFinished } = useUIStore();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setLoaderFinished(true);
      return;
    }

    const timer = setTimeout(() => {
      setLoaderFinished(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, [prefersReducedMotion, setLoaderFinished]);

  if (isLoaderFinished) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAFBF8] text-[#1B201D]"
      >
        <div className="text-center space-y-4 max-w-sm px-4">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-extrabold tracking-widest uppercase font-sans text-[#1B201D]"
          >
            AURELIA NOVA
          </motion.div>

          <div className="text-[10px] font-mono tracking-widest text-[#7DB99A] uppercase">
            Institute of Care • Blueprint Initializing
          </div>

          {/* Blueprint Care Line Vector Draw Animation */}
          <div className="w-48 h-8 mx-auto relative flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 200 40" fill="none">
              <motion.path
                d="M 0 20 L 70 20 L 85 5 L 100 35 L 115 10 L 130 20 L 200 20"
                stroke="#7DB99A"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
              />
            </svg>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
