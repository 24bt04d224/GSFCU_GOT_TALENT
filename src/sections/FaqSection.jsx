import React, { useState } from 'react';
import { FAQS } from '../data/eventData';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#0b0b0e] relative z-10 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#C96B35] uppercase mb-3">
            <HelpCircle className="w-4 h-4 text-[#C96B35]" />
            <span>GOT QUESTIONS?</span>
          </div>
          <h2 className="font-syne font-extrabold text-3xl xs:text-4xl sm:text-5xl uppercase tracking-tight text-[#F4E7D0]">
            FREQUENTLY ASKED <span className="text-[#C96B35]">QUESTIONS</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#B5ACA0] mt-2 sm:mt-3">
            Everything you need to know about GSFCU Got Talent 2026.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 sm:space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`rounded-xl sm:rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#14141a] border-[#C96B35]/50 shadow-xl shadow-[#C96B35]/5'
                    : 'bg-[#101014] border-[#C49A3A]/15 hover:border-[#C49A3A]/30'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 sm:p-6 flex items-center justify-between gap-3 focus:outline-none min-h-[52px]"
                  aria-expanded={isOpen}
                >
                  <span className="font-syne font-bold text-sm sm:text-base md:text-lg text-[#F4E7D0] flex items-start sm:items-center gap-2.5 sm:gap-3">
                    <span className="font-mono text-xs text-[#C49A3A] shrink-0 mt-0.5 sm:mt-0">
                      0{idx + 1}.
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 flex items-center justify-center text-[#C96B35] transition-transform duration-300 shrink-0 ${
                    isOpen ? 'rotate-180 bg-[#C96B35] text-[#F4E7D0]' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 text-xs sm:text-sm text-[#B5ACA0] leading-relaxed border-t border-white/5 animate-in fade-in duration-200">
                    <p className="mt-3 sm:mt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support callout */}
        <div className="mt-10 sm:mt-12 text-center p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-[#C49A3A]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="font-syne font-bold text-sm text-[#F4E7D0]">Still have questions?</h3>
            <p className="text-xs text-[#B5ACA0]">Reach out to the organizing team directly.</p>
          </div>
          <a
            href="mailto:gottalent@gsfcuniversity.ac.in"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#C96B35]/15 text-[#C96B35] hover:bg-[#C96B35] hover:text-[#F4E7D0] border border-[#C96B35]/35 font-mono text-xs font-bold uppercase transition-all min-h-[44px] flex items-center justify-center"
          >
            CONTACT SUPPORT
          </a>
        </div>

      </div>
    </section>
  );
}
