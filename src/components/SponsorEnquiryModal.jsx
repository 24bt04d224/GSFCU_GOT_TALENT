import React, { useState } from 'react';
import { X, Building2, Send, CheckCircle2, ShieldCheck, Mail, Phone, User, Tag, MessageSquare } from 'lucide-react';
import { saveSponsorEnquiry } from '../services/registrationService';

export default function SponsorEnquiryModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    brandName: '',
    contactPerson: '',
    phone: '',
    email: '',
    sponsorshipType: 'Platinum Sponsor',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.brandName.trim() || !formData.contactPerson.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setErrorMsg('Please fill in all required fields marked with *');
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = await saveSponsorEnquiry(formData);
      setSubmittedData(saved);
    } catch (err) {
      console.error('Error saving sponsor enquiry:', err);
      setErrorMsg('Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setFormData({
      brandName: '',
      contactPerson: '',
      phone: '',
      email: '',
      sponsorshipType: 'Title / Presenting Sponsor',
      message: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-modal-backdrop">
      
      <div className="relative w-full max-w-xl bg-[#0e0e13] border border-[#C49A3A]/35 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#F4E7D0] my-8 font-sans animate-modal-content">

        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#B5ACA0] hover:text-[#F4E7D0] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedData ? (
          /* SUCCESS STATE */
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#C96B35]/15 border border-[#C96B35]/40 mx-auto flex items-center justify-center text-[#C96B35]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#C49A3A] uppercase tracking-widest block font-bold">
                ENQUIRY RECEIVED • REFERENCE ID: {submittedData.id}
              </span>
              <h3 className="font-bebas text-3xl sm:text-4xl text-[#F4E7D0] tracking-wider uppercase">
                THANK YOU FOR YOUR <span className="text-[#C96B35]">PARTNERSHIP INTEREST</span>
              </h3>
              <p className="text-xs sm:text-sm font-sans text-[#B5ACA0] max-w-md mx-auto leading-relaxed">
                We are thrilled by the prospect of collaborating with <strong className="text-[#F4E7D0]">{submittedData.brandName}</strong> for GSFCU GOT TALENT 2026.
              </p>
            </div>

            <div className="bg-[#14141c] p-4 rounded-xl border border-white/5 text-left text-xs font-mono space-y-2 max-w-md mx-auto">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-[#B5ACA0]">ORGANIZATION:</span>
                <span className="text-[#F4E7D0] font-bold">{submittedData.brandName}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-[#B5ACA0]">CONTACT PERSON:</span>
                <span className="text-[#F4E7D0]">{submittedData.contactPerson}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-[#B5ACA0]">SPONSORSHIP TIER:</span>
                <span className="text-[#C96B35] font-bold">{submittedData.sponsorshipType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B5ACA0]">STATUS:</span>
                <span className="text-emerald-400 font-bold">FORWARDED TO COMMITTEE</span>
              </div>
            </div>

            <p className="text-[11px] text-[#B5ACA0]">
              Our sponsorship team will get in touch with you at <strong className="text-[#F4E7D0]">{submittedData.email}</strong> shortly.
            </p>

            <button
              onClick={handleReset}
              className="mt-4 px-6 py-3 rounded-md bg-[#C96B35] hover:bg-[#B65A3A] text-[#F4E7D0] text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg border border-[#C96B35]"
            >
              DONE & CLOSE
            </button>
          </div>
        ) : (
          /* FORM STATE */
          <div>
            {/* Modal Header */}
            <div className="pb-5 border-b border-[#C49A3A]/20">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C96B35]/15 border border-[#C96B35]/30 text-[10px] font-mono text-[#C96B35] font-bold uppercase tracking-wider mb-2">
                <Building2 className="w-3.5 h-3.5 text-[#C96B35]" /> SPONSORSHIP & BRAND PARTNERSHIPS
              </div>
              <h2 className="font-bebas text-3xl sm:text-4xl text-[#F4E7D0] tracking-wide leading-none">
                PARTNER WITH <span className="text-[#C96B35]">GSFCU GOT TALENT 2026</span>
              </h2>
              <p className="text-xs text-[#B5ACA0] mt-1 font-sans">
                Fill out the details below to discuss custom branding, stall spaces, title sponsorship, or event support.
              </p>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs font-mono text-red-300">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs font-sans">
              
              {/* Brand / Organization Name */}
              <div>
                <label className="block text-[10px] font-mono text-[#B5ACA0] uppercase tracking-wider mb-1">
                  ORGANIZATION / BRAND NAME <span className="text-[#C96B35]">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#B5ACA0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    placeholder="e.g. Gujarat State Fertilizers & Chemicals Ltd"
                    className="w-full bg-[#08080a] border border-[#C49A3A]/30 rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#F4E7D0] placeholder-[#B5ACA0]/40 focus:outline-none focus:border-[#C96B35]"
                    required
                  />
                </div>
              </div>

              {/* Contact Person & Phone Number (2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#B5ACA0] uppercase tracking-wider mb-1">
                    CONTACT PERSON <span className="text-[#C96B35]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#B5ACA0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      placeholder="Your Full Name"
                      className="w-full bg-[#08080a] border border-[#C49A3A]/30 rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#F4E7D0] placeholder-[#B5ACA0]/40 focus:outline-none focus:border-[#C96B35]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#B5ACA0] uppercase tracking-wider mb-1">
                    PHONE NUMBER <span className="text-[#C96B35]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#B5ACA0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#08080a] border border-[#C49A3A]/30 rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#F4E7D0] placeholder-[#B5ACA0]/40 focus:outline-none focus:border-[#C96B35]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email & Sponsorship Type (2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#B5ACA0] uppercase tracking-wider mb-1">
                    EMAIL ADDRESS <span className="text-[#C96B35]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#B5ACA0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="official@brand.com"
                      className="w-full bg-[#08080a] border border-[#C49A3A]/30 rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#F4E7D0] placeholder-[#B5ACA0]/40 focus:outline-none focus:border-[#C96B35]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#B5ACA0] uppercase tracking-wider mb-1">
                    SPONSORSHIP TYPE
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-[#B5ACA0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      name="sponsorshipType"
                      value={formData.sponsorshipType}
                      onChange={handleChange}
                      className="w-full bg-[#08080a] border border-[#C49A3A]/30 rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#F4E7D0] focus:outline-none focus:border-[#C96B35]"
                    >
                      <option value="Platinum Sponsor">Platinum Sponsor</option>
                      <option value="Gold Sponsor">Gold Sponsor</option>
                      <option value="Silver Sponsor">Silver Sponsor</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Message / Requirements */}
              <div>
                <label className="block text-[10px] font-mono text-[#B5ACA0] uppercase tracking-wider mb-1">
                  MESSAGE / REQUIREMENTS (OPTIONAL)
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-[#B5ACA0] absolute left-3.5 top-3" />
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your brand goals, preferred stalls, or custom partnership requirements..."
                    className="w-full bg-[#08080a] border border-[#C49A3A]/30 rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#F4E7D0] placeholder-[#B5ACA0]/40 focus:outline-none focus:border-[#C96B35]"
                  />
                </div>
              </div>

              {/* Verified Notice & Submit Button */}
              <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#68734A]">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#68734A]" />
                  <span>DIRECT ORGANIZING COMMITTEE ENQUIRY</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-7 py-3 rounded-md bg-[#C96B35] hover:bg-[#B65A3A] text-[#F4E7D0] text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg border border-[#C96B35] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>SUBMITTING ENQUIRY...</span>
                  ) : (
                    <>
                      <span>SEND SPONSOR ENQUIRY</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
