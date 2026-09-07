import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../../stores/uiStore';
import { AppointmentWizard } from './AppointmentWizard';
import { X } from 'lucide-react';

export const AppointmentModal: React.FC = () => {
  const { isAppointmentModalOpen, closeAppointmentModal } = useUIStore();

  return (
    <AnimatePresence>
      {isAppointmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAppointmentModal}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl my-8 z-10"
          >
            <button
              onClick={closeAppointmentModal}
              className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <AppointmentWizard isModal onCloseModal={closeAppointmentModal} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
