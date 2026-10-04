import React, { useState, useEffect } from 'react';
import { ArrowRight, Handshake, Building2, FileText, ExternalLink } from 'lucide-react';
import SponsorEnquiryModal from '../components/SponsorEnquiryModal';
import { getSponsors, fetchSponsorsFromCloud, getBrochure, fetchBrochureFromCloud } from '../services/registrationService';

export default function SponsorsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sponsors, setSponsors] = useState(() => getSponsors());
  const [brochure, setBrochure] = useState(() => getBrochure());

  useEffect(() => {
    const sync = async () => {
      const data = await fetchSponsorsFromCloud();
      setSponsors(data);
      const broch = await fetchBrochureFromCloud();
      setBrochure(broch);
    };
    sync();

    // Listen for storage & dynamic update changes
    const handleStorage = () => {
      setSponsors(getSponsors());
      setBrochure(getBrochure());
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('sponsorsUpdated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('sponsorsUpdated', handleStorage);
    };
  }, []);

  // Filter ONLY active sponsors
  const activeSponsors = sponsors.filter(s => (s.status || '').toUpperCase() === 'ACTIVE');

  // Group active sponsors by category & sort by displayOrder ASC
  const platinumSponsors = activeSponsors
    .filter(s => (s.category || '').toUpperCase().includes('PLATINUM'))
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const goldSponsors = activeSponsors
    .filter(s => (s.category || '').toUpperCase().includes('GOLD'))
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const silverSponsors = activeSponsors
    .filter(s => (s.category || '').toUpperCase().includes('SILVER'))
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const hasAnyActiveSponsor = activeSponsors.length > 0;

  return (
    <section id="sponsors" className="py-20 sm:py-28 bg-[#08080a] border-t border-[#C49A3A]/20 relative overflow-hidden font-sans">
      
      {/* Background Subtle Atmosphere */}
      <div className="absolute inset-0 bg-gujarati-pattern opacity-25 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#08080a] via-transparent to-[#08080a] opacity-80 pointer-events-none" />

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* CASE 1: NO ACTIVE SPONSORS IN DATABASE */}
        {!hasAnyActiveSponsor ? (
          <div className="max-w-3xl mx-auto text-center py-6">
            <span className="text-xs font-mono text-[#C96B35] font-bold uppercase tracking-[3px] block mb-2">
              OUR PARTNERSHIPS
            </span>

            <h2 className="font-bebas text-4xl sm:text-6xl text-[#F4E7D0] tracking-wider uppercase leading-none mb-4">
              WANT TO PARTNER WITH <span className="text-[#C96B35]">GSFCU GOT TALENT?</span>
            </h2>

            <p className="text-sm sm:text-base font-sans text-[#B5ACA0] max-w-xl mx-auto leading-relaxed mb-2">
              Put your brand in front of the GSFC University community.
            </p>
            <p className="text-xs font-mono text-[#C49A3A] font-bold uppercase tracking-widest mb-8">
              Sponsorship opportunities are currently open.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {brochure && brochure.url ? (
                <a
                  href={brochure.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-md bg-[#14141c] hover:bg-[#1a1a24] text-[#F4E7D0] text-xs font-mono font-bold uppercase tracking-widest border border-[#C49A3A]/40 transition-all shadow-md"
                >
                  <FileText className="w-4 h-4 text-[#C49A3A]" />
                  <span>VIEW SPONSORSHIP BROCHURE →</span>
                </a>
              ) : null}

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-md bg-[#C96B35] hover:bg-[#B65A3A] text-[#F4E7D0] text-xs font-mono font-bold uppercase tracking-widest transition-all duration-200 border border-[#C96B35] hover:border-[#F4E7D0]/40 shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>BECOME A SPONSOR →</span>
              </button>
            </div>
          </div>
        ) : (
          /* CASE 2: ACTIVE SPONSORS EXIST IN DATABASE */
          <>
            {/* SECTION HEADER */}
            <div data-reveal className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-mono text-[#C96B35] font-bold uppercase tracking-[3px] block mb-2">
                OUR SUPPORTERS
              </span>

              <h2 className="font-bebas text-4xl sm:text-6xl tracking-wider uppercase leading-none mb-3">
                <span className="text-[#F4E7D0]">SPONSORS</span> <span className="text-[#C96B35]">& PARTNERS</span>
              </h2>

              <p className="text-sm sm:text-base font-sans text-[#B5ACA0] max-w-xl mx-auto leading-relaxed">
                Proudly supporting the talent of GSFC University.
              </p>
            </div>

            {/* 1. PLATINUM SPONSORS (Only rendered if >= 1 active sponsor exists) */}
            {platinumSponsors.length > 0 && (
              <div data-reveal className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-mono text-[#C49A3A] uppercase tracking-[3px] font-bold whitespace-nowrap">
                    PLATINUM
                  </span>
                  <div className="h-[1px] bg-[#C49A3A]/25 flex-grow" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {platinumSponsors.map((sponsor, idx) => (
                    <div
                      key={sponsor.id}
                      data-reveal
                      data-reveal-delay={String((idx % 4) + 1)}
                      className="bg-[#0b0b0e] border border-[#C49A3A]/30 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-lg hover-lift hover:border-[#C49A3A]/60 hover:bg-[#101014] transition-all duration-300 group"
                    >
                      {sponsor.logoUrl ? (
                        <div className="w-full h-20 flex items-center justify-center mb-3">
                          <img
                            src={sponsor.logoUrl}
                            alt={sponsor.name}
                            className="max-h-full max-w-full object-contain filter drop-shadow"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#14141c] border border-[#C49A3A]/20 flex items-center justify-center mb-3 text-[#C96B35]">
                          <Building2 className="w-6 h-6" />
                        </div>
                      )}

                      <span className="font-bebas text-2xl sm:text-3xl text-[#F4E7D0] tracking-wider block leading-none mb-1">
                        {sponsor.name}
                      </span>

                      {sponsor.description && (
                        <span className="text-[11px] font-mono text-[#B5ACA0] uppercase tracking-wider block mt-1 line-clamp-1">
                          {sponsor.description}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. GOLD SPONSORS (Only rendered if >= 1 active sponsor exists) */}
            {goldSponsors.length > 0 && (
              <div data-reveal className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-mono text-[#C96B35] uppercase tracking-[3px] font-bold whitespace-nowrap">
                    GOLD
                  </span>
                  <div className="h-[1px] bg-[#C96B35]/25 flex-grow" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                  {goldSponsors.map((sponsor, idx) => (
                    <div
                      key={sponsor.id}
                      data-reveal
                      data-reveal-delay={String((idx % 5) + 1)}
                      className="bg-[#0b0b0e] border border-white/10 rounded-xl p-5 sm:p-6 flex flex-col items-center justify-center text-center shadow-md hover-lift hover:border-[#C96B35]/50 hover:bg-[#101014] transition-all duration-200 group"
                    >
                      {sponsor.logoUrl ? (
                        <div className="w-full h-16 flex items-center justify-center mb-3">
                          <img
                            src={sponsor.logoUrl}
                            alt={sponsor.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#14141c] border border-white/5 flex items-center justify-center mb-3 text-[#C96B35]">
                          <Building2 className="w-5 h-5" />
                        </div>
                      )}

                      <span className="font-bebas text-xl sm:text-2xl text-[#F4E7D0] tracking-wide block leading-none">
                        {sponsor.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SILVER SPONSORS (Only rendered if >= 1 active sponsor exists) */}
            {silverSponsors.length > 0 && (
              <div data-reveal className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-mono text-[#B5ACA0] uppercase tracking-[3px] font-bold whitespace-nowrap">
                    SILVER
                  </span>
                  <div className="h-[1px] bg-white/15 flex-grow" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
                  {silverSponsors.map((sponsor, idx) => (
                    <div
                      key={sponsor.id}
                      data-reveal
                      data-reveal-delay={String((idx % 6) + 1)}
                      className="bg-[#0b0b0e] border border-white/5 rounded-lg p-4 sm:p-5 flex flex-col items-center justify-center text-center hover-lift hover:border-white/20 hover:bg-[#101014] transition-all duration-200 group"
                    >
                      {sponsor.logoUrl ? (
                        <div className="w-full h-12 flex items-center justify-center mb-2.5">
                          <img
                            src={sponsor.logoUrl}
                            alt={sponsor.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded bg-[#14141c] border border-white/5 flex items-center justify-center mb-2.5 text-[#C49A3A]">
                          <Building2 className="w-4 h-4" />
                        </div>
                      )}

                      <span className="font-bebas text-lg sm:text-xl text-[#F4E7D0] tracking-wide block leading-none">
                        {sponsor.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PARTNERSHIP & BROCHURE CTA BLOCK (Requirement 6) */}
            <div data-reveal className="max-w-4xl mx-auto mt-16">

              <div className="bg-[#0f0e13] border border-[#C96B35]/35 rounded-xl p-8 sm:p-12 text-center shadow-xl relative overflow-hidden transition-all duration-300 hover:border-[#C96B35]/60">
                <div className="w-12 h-12 rounded-full bg-[#C96B35]/15 border border-[#C96B35]/30 mx-auto flex items-center justify-center text-[#C96B35] mb-4">
                  <Handshake className="w-6 h-6" />
                </div>

                <h3 className="font-bebas text-3xl sm:text-5xl text-[#F4E7D0] tracking-wider uppercase mb-3">
                  INTERESTED IN <span className="text-[#C96B35]">PARTNERING WITH US?</span>
                </h3>

                <p className="text-xs sm:text-sm font-sans text-[#B5ACA0] max-w-lg mx-auto mb-8 leading-relaxed">
                  Explore our sponsorship opportunities and discover how your brand can be part of GSFCU GOT TALENT.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {brochure && brochure.url ? (
                    <a
                      href={brochure.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-md bg-[#14141c] hover:bg-[#1a1a24] text-[#F4E7D0] text-xs font-mono font-bold uppercase tracking-widest border border-[#C49A3A]/40 transition-all shadow-md cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-[#C49A3A]" />
                      <span>VIEW SPONSORSHIP BROCHURE →</span>
                    </a>
                  ) : (
                    <button
                      disabled
                      title="Brochure available soon"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-md bg-[#14141c]/50 text-[#B5ACA0]/60 text-xs font-mono font-bold uppercase tracking-widest border border-white/10 opacity-60 cursor-not-allowed"
                    >
                      <FileText className="w-4 h-4" />
                      <span>BROCHURE AVAILABLE SOON</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-md bg-[#C96B35] hover:bg-[#B65A3A] text-[#F4E7D0] text-xs font-mono font-bold uppercase tracking-widest transition-all duration-200 border border-[#C96B35] hover:border-[#F4E7D0]/40 shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>BECOME A SPONSOR →</span>
                  </button>
                </div>

              </div>
            </div>
          </>
        )}

      </div>

      {/* SPONSOR ENQUIRY MODAL */}
      <SponsorEnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </section>
  );
}
