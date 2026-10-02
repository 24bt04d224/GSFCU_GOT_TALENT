import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
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
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-xs font-mono tracking-widest text-[#F4E7D0]/80 hover:text-[#C96B35] uppercase transition-colors relative group py-1"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C96B35] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right: CTA Button */}
        <div className="hidden md:flex items-center">
          <Link
            to="/register"
            className="group relative overflow-hidden rounded-md bg-[#C96B35] hover:bg-[#B65A3A] px-5 py-2.5 text-xs font-mono font-bold tracking-widest text-[#F4E7D0] uppercase shadow-md shadow-[#C96B35]/20 transition-all duration-300 flex items-center gap-2 border border-[#C96B35] hover:border-[#B65A3A]"
          >
            <span>REGISTER NOW</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden min-w-[44px] min-h-[44px] p-2 flex items-center justify-center rounded-md text-[#F4E7D0] hover:text-[#C96B35] hover:bg-[#C96B35]/10 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-[#C96B35]" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="md:hidden fixed top-[60px] sm:top-[68px] left-0 right-0 bg-[#08080a]/98 backdrop-blur-xl border-b border-[#C49A3A]/20 p-6 flex flex-col gap-6 shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-70px)] overflow-y-auto">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-xs font-mono tracking-widest text-[#F4E7D0] hover:text-[#C96B35] uppercase transition-colors py-3 border-b border-[#C49A3A]/15 flex items-center justify-between min-h-[44px]"
                >
                  <span>{link.name}</span>
                  <span className="text-[#C96B35]">→</span>
                </a>
              ))}
            </nav>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#C96B35] hover:bg-[#B65A3A] active:bg-[#B65A3A] text-[#F4E7D0] py-3.5 rounded-md font-mono font-bold text-xs tracking-widest uppercase shadow-lg shadow-[#C96B35]/25 flex items-center justify-center gap-2 min-h-[44px] border border-[#C96B35] hover:border-[#B65A3A]"
            >
              REGISTER NOW <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
