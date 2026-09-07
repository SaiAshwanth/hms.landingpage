import React from 'react';
import { DEPARTMENTS_DATA } from '../data/departments';
import { HeartPulse, Brain, Activity, Shield, Stethoscope, Heart, Smile, PhoneCall } from 'lucide-react';

interface SpecialityNavigationProps {
  activeId: string;
  onSelect: (id: string) => void;
}

export const SpecialityNavigation: React.FC<SpecialityNavigationProps> = ({
  activeId,
  onSelect,
}) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'HeartPulse': return HeartPulse;
      case 'Brain': return Brain;
      case 'Activity': return Activity;
      case 'Shield': return Shield;
      case 'Stethoscope': return Stethoscope;
      case 'Heart': return Heart;
      case 'Smile': return Smile;
      case 'PhoneCall': return PhoneCall;
      default: return HeartPulse;
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="text-xs font-mono uppercase tracking-wider text-[#A7AAA4] mb-2 font-semibold">
        Select Speciality Faculty
      </div>
      <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-2 scrollbar-thin">
        {DEPARTMENTS_DATA.map((dept) => {
          const Icon = getIcon(dept.iconName);
          const isActive = dept.id === activeId;
          return (
            <button
              key={dept.id}
              onClick={() => onSelect(dept.id)}
              className={`w-full flex items-center justify-between p-3 rounded-none text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#151816] text-[#8CC8A3] border-l-2 border-l-[#8CC8A3]'
                  : 'bg-transparent text-[#A7AAA4] hover:text-[#FAFAF7]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 ${isActive ? 'bg-[#8CC8A3] text-[#0B0D0C]' : 'bg-[#151816] text-[#A7AAA4]'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{dept.name}</div>
                  <div className="text-[10px] text-slate-400 font-light truncate max-w-[180px]">
                    {dept.tagline}
                  </div>
                </div>
              </div>
              {isActive && <span className="w-2 h-2 rounded-full bg-[#8CC8A3] animate-pulse" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
