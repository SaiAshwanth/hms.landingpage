import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import type { ChapterId } from '../../types/common';

const CHAPTERS: ChapterId[] = [
  '01 / ARRIVE',
  '02 / DISCOVER',
  '03 / MEET',
  '04 / UNDERSTAND',
  '05 / EXPERIENCE',
  '06 / CARE',
  '07 / CONNECT',
];

export const ChapterSidebar: React.FC = () => {
  const { activeChapter, setActiveChapter } = useUIStore();

  const handleScrollToChapter = (chapter: ChapterId) => {
    setActiveChapter(chapter);
    let targetId = '';
    switch (chapter) {
      case '01 / ARRIVE': targetId = 'hero'; break;
      case '02 / DISCOVER': targetId = 'at-a-glance'; break;
      case '03 / MEET': targetId = 'care-rooms'; break;
      case '04 / UNDERSTAND': targetId = 'day-at-aurelia'; break;
      case '05 / EXPERIENCE': targetId = 'patient-stories'; break;
      case '06 / CARE': targetId = 'campus'; break;
      case '07 / CONNECT': targetId = 'appointment'; break;
    }
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <aside className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col space-y-3 pointer-events-auto">
      {CHAPTERS.map((ch) => {
        const isActive = ch === activeChapter;
        return (
          <button
            key={ch}
            onClick={() => handleScrollToChapter(ch)}
            className="group flex items-center gap-3 cursor-pointer text-left focus:outline-none"
            title={ch}
          >
            <div
              className={`h-px transition-all duration-300 ${
                isActive
                  ? 'w-8 bg-[#7DB99A]'
                  : 'w-3 bg-[#1B201D]/20 group-hover:w-5 group-hover:bg-[#1B201D]/50'
              }`}
            />
            <span
              className={`text-[10px] font-mono tracking-widest transition-colors duration-300 opacity-0 group-hover:opacity-100 ${
                isActive ? 'opacity-100 font-bold text-[#1B201D]' : 'text-[#A7AAA4]'
              }`}
            >
              {ch}
            </span>
          </button>
        );
      })}
    </aside>
  );
};
