import { create } from 'zustand';
import type { ChapterId, CursorMode } from '../types/common';

interface AppointmentPrefill {
  specialityId?: string;
  doctorId?: string;
}

interface UIStore {
  isLoaderFinished: boolean;
  setLoaderFinished: (finished: boolean) => void;

  activeChapter: ChapterId;
  setActiveChapter: (chapter: ChapterId) => void;

  cursorMode: CursorMode;
  setCursorMode: (mode: CursorMode) => void;

  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;

  isAppointmentModalOpen: boolean;
  appointmentPrefill: AppointmentPrefill | null;
  openAppointmentModal: (prefill?: AppointmentPrefill) => void;
  closeAppointmentModal: () => void;

  isEmergencyModalOpen: boolean;
  setEmergencyModalOpen: (open: boolean) => void;

  isMobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;

  activeSpecialityId: string;
  setActiveSpecialityId: (id: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isLoaderFinished: false,
  setLoaderFinished: (finished) => set({ isLoaderFinished: finished }),

  activeChapter: '01 / ARRIVE',
  setActiveChapter: (chapter) => set({ activeChapter: chapter }),

  cursorMode: 'default',
  setCursorMode: (mode) => set({ cursorMode: mode }),

  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

  isAppointmentModalOpen: false,
  appointmentPrefill: null,
  openAppointmentModal: (prefill) => set({ isAppointmentModalOpen: true, appointmentPrefill: prefill || null }),
  closeAppointmentModal: () => set({ isAppointmentModalOpen: false, appointmentPrefill: null }),

  isEmergencyModalOpen: false,
  setEmergencyModalOpen: (open) => set({ isEmergencyModalOpen: open }),

  isMobileNavOpen: false,
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),

  activeSpecialityId: 'cardiology',
  setActiveSpecialityId: (id) => set({ activeSpecialityId: id }),
}));
