import React from 'react';
import { Button } from '../../../components/ui/Button';
import { MagneticButton } from '../../../components/ui/MagneticButton';
import { useUIStore } from '../../../stores/uiStore';
import { Calendar, ArrowRight } from 'lucide-react';

interface SpecialityActionsProps {
  specialityId: string;
}

export const SpecialityActions: React.FC<SpecialityActionsProps> = ({ specialityId }) => {
  const { openAppointmentModal } = useUIStore();

  const handleBookSpeciality = () => {
    openAppointmentModal({ specialityId });
  };

  const handleScrollToDoctors = () => {
    const el = document.getElementById('doctors');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
      <MagneticButton
        variant="primary"
        size="md"
        icon={<Calendar className="w-4 h-4" />}
        onClick={handleBookSpeciality}
      >
        Book Faculty Consultation
      </MagneticButton>

      <Button
        variant="outline"
        size="md"
        icon={<ArrowRight className="w-4 h-4" />}
        iconPosition="right"
        onClick={handleScrollToDoctors}
      >
        Meet Department Consultants
      </Button>
    </div>
  );
};
