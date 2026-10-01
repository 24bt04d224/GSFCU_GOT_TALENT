import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/eventData';
import { UserCheck, Radio, Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEP_ICONS = [UserCheck, Radio, Trophy];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#08080a] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 sm:mb-16">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-[2px] bg-[#C96B35]" />
            <span className="font-mono text-xs tracking-widest text-[#C49A3A] uppercase font-bold">
              EVENT FORMAT & ROADMAP
            </span>
          </div>
          <h2 className="font-bebas text-4xl xs:text-5xl sm:text-7xl uppercase tracking-wide text-[#F4E7D0]">
            HOW IT <span className="text-[#C96B35]">WORKS</span>
          </h2>
        </div>

        {/* Editorial Sequence Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          
          {/* Horizontal Editorial Connector Bar */}
          <div className="hidden md:block absolute top-12 left-8 right-8 h-[1px] bg-white/10 z-0" />

          {HOW_IT_WORKS_STEPS.map((stepItem, idx) => {
            const Icon = STEP_ICONS[idx] || UserCheck;
            return (
              <div
                key={stepItem.step}
                className="relative z-10 bg-[#0f0e13] border border-[#C49A3A]/20 rounded-xl p-5 sm:p-8 flex flex-col justify-between hover:border-[#C96B35]/50 transition-all duration-300 group"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#08080a] border border-[#C49A3A]/25 flex items-center justify-center text-[#C96B35] group-hover:bg-[#C96B35] group-hover:text-[#F4E7D0] transition-colors duration-300 shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="font-bebas text-5xl sm:text-6xl text-[#F4E7D0]/10 group-hover:text-[#C49A3A]/40 transition-colors leading-none">
                      {stepItem.step}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-bebas text-2xl xs:text-3xl uppercase tracking-wide text-[#F4E7D0] mb-1">
                    {stepItem.title}
                  </h3>
                  <p className="font-mono text-[11px] sm:text-xs text-[#C49A3A] uppercase tracking-wider mb-3 sm:mb-4">
                    {stepItem.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-[#B5ACA0] leading-relaxed font-sans">
                    {stepItem.description}
                  </p>
                </div>

                {/* Bottom Step Action */}
                <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#B5ACA0]">
                  <span>STAGE PHASE {stepItem.step}</span>
                  {idx === 0 && (
                    <Link to="/register" className="text-[#C96B35] font-bold hover:underline flex items-center gap-1 min-h-[36px]">
                      TAKE THE STAGE <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
