import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Calendar, Clock, MapPin, ArrowRight, ArrowDown } from 'lucide-react';
import heroBgImg from '../assets/hero_bg.png';

export default function HeroSection() {
  const containerRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const metaRef = useRef(null);
  const ctaGroupRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        containerRef.current,
        { opacity: 0.8 },
        { opacity: 1, duration: 0.8 }
      )
      .fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      )
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.3"
      )
      .fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.4"
      )
      .fromTo(
        metaRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      )
      .fromTo(
        ctaGroupRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.3"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToAbout = (e) => {
    e.preventDefault();
    const el = document.querySelector('#about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
<<<<<<< HEAD
      className="relative w-full min-h-screen min-h-[100svh] lg:min-h-[100dvh] pt-24 sm:pt-28 lg:pt-0 pb-16 sm:pb-20 lg:pb-0 flex items-center bg-[#08080a] overflow-hidden select-none"
      style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {/* FULL-BLEED CONTINUOUS STAGE PHOTOGRAPH BACKGROUND */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-no-repeat bg-[position:88%_center] xs:bg-[position:90%_center] sm:bg-[position:92%_center] lg:bg-[position:right_center] z-0 transition-all duration-300"
        style={{ backgroundImage: `url(${heroBgImg})` }}
      />

      {/* TACTILE FINE GRAIN OVERLAY */}
      <div className="absolute inset-0 bg-grain opacity-20 sm:opacity-25 z-10 pointer-events-none" />

      {/* DIRECTIONAL GRADIENT OVERLAY FOR TEXT LEGIBILITY ONLY */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-[#08080a]/90 45% via-[#08080a]/40 70% to-transparent w-full sm:w-[85%] lg:w-[70%] z-10 pointer-events-none" />
      
      {/* SOFT BOTTOM BLEND TO CONTINUOUS PAGE BACKGROUND */}
      <div className="absolute bottom-0 inset-x-0 h-24 sm:h-36 lg:h-40 bg-gradient-to-t from-[#08080a] via-[#08080a]/60 to-transparent z-10 pointer-events-none" />

      {/* HERO CONTENT - PLACED DIRECTLY OVER ACCESSIBLE LEFT AREA */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-20 pt-4 sm:pt-8 lg:pt-24">
        <div className="max-w-2xl text-left">
          
          {/* Eyebrow */}
          <div ref={eyebrowRef} className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
            <span className="w-6 sm:w-8 h-[2px] bg-[#C96B35] shrink-0" />
            <span className="font-mono text-[10px] xs:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#C49A3A] uppercase font-bold">
=======
      className="relative w-full min-h-screen lg:h-screen pt-20 sm:pt-24 lg:pt-28 pb-16 flex items-center bg-[#050708] overflow-hidden select-none"
    >
      {/* FULL-BLEED STAGE PHOTOGRAPH BACKGROUND */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-no-repeat bg-[position:85%_center] sm:bg-[position:90%_center] lg:bg-[position:right_center] z-0 transition-transform duration-1000 scale-[1.01]"
        style={{ backgroundImage: `url(${heroBgImg})` }}
      />

      {/* TACTILE FINE GRAIN & ATMOSPHERIC OVERLAY */}
      <div className="absolute inset-0 bg-grain opacity-20 z-10 pointer-events-none" />

      {/* CINEMATIC DIRECTIONAL GRADIENT OVERLAY FOR TEXT READABILITY */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(5,7,8,0.98) 0%, rgba(5,7,8,0.92) 32%, rgba(5,7,8,0.68) 58%, rgba(5,7,8,0.15) 100%)'
        }}
      />
      
      {/* SUBTLE BOTTOM VIGNETTE GRADIENT */}
      <div className="absolute bottom-0 inset-x-0 h-28 sm:h-40 bg-gradient-to-t from-[#050708] via-[#050708]/60 to-transparent z-10 pointer-events-none" />

      {/* HERO CONTENT CONTAINER - LEFT EDITORIAL ALIGNMENT */}
      <div className="max-w-[1680px] mx-auto w-full px-6 sm:px-10 lg:px-12 relative z-20 pt-6 sm:pt-8 lg:pt-12">
        <div className="max-w-[650px] text-left">
          
          {/* Small Eyebrow */}
          <div ref={eyebrowRef} className="flex items-center gap-3 mb-4 sm:mb-5">
            <span className="w-6 sm:w-8 h-[1.5px] bg-[#E66F2E] shrink-0" />
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.28em] text-[#E66F2E] uppercase font-semibold">
>>>>>>> 5d886f7 (Updated Changes)
              GSFC UNIVERSITY PRESENTS
            </span>
          </div>

<<<<<<< HEAD
          {/* Main Editorial Headline */}
          <div ref={titleRef} className="mb-4 sm:mb-6">
            <h1 className="font-bebas uppercase tracking-wide leading-[0.88] select-none text-[#F4E7D0] text-[2.85rem] xs:text-5xl sm:text-7xl lg:text-[7.5rem]">
              <span className="block text-[#F4E7D0]">GSFCU</span>
              <span className="block text-[#F4E7D0]">
                GOT <span className="text-[#C96B35]">TALENT</span>
=======
          {/* Main Title - Extreme Prominent Display Typography */}
          <div ref={titleRef} className="mb-4 sm:mb-5">
            <h1 className="font-bebas uppercase tracking-tight leading-[0.84] select-none text-[#F2E8D5] text-[3.6rem] xs:text-6xl sm:text-8xl lg:text-[7.8rem] xl:text-[8.5rem]">
              <span className="block text-[#F2E8D5]">GSFCU</span>
              <span className="block text-[#F2E8D5]">
                GOT <span className="text-[#E66F2E]">TALENT</span>
>>>>>>> 5d886f7 (Updated Changes)
              </span>
            </h1>
          </div>

<<<<<<< HEAD
          {/* Tagline */}
          <div ref={taglineRef} className="mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <span className="font-hand text-2xl xs:text-3xl sm:text-4xl text-[#C49A3A] font-bold">
                "Expect The Unexpected"
              </span>
              <span className="font-mono text-[9px] xs:text-[10px] text-[#68734A] uppercase tracking-widest border border-[#68734A]/40 bg-[#68734A]/10 px-2.5 py-0.5 rounded-sm font-semibold">
=======
          {/* Tagline & Outlined Badge */}
          <div ref={taglineRef} className="mb-7 sm:mb-9">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="font-hand text-2xl sm:text-4xl lg:text-5xl text-[#D59A28] font-bold italic tracking-wide">
                "Expect The Unexpected"
              </span>
              <span className="font-mono text-[10px] text-[#BEB8AD] uppercase tracking-widest border border-white/12 bg-black/50 px-3 py-1 rounded-sm font-semibold">
>>>>>>> 5d886f7 (Updated Changes)
                2026 EDITION
              </span>
            </div>
          </div>

<<<<<<< HEAD
          {/* Event Meta Information */}
          <div ref={metaRef} className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-mono text-[#F4E7D0]/90 mb-8 sm:mb-10 pb-2">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#C96B35] shrink-0" />
              <div>
                <span className="text-[9px] xs:text-[10px] text-[#B5ACA0] block uppercase">EVENT DATE</span>
                <span className="font-bold text-[#F4E7D0]">29 OCTOBER 2026</span>
              </div>
            </div>

            <div className="hidden sm:block w-[1px] h-6 bg-[#C49A3A]/25" />

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#C49A3A]/80 shrink-0" />
              <div>
                <span className="text-[9px] xs:text-[10px] text-[#B5ACA0] block uppercase">AUDITIONS</span>
                <span className="text-xs sm:text-sm text-[#F4E7D0]/80">22 OCTOBER 2026 • THURSDAY</span>
              </div>
            </div>

            <div className="hidden sm:block w-[1px] h-6 bg-[#C49A3A]/25" />

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#C49A3A] shrink-0" />
              <div>
                <span className="text-[9px] xs:text-[10px] text-[#B5ACA0] block uppercase">VENUE</span>
                <span className="text-[#F4E7D0]">GSFC University Auditorium</span>
=======
          {/* Editorial Event Information Metadata Section */}
          <div ref={metaRef} className="mb-8 sm:mb-10 space-y-3.5">
            {/* Row 1: Event Date & Auditions */}
            <div className="flex flex-wrap items-center gap-y-3">
              {/* Event Date */}
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#E66F2E] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] sm:text-[11px] font-mono font-medium tracking-[1px] text-[#F5EBD7]/70 uppercase block">
                    EVENT DATE
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-semibold tracking-[0.5px] text-[#F3E8D4] leading-[1.3] block">
                    29 OCTOBER 2026
                  </span>
                </div>
              </div>

              {/* Subtle Vertical Divider */}
              <div className="hidden sm:block w-[1px] h-6 bg-[#E66F2E]/25 mx-5 sm:mx-6" />

              {/* Auditions */}
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#E66F2E] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] sm:text-[11px] font-mono font-medium tracking-[1px] text-[#F5EBD7]/70 uppercase block">
                    AUDITIONS
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-semibold tracking-[0.5px] text-[#F3E8D4] leading-[1.3] block">
                    22 OCTOBER 2026 • THURSDAY
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2: Venue */}
            <div className="flex items-start gap-2.5 pt-0.5">
              <MapPin className="w-4 h-4 text-[#E66F2E] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] sm:text-[11px] font-mono font-medium tracking-[1px] text-[#F5EBD7]/70 uppercase block">
                  VENUE
                </span>
                <span className="text-xs sm:text-sm font-mono font-semibold tracking-[0.5px] text-[#F3E8D4] leading-[1.3] block">
                  Aanganva, GSFC University
                </span>
>>>>>>> 5d886f7 (Updated Changes)
              </div>
            </div>
          </div>

<<<<<<< HEAD
          {/* Asymmetric Campaign CTAs */}
          <div ref={ctaGroupRef} className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              to="/register"
              className="group relative overflow-hidden rounded-md bg-[#C96B35] hover:bg-[#B65A3A] px-6 xs:px-8 py-3.5 xs:py-4 text-xs sm:text-sm font-mono font-extrabold tracking-widest text-[#F4E7D0] uppercase shadow-xl shadow-[#C96B35]/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-3 border border-[#C96B35] hover:border-[#B65A3A] min-h-[44px] w-full xs:w-auto text-center"
            >
              <span>REGISTER NOW</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
=======
          {/* Campaign CTA Area */}
          <div ref={ctaGroupRef} className="flex flex-wrap items-center gap-5 sm:gap-7">
            <Link
              to="/register"
              className="group relative overflow-hidden rounded-[8px] bg-[#E66F2E] hover:bg-[#d05e1f] px-8 py-4 text-xs sm:text-sm font-mono font-bold tracking-[0.15em] text-[#F2E8D5] uppercase shadow-xl shadow-[#E66F2E]/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 border border-[#E66F2E] min-h-[54px] w-full sm:w-auto text-center"
            >
              <span>REGISTER NOW</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
>>>>>>> 5d886f7 (Updated Changes)
            </Link>

            <a
              href="#about"
              onClick={scrollToAbout}
<<<<<<< HEAD
              className="inline-flex items-center justify-center gap-2 text-xs font-mono tracking-widest text-[#B5ACA0] hover:text-[#F4E7D0] uppercase transition-colors group py-2.5 min-h-[44px] w-full xs:w-auto text-center"
            >
              <span>EXPLORE EVENT</span>
              <ArrowDown className="w-4 h-4 text-[#C49A3A] group-hover:translate-y-1 transition-transform" />
=======
              className="inline-flex items-center justify-center gap-2 text-xs font-mono tracking-[0.15em] text-[#BEB8AD] hover:text-[#E66F2E] uppercase transition-colors group py-3 min-h-[44px] w-full sm:w-auto text-center"
            >
              <span>EXPLORE EVENT</span>
              <ArrowDown className="w-4 h-4 text-[#E66F2E] group-hover:translate-y-1 transition-transform" />
>>>>>>> 5d886f7 (Updated Changes)
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
