import React from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { EVENT_DETAILS } from '../data/eventData';
import { Sparkles, AtSign, Mail, MapPin, Calendar, ArrowUp } from 'lucide-react';

export default function Footer() {
=======
import { Sparkles, Calendar, MapPin, Mail, AtSign, ArrowUp, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { canAccessPortal, loading } = useAuth();

>>>>>>> 5d886f7 (Updated Changes)
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
<<<<<<< HEAD
    <footer className="bg-[#050507] border-t border-[#C49A3A]/20 text-[#F4E7D0] pt-12 sm:pt-16 pb-8 sm:pb-12 relative overflow-hidden">
      {/* Subtle top ambient bar */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C96B35] to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 pb-8 sm:pb-12 border-b border-[#C49A3A]/15">
          
          {/* Brand & Tagline Column */}
          <div className="sm:col-span-2 md:col-span-5 flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#C96B35] to-[#C49A3A] flex items-center justify-center p-0.5 shrink-0">
                <div className="w-full h-full bg-[#08080a] rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#C96B35]" />
                </div>
              </div>
              <span className="font-syne font-extrabold text-lg sm:text-xl tracking-tight text-[#F4E7D0]">
                GSFCU <span className="text-[#C96B35]">GOT TALENT</span>
              </span>
            </div>
            
            <p className="font-syne font-bold text-xl sm:text-2xl tracking-tight text-[#C49A3A] uppercase">
              "{EVENT_DETAILS.tagline}"
            </p>
            
            <p className="text-xs text-[#B5ACA0] leading-relaxed max-w-sm">
              The flagship annual talent showcase of GSFC University. Celebrating raw student passion, artistic mastery, and cinematic stage performances.
            </p>

            <div className="pt-1 flex items-center gap-3">
              <span className="inline-block px-3 py-1 rounded-full bg-[#C96B35]/10 border border-[#C96B35]/25 text-[10px] sm:text-[11px] font-mono text-[#C96B35] tracking-wider uppercase">
                {EVENT_DETAILS.season}
=======
    <footer className="bg-[#050507] border-t border-[#3A3029] text-[#F4E7D0] pt-14 sm:pt-18 pb-8 sm:pb-12 relative overflow-hidden font-sans">
      {/* Subtle top ambient divider line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E86F2D]/60 to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 pb-10 sm:pb-12 border-b border-[#3A3029]/60">
          
          {/* LEFT COLUMN — BRAND */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E86F2D]/15 border border-[#E86F2D]/40 flex items-center justify-center shrink-0 text-[#E86F2D]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bebas text-2xl sm:text-3xl tracking-wider text-[#F1E8D8] leading-none">
                GSFCU <span className="text-[#E86F2D]">GOT TALENT</span>
              </span>
            </div>

            <p className="font-bebas text-xl sm:text-2xl tracking-wide text-[#E86F2D] uppercase">
              "EXPECT THE UNEXPECTED"
            </p>

            <p className="text-xs text-[#C9C5BD] leading-relaxed max-w-sm font-sans font-light">
              The flagship annual talent showcase of GSFC University. Celebrating raw student passion, artistic mastery, and cinematic stage performances.
            </p>

            <div className="pt-1">
              <span className="inline-block px-3 py-1 rounded-full bg-[#E86F2D]/10 border border-[#E86F2D]/30 text-[10px] font-mono text-[#E86F2D] tracking-widest uppercase font-semibold">
                2026 EDITION
>>>>>>> 5d886f7 (Updated Changes)
              </span>
            </div>
          </div>

<<<<<<< HEAD
          {/* Event Quick Info Column */}
          <div className="sm:col-span-1 md:col-span-4 flex flex-col gap-3 sm:gap-4">
            <h4 className="text-xs font-mono tracking-widest text-[#C49A3A] uppercase">
              EVENT DETAILS
            </h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs text-[#F4E7D0]/80">
              <li className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#C96B35] shrink-0 mt-0.5" />
                <span>{EVENT_DETAILS.fullDate}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C96B35] shrink-0 mt-0.5" />
                <span>{EVENT_DETAILS.location}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AtSign className="w-4 h-4 text-[#C96B35] shrink-0 mt-0.5" />
                <a href="#" className="hover:text-[#C96B35] transition-colors">{EVENT_DETAILS.instagramHandle} (Official handle)</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#C96B35] shrink-0 mt-0.5" />
                <a href={`mailto:${EVENT_DETAILS.contactEmail}`} className="hover:text-[#C96B35] transition-colors break-all sm:break-normal">{EVENT_DETAILS.contactEmail}</a>
=======
          {/* CENTER COLUMN — EVENT DETAILS */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h4 className="text-xs font-mono tracking-widest text-[#E86F2D] uppercase font-bold">
              EVENT DETAILS
            </h4>
            
            <ul className="space-y-3 text-xs text-[#C9C5BD] font-sans">
              <li className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#E86F2D] shrink-0" />
                <span className="text-[#F1E8D8] font-medium">Thursday, 29 October 2026</span>
              </li>
              
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#E86F2D] shrink-0" />
                <span className="text-[#F1E8D8] font-medium">Aanganva, GSFC University</span>
              </li>

              <li className="flex items-center gap-3">
                <AtSign className="w-4 h-4 text-[#E86F2D] shrink-0" />
                <a
                  href="https://instagram.com/radiogsfcu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E86F2D] transition-colors font-mono"
                >
                  @radiogsfcu
                </a>
              </li>

              <li className="flex items-center gap-3">
                <AtSign className="w-4 h-4 text-[#E86F2D] shrink-0" />
                <a
                  href="https://instagram.com/theatreclub_gsfcu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E86F2D] transition-colors font-mono"
                >
                  @theatreclub_gsfcu
                </a>
              </li>

              <li className="flex items-center gap-3 pt-0.5">
                <Mail className="w-4 h-4 text-[#E86F2D] shrink-0" />
                <a
                  href="mailto:radiogsfcu@gsfcuniversity.ac.in"
                  className="hover:text-[#E86F2D] transition-colors font-mono break-all"
                >
                  radiogsfcu@gsfcuniversity.ac.in
                </a>
>>>>>>> 5d886f7 (Updated Changes)
              </li>
            </ul>
          </div>

<<<<<<< HEAD
          {/* Quick Navigation Column */}
          <div className="sm:col-span-1 md:col-span-3 flex flex-col gap-3 sm:gap-4">
            <h4 className="text-xs font-mono tracking-widest text-[#C49A3A] uppercase">
              NAVIGATION
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#B5ACA0]">
              <a href="#about" className="hover:text-[#C96B35] transition-colors py-1 min-h-[36px] flex items-center">About</a>
              <a href="#talents" className="hover:text-[#C96B35] transition-colors py-1 min-h-[36px] flex items-center">Categories</a>
              <a href="#how-it-works" className="hover:text-[#C96B35] transition-colors py-1 min-h-[36px] flex items-center">How It Works</a>
              <a href="#rules" className="hover:text-[#C96B35] transition-colors py-1 min-h-[36px] flex items-center">Rules</a>
              <a href="#faq" className="hover:text-[#C96B35] transition-colors py-1 min-h-[36px] flex items-center">FAQ</a>
              <Link to="/register" className="text-[#C96B35] font-semibold hover:underline py-1 min-h-[36px] flex items-center">Register Now</Link>
              <Link to="/admin" className="text-[#C49A3A] hover:text-[#C96B35] transition-colors py-1 min-h-[36px] flex items-center">Organizer Portal</Link>
            </div>
            
            <div className="pt-2 sm:pt-4">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B5ACA0] hover:text-[#F4E7D0] transition-colors py-2 min-h-[44px]"
              >
                Back to Top <ArrowUp className="w-3.5 h-3.5" />
=======
          {/* RIGHT COLUMN — NAVIGATION */}
          <div className="md:col-span-3 flex flex-col justify-between gap-6">
            <div>
              <h4 className="text-xs font-mono tracking-widest text-[#E86F2D] uppercase font-bold mb-4">
                NAVIGATION
              </h4>
              <div className="flex flex-col gap-2.5 text-xs text-[#C9C5BD] font-mono">
                <a href="#about" className="hover:text-[#E86F2D] transition-colors">About</a>
                <a href="#talents" className="hover:text-[#E86F2D] transition-colors">Categories</a>
                <a href="#how-it-works" className="hover:text-[#E86F2D] transition-colors">How It Works</a>
                <a href="#rules" className="hover:text-[#E86F2D] transition-colors">Rules</a>
                <a href="#faq" className="hover:text-[#E86F2D] transition-colors">FAQ</a>
                <Link to="/register" className="text-[#E86F2D] font-bold hover:underline">Register Now</Link>
              </div>
            </div>

            <div>
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9C5BD] hover:text-[#F1E8D8] transition-colors py-1 cursor-pointer"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3.5 h-3.5 text-[#E86F2D]" />
>>>>>>> 5d886f7 (Updated Changes)
              </button>
            </div>
          </div>

        </div>

<<<<<<< HEAD
        {/* Bottom copyright */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[10px] sm:text-[11px] text-[#B5ACA0]">
          <p>© 2026 GSFC University. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[#B5ACA0]">GSFCU GOT TALENT 2026</span>
            <span>•</span>
            <Link to="/admin" className="font-mono text-[#C49A3A] hover:text-[#C96B35] transition-colors">
              ORGANIZER DASHBOARD 🔒
            </Link>
          </div>
        </div>
=======
        {/* BOTTOM FOOTER */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-[#C9C5BD]">
          <p>© 2026 GSFC University. All Rights Reserved.</p>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[#C9C5BD]/80">GSFCU GOT TALENT 2026</span>
            {!loading && canAccessPortal && (
              <>
                <span className="text-[#3A3029]">•</span>
                <Link
                  to="/portal"
                  className="font-mono text-[#E86F2D] hover:underline flex items-center gap-1"
                >
                  <span>ORGANIZER DASHBOARD 🔒</span>
                </Link>
              </>
            )}
          </div>
        </div>

>>>>>>> 5d886f7 (Updated Changes)
      </div>
    </footer>
  );
}
