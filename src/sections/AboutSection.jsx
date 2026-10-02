import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import aboutDancePerfImg from '../assets/about_dance_perf.png';
import { Users, Award, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const textRef = useRef(null);
  const photoRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      gsap.fromTo(
        photoRef.current,
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          },
        }
      );

      gsap.fromTo(
        featuresRef.current,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Users,
      title: "EXPERT JURY PANEL",
      desc: "Performed before respected faculty and guest judges.",
    },
    {
      icon: Award,
      title: "GRAND AWARDS",
      desc: "Trophies, certificates & cash prizes across all categories.",
    },
    {
      icon: Star,
      title: "UNIVERSITY FAME",
      desc: "Showcase your genius before a live student audience.",
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-12 bg-[#08080a] relative overflow-hidden text-[#F4E7D0] border-t border-[#C49A3A]/20"
    >
      {/* Subtle warm light spill behind photograph */}
      <div className="absolute top-1/3 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#C96B35]/4 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Main Two-Column Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE: Content (Approx 50% width) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Top Label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-[1.5px] bg-[#C96B35]" />
              <span className="font-mono text-xs tracking-[0.25em] text-[#C96B35] uppercase font-semibold">
                ABOUT THE EVENT
              </span>
            </div>

            {/* Main Heading */}
            <h2
              ref={headlineRef}
              className="font-bebas uppercase text-5xl xs:text-6xl sm:text-7xl lg:text-8xl tracking-wider text-[#F4E7D0] leading-[0.9] mb-8"
            >
              <div>YOUR STAGE.</div>
              <div className="text-[#C96B35]">YOUR TALENT.</div>
              <div className="font-hand font-normal text-4xl sm:text-6xl lg:text-7xl text-[#C49A3A] tracking-normal normal-case mt-1">
                YOUR MOMENT.
              </div>
            </h2>

            {/* Paragraph Description */}
            <div ref={textRef} className="space-y-6 text-sm sm:text-base text-[#B5ACA0] leading-relaxed font-sans max-w-xl">
              <p>
                <strong className="text-[#F4E7D0] font-semibold">GSFCU Got Talent 2026</strong> is the premier annual talent showcase of GSFC University. Designed to celebrate raw student passion, artistic mastery, and live performance courage during the vibrant <span className="text-[#C49A3A] font-medium">Navratri season</span>.
              </p>
              <p>
                Whether you are a vocalist, classical or contemporary dancer, theatrical actor, instrumentalist, or stand-up comic, this is your platform to break boundaries and command the auditorium spotlight.
              </p>
            </div>

          </div>

          {/* RIGHT SIDE: Cinematic Stage Photograph (Approx 50% width) */}
          <div ref={photoRef} className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] rounded-[10px] bg-[#121218] border border-[#C49A3A]/25 shadow-2xl overflow-hidden group">
              <img
                src={aboutDancePerfImg}
                alt="GSFCU Stage Dancer Performance"
                className="w-full h-full object-cover rounded-[10px] filter brightness-95 group-hover:scale-102 transition-transform duration-700"
              />
              {/* Subtle dark gradient overlay at bottom to blend into dark background */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/30 to-transparent pointer-events-none" />

              {/* Handwritten caption near lower right */}
              <div className="absolute bottom-6 right-6 text-right z-10 pointer-events-none">
                <span className="font-hand text-2xl sm:text-3xl lg:text-4xl text-[#C49A3A] block leading-tight drop-shadow-md">
                  Different Talents.<br />
                  One Platform.
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM HIGHLIGHTS: Clean Horizontal Editorial Feature Row */}
        <div ref={featuresRef} className="mt-16 sm:mt-24 pt-10 sm:pt-14 border-t border-[#C49A3A]/20">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#C49A3A]/20">
            {features.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  className="py-6 md:py-0 md:px-8 first:pl-0 last:pr-0 flex flex-col gap-3 group"
                >
                  <IconComponent className="w-5 h-5 text-[#C96B35] stroke-[1.5] transition-transform duration-300 group-hover:scale-110" />
                  <div>
                    <h3 className="font-bebas text-xl sm:text-2xl text-[#F4E7D0] tracking-wider uppercase mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#B5ACA0] leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

