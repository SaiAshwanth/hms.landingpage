import { z } from 'zod';

export const appointmentSchema = z.object({
  specialityId: z.string().min(1, 'Please select a medical speciality'),
  doctorId: z.string().min(1, 'Please select a consultant physician'),
  appointmentDate: z.string().min(1, 'Please select an appointment date'),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  patientName: z.string().min(2, 'Full name must be at least 2 characters'),
  patientEmail: z.string().email('Please enter a valid email address'),
  patientPhone: z.string().min(10, 'Please enter a valid phone number'),
  patientAge: z.coerce.number().min(1, 'Age is required').max(120, 'Please enter a valid age'),
  gender: z.enum(['male', 'female', 'other'], { message: 'Select gender' }),
  reasonForVisit: z.string().min(5, 'Briefly describe your symptoms or reason for visit'),
  isFirstVisit: z.boolean(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
