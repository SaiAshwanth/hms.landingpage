import React, { useState, useRef, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Activity, Calendar, User, ChevronRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    specialityId?: string;
  };
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: 'bot',
    text: 'Hello! I am Dr. Aurelia AI. How can I assist you with clinical triage, health questions, or scheduling a specialist today?',
    timestamp: 'Just now',
  },
];

const QUICK_PROMPTS = [
  { label: '❤️ Cardiac Care', query: 'I have chest discomfort or cardiac questions.' },
  { label: '🧠 Neuro Triage', query: 'I have persistent headaches or neuro symptoms.' },
  { label: '📅 Book Doctor', query: 'How do I schedule an appointment with a top specialist?' },
  { label: '🚑 ER Line', query: 'What is the 24/7 Level-1 Emergency hotline?' },
];

export const AIDoctorBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { openAppointmentModal } = useUIStore();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const generateBotReply = (userText: string) => {
    const textLower = userText.toLowerCase();
    let replyText = '';
    let action: ChatMessage['action'] = undefined;

    if (textLower.includes('chest') || textLower.includes('heart') || textLower.includes('cardio')) {
      replyText = 'Cardiac symptoms require rapid expert evaluation. Our Heart Institute features 3D echocardiography, hybrid catheterization, and 24/7 cardiac ICU led by Dr. Elena Rostova.';
      action = {
        label: 'Book Cardiology Visit',
        specialityId: 'cardiology',
      };
    } else if (textLower.includes('headache') || textLower.includes('neuro') || textLower.includes('brain')) {
      replyText = 'Neurological symptoms like persistent headaches or numbness should be evaluated. Our Neuroscience Center provides 3.0T functional MRI and sub-millimeter surgical precision.';
      action = {
        label: 'Book Neurology Visit',
        specialityId: 'neurology',
      };
    } else if (textLower.includes('er') || textLower.includes('emergency') || textLower.includes('urgent')) {
      replyText = 'For critical medical emergencies, please dial our 24/7 Trauma Hotline immediately: +91 (40) 8900-9999 or visit our Emergency Bay with zero triage delay.';
      action = {
        label: 'Call ER: +91 (40) 8900-9999',
      };
    } else if (textLower.includes('book') || textLower.includes('doctor') || textLower.includes('appointment')) {
      replyText = 'You can consult with any of our 120+ international consultant physicians across 38 subspecialities.';
      action = {
        label: 'Schedule Appointment',
      };
    } else {
      replyText = `Thank you for your question regarding "${userText}". Aurelia Nova delivers board-certified care across Cardiology, Neurology, Orthopedics, and Emergency Medicine. Would you like to schedule a visit?`;
      action = {
        label: 'Book Consultation',
      };
    }

    return { replyText, action };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const { replyText, action } = generateBotReply(query);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action,
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* FLOATING POPUP TRIGGER BUTTON AT BOTTOM-RIGHT (z-[9999]) */}
      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className="relative group flex items-center gap-3 px-4 py-3 bg-[#1B494D] hover:bg-[#13383C] text-white rounded-full shadow-2xl border border-teal-400/40 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
        >
          {/* Animated Pulse Ring */}
          <span className="absolute -inset-1 rounded-full bg-teal-400/25 animate-pulse pointer-events-none" />

          {/* Bot Icon with Green Dot */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-teal-500/30 text-teal-200 border border-teal-300/40">
            <Bot className="w-5 h-5 text-teal-200 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#1B494D]" />
          </div>

          <div className="flex flex-col text-left pr-1">
            <span className="text-[11px] font-mono tracking-wider font-bold text-white uppercase flex items-center gap-1.5">
              <span>AI DOCTOR</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[9px] font-mono text-teal-200/80 uppercase">
              {isOpen ? 'Close Chat' : 'Ask AI'}
            </span>
          </div>
        </button>
      </div>

      {/* POPUP CHAT WINDOW ANCHORED AT BOTTOM-RIGHT (z-[9999], NO BACKGROUND DIMMING) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-20 right-6 w-80 sm:w-96 h-[480px] z-[9999] bg-slate-900/95 text-slate-100 backdrop-blur-xl rounded-2xl shadow-2xl border border-teal-500/40 flex flex-col overflow-hidden font-sans pointer-events-auto"
          >
            {/* POPUP HEADER */}
            <div className="p-3.5 bg-gradient-to-r from-[#1B494D] to-slate-900 border-b border-teal-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-full bg-teal-500/20 border border-teal-400/40 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-teal-300" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border-2 border-slate-900" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-1">
                    <span>DR. AURELIA AI</span>
                    <Sparkles className="w-3 h-3 text-teal-400" />
                  </h3>
                  <p className="text-[9px] font-mono text-teal-200/70">
                    24/7 Clinical Triage & Guidance
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* POPUP MESSAGES BODY */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 scrollbar-none text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Activity className="w-3 h-3 text-teal-300" />
                    </div>
                  )}

                  <div className={`max-w-[84%] space-y-1.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3 rounded-xl leading-relaxed text-xs ${
                        msg.sender === 'user'
                          ? 'bg-teal-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.action && (
                      <button
                        type="button"
                        onClick={() => {
                          openAppointmentModal({ specialityId: msg.action?.specialityId });
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 bg-teal-500/20 hover:bg-teal-500/35 border border-teal-400/40 text-teal-200 rounded-lg text-[10px] font-mono font-bold uppercase flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-teal-400" />
                          <span>{msg.action.label}</span>
                        </span>
                        <ChevronRight className="w-3 h-3 text-teal-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}

                    <span className="text-[9px] font-mono text-slate-500 px-1 block">
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-slate-300">
                      <User className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 items-center text-slate-400 text-[9px] font-mono">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0">
                    <Activity className="w-3 h-3 text-teal-300 animate-spin" />
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* QUICK PROMPT CHIPS */}
            <div className="px-3 py-2 bg-slate-950/70 border-t border-slate-800 flex flex-wrap gap-1">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSendMessage(prompt.query)}
                  className="px-2 py-1 bg-slate-800/90 hover:bg-teal-950 border border-slate-700 hover:border-teal-500/50 text-slate-300 hover:text-teal-200 rounded-full text-[9px] font-mono transition-colors cursor-pointer"
                >
                  {prompt.label}
                </button>
              ))}
            </div>

            {/* POPUP INPUT FOOTER */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask Dr. Aurelia AI..."
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              />

              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="p-2 bg-[#1B494D] hover:bg-teal-600 disabled:opacity-40 text-white rounded-lg transition-all cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
