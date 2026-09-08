import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appointmentSchema, type AppointmentFormValues } from '../schemas/appointmentSchema';
import { DEPARTMENTS_DATA } from '../../departments/data/departments';
import { DOCTORS_DATA } from '../../doctors/data/doctors';
import { useUIStore } from '../../../stores/uiStore';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'
];

interface AppointmentWizardProps {
  isModal?: boolean;
  onCloseModal?: () => void;
}

export const AppointmentWizard: React.FC<AppointmentWizardProps> = ({ isModal = false, onCloseModal }) => {
  const { appointmentPrefill } = useUIStore();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      specialityId: appointmentPrefill?.specialityId || 'cardiology',
      doctorId: appointmentPrefill?.doctorId || 'dr-arjun-mehra',
      appointmentDate: new Date().toISOString().split('T')[0],
      timeSlot: '10:00 AM',
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      patientAge: 32,
      gender: 'male',
      reasonForVisit: 'General health evaluation and consultation',
      isFirstVisit: true,
    },
  });

  const selectedSpecialityId = watch('specialityId');
  const selectedDoctorId = watch('doctorId');
  const selectedDate = watch('appointmentDate');
  const selectedTimeSlot = watch('timeSlot');

  const filteredDoctors = DOCTORS_DATA.filter((d) => d.specialityId === selectedSpecialityId);

  useEffect(() => {
    if (appointmentPrefill?.specialityId) {
      setValue('specialityId', appointmentPrefill.specialityId);
    }
    if (appointmentPrefill?.doctorId) {
      setValue('doctorId', appointmentPrefill.doctorId);
    }
  }, [appointmentPrefill, setValue]);

  const onSubmit = (_data: AppointmentFormValues) => {
    setIsSubmitted(true);
  };

  const handleNextStep = () => {
    if (currentStep < 5) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const selectedDocObj = DOCTORS_DATA.find((d) => d.id === selectedDoctorId);
  const selectedSpecObj = DEPARTMENTS_DATA.find((d) => d.id === selectedSpecialityId);

  return (
    <div className="w-full">

      {isSubmitted ? (
        <div className="p-8 sm:p-12 text-center bg-[#0B0D0C] text-[#FAFAF7] space-y-6 shadow-2xl border border-white/10">
          <div className="w-16 h-16 rounded-full bg-[#8CC8A3]/20 border border-[#8CC8A3]/50 flex items-center justify-center text-[#8CC8A3] mx-auto animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <div className="text-xs font-mono font-bold text-[#8CC8A3] uppercase mb-1 tracking-widest">
              CONSULTATION CONFIRMED
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase font-sans">
              Appointment Reserved
            </h3>
            <p className="text-sm text-[#A7AAA4] font-light mt-2 max-w-md mx-auto">
              Your consultation request with <strong className="text-white">{selectedDocObj?.name}</strong> is scheduled for <strong className="text-white">{selectedDate}</strong> at <strong className="text-white">{selectedTimeSlot}</strong>.
            </p>
          </div>

          <div className="p-4 bg-[#151816] border border-white/10 max-w-md mx-auto text-xs text-[#A7AAA4] space-y-1 text-left font-mono">
            <div className="flex justify-between">
              <span>Speciality:</span>
              <span className="text-white font-bold">{selectedSpecObj?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="text-[#8CC8A3]">Outpatient Block B • Floor 2</span>
            </div>
            <div className="flex justify-between">
              <span>Token Ref:</span>
              <span className="text-[#8CC8A3] font-bold">AN-2026-9842</span>
            </div>
          </div>

          <div className="text-[11px] text-[#A7AAA4] font-light">
            A confirmation SMS & email has been dispatched. Present token at Block B reception upon arrival.
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
                if (onCloseModal) onCloseModal();
              }}
              className="px-6 py-3 border border-white/20 text-[#FAFAF7] text-xs font-mono font-bold uppercase hover:bg-white/10 transition-colors cursor-pointer"
            >
              Close Booking Window
            </button>
          </div>
        </div>
      ) : (
        <div className={`p-6 sm:p-10 border border-[#0B0D0C]/15 bg-[#FAFAF7] text-[#0B0D0C] ${isModal ? 'bg-[#FAFAF7]' : ''}`}>

          {/* Wizard Header & Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#8CC8A3] uppercase tracking-widest">
                  STEP 0{currentStep} OF 05
                </span>
                <h3 className="text-xl font-extrabold uppercase font-sans text-[#0B0D0C]">
                  {currentStep === 1 && 'Select Speciality Faculty'}
                  {currentStep === 2 && 'Select Consultant Physician'}
                  {currentStep === 3 && 'Choose Consultation Date'}
                  {currentStep === 4 && 'Choose Preferred Time Slot'}
                  {currentStep === 5 && 'Patient Details'}
                </h3>
              </div>
              <span className="text-xs font-mono text-[#A7AAA4]">SMART SCHEDULER</span>
            </div>

            {/* Step Progress Line */}
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 transition-all duration-500 ${step <= currentStep
                      ? 'bg-[#0B0D0C]'
                      : 'bg-[#0B0D0C]/15'
                    }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* STEP 1: Select Speciality */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {DEPARTMENTS_DATA.map((dept) => {
                  const isSelected = selectedSpecialityId === dept.id;
                  return (
                    <button
                      type="button"
                      key={dept.id}
                      onClick={() => {
                        setValue('specialityId', dept.id);
                        const firstDoc = DOCTORS_DATA.find((d) => d.specialityId === dept.id);
                        if (firstDoc) setValue('doctorId', firstDoc.id);
                      }}
                      className={`p-4 text-left border transition-all cursor-pointer flex items-center justify-between ${isSelected
                          ? 'bg-[#0B0D0C] text-[#FAFAF7] border-[#0B0D0C]'
                          : 'bg-white border-[#0B0D0C]/15 text-[#0B0D0C] hover:border-[#0B0D0C]'
                        }`}
                    >
                      <div>
                        <div className="text-sm font-bold uppercase">{dept.name}</div>
                        <div className="text-[11px] font-mono opacity-70">{dept.tagline}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#8CC8A3] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* STEP 2: Select Doctor */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {filteredDoctors.length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-[#A7AAA4] text-sm">
                    No doctor available for selected speciality. Please select another speciality.
                  </div>
                ) : (
                  filteredDoctors.map((doc) => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <button
                        type="button"
                        key={doc.id}
                        onClick={() => setValue('doctorId', doc.id)}
                        className={`p-3.5 text-left border transition-all cursor-pointer flex items-center gap-3 ${isSelected
                            ? 'bg-[#0B0D0C] text-[#FAFAF7] border-[#0B0D0C]'
                            : 'bg-white border-[#0B0D0C]/15 text-[#0B0D0C] hover:border-[#0B0D0C]'
                          }`}
                      >
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="w-12 h-12 rounded-none object-cover border border-[#0B0D0C]/20 shrink-0 filter grayscale"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold uppercase truncate">{doc.name}</div>
                          <div className="text-[11px] font-mono opacity-70 truncate">{doc.title}</div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {/* STEP 3: Choose Date */}
            {currentStep === 3 && (
              <div className="space-y-4 max-w-md mx-auto">
                <label className="block text-xs font-mono font-bold text-[#0B0D0C] uppercase">
                  Select Consultation Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  {...register('appointmentDate')}
                  className="w-full p-4 bg-white border border-[#0B0D0C]/20 text-[#0B0D0C] font-mono text-sm focus:outline-none focus:border-[#0B0D0C]"
                />
              </div>
            )}

            {/* STEP 4: Choose Time Slot */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <label className="block text-xs font-mono font-bold text-[#0B0D0C] uppercase">
                  Available Outpatient Slots
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setValue('timeSlot', slot)}
                        className={`p-3 text-center border font-mono text-sm font-bold transition-all cursor-pointer ${isSelected
                            ? 'bg-[#0B0D0C] text-[#FAFAF7] border-[#0B0D0C]'
                            : 'bg-white border-[#0B0D0C]/15 text-[#0B0D0C] hover:border-[#0B0D0C]'
                          }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: Patient Details Form */}
            {currentStep === 5 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#0B0D0C] mb-1">Full Patient Name *</label>
                  <input
                    type="text"
                    {...register('patientName')}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-3 bg-white border border-[#0B0D0C]/20 text-[#0B0D0C] text-sm focus:border-[#0B0D0C] focus:outline-none"
                  />
                  {errors.patientName && <span className="text-[11px] text-rose-500">{errors.patientName.message}</span>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#0B0D0C] mb-1">Email Address *</label>
                  <input
                    type="email"
                    {...register('patientEmail')}
                    placeholder="rahul@example.com"
                    className="w-full p-3 bg-white border border-[#0B0D0C]/20 text-[#0B0D0C] text-sm focus:border-[#0B0D0C] focus:outline-none"
                  />
                  {errors.patientEmail && <span className="text-[11px] text-rose-500">{errors.patientEmail.message}</span>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#0B0D0C] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    {...register('patientPhone')}
                    placeholder="+91 98765 43210"
                    className="w-full p-3 bg-white border border-[#0B0D0C]/20 text-[#0B0D0C] text-sm focus:border-[#0B0D0C] focus:outline-none"
                  />
                  {errors.patientPhone && <span className="text-[11px] text-rose-500">{errors.patientPhone.message}</span>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-mono text-[#0B0D0C] mb-1">Age *</label>
                    <input
                      type="number"
                      {...register('patientAge')}
                      className="w-full p-3 bg-white border border-[#0B0D0C]/20 text-[#0B0D0C] text-sm focus:border-[#0B0D0C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#0B0D0C] mb-1">Gender *</label>
                    <select
                      {...register('gender')}
                      className="w-full p-3 bg-white border border-[#0B0D0C]/20 text-[#0B0D0C] text-sm focus:border-[#0B0D0C] focus:outline-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-[#0B0D0C] mb-1">Reason for Consultation *</label>
                  <textarea
                    rows={2}
                    {...register('reasonForVisit')}
                    placeholder="Briefly describe your symptoms or medical concern..."
                    className="w-full p-3 bg-white border border-[#0B0D0C]/20 text-[#0B0D0C] text-sm focus:border-[#0B0D0C] focus:outline-none"
                  />
                  {errors.reasonForVisit && <span className="text-[11px] text-rose-500">{errors.reasonForVisit.message}</span>}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="pt-6 border-t border-[#0B0D0C]/15 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 text-xs font-mono font-bold uppercase text-[#0B0D0C] hover:bg-[#0B0D0C]/10 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-[#0B0D0C] text-[#FAFAF7] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#8CC8A3] hover:text-[#0B0D0C] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Continue to Step 0{currentStep + 1}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-[#0B0D0C] text-[#FAFAF7] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#8CC8A3] hover:text-[#0B0D0C] transition-colors cursor-pointer"
                >
                  Confirm & Reserve Appointment
                </button>
              )}
            </div>

          </form>

        </div>
      )}

    </div>
  );
};
