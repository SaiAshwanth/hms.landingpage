export type ChapterId =
  | '01 / ARRIVE'
  | '02 / DISCOVER'
  | '03 / MEET'
  | '04 / UNDERSTAND'
  | '05 / EXPERIENCE'
  | '06 / CARE'
  | '07 / CONNECT';

export type CursorMode = 'default' | 'explore' | 'view' | 'drag' | 'book' | 'emergency';

export type Doctor = {
  id: string;
  name: string;
  title: string;
  speciality: string;
  specialityId: string;
  qualifications: string[];
  experience: number;
  languages: string[];
  rating: number;
  availableDays: string[];
  image: string;
  bio: string;
  quote: string;
  keyTreatments: string[];
  isChiefConsultant?: boolean;
};

export type Department = {
  id: string;
  name: string;
  roomName?: string;
  roomNumber?: string;
  tagline: string;
  description: string;
  iconName?: string;
  leadConsultant: string;
  keyServices: string[];
  availableDiagnostics: string[];
  anatomicalRegion?: string;
  bgImage?: string;
  stats: {
    surgeriesPerYear?: string;
    bedCapacity?: string;
    successRate?: string;
  };
};

export type Facility = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  features: string[];
  operatingHours: string;
};

export type TechnologyItem = {
  id: string;
  name: string;
  nodeName?: string;
  category: string;
  description: string;
  clinicalImpact: string;
  iconName?: string;
  visualType?: 'mri' | 'ai-imaging' | 'robotic' | 'pathology' | 'telemetry';
  technicalDetails?: string[];
  stats: { label: string; value: string }[];
};

export type HealthPackage = {
  id: string;
  name: string;
  tagline: string;
  category: 'executive' | 'cardiac' | 'women' | 'men' | 'senior' | 'diabetes';
  price: number;
  duration: string;
  idealFor: string;
  testsCount: number;
  includedTests: string[];
  isPopular?: boolean;
};

export type PatientStory = {
  id: string;
  patientName: string;
  age: number;
  location: string;
  treatment: string;
  department: string;
  quote: string;
  storySnippet: string;
  recoveringTime: string;
  image: string;
};

export type DayTimelineItem = {
  time: string;
  title: string;
  subtitle: string;
  description: string;
  department: string;
  lightingState: 'morning' | 'afternoon' | 'evening' | 'night';
};

export type VisitStep = {
  step: string;
  time: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
};

export type CampusZone = {
  id: string;
  name: string;
  code: string;
  building: string;
  floor: string;
  description: string;
  keyUnits: string[];
  coordinates: { x: number; y: number };
};

export type QuickSearchItem = {
  id: string;
  title: string;
  subtitle: string;
  category: 'Doctor' | 'Department' | 'Technology' | 'Facility' | 'Package' | 'Emergency';
  linkId: string;
};
