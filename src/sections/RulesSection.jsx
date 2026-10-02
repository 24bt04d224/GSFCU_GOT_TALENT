import React from 'react';
import { RULES_AND_GUIDELINES } from '../data/eventData';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function RulesSection() {
  return (
    <section id="rules" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#08080a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-4 sm:gap-6">
          <div>
            <span className="font-mono text-xs tracking-widest text-[#C96B35] uppercase block mb-2 sm:mb-3">
              OFFICIAL CODE OF CONDUCT
            </span>
            <h2 className="font-syne font-extrabold text-3xl xs:text-4xl sm:text-5xl uppercase tracking-tight text-[#F4E7D0]">
              RULES & <span className="text-[#C49A3A]">GUIDELINES</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#B5ACA0] bg-[#C49A3A]/10 px-3.5 sm:px-4 py-2 rounded-lg border border-[#C49A3A]/20 self-start md:self-auto">
            <ShieldAlert className="w-4 h-4 text-[#C96B35] shrink-0" />
            <span>Strict Adherence Required for All Participants</span>
          </div>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {RULES_AND_GUIDELINES.map((rule) => (
            <div
              key={rule.id}
              className="bg-[#101014] border border-[#C49A3A]/15 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#C49A3A]/40 transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-[#C96B35] bg-[#C96B35]/10 px-2.5 py-1 rounded-md border border-[#C96B35]/25 font-bold">
                    RULE #{rule.id.toString().padStart(2, '0')}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[#68734A] opacity-75 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="font-syne font-bold text-base sm:text-lg text-[#F4E7D0] mb-2 group-hover:text-[#C49A3A] transition-colors">
                  {rule.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-[#B5ACA0] leading-relaxed">
                  {rule.content}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#C49A3A]/15 flex items-center justify-between text-[11px] font-mono text-[#B5ACA0]/60">
                <span>VERIFIED BY COMMITTEE</span>
                <span>GSFCU 2026</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
