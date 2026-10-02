import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Sparkles, Calendar, MapPin, ShieldCheck } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';

export default function DigitalPassModal({ registration, onClose }) {
  const ticketRef = useRef(null);

  if (!registration) return null;

  const handlePrint = () => {
    window.print();
  };

  const qrPayload = JSON.stringify({
    id: registration.id,
    name: registration.fullName,
    enroll: registration.enrollmentNo,
    category: registration.category,
    event: "GSFCU GOT TALENT 2026"
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#0e0e13] border border-[#C49A3A]/30 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#F4E7D0] my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#B5ACA0] hover:text-[#F4E7D0] transition-colors print:hidden"
          aria-label="Close Digital Pass"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Ticket Card */}
        <div ref={ticketRef} className="print:m-0 print:p-0">
          
          {/* Ticket Header */}
          <div className="text-center pb-5 border-b border-[#C49A3A]/25 relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C96B35]/15 border border-[#C96B35]/30 text-[10px] font-mono text-[#C96B35] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-[#C96B35]" /> OFFICIAL CANDIDATE ENTRY PASS
            </div>
            
            <h2 className="font-bebas text-3xl sm:text-4xl text-[#F4E7D0] tracking-wider leading-none">
              GSFCU <span className="text-[#C96B35]">GOT TALENT</span>
            </h2>
            <p className="font-mono text-[9px] sm:text-[10px] text-[#C49A3A] uppercase tracking-widest mt-1">
              NAVRATRI SPECIAL EDITION • 2026
            </p>
          </div>

          {/* Ticket Body: Details & QR Code */}
          <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            
            {/* Candidate Details (7 cols) */}
            <div className="sm:col-span-7 space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-[#B5ACA0] uppercase block">CANDIDATE NAME</span>
                <span className="font-bebas text-2xl text-[#F4E7D0] tracking-wide block leading-none mt-0.5">
                  {registration.fullName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                <div>
                  <span className="text-[9px] font-mono text-[#B5ACA0] uppercase block">ENROLLMENT NO</span>
                  <span className="font-mono font-bold text-[#F4E7D0] text-xs">
                    {registration.enrollmentNo}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-[#B5ACA0] uppercase block">CATEGORY</span>
                  <span className="font-bold text-[#C96B35] uppercase text-xs">
                    {registration.category}
                  </span>
                </div>
              </div>

              <div className="pt-1 border-t border-white/5">
                <span className="text-[9px] font-mono text-[#B5ACA0] uppercase block">PERFORMANCE TITLE</span>
                <span className="font-medium text-[#F4E7D0] text-xs line-clamp-1">
                  "{registration.performanceName}"
                </span>
                <span className="text-[10px] text-[#B5ACA0] block mt-0.5">
                  {registration.schoolDept} ({registration.participationType})
                </span>
              </div>

              <div className="pt-2 border-t border-[#C49A3A]/20 flex items-center gap-2 text-[10px] font-mono text-[#68734A]">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#68734A]" />
                <span className="font-semibold">VERIFIED UNIVERSITY ENTRY</span>
              </div>
            </div>

            {/* QR Code Container (5 cols) */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 bg-[#08080a] border border-[#C49A3A]/30 rounded-xl shadow-inner text-center">
              <div className="p-2 bg-white rounded-lg shadow-md">
                <QRCodeSVG
                  value={qrPayload}
                  size={120}
                  level="M"
                  fgColor="#08080a"
                  bgColor="#ffffff"
                />
              </div>
              <span className="font-mono font-extrabold text-xs text-[#C96B35] tracking-widest mt-2 block">
                {registration.id}
              </span>
              <span className="text-[8px] font-mono text-[#B5ACA0] uppercase tracking-wider block mt-0.5">
                SCAN AT AUDITION DESK
              </span>
            </div>

          </div>

          {/* Ticket Footer Schedule */}
          <div className="pt-4 border-t border-[#C49A3A]/25 grid grid-cols-2 gap-3 text-[11px] font-mono bg-[#14141c]/50 p-3.5 rounded-lg border border-white/5">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#C96B35] shrink-0" />
              <div>
                <span className="text-[8px] text-[#B5ACA0] uppercase block">AUDITION DATE</span>
                <span className="text-[#F4E7D0] font-bold">22 OCT 2026</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C49A3A] shrink-0" />
              <div>
                <span className="text-[8px] text-[#B5ACA0] uppercase block">VENUE</span>
                <span className="text-[#F4E7D0] font-bold">{EVENT_DETAILS.location}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons (Print & Close) */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-md border border-[#C49A3A]/25 text-xs font-mono text-[#B5ACA0] hover:text-[#F4E7D0] uppercase transition-colors"
          >
            Close
          </button>
          
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-[#C96B35] hover:bg-[#B65A3A] text-[#F4E7D0] text-xs font-mono font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all border border-[#C96B35] hover:border-[#B65A3A]"
          >
            <Printer className="w-4 h-4" /> PRINT / SAVE DIGITAL PASS
          </button>
        </div>

      </div>
    </div>
  );
}
