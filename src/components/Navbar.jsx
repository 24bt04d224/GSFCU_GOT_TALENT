import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { Menu, X, ArrowRight } from 'lucide-react';
=======
import { Menu, X, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
>>>>>>> 5d886f7 (Updated Changes)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
<<<<<<< HEAD

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
=======
  const { canAccessPortal, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
>>>>>>> 5d886f7 (Updated Changes)
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'ABOUT', href: '#about' },
    { name: 'TALENTS', href: '#talents' },
    { name: 'FORMAT', href: '#how-it-works' },
    { name: 'RULES', href: '#rules' },
    { name: 'FAQ', href: '#faq' },
<<<<<<< HEAD
=======
    { name: 'SPONSORS', href: '#sponsors' },
>>>>>>> 5d886f7 (Updated Changes)
  ];

  const handleNavClick = (e, href) => {
    if (location.pathname !== '/') {
      navigate('/' + href);
      setMobileMenuOpen(false);
      return;
    }

    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

<<<<<<< HEAD
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08080a]/95 backdrop-blur-md border-b border-[#C49A3A]/20 py-3 shadow-xl'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4 sm:py-5 border-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: GSFC University Identity */}
        <Link to="/" className="group flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col">
            <span className="font-bebas text-xl xs:text-2xl sm:text-3xl tracking-wider text-[#F4E7D0] group-hover:text-[#C96B35] transition-colors leading-none">
              GSFCU <span className="text-[#C96B35]">GOT TALENT</span>
            </span>
            <span className="text-[8px] xs:text-[9px] font-mono tracking-widest text-[#C49A3A] uppercase mt-0.5">
              29 OCT 2026 • GSFC UNIVERSITY
            </span>
          </div>
        </Link>

        {/* Center: Nav links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
=======
  const isPortalRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/portal');
  const isHomePage = location.pathname === '/';
  const isTransparent = isHomePage && !scrolled;

  return (
    <header
      className="fixed top-0 left-0 right-0 w-full z-[9999] h-20 flex items-center"
      style={{
        transition: 'background 300ms ease, border-color 300ms ease, box-shadow 300ms ease, backdrop-filter 300ms ease, -webkit-backdrop-filter 300ms ease',
        background: isTransparent ? 'transparent' : 'rgba(7, 9, 10, 0.96)',
        backdropFilter: isTransparent ? 'none' : 'blur(10px)',
        WebkitBackdropFilter: isTransparent ? 'none' : 'blur(10px)',
        borderBottom: isTransparent ? 'none' : '1px solid rgba(230, 111, 46, 0.65)',
        boxShadow: isTransparent ? 'none' : '0 1px 10px rgba(230, 111, 46, 0.08)'
      }}
    >
      <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-12 flex items-center justify-between">
        
        {/* Left: GSFCU | GOT TALENT */}
        <Link to="/" className="group flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="font-bebas text-2xl sm:text-3xl tracking-wider text-[#F1E8D8] leading-none">
              GSFCU
            </span>
            <span className="text-[#3A3029] font-light text-xl">|</span>
            <span className="font-bebas text-2xl sm:text-3xl tracking-wider text-[#E86F2D] leading-none">
              GOT TALENT
            </span>
          </div>
          <span className="text-[9px] font-mono tracking-widest text-[#C9C5BD]/70 uppercase mt-1">
            29 OCT 2026  •  GSFC UNIVERSITY
          </span>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
>>>>>>> 5d886f7 (Updated Changes)
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
<<<<<<< HEAD
              className="text-xs font-mono tracking-widest text-[#F4E7D0]/80 hover:text-[#C96B35] uppercase transition-colors relative group py-1"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C96B35] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <Link
            to="/admin"
            className="text-xs font-mono tracking-widest text-[#C49A3A] hover:text-[#C96B35] uppercase transition-colors relative group py-1"
          >
            PORTAL 🔒
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C96B35] transition-all duration-300 group-hover:w-full" />
          </Link>
        </nav>

        {/* Right: CTA Button */}
        <div className="hidden md:flex items-center">
          <Link
            to="/register"
            className="group relative overflow-hidden rounded-md bg-[#C96B35] hover:bg-[#B65A3A] px-5 py-2.5 text-xs font-mono font-bold tracking-widest text-[#F4E7D0] uppercase shadow-md shadow-[#C96B35]/20 transition-all duration-300 flex items-center gap-2 border border-[#C96B35] hover:border-[#B65A3A]"
=======
              className="text-xs font-mono tracking-widest text-[#C9C5BD] hover:text-[#E86F2D] uppercase transition-colors relative py-1 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#E86F2D] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Far Right: Rectangular orange button */}
        <div className="hidden md:flex items-center">
          <Link
            to="/register"
            className="group relative overflow-hidden rounded bg-[#E86F2D] hover:bg-[#d05e1f] px-5 py-2.5 text-xs font-mono font-bold tracking-widest text-[#F1E8D8] uppercase transition-all duration-200 flex items-center gap-2 border border-[#E86F2D] hover:scale-[1.02] active:scale-[0.98]"
>>>>>>> 5d886f7 (Updated Changes)
          >
            <span>REGISTER NOW</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
<<<<<<< HEAD
          className="md:hidden min-w-[44px] min-h-[44px] p-2 flex items-center justify-center rounded-md text-[#F4E7D0] hover:text-[#C96B35] hover:bg-[#C96B35]/10 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-[#C96B35]" /> : <Menu className="w-6 h-6" />}
=======
          className="md:hidden min-w-[44px] min-h-[44px] p-2 flex items-center justify-center rounded-md text-[#F1E8D8] hover:text-[#E86F2D] transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-[#E86F2D]" /> : <Menu className="w-6 h-6" />}
>>>>>>> 5d886f7 (Updated Changes)
        </button>

      </div>

<<<<<<< HEAD
      {/* Mobile Menu Backdrop & Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="md:hidden fixed top-[60px] sm:top-[68px] left-0 right-0 bg-[#08080a]/98 backdrop-blur-xl border-b border-[#C49A3A]/20 p-6 flex flex-col gap-6 shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-70px)] overflow-y-auto">
=======
      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/75 backdrop-blur-xs z-[9998]"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="md:hidden fixed top-[80px] left-0 right-0 bg-[#080B0C] border-b border-[#3A3029] p-6 flex flex-col gap-6 shadow-2xl z-[9999] animate-in slide-in-from-top-2 duration-200">
>>>>>>> 5d886f7 (Updated Changes)
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
<<<<<<< HEAD
                  className="text-xs font-mono tracking-widest text-[#F4E7D0] hover:text-[#C96B35] uppercase transition-colors py-3 border-b border-[#C49A3A]/15 flex items-center justify-between min-h-[44px]"
                >
                  <span>{link.name}</span>
                  <span className="text-[#C96B35]">→</span>
                </a>
              ))}
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-mono tracking-widest text-[#C49A3A] hover:text-[#C96B35] uppercase transition-colors py-3 border-b border-[#C49A3A]/15 flex items-center justify-between min-h-[44px]"
              >
                <span>ORGANIZER PORTAL 🔒</span>
                <span className="text-[#C49A3A]">→</span>
              </Link>
=======
                  className="text-xs font-mono tracking-widest text-[#C9C5BD] hover:text-[#E86F2D] uppercase transition-colors py-3 border-b border-[#3A3029]/50 flex items-center justify-between min-h-[44px]"
                >
                  <span>{link.name}</span>
                  <span className="text-[#E86F2D]">→</span>
                </a>
              ))}
>>>>>>> 5d886f7 (Updated Changes)
            </nav>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
<<<<<<< HEAD
              className="w-full text-center bg-[#C96B35] hover:bg-[#B65A3A] active:bg-[#B65A3A] text-[#F4E7D0] py-3.5 rounded-md font-mono font-bold text-xs tracking-widest uppercase shadow-lg shadow-[#C96B35]/25 flex items-center justify-center gap-2 min-h-[44px] border border-[#C96B35] hover:border-[#B65A3A]"
=======
              className="w-full text-center bg-[#E86F2D] hover:bg-[#d05e1f] text-[#F1E8D8] py-3.5 rounded font-mono font-bold text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2 min-h-[44px] border border-[#E86F2D]"
>>>>>>> 5d886f7 (Updated Changes)
            >
              REGISTER NOW <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
<<<<<<< HEAD
=======


>>>>>>> 5d886f7 (Updated Changes)
