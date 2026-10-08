import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Calendar, Clock, MapPin, ArrowRight, ArrowDown } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';
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

              GSFC UNIVERSITY PRESENTS
            </span>
          </div>

          {/* Main Title - Extreme Prominent Display Typography */}
          <div ref={titleRef} className="mb-4 sm:mb-5">
            <h1 className="font-bebas uppercase tracking-tight leading-[0.84] select-none text-[#F2E8D5] text-[3.6rem] xs:text-6xl sm:text-8xl lg:text-[7.8rem] xl:text-[8.5rem]">
              <span className="block text-[#F2E8D5]">GSFCU</span>
              <span className="block text-[#F2E8D5]">
                GOT <span className="text-[#E66F2E]">TALENT</span>

              </span>
            </h1>
          </div>

          {/* Tagline & Outlined Badge */}
          <div ref={taglineRef} className="mb-7 sm:mb-9">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="font-hand text-2xl sm:text-4xl lg:text-5xl text-[#D59A28] font-bold italic tracking-wide">
                "Expect The Unexpected"
              </span>
              <span className="font-mono text-[10px] text-[#BEB8AD] uppercase tracking-widest border border-white/12 bg-black/50 px-3 py-1 rounded-sm font-semibold">

                2026 EDITION
              </span>
            </div>
          </div>

          {/* Editorial Event Information Metadata Section */}
          <div ref={metaRef} className="mb-8 sm:mb-10 space-y-3.5">
            {/* Row 1: Auditions & Event Showcase */}
            <div className="flex flex-wrap items-center gap-y-3">
              {/* Auditions (Active primary date) */}
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#E66F2E] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] sm:text-[11px] font-mono font-medium tracking-[1px] text-[#F5EBD7]/70 uppercase block">
                    AUDITIONS
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-semibold tracking-[0.5px] text-[#F3E8D4] leading-[1.3] block">
                    {EVENT_DETAILS.displayAuditionDate}
                  </span>
                </div>
              </div>

              {/* Subtle Vertical Divider */}
              <div className="hidden sm:block w-[1px] h-6 bg-[#E66F2E]/25 mx-5 sm:mx-6" />

              {/* Grand Showcase (Hidden till 22 October) */}
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#E66F2E] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] sm:text-[11px] font-mono font-medium tracking-[1px] text-[#F5EBD7]/70 uppercase block">
                    GRAND SHOWCASE
                  </span>
                  {EVENT_DETAILS.isFinaleRevealed ? (
                    <span className="text-xs sm:text-sm font-mono font-semibold tracking-[0.5px] text-[#F3E8D4] leading-[1.3] block">
                      {EVENT_DETAILS.finaleDate}
                    </span>
                  ) : (
                    <span className="text-xs sm:text-sm font-mono font-semibold tracking-[0.5px] text-[#D59A28] leading-[1.3] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#D59A28] animate-pulse" />
                      REVEALING 22 OCT
                    </span>
                  )}
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

              </div>
            </div>
          </div>

          {/* Campaign CTA Area */}
          <div ref={ctaGroupRef} className="flex flex-wrap items-center gap-5 sm:gap-7">
            <Link
              to="/register"
              className="group relative overflow-hidden rounded-[8px] bg-[#E66F2E] hover:bg-[#d05e1f] px-8 py-4 text-xs sm:text-sm font-mono font-bold tracking-[0.15em] text-[#F2E8D5] uppercase shadow-xl shadow-[#E66F2E]/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 border border-[#E66F2E] min-h-[54px] w-full sm:w-auto text-center"
            >
              <span>REGISTER NOW</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

            </Link>

            <a
              href="#about"
              onClick={scrollToAbout}
              className="inline-flex items-center justify-center gap-2 text-xs font-mono tracking-[0.15em] text-[#BEB8AD] hover:text-[#E66F2E] uppercase transition-colors group py-3 min-h-[44px] w-full sm:w-auto text-center"
            >
              <span>EXPLORE EVENT</span>
              <ArrowDown className="w-4 h-4 text-[#E66F2E] group-hover:translate-y-1 transition-transform" />

            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
