import React from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { useUIStore } from '../../stores/uiStore';
import { Search, ArrowRight, Menu } from 'lucide-react';

export const Header: React.FC = () => {
  const { isScrolled } = useScrollProgress();
  const { toggleCommandPalette, openAppointmentModal, toggleMobileNav, setCursorMode } = useUIStore();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md py-3.5 border-b border-slate-200/80 shadow-sm text-slate-900'
          : 'bg-transparent py-5 text-slate-900'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo - Minimal Flagship matching reference */}
          <a href="#hero" className="flex items-center gap-3 group">
            {/* Elegant Chevron "A" Icon */}
            <div className="relative w-7 h-7 flex items-center justify-center">
              <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7 text-teal-700 transition-transform group-hover:scale-105">
                <path d="M16 4L4 28H11L16 17L21 28H28L16 4Z" fill="currentColor" />
                <path d="M16 11L11.5 21H20.5L16 11Z" fill="#0284C7" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="text-sm sm:text-base font-black tracking-widest text-slate-900 uppercase font-sans leading-none">
                AURELIA NOVA
              </div>
              <div className="text-[9px] tracking-widest text-slate-500 font-mono uppercase mt-0.5">
                INSTITUTE OF ADVANCED MULTISPECIALITY CARE
              </div>
            </div>
          </a>

          {/* Center Navigation matching reference */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-sans tracking-wide font-medium text-slate-700">
            <a href="#hero" className="text-slate-900 font-bold border-b-2 border-teal-700 pb-0.5">Home</a>
            <a href="#visit-reimagined" className="hover:text-teal-700 transition-colors">About</a>
            <a href="#specialists" className="hover:text-teal-700 transition-colors">Specialities</a>
            <a href="#doctors" className="hover:text-teal-700 transition-colors">Our Doctors</a>
            <a href="#at-a-glance" className="hover:text-teal-700 transition-colors">Patient Care</a>
            <a href="#emergency" className="hover:text-teal-700 transition-colors">Contact</a>
          </nav>

          {/* Right Action Controls matching reference */}
          <div className="flex items-center gap-4">

            {/* Search Icon */}
            <button
              onClick={toggleCommandPalette}
              onMouseEnter={() => setCursorMode('explore')}
              onMouseLeave={() => setCursorMode('default')}
              className="p-2 text-slate-600 hover:text-teal-700 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <span className="hidden sm:inline-block w-px h-4 bg-slate-300" />

            {/* Care Beyond Today Action Pill Button */}
            <button
              onClick={() => openAppointmentModal()}
              onMouseEnter={() => setCursorMode('book')}
              onMouseLeave={() => setCursorMode('default')}
              className="hidden sm:inline-flex items-center gap-2.5 px-5 py-2 text-xs font-mono tracking-widest font-semibold text-slate-800 border border-slate-300 rounded-full hover:border-teal-700 hover:text-teal-800 hover:bg-teal-50/50 transition-all cursor-pointer shadow-xs"
            >
              <span>CARE BEYOND TODAY</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={toggleMobileNav}
              className="lg:hidden p-2 text-slate-700 hover:text-teal-700"
              aria-label="Open navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};


