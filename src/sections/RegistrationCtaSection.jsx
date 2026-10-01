import React from 'react';
import { Link } from 'react-router-dom';
import GarbaMandalaSVG from '../components/GarbaMandalaSVG';
import { EVENT_DETAILS } from '../data/eventData';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function RegistrationCtaSection() {
  return (
    <section className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0b0b0e] relative overflow-hidden text-center z-10 border-t border-white/10">
      
      {/* Background Mandala overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] opacity-15 pointer-events-none">
        <GarbaMandalaSVG />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Sparkles className="w-4 h-4 text-[#C96B35]" />
          <span className="font-mono text-xs tracking-widest text-[#C49A3A] uppercase font-bold">
            FINAL CALL FOR ENTRIES
          </span>
        </div>

        {/* Closing Headline */}
        <h2 className="font-bebas text-4xl xs:text-5xl sm:text-7xl lg:text-[7rem] uppercase tracking-wide text-[#F4E7D0] leading-none mb-3">
          THE STAGE IS <span className="text-[#C96B35]">YOURS.</span>
        </h2>

        {/* Sub-Tagline */}
        <p className="font-hand text-2xl xs:text-3xl sm:text-4xl text-[#C49A3A] mb-6 sm:mb-8">
          "Expect The Unexpected"
        </p>

        {/* Final CTA Button */}
        <Link
          to="/register"
          className="group relative overflow-hidden rounded-md bg-[#C96B35] hover:bg-[#B65A3A] px-6 xs:px-10 py-4 sm:py-5 text-xs xs:text-sm sm:text-base font-mono font-extrabold tracking-widest text-[#F4E7D0] uppercase shadow-2xl shadow-[#C96B35]/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 border border-[#C96B35] hover:border-[#B65A3A] min-h-[48px] w-full xs:w-auto"
        >
          <span>TAKE THE STAGE</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </Link>

        {/* Event Date Tag */}
        <p className="font-mono text-[10px] sm:text-xs text-[#B5ACA0] tracking-widest uppercase mt-6 sm:mt-8 border-t border-[#C49A3A]/20 pt-4 max-w-md mx-auto">
          29 OCTOBER 2026 • GSFC UNIVERSITY CAMPUS • ENTRY FREE
        </p>

      </div>
    </section>
  );
}
