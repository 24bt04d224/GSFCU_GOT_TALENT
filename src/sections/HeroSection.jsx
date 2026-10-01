import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { EVENT_DETAILS } from '../data/eventData';
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
              GSFC UNIVERSITY PRESENTS
            </span>
          </div>

          {/* Main Editorial Headline */}
          <div ref={titleRef} className="mb-4 sm:mb-6">
            <h1 className="font-bebas uppercase tracking-wide leading-[0.88] select-none text-white text-[2.85rem] xs:text-5xl sm:text-7xl lg:text-[7.5rem]">
              <span className="block text-[#F4E7D0]">GSFCU</span>
              <span className="block text-[#F4E7D0]">
                GOT <span className="text-[#C96B35]">TALENT</span>
              </span>
            </h1>
          </div>

          {/* Tagline */}
          <div ref={taglineRef} className="mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <span className="font-hand text-2xl xs:text-3xl sm:text-4xl text-[#C49A3A] font-bold">
                "Expect The Unexpected"
              </span>
              <span className="font-mono text-[9px] xs:text-[10px] text-[#68734A] uppercase tracking-widest border border-[#68734A]/40 bg-[#68734A]/10 px-2.5 py-0.5 rounded-sm font-semibold">
                2026 EDITION
              </span>
            </div>
          </div>

          {/* Event Meta Information */}
          <div ref={metaRef} className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-mono text-[#F4E7D0]/90 mb-8 sm:mb-10 pb-2">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#C96B35] shrink-0" />
              <div>
                <span className="text-[9px] xs:text-[10px] text-[#B5ACA0] block uppercase">EVENT DATE</span>
                <span className="font-bold text-[#F4E7D0]">29 OCTOBER 2026</span>
              </div>
            </div>

            <div className="hidden sm:block w-[1px] h-6 bg-white/15" />

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#C49A3A]/80 shrink-0" />
              <div>
                <span className="text-[9px] xs:text-[10px] text-[#B5ACA0] block uppercase">AUDITIONS</span>
                <span className="text-xs sm:text-sm text-[#F4E7D0]/80">22 OCTOBER 2026 • THURSDAY</span>
              </div>
            </div>

            <div className="hidden sm:block w-[1px] h-6 bg-white/15" />

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#C49A3A] shrink-0" />
              <div>
                <span className="text-[9px] xs:text-[10px] text-[#B5ACA0] block uppercase">VENUE</span>
                <span className="text-[#F4E7D0]">GSFC University Auditorium</span>
              </div>
            </div>
          </div>

          {/* Asymmetric Campaign CTAs */}
          <div ref={ctaGroupRef} className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              to="/register"
              className="group relative overflow-hidden rounded-md bg-[#C96B35] hover:bg-[#B65A3A] px-6 xs:px-8 py-3.5 xs:py-4 text-xs sm:text-sm font-mono font-extrabold tracking-widest text-[#F4E7D0] uppercase shadow-xl shadow-[#C96B35]/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-3 border border-[#C96B35] hover:border-[#B65A3A] min-h-[44px] w-full xs:w-auto text-center"
            >
              <span>REGISTER NOW</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <a
              href="#about"
              onClick={scrollToAbout}
              className="inline-flex items-center justify-center gap-2 text-xs font-mono tracking-widest text-[#B5ACA0] hover:text-[#F4E7D0] uppercase transition-colors group py-2.5 min-h-[44px] w-full xs:w-auto text-center"
            >
              <span>EXPLORE EVENT</span>
              <ArrowDown className="w-4 h-4 text-[#C49A3A] group-hover:translate-y-1 transition-transform" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
