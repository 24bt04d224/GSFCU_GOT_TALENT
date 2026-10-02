import React from 'react';
import { Link } from 'react-router-dom';
import { Mic2, Sparkles, Theater, Music, Laugh, Flame, ArrowRight } from 'lucide-react';

import catSinging from '../assets/cat_singing.png';
import catDance from '../assets/cat_dance.png';
import catDrama from '../assets/cat_drama.png';
import catInstrumental from '../assets/cat_instrumental.png';
import catComedy from '../assets/cat_comedy.png';
import catSpecial from '../assets/cat_special.png';

const CATEGORIES_DATA = [
  {
    number: "01",
    title: "SINGING",
    subtitle: "SOLO & GROUP VOCALS",
    description: "Showcase your vocal prowess across Indian classical, Bollywood, Western, semi-classical, or original compositions.",
    tags: ["Solo", "Group", "Acoustic", "Western", "Classical"],
    icon: Mic2,
    image: catSinging,
    id: "singing"
  },
  {
    number: "02",
    title: "DANCE",
    subtitle: "GARBA FUSION, CLASSICAL & HIP-HOP",
    description: "Bring the stage alive with expressive movement, traditional Navratri energy, contemporary choreography, or street styles.",
    tags: ["Classical", "Folk", "Western", "Hip-Hop", "Fusion"],
    icon: Sparkles,
    image: catDance,
    id: "dance"
  },
  {
    number: "03",
    title: "DRAMA / THEATRE",
    subtitle: "SKIT, MONO-ACT & STREET PLAY",
    description: "Captivate the audience through storytelling, dramatic expressions, theatrical skits, mime, or mono-acting.",
    tags: ["Skit", "Mono-act", "Street Play", "Mime"],
    icon: Theater,
    image: catDrama,
    id: "drama"
  },
  {
    number: "04",
    title: "INSTRUMENTAL",
    subtitle: "ACOUSTIC & ELECTRONIC PERFORMANCE",
    description: "Let your instrument speak through guitar, keyboard, flute, tabla, violin, drums, or full acoustic performances.",
    tags: ["Guitar", "Piano", "Violin", "Flute", "Tabla"],
    icon: Music,
    image: catInstrumental,
    id: "instrumental"
  },
  {
    number: "05",
    title: "STAND-UP / COMEDY",
    subtitle: "SOLO COMEDY & IMPROV ACTS",
    description: "Deliver sharp, relatable college humour, mimicry, improv, or original comedy that leaves the audience laughing.",
    tags: ["Solo", "Improv", "Stand-up", "Sketch"],
    icon: Laugh,
    image: catComedy,
    id: "comedy"
  },
  {
    number: "06",
    title: "OTHER / SPECIAL TALENT",
    subtitle: "UNCONVENTIONAL & SPECIAL ACTS",
    description: "Have a unique talent? This is your stage.",
    tags: ["Poetry", "Rap", "Magic", "Beatbox", "Any Other"],
    icon: Flame,
    image: catSpecial,
    id: "other"
  }
];

export default function CategoriesSection() {
  return (
    <section id="talents" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#0b0b0e] relative z-20 border-t border-[#C49A3A]/15">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-6 border-b border-[#C49A3A]/15 pb-8 sm:pb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-[2px] bg-[#C96B35]" />
              <span className="font-mono text-xs tracking-widest text-[#C96B35] uppercase font-bold">
                CATEGORIES
              </span>
            </div>
            <h2 className="font-bebas text-4xl xs:text-5xl sm:text-7xl uppercase tracking-wide text-[#F4E7D0] leading-none">
              FIND YOUR <span className="text-[#C96B35]">STAGE</span>
            </h2>
            <p className="font-hand text-lg xs:text-xl sm:text-2xl text-[#C49A3A] mt-1.5 font-bold">
              "Different Talents. One Platform."
            </p>
          </div>
          
          <div className="max-w-md">
            <p className="text-xs sm:text-sm text-[#B5ACA0] leading-relaxed font-sans">
              Explore the categories and choose how you want to express your talent. Whether it's your voice, moves, ideas or humour — there's a stage for you.
            </p>
          </div>
        </div>

        {/* 2-Column Grid of 6 Large Horizontal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {CATEGORIES_DATA.map((cat) => {
            const IconComponent = cat.icon;

            return (
              <div
                key={cat.id}
                className="group relative bg-[#0f0e13] border border-[#C49A3A]/20 hover:border-[#C96B35]/50 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl shadow-black/40 hover:shadow-[#C96B35]/10 transition-all duration-300 flex flex-row items-stretch min-h-[220px] xs:min-h-[240px] sm:min-h-[260px]"
              >
                {/* Left Content Area (62% width) */}
                <div className="w-[62%] xs:w-[65%] p-4 xs:p-5 sm:p-6 flex flex-col justify-between z-10 bg-gradient-to-r from-[#0f0e13] via-[#0f0e13] to-[#0f0e13]/90">
                  <div>
                    {/* Number & Icon header */}
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#C96B35]">
                        {cat.number}
                      </span>
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-[#C49A3A] group-hover:text-[#C96B35] transition-colors shrink-0" />
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="font-bebas text-xl xs:text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wide text-[#F4E7D0] group-hover:text-[#F4E7D0] transition-colors leading-none mb-1">
                      {cat.title}
                    </h3>
                    <p className="font-mono text-[9px] xs:text-[10px] sm:text-xs text-[#C49A3A] uppercase tracking-wider mb-2.5">
                      {cat.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-[11px] xs:text-xs sm:text-sm text-[#B5ACA0] leading-snug sm:leading-relaxed font-sans mb-3 sm:mb-4 line-clamp-3">
                      {cat.description}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 xs:gap-1.5 mb-3 sm:mb-4">
                      {cat.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] xs:text-[10px] font-mono text-[#F4E7D0]/90 bg-[#C49A3A]/5 border border-[#C49A3A]/20 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Register Action */}
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-1.5 font-mono text-[11px] xs:text-xs font-bold tracking-wider text-[#C96B35] group-hover:text-[#F4E7D0] uppercase transition-colors pt-1"
                    >
                      <span>REGISTER</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform text-[#C96B35] group-hover:text-[#F4E7D0]" />
                    </Link>
                  </div>
                </div>

                {/* Right Image Area (38% width) */}
                <div className="w-[38%] xs:w-[35%] relative overflow-hidden shrink-0 bg-[#08080a]">
                  <img
                    src={cat.image}
                    alt={`${cat.title} performance`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                  />
                  {/* Subtle blend gradient on left edge of photograph */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0f0e13] via-[#0f0e13]/40 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0e13]/80 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
