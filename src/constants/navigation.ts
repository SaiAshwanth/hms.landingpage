import type { NavigationItem } from '../types/navigation';

export const MAIN_NAV_ITEMS: NavigationItem[] = [
  { label: 'Hospital', href: '#overview' },
  { label: 'Departments', href: '#departments' },
  { label: 'Doctors', href: '#doctors' },
  { label: 'Technology', href: '#technology' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Patient Care', href: '#services' },
];

export const FOOTER_QUICK_LINKS = [
  { label: 'About Aurelia Nova', href: '#overview' },
  { label: 'Medical Specialities', href: '#departments' },
  { label: 'Consultant Directory', href: '#doctors' },
  { label: 'Advanced Diagnostics', href: '#technology' },
  { label: 'Patient Facilities', href: '#facilities' },
  { label: 'Executive Health Checkups', href: '#wellness' },
  { label: 'Campus Map & Access', href: '#campus' },
];

export const FOOTER_PATIENT_SERVICES = [
  { label: '24/7 Emergency Care', href: '#emergency' },
  { label: 'Book Consultation', href: '#appointment' },
  { label: 'Insurance & Cashless Desk', href: '#services' },
  { label: 'International Patients', href: '#services' },
  { label: 'Diagnostic Records', href: '#services' },
  { label: 'Visitor Guidelines', href: '#services' },
];
