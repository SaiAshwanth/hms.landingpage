import React from 'react';
import type { Department } from '../../../types/common';
import { Badge } from '../../../components/ui/Badge';
import { CheckCircle2, UserCheck, Activity, Award } from 'lucide-react';

interface SpecialityDetailsProps {
  department: Department;
}

export const SpecialityDetails: React.FC<SpecialityDetailsProps> = ({ department }) => {
  return (
    <div className="space-y-6">
      {/* Department Header */}
      <div>
        <Badge variant="cyan" className="mb-2">
          FACULTY DETAILS
        </Badge>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {department.name}
        </h3>
        <p className="text-xs text-cyan-300 font-mono mt-1">
          {department.tagline}
        </p>
        <p className="text-sm text-slate-300 font-light mt-3 leading-relaxed">
          {department.description}
        </p>
      </div>

      {/* Lead Consultant */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">Lead Clinical Chair</div>
            <div className="text-sm font-bold text-white">{department.leadConsultant}</div>
          </div>
        </div>
        <Badge variant="emerald" size="sm">Available</Badge>
      </div>

      {/* Key Services & Diagnostics Split */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Key Services */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-2">
          <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 mb-3">
            <Activity className="w-4 h-4 text-cyan-400" />
            Key Interventions
          </div>
          <ul className="space-y-2">
            {department.keyServices.map((service) => (
              <li key={service} className="text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{service}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Diagnostics & Stats */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-3">
          <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 mb-2">
            <Award className="w-4 h-4 text-indigo-400" />
            Clinical Diagnostics & Metrics
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-center font-mono-numbers">
            {department.stats.surgeriesPerYear && (
              <div className="p-2 rounded bg-slate-950 border border-white/5">
                <div className="text-base font-extrabold text-cyan-400">{department.stats.surgeriesPerYear}</div>
                <div className="text-[10px] text-slate-400 font-sans">Surgeries / Yr</div>
              </div>
            )}
            {department.stats.successRate && (
              <div className="p-2 rounded bg-slate-950 border border-white/5">
                <div className="text-base font-extrabold text-emerald-400">{department.stats.successRate}</div>
                <div className="text-[10px] text-slate-400 font-sans">Success Rate</div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
