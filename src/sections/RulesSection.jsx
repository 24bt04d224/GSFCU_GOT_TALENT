import React from 'react';
import { ShieldCheck, Clock, Mic, Music, Award, Users, Shield } from 'lucide-react';

const RULES_DATA = [
  {
    id: 1,
    ruleNumber: 'RULE #01',
    icon: ShieldCheck,
    title: 'Student Identity Verification',
    content: 'All participants must present their official GSFC University student ID card during audition check-in on 22 October 2026 and stage performances.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    ruleNumber: 'RULE #02',
    icon: Clock,
    title: 'Time Limit Compliance',
    content: 'Performances must strictly adhere to the designated time limits: Solo acts (3–5 mins), Group acts (5–8 mins). Exceeding time limits may result in point deductions.',
    image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    ruleNumber: 'RULE #03',
    icon: Mic,
    title: 'Decorum & Content Policy',
    content: 'Performances must maintain dignity. Any content containing vulgarity, offensive religious/political statements, or inappropriate gestures will lead to immediate disqualification.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    ruleNumber: 'RULE #04',
    icon: Music,
    title: 'Track & Prop Submissions',
    content: 'Audio backing tracks (MP3 format, 320kbps) and prop requirements must be submitted to the organizing committee 48 hours prior to audition day.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    ruleNumber: 'RULE #05',
    icon: Award,
    title: 'Jury Decision Finality',
    content: 'The decisions made by the official judge panel regarding audition scoring and finalist selection are absolute and binding.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    ruleNumber: 'RULE #06',
    icon: Users,
    title: 'Group Representation',
    content: 'For group events, all team members must belong to GSFC University. A designated team leader will serve as the primary contact person.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
  },
];

export default function RulesSection() {
  return (
    <section id="rules" className="pt-8 sm:pt-12 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-[#070909] relative overflow-hidden">
      {/* Subtle Warm Atmospheric Ambient Lighting */}
      <div className="absolute top-10 left-0 w-96 h-96 bg-[#E56F2D]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#C99A28]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Editorial Section Header */}
        <div data-reveal className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            {/* Small Orange Line before Heading */}
            <div className="w-12 sm:w-16 h-[3px] bg-[#E56F2D] mb-4" />
            <h2 className="font-bebas text-5xl sm:text-7xl lg:text-8xl tracking-wider leading-none uppercase">
              <span className="text-[#F3E8D4]">RULES & </span>
              <span className="text-[#E56F2D]">GUIDELINES</span>
            </h2>
          </div>

          {/* Premium Status Badge */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#101416]/80 backdrop-blur-md border border-[#E56F2D]/35 self-start lg:self-auto shadow-lg">
            <Shield className="w-4 h-4 text-[#E56F2D] shrink-0" />
            <span className="text-[11px] font-mono tracking-widest text-[#F3E8D4] uppercase font-semibold">
              STRICT ADHERENCE REQUIRED FOR ALL PARTICIPANTS
            </span>
          </div>
        </div>

        {/* 3x2 Cinematic Rule Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {RULES_DATA.map((rule, idx) => {
            const IconComponent = rule.icon;
            return (
              <div
                key={rule.id}
                data-reveal
                data-reveal-delay={String((idx % 3) + 1)}
                className="group relative hover-lift bg-[#101416] border border-[#E56F2D]/28 rounded-2xl p-7 sm:p-8 flex flex-col justify-between min-h-[300px] overflow-hidden transition-all duration-500 hover:border-[#E56F2D]/65 hover:shadow-2xl hover:shadow-[#E56F2D]/10"
              >

                {/* Integrated Background Photography with Gradient Masking (Occupies Right 45%) */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 right-0 w-[55%] h-full">
                    <img
                      src={rule.image}
                      alt={rule.title}
                      className="w-full h-full object-cover object-center opacity-40 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  </div>
                  {/* Smooth Gradient Overlay: Dark left to translucent right */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#101416] via-[#101416]/90 via-55% to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101416] via-transparent to-transparent opacity-80" />
                </div>

                {/* Card Content - Z-Index 10 for absolute legibility */}
                <div className="relative z-10">
                  {/* Top: Premium Icon Container & Rule Number */}
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className="w-12 h-12 rounded-xl border border-[#E56F2D]/60 bg-[#070909]/80 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner group-hover:border-[#E56F2D] transition-colors">
                      <IconComponent className="w-5 h-5 text-[#E56F2D]" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#E56F2D] uppercase tracking-[1.5px]">
                      {rule.ruleNumber}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="font-bebas text-2xl sm:text-[27px] tracking-wide text-[#F3E8D4] leading-tight mb-2.5 font-bold group-hover:text-white transition-colors">
                    {rule.title}
                  </h3>

                  {/* Card Body Text */}
                  <p className="text-xs sm:text-[14px] text-[#F3E8D4]/72 leading-[1.6] max-w-[84%] font-sans">
                    {rule.content}
                  </p>
                </div>

                {/* Bottom Metadata & Divider */}
                <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-wider text-[#B9B4AA] uppercase">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-[1.5px] bg-[#E56F2D]" />
                    <span>VERIFIED BY COMMITTEE</span>
                  </span>
                  <span className="font-semibold text-[#B9B4AA]/80">GSFCU 2026</span>
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
