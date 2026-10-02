import React from 'react';
import { IMPORTANT_INFO } from '../data/eventData';
import { Info, Calendar, ShieldCheck, UserCheck, Music, Bell } from 'lucide-react';

const INFO_ICONS = [Calendar, ShieldCheck, UserCheck, Music, Bell];

export default function ImportantInfoSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#0b0b0e] border-y border-[#C49A3A]/15 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 sm:mb-10">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#C96B35]/10 flex items-center justify-center text-[#C96B35] shrink-0 border border-[#C96B35]/20">
            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] sm:text-xs tracking-widest text-[#C49A3A] uppercase block">
              OFFICIAL EVENT BRIEFING
            </span>
            <h2 className="font-syne font-extrabold text-xl xs:text-2xl sm:text-3xl uppercase tracking-tight text-[#F4E7D0]">
              IMPORTANT INFORMATION
            </h2>
          </div>
        </div>

        {/* Structured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {IMPORTANT_INFO.map((info, idx) => {
            const Icon = INFO_ICONS[idx % INFO_ICONS.length];
            return (
              <div
                key={idx}
                className="bg-[#121217] border border-[#C49A3A]/20 rounded-xl p-5 sm:p-6 flex flex-col gap-3 hover:border-[#C96B35]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#C96B35] shrink-0" />
                  <h3 className="font-syne font-bold text-sm sm:text-base text-[#F4E7D0]">
                    {info.title}
                  </h3>
                </div>
                <p className="text-xs text-[#B5ACA0] leading-relaxed">
                  {info.detail}
                </p>
                <span className="text-[10px] font-mono text-[#C49A3A]/70 uppercase pt-2 border-t border-[#C49A3A]/15">
                  Organizing Committee Notice
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
