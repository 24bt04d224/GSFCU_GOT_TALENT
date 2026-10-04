<<<<<<< HEAD
import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Sparkles, Calendar, MapPin, ShieldCheck } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';

export default function DigitalPassModal({ registration, onClose }) {
  const ticketRef = useRef(null);

  if (!registration) return null;
=======
import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Download, Sparkles, Calendar, MapPin, ShieldCheck, Loader2, MessageSquare, ExternalLink } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { EVENT_DETAILS } from '../data/eventData';

export default function DigitalPassModal({ registration, onClose, isOpen = true }) {
  const ticketRef = useRef(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!registration || isOpen === false) return null;

>>>>>>> 5d886f7 (Updated Changes)

  const handlePrint = () => {
    window.print();
  };

<<<<<<< HEAD
=======
  const handleDownloadPdf = async () => {
    if (!ticketRef.current || isExportingPdf) return;
    setIsExportingPdf(true);

    try {
      // Wait for fonts and visual assets to complete rendering
      if (document?.fonts) {
        await document.fonts.ready;
      }
      await new Promise((res) => setTimeout(res, 300));

      const element = ticketRef.current;

      // Capture ONLY the Official Entry Pass DOM element
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#0e0e13',
        logging: false,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');

      // Create single PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

      // Safe page margins (10mm)
      const marginX = 10;
      const marginY = 10;
      const maxW = pdfWidth - (marginX * 2); // 190mm
      const maxH = pdfHeight - (marginY * 2); // 277mm

      // Fit captured pass proportionally within 1 page boundaries
      let imgWidth = maxW;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > maxH) {
        imgHeight = maxH;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
      }

      // Center the pass image on the page
      const posX = (pdfWidth - imgWidth) / 2;
      const posY = (pdfHeight - imgHeight) / 2;

      // Fill dark background matching pass theme
      pdf.setFillColor(14, 14, 19);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      // Add captured pass image to page 1
      pdf.addImage(imgData, 'PNG', posX, posY, imgWidth, imgHeight, undefined, 'FAST');

      // GUARANTEE STRICTLY ONE PDF PAGE
      const totalPages = pdf.getNumberOfPages();
      if (totalPages > 1) {
        for (let i = totalPages; i > 1; i--) {
          pdf.deletePage(i);
        }
      }

      const cleanId = (registration.id || 'PASS').replace(/[^a-zA-Z0-9_-]/g, '');
      pdf.save(`GSFCU-GOT-TALENT-PASS-${cleanId}.pdf`);
    } catch (err) {
      console.error('PDF export failed, falling back to print window:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

>>>>>>> 5d886f7 (Updated Changes)
  const qrPayload = JSON.stringify({
    id: registration.id,
    name: registration.fullName,
    enroll: registration.enrollmentNo,
    category: registration.category,
    event: "GSFCU GOT TALENT 2026"
  });

<<<<<<< HEAD
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
=======
  const memberNames = (registration.teamMembers || [])
    .map((m) => m.name)
    .filter(Boolean);

  const handleModalClose = (e) => {
    if (e) e.stopPropagation();
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleModalClose(e);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pb-8 sm:pb-10 bg-black/85 backdrop-blur-md overflow-y-auto animate-modal-backdrop font-sans"
    >
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg my-auto printable-pass-target animate-modal-content">
        
        {/* Close (×) Button */}
        <button
          type="button"
          onClick={handleModalClose}
          className="absolute -top-3 -right-3 sm:top-2 sm:right-2 z-30 p-2 rounded-full bg-[#14141c] hover:bg-[#1a1a24] text-[#B5ACA0] hover:text-[#F4E7D0] border border-[#C49A3A]/30 transition-all print:hidden cursor-pointer shadow-lg hover:scale-110 active:scale-95"
          aria-label="Close Digital Pass"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Printable Ticket Card */}
        <div 
          ref={ticketRef} 
          className="bg-[#0e0e13] border border-[#C49A3A]/35 rounded-2xl p-4 sm:p-6 text-[#F4E7D0] shadow-2xl relative overflow-hidden animate-pass-in"
        >
          {/* Ticket Header */}
          <div className="text-center pb-3 sm:pb-4 border-b border-[#C49A3A]/25 relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C96B35]/15 border border-[#C96B35]/30 text-[10px] font-mono text-[#C96B35] font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3 text-[#C96B35]" /> OFFICIAL CANDIDATE ENTRY PASS
            </div>
            
            <h2 className="font-bebas text-2xl sm:text-4xl text-[#F4E7D0] tracking-wider leading-none">
              GSFCU <span className="text-[#C96B35]">GOT TALENT</span>
            </h2>
            <p className="font-mono text-[9px] sm:text-[10px] text-[#C49A3A] uppercase tracking-widest mt-0.5">
              OFFICIAL 2026 EDITION
>>>>>>> 5d886f7 (Updated Changes)
            </p>
          </div>

          {/* Ticket Body: Details & QR Code */}
<<<<<<< HEAD
          <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            
            {/* Candidate Details (7 cols) */}
            <div className="sm:col-span-7 space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-[#B5ACA0] uppercase block">CANDIDATE NAME</span>
                <span className="font-bebas text-2xl text-[#F4E7D0] tracking-wide block leading-none mt-0.5">
=======
          <div className="py-4 sm:py-5 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center">
            
            {/* Candidate Details (7 cols) */}
            <div className="sm:col-span-7 space-y-2.5 text-xs">
              <div>
                <span className="text-[9px] sm:text-[10px] font-mono text-[#B5ACA0] uppercase block">
                  {registration.participationType === 'Team' || registration.participationType === 'Group'
                    ? 'PRIMARY PARTICIPANT / TEAM LEAD'
                    : 'CANDIDATE NAME'}
                </span>
                <span className="font-bebas text-xl sm:text-2xl text-[#F4E7D0] tracking-wide block leading-none mt-0.5">
>>>>>>> 5d886f7 (Updated Changes)
                  {registration.fullName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                <div>
                  <span className="text-[9px] font-mono text-[#B5ACA0] uppercase block">ENROLLMENT NO</span>
<<<<<<< HEAD
                  <span className="font-mono font-bold text-[#F4E7D0] text-xs">
=======
                  <span className="font-mono font-bold text-[#F4E7D0] text-[11px] sm:text-xs">
>>>>>>> 5d886f7 (Updated Changes)
                    {registration.enrollmentNo}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-[#B5ACA0] uppercase block">CATEGORY</span>
<<<<<<< HEAD
                  <span className="font-bold text-[#C96B35] uppercase text-xs">
=======
                  <span className="font-bold text-[#C96B35] uppercase text-[11px] sm:text-xs">
>>>>>>> 5d886f7 (Updated Changes)
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
<<<<<<< HEAD
                  {registration.schoolDept} ({registration.participationType})
                </span>
              </div>

              <div className="pt-2 border-t border-[#C49A3A]/20 flex items-center gap-2 text-[10px] font-mono text-[#68734A]">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#68734A]" />
=======
                  {registration.schoolDept} ({registration.participationType || 'Solo'})
                </span>
              </div>

              {/* DYNAMIC TEAM MEMBERS DISPLAY (For Duo & Team Performances) */}
              {memberNames.length > 0 && (
                <div className="pt-1 border-t border-white/5">
                  <span className="text-[9px] font-mono text-[#C96B35] font-bold uppercase block">
                    {registration.participationType === 'Duo' ? 'PERFORMANCE PARTNER' : `TEAM MEMBERS (${memberNames.length})`}
                  </span>
                  <p className="text-[10px] font-mono text-[#F4E7D0] leading-tight mt-0.5 break-words line-clamp-2">
                    {memberNames.join(', ')}
                  </p>
                </div>
              )}

              <div className="pt-1.5 border-t border-[#C49A3A]/20 flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono text-[#68734A]">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#68734A]" />
>>>>>>> 5d886f7 (Updated Changes)
                <span className="font-semibold">VERIFIED UNIVERSITY ENTRY</span>
              </div>
            </div>

            {/* QR Code Container (5 cols) */}
<<<<<<< HEAD
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 bg-[#08080a] border border-[#C49A3A]/30 rounded-xl shadow-inner text-center">
              <div className="p-2 bg-white rounded-lg shadow-md">
                <QRCodeSVG
                  value={qrPayload}
                  size={120}
=======
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 sm:p-3.5 bg-[#08080a] border border-[#C49A3A]/30 rounded-xl shadow-inner text-center">
              <div className="p-1.5 sm:p-2 bg-white rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
                <QRCodeSVG
                  value={qrPayload}
                  size={110}
>>>>>>> 5d886f7 (Updated Changes)
                  level="M"
                  fgColor="#08080a"
                  bgColor="#ffffff"
                />
              </div>
<<<<<<< HEAD
              <span className="font-mono font-extrabold text-xs text-[#C96B35] tracking-widest mt-2 block">
=======
              <span className="font-mono font-extrabold text-xs text-[#C96B35] tracking-widest mt-1.5 block">
>>>>>>> 5d886f7 (Updated Changes)
                {registration.id}
              </span>
              <span className="text-[8px] font-mono text-[#B5ACA0] uppercase tracking-wider block mt-0.5">
                SCAN AT AUDITION DESK
              </span>
            </div>

          </div>

<<<<<<< HEAD
          {/* Ticket Footer Schedule */}
          <div className="pt-4 border-t border-[#C49A3A]/25 grid grid-cols-2 gap-3 text-[11px] font-mono bg-[#14141c]/50 p-3.5 rounded-lg border border-white/5">
=======
          {/* WhatsApp Group Invitation Callout in Pass Card */}
          <div className="mt-2 p-2.5 sm:p-3 rounded-xl bg-[#0f1712] border border-emerald-500/35 text-left flex items-center justify-between gap-2.5 print:hidden">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 animate-whatsapp-pulse">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bebas text-sm sm:text-base text-[#F4E7D0] tracking-wide block leading-none">JOIN WHATSAPP GROUP</span>
                <span className="text-[9px] sm:text-[10px] text-[#B5ACA0] font-sans block mt-0.5">Stay updated with event schedules & announcements</span>
              </div>
            </div>
            <a
              href="https://chat.whatsapp.com/LETsJjET2As6fXFHCA8iAh"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 sm:px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-[#F4E7D0] text-[10px] font-mono font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-1 transition-all border border-emerald-500/40 shadow-sm cursor-pointer btn-hover-subtle animate-whatsapp-pulse"
            >
              <span>JOIN</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Ticket Footer Schedule */}
          <div className="mt-2.5 pt-2.5 border-t border-[#C49A3A]/25 grid grid-cols-2 gap-2 text-[10px] sm:text-[11px] font-mono bg-[#14141c]/50 p-2.5 rounded-lg border border-white/5">
>>>>>>> 5d886f7 (Updated Changes)
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

<<<<<<< HEAD
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
=======
        {/* 4 ACTION BUTTONS ROW (CLOSE, JOIN WHATSAPP, DOWNLOAD PDF, PRINT PASS) */}
        <div className="mt-3 sm:mt-4 pt-1 grid grid-cols-2 sm:grid-cols-4 gap-2 w-full print:hidden">
          
          {/* 1. CLOSE BUTTON */}
          <button
            type="button"
            onClick={handleModalClose}
            className="w-full px-2.5 sm:px-3 py-2.5 rounded-lg bg-[#14141c] hover:bg-[#1a1a24] text-[#F4E7D0] border border-[#C49A3A]/40 hover:border-[#C49A3A]/70 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md text-center btn-hover-subtle"
          >
            CLOSE
          </button>

          {/* 2. JOIN WHATSAPP GROUP BUTTON */}
          <a
            href="https://chat.whatsapp.com/LETsJjET2As6fXFHCA8iAh"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-2.5 sm:px-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[#F4E7D0] text-xs font-mono font-bold uppercase tracking-wider transition-all border border-emerald-500/50 shadow-md flex items-center justify-center gap-1 cursor-pointer text-center whitespace-nowrap btn-hover-subtle animate-whatsapp-pulse"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span className="truncate">JOIN WHATSAPP</span>
          </a>

          {/* 3. DOWNLOAD PDF BUTTON */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="w-full px-2.5 sm:px-3 py-2.5 rounded-lg bg-[#C49A3A] hover:bg-[#b0872e] text-[#08080a] text-xs font-mono font-bold uppercase tracking-wider transition-all border border-[#C49A3A] shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer whitespace-nowrap btn-hover-subtle"
          >

            {isExportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#08080a] shrink-0" />
                <span>GENERATING...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-[#08080a] shrink-0" />
                <span>DOWNLOAD PDF</span>
              </>
            )}
          </button>

          {/* 4. PRINT PASS BUTTON */}
          <button
            type="button"
            onClick={handlePrint}
            className="w-full px-2.5 sm:px-3 py-2.5 rounded-lg bg-[#C96B35] hover:bg-[#B65A3A] text-[#F4E7D0] text-xs font-mono font-bold uppercase tracking-wider transition-all border border-[#C96B35] shadow-md flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5 shrink-0" />
            <span>PRINT PASS</span>
          </button>

>>>>>>> 5d886f7 (Updated Changes)
        </div>

      </div>
    </div>
  );
}
