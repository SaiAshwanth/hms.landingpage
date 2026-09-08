import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../stores/uiStore';
import { DOCTORS_DATA } from '../../features/doctors/data/doctors';
import type { Doctor } from '../../types/common';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Stethoscope,
  MessageSquare,
  Maximize2,
  Minimize2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Volume2,
  VolumeX,
  PhoneCall,
  RotateCcw,
  Star,
  Award,
  ChevronRight,
  User,
  Activity,
  HeartPulse,
  Wind,
  Brain,
  Smile,
  Shield,
  Clock,
} from 'lucide-react';

// ==========================================
// 1. TYPED SYMPTOM DEFINITIONS
// ==========================================
type SymptomSeverity = 'critical' | 'medium' | 'normal';

interface SymptomItem {
  id: string;
  name: string;
  description: string;
  severity: SymptomSeverity;
  iconName: 'HeartPulse' | 'Wind' | 'AlertTriangle' | 'Brain' | 'Activity' | 'Smile' | 'Shield';
  specialityId: string;
}

const COMMON_SYMPTOMS: SymptomItem[] = [
  // Critical
  {
    id: 'chest-pain',
    name: 'Chest Pain / Tightness',
    description: 'Crushing or tight retrosternal discomfort radiating to jaw or left arm.',
    severity: 'critical',
    iconName: 'HeartPulse',
    specialityId: 'cardiology',
  },
  {
    id: 'shortness-breath',
    name: 'Shortness of Breath',
    description: 'Acute dyspnea, air hunger, or difficulty catching breath at rest.',
    severity: 'critical',
    iconName: 'Wind',
    specialityId: 'emergency',
  },
  {
    id: 'dizziness-fainting',
    name: 'Dizziness / Fainting',
    description: 'Sudden syncope, spinning vertigo, lightheadedness, or acute confusion.',
    severity: 'critical',
    iconName: 'AlertTriangle',
    specialityId: 'neurology',
  },
  // Medium
  {
    id: 'high-fever',
    name: 'High Fever / Chills',
    description: 'Oral temp > 101°F with sweating, rigors, body aches, and malaise.',
    severity: 'medium',
    iconName: 'Activity',
    specialityId: 'emergency',
  },
  {
    id: 'stomach-pain',
    name: 'Stomach / Abdominal Pain',
    description: 'Severe epigastric cramps, localized abdominal tenderness, or colic.',
    severity: 'medium',
    iconName: 'Activity',
    specialityId: 'gastroenterology',
  },
  {
    id: 'severe-migraine',
    name: 'Severe Migraine / Headache',
    description: 'Intense throbbing cranial pain with light sensitivity or nausea.',
    severity: 'medium',
    iconName: 'Brain',
    specialityId: 'neurology',
  },
  {
    id: 'persistent-vomiting',
    name: 'Persistent Vomiting',
    description: 'Inability to keep liquids down, recurrent emesis, dehydration risk.',
    severity: 'medium',
    iconName: 'AlertTriangle',
    specialityId: 'gastroenterology',
  },
  {
    id: 'pediatric-distress',
    name: 'Infant / Child Distress',
    description: 'Pediatric lethargy, inconsolable crying, refusal to feed, or fever.',
    severity: 'medium',
    iconName: 'Smile',
    specialityId: 'paediatrics',
  },
  // Normal / Mild
  {
    id: 'joint-back-pain',
    name: 'Joint / Back Pain',
    description: 'Lumbar strain, knee stiffness, or muscular ache after posture strain.',
    severity: 'normal',
    iconName: 'Shield',
    specialityId: 'orthopaedics',
  },
  {
    id: 'acid-reflux',
    name: 'Mild Nausea / Acid Reflux',
    description: 'Post-meal heartburn, sour indigestion, or mild stomach fullness.',
    severity: 'normal',
    iconName: 'Activity',
    specialityId: 'gastroenterology',
  },
  {
    id: 'skin-rash',
    name: 'Skin Rash / Itch',
    description: 'Localized cutaneous redness, hives, or mild allergic itch.',
    severity: 'normal',
    iconName: 'Shield',
    specialityId: 'emergency',
  },
  {
    id: 'fatigue-cold',
    name: 'Fatigue / Mild Cold',
    description: 'Nasal congestion, low-grade scratchy throat, and general tiredness.',
    severity: 'normal',
    iconName: 'Shield',
    specialityId: 'emergency',
  },
];

const DURATION_PILLS = [
  'Less than a few hours',
  'Today',
  '2–3 days',
  '4–7 days',
  'More than a week',
];

// ==========================================
// 2. TRIAGE REPORT STRUCTURE
// ==========================================
interface ClinicalAssessment {
  urgency: SymptomSeverity;
  urgencyLabel: string;
  title: string;
  overview: string;
  differentials: string[];
  immediateActions: string[];
  avoidActions: string[];
  redFlags: string[];
  recommendedDoctor: Doctor;
  analyzedAt: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  urgency?: SymptomSeverity;
  warning?: string;
  bullets?: string[];
  suggestedDoctor?: Doctor;
  actionLabel?: string;
}

let msgSeq = 0;
const createMsgId = () => `bot-msg-${++msgSeq}-${Date.now()}`;
const getNowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// ==========================================
// 3. CLINICAL TRIAGE ENGINE
// ==========================================
function evaluateTriage(
  selectedIds: string[],
  userNotes: string,
  pain: number,
  duration: string
): ClinicalAssessment {
  const selected = COMMON_SYMPTOMS.filter((s) => selectedIds.includes(s.id));
  const notesLower = userNotes.toLowerCase();

  const hasCritical =
    selected.some((s) => s.severity === 'critical') ||
    notesLower.includes('chest pain') ||
    notesLower.includes('breathing') ||
    notesLower.includes('fainted') ||
    notesLower.includes('unconscious') ||
    notesLower.includes('stroke') ||
    (pain >= 9 && selected.length > 0);

  const hasMedium =
    selected.some((s) => s.severity === 'medium') ||
    pain >= 6 ||
    selected.length >= 2;

  let urgency: SymptomSeverity = 'normal';
  if (hasCritical) urgency = 'critical';
  else if (hasMedium) urgency = 'medium';

  // Match Department & Doctor
  let targetSpecId = 'emergency';
  if (urgency === 'critical') {
    if (selected.some((s) => s.id === 'chest-pain') || notesLower.includes('chest')) {
      targetSpecId = 'cardiology';
    } else {
      targetSpecId = 'emergency';
    }
  } else if (selected.some((s) => s.id === 'stomach-pain' || s.id === 'persistent-vomiting' || s.id === 'acid-reflux') || notesLower.includes('stomach')) {
    targetSpecId = 'gastroenterology';
  } else if (selected.some((s) => s.id === 'severe-migraine' || s.id === 'dizziness-fainting') || notesLower.includes('headache')) {
    targetSpecId = 'neurology';
  } else if (selected.some((s) => s.id === 'joint-back-pain') || notesLower.includes('back') || notesLower.includes('joint')) {
    targetSpecId = 'orthopaedics';
  } else if (selected.some((s) => s.id === 'pediatric-distress') || notesLower.includes('child') || notesLower.includes('baby')) {
    targetSpecId = 'paediatrics';
  }

  const matchedDoctor =
    DOCTORS_DATA.find((d) => d.specialityId === targetSpecId) ||
    DOCTORS_DATA[0];

  const symptomList = selected.map((s) => s.name).join(', ') || 'Reported health concern';

  let title = '';
  let overview = '';
  let differentials: string[] = [];
  let immediateActions: string[] = [];
  let avoidActions: string[] = [];
  let redFlags: string[] = [];

  if (urgency === 'critical') {
    title = 'Immediate Emergency Medical Evaluation Needed';
    overview = `Your reported symptoms (${symptomList}${userNotes ? ` | Notes: "${userNotes}"` : ''}) exhibit high-priority indicators. Acute cardiopulmonary, vascular, or neurological instability must be ruled out immediately by emergency clinicians.`;
    differentials = [
      'Acute Coronary Syndrome / Cardiac Ischemia',
      'Acute Respiratory Compromise',
      'Cerebrovascular Event (Stroke / TIA)',
      'Severe Hemodynamic Collapse',
    ];
    immediateActions = [
      'Seek emergency medical care immediately or visit Aurelia Level-1 Trauma Bay.',
      'Stop all physical exertion and sit in an upright, well-ventilated posture.',
      'Loosen any tight clothing around the neck and chest.',
      'Call emergency services (+91 40 8900-9999) without delay.',
    ];
    avoidActions = [
      'Do NOT drive yourself; arrange emergency transport immediately.',
      'Do NOT wait to see if acute chest pain, numbness, or breathing difficulty resolves.',
      'Do NOT take unprescribed stimulants or medications.',
    ];
    redFlags = [
      'Crushing chest pressure radiating to left arm, back, or jaw.',
      'Inability to speak in full sentences or cyanosis (blue lips/fingers).',
      'Sudden facial droop, arm weakness, or slurred speech.',
      'Loss of consciousness, syncope, or explosive headache.',
    ];
  } else if (urgency === 'medium') {
    title = 'Priority Clinical Consultation Recommended';
    overview = `Your recorded presentation includes ${symptomList} with a pain intensity of ${pain}/10 and duration of ${duration}. These signs suggest an active inflammatory, digestive, or neurological process that warrants a prompt physician evaluation.`;
    differentials = [
      'Acute Gastroenteritis or Peptic Inflammation',
      'Active Viral or Bacterial Infectious Response',
      'Migraine Episode or Cranial Neuralgia',
      'Biliary Colic or Localized Organ Discomfort',
    ];
    immediateActions = [
      'Sip small amounts of oral electrolyte rehydration solution (ORS) frequently.',
      'Rest in a calm, ambient room and log symptom patterns.',
      'Book a priority consultation with an Aurelia specialist within 24–48 hours.',
    ];
    avoidActions = [
      'Avoid taking NSAIDs (like ibuprofen or aspirin) on an empty stomach.',
      'Avoid heavy, oily, fried foods, dairy, and caffeine.',
      'Do not ignore sudden progression or persistent temperature spikes.',
    ];
    redFlags = [
      'Fever exceeding 102.5°F persisting over 48 hours.',
      'Persistent vomiting preventing all oral fluid intake.',
      'Sudden rigid abdominal tenderness or visible blood in stool/emesis.',
    ];
  } else {
    title = 'Routine Care & Clinical Monitoring';
    overview = `Your recorded symptoms (${symptomList}) suggest mild to moderate discomfort without acute instability. Conservative supportive care and routine evaluation provide safe, targeted relief.`;
    differentials = [
      'Musculoskeletal or postural strain',
      'Transient functional dyspepsia / mild acid reflux',
      'Upper respiratory viral prodrome or fatigue',
      'Mild localized contact reaction',
    ];
    immediateActions = [
      'Maintain steady hydration and prioritize restorative rest.',
      'Apply warm or cool compresses for muscular aches.',
      'Schedule a routine outpatient review if symptoms persist beyond 5 days.',
    ];
    avoidActions = [
      'Avoid heavy lifting or sudden awkward spinal twisting.',
      'Avoid late-night heavy meals before lying flat.',
    ];
    redFlags = [
      'Pain escalating above 7/10 or sudden localized swelling.',
      'Development of fever, chills, or numbness.',
    ];
  }

  return {
    urgency,
    urgencyLabel:
      urgency === 'critical'
        ? 'EMERGENCY / LEVEL-1 URGENT'
        : urgency === 'medium'
        ? 'PRIORITY SPECIALIST CARE'
        : 'ROUTINE CLINICAL CARE',
    title,
    overview,
    differentials,
    immediateActions,
    avoidActions,
    redFlags,
    recommendedDoctor: matchedDoctor,
    analyzedAt: getNowTime(),
  };
}

// ==========================================
// 4. CHAT RESPONSE GENERATOR
// ==========================================
function generateChatReply(
  userText: string,
  activeTriage: ClinicalAssessment | null
): ChatMessage {
  const lower = userText.toLowerCase();

  // Emergency query
  if (
    lower.includes('chest') ||
    lower.includes('breathing') ||
    lower.includes('heart attack') ||
    lower.includes('fainted') ||
    lower.includes('passed out') ||
    lower.includes('stroke') ||
    lower.includes('numbness')
  ) {
    const erDoc = DOCTORS_DATA.find((d) => d.specialityId === 'emergency') || DOCTORS_DATA[0];
    return {
      id: createMsgId(),
      role: 'assistant',
      content:
        'URGENT MEDICAL NOTICE: The symptoms you mentioned may indicate an acute medical emergency. Do not wait for symptoms to subside.',
      timestamp: getNowTime(),
      urgency: 'critical',
      warning:
        'Dial +91 (40) 8900-9999 immediately or proceed directly to the Aurelia Level-1 Emergency Bay with zero triage delay.',
      bullets: [
        'Stop all exertion and sit upright in a well-ventilated area.',
        'Loosen any tight clothing around your collar and chest.',
        'Do not attempt to drive yourself to the hospital.',
      ],
      suggestedDoctor: erDoc,
      actionLabel: 'Call 24/7 Emergency Line',
    };
  }

  // Medication advice
  if (
    lower.includes('paracetamol') ||
    lower.includes('medicine') ||
    lower.includes('tablet') ||
    lower.includes('painkiller') ||
    lower.includes('ibuprofen')
  ) {
    return {
      id: createMsgId(),
      role: 'assistant',
      content:
        'Regarding medication safety: While over-the-counter options like paracetamol are commonly utilized for mild fever and analgesia, safe usage strictly depends on your personal health profile.',
      timestamp: getNowTime(),
      bullets: [
        'Packaging dosage limits must never be exceeded.',
        'Avoid NSAIDs (like ibuprofen) if you have stomach cramps or gastric ulcer risk.',
        'Confirm suitability if you have liver, kidney, or cardiovascular conditions.',
        'Always consult an Aurelia physician or pharmacist before starting new medications.',
      ],
      actionLabel: 'Schedule Physician Consult',
    };
  }

  // Diet / What to eat
  if (lower.includes('eat') || lower.includes('food') || lower.includes('diet') || lower.includes('drink')) {
    const gastroDoc = DOCTORS_DATA.find((d) => d.specialityId === 'gastroenterology') || DOCTORS_DATA[4];
    return {
      id: createMsgId(),
      role: 'assistant',
      content:
        'When experiencing stomach or digestive discomfort, lighter and non-irritating nutrition helps protect the gastric mucosa:',
      timestamp: getNowTime(),
      bullets: [
        'Sip clear fluids frequently: warm water, coconut water, or electrolyte ORS.',
        'Opt for bland foods: boiled rice, toast, plain crackers, and bananas.',
        'Avoid spicy gravies, deep-fried snacks, dairy, citrus, and caffeine.',
      ],
      suggestedDoctor: gastroDoc,
      actionLabel: `Book with ${gastroDoc.name}`,
    };
  }

  // Doctors / Specialist inquiry
  if (lower.includes('doctor') || lower.includes('specialist') || lower.includes('who should i see')) {
    const targetDoc = activeTriage ? activeTriage.recommendedDoctor : DOCTORS_DATA[0];
    return {
      id: createMsgId(),
      role: 'assistant',
      content: `Aurelia Hospital features 120+ international consultant specialists across 38 departments. Based on your inquiry, we recommend consulting ${targetDoc.name} in ${targetDoc.speciality}.`,
      timestamp: getNowTime(),
      suggestedDoctor: targetDoc,
      actionLabel: `Book with ${targetDoc.name}`,
    };
  }

  // General compassionate response
  const targetDoc = activeTriage ? activeTriage.recommendedDoctor : DOCTORS_DATA[0];
  return {
    id: createMsgId(),
    role: 'assistant',
    content: `Thank you for sharing your concern.${
      activeTriage ? ` In light of your active triage (${activeTriage.title}), ` : ' '
    }Our clinical team is available 24/7. Could you share if the symptoms started suddenly or if you have any other questions regarding care?`,
    timestamp: getNowTime(),
    bullets: [
      'You can switch to the Symptom Triage tab to run a multi-symptom calculation.',
      'Our outpatient desks and 24/7 trauma suites are continuously operational.',
    ],
    suggestedDoctor: targetDoc,
    actionLabel: `Consult ${targetDoc.name}`,
  };
}

// Helper icon render
const renderSymptomIcon = (iconName: SymptomItem['iconName']) => {
  switch (iconName) {
    case 'HeartPulse': return <HeartPulse className="w-4 h-4" />;
    case 'Wind': return <Wind className="w-4 h-4" />;
    case 'Brain': return <Brain className="w-4 h-4" />;
    case 'Smile': return <Smile className="w-4 h-4" />;
    case 'Shield': return <Shield className="w-4 h-4" />;
    case 'Activity': return <Activity className="w-4 h-4" />;
    default: return <AlertTriangle className="w-4 h-4" />;
  }
};

// ==========================================
// 5. MAIN AI DOCTOR BOT COMPONENT
// ==========================================
export const AIDoctorBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'triage' | 'chat'>('triage');

  const { openAppointmentModal } = useUIStore();

  // Triage state
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomFilter, setSymptomFilter] = useState<'all' | SymptomSeverity>('all');
  const [userNotes, setUserNotes] = useState('');
  const [painLevel, setPainLevel] = useState(3);
  const [duration, setDuration] = useState('Today');
  const [assessment, setAssessment] = useState<ClinicalAssessment | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Audio & Copy states
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am Dr. Aurelia AI. Select your symptoms in the "Symptom Triage" tab to receive an immediate severity rating and matched hospital doctor, or ask me any health questions directly below.',
      timestamp: 'Just now',
      bullets: [
        'Multi-symptom triage with severity rating (Critical, Medium, Normal)',
        'Direct 1-click booking with hospital specialists',
        'Clinical care guidance, medication caution, and red flag warnings',
      ],
    },
  ]);
  const [inputChat, setInputChat] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping, activeTab]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Multi-select toggle
  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Run Triage
  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0 && !userNotes.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = evaluateTriage(selectedSymptoms, userNotes, painLevel, duration);
      setAssessment(res);
      setIsAnalyzing(false);
    }, 400);
  };

  // Transfer Triage into AI Chat
  const handleTransferToChat = () => {
    if (!assessment) return;
    const triageNotice: ChatMessage = {
      id: createMsgId(),
      role: 'assistant',
      content: `I reviewed your clinical triage assessment (${assessment.urgencyLabel}). Based on your symptoms and a pain level of ${painLevel}/10, an evaluation with ${assessment.recommendedDoctor.name} (${assessment.recommendedDoctor.speciality}) is recommended.`,
      timestamp: getNowTime(),
      urgency: assessment.urgency,
      suggestedDoctor: assessment.recommendedDoctor,
      warning:
        assessment.urgency === 'critical'
          ? 'Emergency Alert: Red-flag symptoms detected. Please seek immediate medical attention or call +91 (40) 8900-9999.'
          : undefined,
      bullets: [
        'Do you have any questions regarding test preparation or nutrition?',
        'Can you tell me if your symptoms have worsened over the last few hours?',
      ],
      actionLabel: `Book with ${assessment.recommendedDoctor.name}`,
    };

    setChatMessages((prev) => [...prev, triageNotice]);
    setActiveTab('chat');
  };

  // Copy Summary
  const handleCopySummary = async () => {
    if (!assessment) return;
    const reportText = `[AURELIA CLINICAL TRIAGE REPORT]
Urgency: ${assessment.urgencyLabel}
Doctor Match: ${assessment.recommendedDoctor.name} (${assessment.recommendedDoctor.speciality})
Pain Intensity: ${painLevel}/10 | Duration: ${duration}
Symptoms: ${selectedSymptoms.join(', ') || 'Reported Issue'}
Notes: ${userNotes || 'None'}

Overview:
${assessment.overview}

Immediate Guidance:
${assessment.immediateActions.map((a) => `• ${a}`).join('\n')}

Red Flags:
${assessment.redFlags.map((rf) => `• ${rf}`).join('\n')}
Aurelia Emergency: +91 (40) 8900-9999`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(reportText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Ignore fallback
    }
  };

  // Speech Narration
  const handleToggleSpeech = () => {
    if (!speechSupported || !assessment) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const text = `${assessment.title}. ${assessment.overview}. Recommended specialist: ${assessment.recommendedDoctor.name}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Send Chat message
  const handleSendChat = (text?: string) => {
    const messageText = (text || inputChat).trim();
    if (!messageText) return;

    const userMsg: ChatMessage = {
      id: createMsgId(),
      role: 'user',
      content: messageText,
      timestamp: getNowTime(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!text) setInputChat('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateChatReply(messageText, assessment);
      setChatMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 450);
  };

  // 1-Click Book Doctor
  const handleBookDoctor = (doc: Doctor) => {
    openAppointmentModal({
      specialityId: doc.specialityId,
      doctorId: doc.id,
    });
    setIsOpen(false);
  };

  const filteredSymptoms = COMMON_SYMPTOMS.filter(
    (s) => symptomFilter === 'all' || s.severity === symptomFilter
  );

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (BOTTOM-RIGHT) */}
      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative group flex items-center gap-3 px-4 py-3 bg-[#1B494D] hover:bg-[#13383C] text-white rounded-full shadow-2xl border border-teal-400/50 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
          aria-label={isOpen ? 'Close AI Consultation' : 'Open Dr. Aurelia AI Consultation'}
        >
          <span className="absolute -inset-1 rounded-full bg-teal-400/25 animate-pulse pointer-events-none" />
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-teal-500/30 text-teal-200 border border-teal-300/50">
            <Bot className="w-5 h-5 text-teal-200 group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#1B494D]" />
          </div>
          <div className="flex flex-col text-left pr-1">
            <span className="text-[11px] font-mono tracking-wider font-bold text-white uppercase flex items-center gap-1.5">
              <span>DR. AURELIA AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[9px] font-mono text-teal-200/80 uppercase">
              {isOpen ? 'Close Window' : 'Clinical Triage'}
            </span>
          </div>
          {selectedSymptoms.length > 0 && !isOpen && (
            <span className="absolute -top-1 -left-1 bg-amber-500 text-slate-950 text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
              {selectedSymptoms.length}
            </span>
          )}
        </button>
      </div>

      {/* FLOATING WORKSTATION MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 z-[9999] bg-slate-950/95 text-slate-100 backdrop-blur-2xl rounded-2xl shadow-2xl border border-teal-500/40 flex flex-col overflow-hidden font-sans pointer-events-auto transition-[width,height] duration-300 ${
              isExpanded
                ? 'sm:w-[680px] h-[720px] max-h-[90vh]'
                : 'sm:w-[470px] h-[600px] max-h-[85vh]'
            }`}
          >
            {/* HEADER */}
            <div className="p-3 bg-gradient-to-r from-[#1B494D] via-slate-900 to-slate-950 border-b border-teal-500/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-full bg-teal-500/20 border border-teal-400/50 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-teal-300" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border-2 border-slate-900" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-1.5">
                    <span>DR. AURELIA AI</span>
                    <Sparkles className="w-3 h-3 text-teal-400" />
                  </h3>
                  <p className="text-[9px] font-mono text-teal-200/80">
                    Clinical Triage & Specialist Referral
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsExpanded((p) => !p)}
                  className="hidden sm:flex p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title={isExpanded ? 'Compact mode' : 'Expand workstation'}
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* TAB BAR */}
            <div className="px-3 pt-2 bg-slate-950 border-b border-slate-800 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('triage')}
                className={`pb-2 px-3 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'triage'
                    ? 'border-teal-400 text-teal-200'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Symptom Triage</span>
                {assessment && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      assessment.urgency === 'critical'
                        ? 'bg-rose-500'
                        : assessment.urgency === 'medium'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`pb-2 px-3 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? 'border-teal-400 text-teal-200'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>AI Doctor Chat</span>
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 overflow-hidden flex flex-col bg-slate-950">
              {activeTab === 'triage' ? (
                <div className="flex-1 p-3.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 space-y-4 text-xs">
                  {assessment ? (
                    // ASSESSMENT REPORT VIEW
                    <div className="space-y-4 animate-in fade-in duration-300">
                      {/* URGENCY BANNER */}
                      <div
                        className={`p-3.5 rounded-xl border flex items-start gap-3 shadow-lg ${
                          assessment.urgency === 'critical'
                            ? 'bg-rose-950/50 border-rose-500/60 text-rose-100 shadow-rose-950/50'
                            : assessment.urgency === 'medium'
                            ? 'bg-amber-950/40 border-amber-500/50 text-amber-100 shadow-amber-950/40'
                            : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100 shadow-emerald-950/40'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                            assessment.urgency === 'critical'
                              ? 'bg-rose-500/20 border-rose-400/50 text-rose-300'
                              : assessment.urgency === 'medium'
                              ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                              : 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                          }`}
                        >
                          {assessment.urgency === 'critical' ? (
                            <AlertTriangle className="w-4 h-4 animate-bounce text-rose-300" />
                          ) : assessment.urgency === 'medium' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-300" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                                assessment.urgency === 'critical'
                                  ? 'bg-rose-500/25 border border-rose-400/40 text-rose-300'
                                  : assessment.urgency === 'medium'
                                  ? 'bg-amber-500/25 border border-amber-400/40 text-amber-300'
                                  : 'bg-emerald-500/25 border border-emerald-400/40 text-emerald-300'
                              }`}
                            >
                              {assessment.urgencyLabel}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {assessment.analyzedAt}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-white mt-1">
                            {assessment.title}
                          </h3>
                        </div>
                      </div>

                      {/* EMERGENCY FLASH BAR */}
                      {assessment.urgency === 'critical' && (
                        <div className="p-3 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl shadow-lg flex items-center justify-between gap-3 border border-red-400/50">
                          <div className="flex items-center gap-2">
                            <PhoneCall className="w-4 h-4 text-white animate-pulse" />
                            <div>
                              <div className="text-xs font-bold font-mono uppercase">
                                Aurelia 24/7 Level-1 Emergency Hotline
                              </div>
                              <div className="text-[11px] font-mono opacity-90">
                                +91 (40) 8900-9999 • Zero Delay Resuscitation
                              </div>
                            </div>
                          </div>
                          <a
                            href="tel:+914089009999"
                            className="px-3 py-1.5 bg-white text-rose-700 font-bold rounded-lg text-xs hover:bg-rose-50 transition-colors shadow-sm shrink-0"
                          >
                            Call Now
                          </a>
                        </div>
                      )}

                      {/* CLINICAL OVERVIEW */}
                      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-teal-300 font-mono text-[11px] font-semibold uppercase tracking-wider">
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>Clinical Assessment Overview</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {assessment.overview}
                        </p>
                      </div>

                      {/* RED FLAGS */}
                      {assessment.redFlags.length > 0 && (
                        <div className="bg-rose-950/30 border border-rose-500/30 p-3 rounded-xl space-y-1.5">
                          <div className="flex items-center gap-1.5 text-rose-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Red Flag Warnings (Rush to Emergency if Present)</span>
                          </div>
                          <ul className="space-y-1 pl-4 list-disc text-slate-300 text-[11px]">
                            {assessment.redFlags.map((rf, idx) => (
                              <li key={idx} className="leading-snug">{rf}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* WHAT TO DO & AVOID */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                          <div className="text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>What You Can Do Now</span>
                          </div>
                          <ul className="space-y-1 text-slate-300 text-[10px] pl-3 list-disc">
                            {assessment.immediateActions.map((act, idx) => (
                              <li key={idx} className="leading-snug">{act}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                          <div className="text-rose-400 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>What To Avoid</span>
                          </div>
                          <ul className="space-y-1 text-slate-300 text-[10px] pl-3 list-disc">
                            {assessment.avoidActions.map((act, idx) => (
                              <li key={idx} className="leading-snug">{act}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* RECOMMENDED HOSPITAL DOCTOR */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-slate-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                            <span>Recommended Aurelia Specialist</span>
                          </span>
                          <span className="text-[10px] text-teal-400 font-mono">
                            Top Match
                          </span>
                        </div>

                        {/* Doctor Card */}
                        <div className="bg-slate-900/90 border border-teal-500/30 rounded-xl p-3.5 shadow-lg backdrop-blur-md">
                          <div className="flex items-start gap-3">
                            <img
                              src={assessment.recommendedDoctor.image}
                              alt={assessment.recommendedDoctor.name}
                              className="w-14 h-14 rounded-xl object-cover border border-teal-400/40 shadow-sm shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="text-xs font-bold text-white tracking-wide truncate">
                                  {assessment.recommendedDoctor.name}
                                </h4>
                                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded text-[10px] text-amber-300 font-mono shrink-0">
                                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                  <span>{assessment.recommendedDoctor.rating}</span>
                                </div>
                              </div>
                              <p className="text-[11px] text-teal-300 font-medium truncate mt-0.5">
                                {assessment.recommendedDoctor.speciality}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {assessment.recommendedDoctor.title}
                              </p>
                              <div className="flex items-center gap-3 mt-1.5 text-[9px] font-mono text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Award className="w-3 h-3 text-teal-400" />
                                  <span>{assessment.recommendedDoctor.experience} yrs exp</span>
                                </span>
                                <span className="text-emerald-400">• Available for Booking</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-800">
                            <button
                              type="button"
                              onClick={() => handleBookDoctor(assessment.recommendedDoctor)}
                              className="w-full py-1.5 px-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-lg text-[11px] font-semibold tracking-wide flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                            >
                              <Calendar className="w-3.5 h-3.5 text-teal-200" />
                              <span>Book with {assessment.recommendedDoctor.name.split(' ')[1] || assessment.recommendedDoctor.name}</span>
                              <ChevronRight className="w-3 h-3 text-teal-200" />
                            </button>

                            <button
                              type="button"
                              onClick={handleTransferToChat}
                              className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                              <span>Discuss in AI Chat</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* SUMMARY ACTIONS */}
                      <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleCopySummary}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-teal-400" />}
                            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
                          </button>

                          {speechSupported && (
                            <button
                              type="button"
                              onClick={handleToggleSpeech}
                              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                                isSpeaking ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                              }`}
                            >
                              {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-teal-400" />}
                              <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setAssessment(null)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>New Assessment</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // FORM VIEW (SYMPTOM PICKER + MANUAL NOTES + PAIN + DURATION)
                    <>
                      {/* INTRO NOTICE */}
                      <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-300">
                        <Stethoscope className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <span>
                          Select your symptoms below or describe what you feel. The clinical engine evaluates urgency (
                          <strong className="text-rose-400">Critical</strong>,{' '}
                          <strong className="text-amber-400">Medium</strong>,{' '}
                          <strong className="text-emerald-400">Normal</strong>) and connects you with the right specialist.
                        </span>
                      </div>

                      {/* FILTER TABS & COUNT */}
                      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                          {(['all', 'critical', 'medium', 'normal'] as const).map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setSymptomFilter(lvl)}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase transition-all cursor-pointer ${
                                symptomFilter === lvl
                                  ? 'bg-teal-500/25 text-teal-200 border border-teal-400/40'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>

                        {selectedSymptoms.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-teal-300 bg-teal-950/80 border border-teal-500/40 px-2 py-0.5 rounded-full">
                              {selectedSymptoms.length} selected
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedSymptoms([])}
                              className="text-[10px] font-mono text-slate-400 hover:text-rose-300 cursor-pointer"
                            >
                              Reset
                            </button>
                          </div>
                        )}
                      </div>

                      {/* SYMPTOM CHIPS GRID */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
                        {filteredSymptoms.map((sym) => {
                          const isSelected = selectedSymptoms.includes(sym.id);
                          return (
                            <button
                              key={sym.id}
                              type="button"
                              onClick={() => toggleSymptom(sym.id)}
                              className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                                isSelected
                                  ? sym.severity === 'critical'
                                    ? 'border-rose-500/80 bg-rose-950/30 text-white ring-1 ring-rose-500/40'
                                    : sym.severity === 'medium'
                                    ? 'border-amber-500/80 bg-amber-950/30 text-white ring-1 ring-amber-500/40'
                                    : 'border-emerald-500/80 bg-emerald-950/30 text-white ring-1 ring-emerald-500/40'
                                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                                  isSelected
                                    ? sym.severity === 'critical'
                                      ? 'bg-rose-500/20 border-rose-400/40 text-rose-300'
                                      : sym.severity === 'medium'
                                      ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                                      : 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                                    : 'bg-slate-800 border-slate-700 text-slate-400'
                                }`}
                              >
                                {renderSymptomIcon(sym.iconName)}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-semibold text-slate-200 truncate">
                                    {sym.name}
                                  </span>
                                  <span
                                    className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border ${
                                      sym.severity === 'critical'
                                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                                        : sym.severity === 'medium'
                                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                                        : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                    }`}
                                  >
                                    {sym.severity}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                  {sym.description}
                                </p>
                              </div>

                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 self-center ${
                                  isSelected ? 'bg-teal-500 border-teal-400 text-slate-950' : 'border-slate-700'
                                }`}
                              >
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* MANUAL ISSUE TEXTAREA */}
                      <div className="space-y-1.5 pt-1">
                        <label className="text-[11px] font-mono text-slate-300 flex items-center justify-between">
                          <span>Describe your issue</span>
                          <span className="text-[10px] text-slate-500">Optional notes</span>
                        </label>
                        <textarea
                          rows={2}
                          value={userNotes}
                          onChange={(e) => setUserNotes(e.target.value)}
                          placeholder="e.g. Severe abdominal cramps after dinner with mild fever, started yesterday..."
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 resize-none"
                        />
                      </div>

                      {/* PAIN INTENSITY SLIDER */}
                      <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-slate-300 text-[11px] flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-teal-400" />
                            <span>Pain / Discomfort Intensity</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300">
                            {painLevel} / 10
                          </span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={10}
                          value={painLevel}
                          onChange={(e) => setPainLevel(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                        />
                        <div className="flex justify-between text-[9px] font-mono text-slate-500 px-0.5">
                          <span>1 (Mild)</span>
                          <span>5 (Moderate)</span>
                          <span>10 (Unbearable)</span>
                        </div>
                      </div>

                      {/* DURATION PILLS */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-teal-400" />
                          <span>Duration</span>
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {DURATION_PILLS.map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setDuration(d)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                                duration === d
                                  ? 'bg-teal-500/25 text-teal-200 border border-teal-400/50 font-semibold'
                                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ANALYZE BUTTON */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleAnalyze}
                          disabled={selectedSymptoms.length === 0 && !userNotes.trim()}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl border border-teal-400/40 cursor-pointer"
                        >
                          {isAnalyzing ? (
                            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-teal-200 animate-pulse" />
                          )}
                          <span>Analyze Symptoms & Suggest Doctor</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                // AI DOCTOR LIVE CHAT VIEW
                <div className="flex-1 flex flex-col h-full overflow-hidden text-xs">
                  {/* Context notice if triage active */}
                  {assessment && (
                    <div className="p-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            assessment.urgency === 'critical' ? 'bg-rose-500 animate-ping' : 'bg-amber-400'
                          }`}
                        />
                        <span className="text-[10px] font-mono text-slate-300 truncate">
                          Triage Context: <strong className="text-white">{assessment.title}</strong>
                        </span>
                      </div>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 shrink-0">
                        {assessment.urgency}
                      </span>
                    </div>
                  )}

                  {/* CHAT MESSAGES */}
                  <div className="flex-1 p-3.5 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-7 h-7 rounded-full bg-teal-500/20 border border-teal-400/40 flex items-center justify-center shrink-0 mt-0.5">
                            <Bot className="w-4 h-4 text-teal-300" />
                          </div>
                        )}

                        <div className={`max-w-[88%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`p-3.5 rounded-2xl leading-relaxed text-xs shadow-md ${
                              msg.role === 'user'
                                ? 'bg-teal-600 text-white rounded-br-xs'
                                : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-xs'
                            }`}
                          >
                            {msg.urgency === 'critical' && (
                              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-mono font-bold text-rose-300 bg-rose-950/70 border border-rose-500/50 px-2 py-0.5 rounded-md">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                                <span>URGENT MEDICAL NOTICE</span>
                              </div>
                            )}

                            <p className="whitespace-pre-line">{msg.content}</p>

                            {msg.warning && (
                              <div className="mt-2.5 p-2 bg-rose-950/40 border border-rose-500/40 rounded-xl text-[11px] text-rose-200 flex items-start gap-1.5">
                                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                <span>{msg.warning}</span>
                              </div>
                            )}

                            {msg.bullets && msg.bullets.length > 0 && (
                              <ul className="mt-2 space-y-1 pl-4 list-disc text-slate-200 text-[11px]">
                                {msg.bullets.map((b, idx) => (
                                  <li key={idx} className="leading-snug">{b}</li>
                                ))}
                              </ul>
                            )}

                            {msg.suggestedDoctor && (
                              <div className="mt-3 pt-2.5 border-t border-slate-800">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={msg.suggestedDoctor.image}
                                      alt={msg.suggestedDoctor.name}
                                      className="w-8 h-8 rounded-lg object-cover border border-teal-400/40"
                                    />
                                    <div>
                                      <div className="text-xs font-bold text-white">{msg.suggestedDoctor.name}</div>
                                      <div className="text-[10px] text-teal-300">{msg.suggestedDoctor.speciality}</div>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleBookDoctor(msg.suggestedDoctor!)}
                                  className="w-full py-1.5 px-3 bg-teal-500/20 hover:bg-teal-500/35 border border-teal-400/40 text-teal-200 rounded-lg text-[10px] font-mono font-bold uppercase flex items-center justify-between cursor-pointer"
                                >
                                  <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-teal-300" />
                                    <span>{msg.actionLabel || `Book with ${msg.suggestedDoctor.name}`}</span>
                                  </span>
                                  <ChevronRight className="w-3.5 h-3.5 text-teal-300" />
                                </button>
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] font-mono text-slate-500 px-1 block">
                            {msg.timestamp}
                          </span>
                        </div>

                        {msg.role === 'user' && (
                          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-slate-300">
                            <User className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex gap-2.5 items-center text-slate-400 text-[10px] font-mono">
                        <div className="w-7 h-7 rounded-full bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0">
                          <Activity className="w-3.5 h-3.5 text-teal-300 animate-spin" />
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex items-center gap-1">
                          <span className="text-[10px] text-teal-300 mr-1">Dr. Aurelia is thinking</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]" />
                        </div>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* QUICK PROMPT PILLS */}
                  <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                    {['What should I eat?', 'Is this serious?', 'Which doctor should I see?', 'Can I take paracetamol?'].map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendChat(q)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-teal-950 border border-slate-800 hover:border-teal-500/40 text-slate-300 hover:text-teal-200 rounded-full text-[10px] font-mono whitespace-nowrap cursor-pointer shrink-0"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* CHAT INPUT BAR */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendChat();
                    }}
                    className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0"
                  >
                    <input
                      type="text"
                      value={inputChat}
                      onChange={(e) => setInputChat(e.target.value)}
                      placeholder="Ask Dr. Aurelia AI anything..."
                      className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                    />
                    <button
                      type="submit"
                      disabled={!inputChat.trim()}
                      className="p-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-40 text-white rounded-xl cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
