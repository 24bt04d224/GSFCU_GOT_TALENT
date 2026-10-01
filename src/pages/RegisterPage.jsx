import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { EVENT_DETAILS, TALENT_CATEGORIES } from '../data/eventData';
import { 
  User, Sparkles, ArrowRight, ArrowLeft, MessageSquare, ExternalLink, ShieldCheck, CheckCircle2 
} from 'lucide-react';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    enrollmentNo: '',
    schoolDept: 'School of Technology (SOT)',
    semester: '1st Semester',
    phone: '',
    email: '',
    category: 'singing',
    participationType: 'Solo',
    performanceName: '',
    numParticipants: '1',
    description: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.enrollmentNo.trim()) newErrors.enrollmentNo = 'Enrollment Number is required';
    if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Valid 10-digit phone number required';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid student email required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.performanceName.trim()) newErrors.performanceName = 'Performance title is required';
    if (!formData.description.trim()) newErrors.description = 'Short description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `GT26-${randomNum}`;
    setRegistrationId(newId);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C96B35', '#C49A3A', '#B65A3A', '#68734A', '#F4E7D0']
      });
    } catch (err) {}
  };

  const resetForm = () => {
    setSubmitted(false);
    setStep(1);
    setFormData({
      fullName: '',
      enrollmentNo: '',
      schoolDept: 'School of Technology (SOT)',
      semester: '1st Semester',
      phone: '',
      email: '',
      category: 'singing',
      participationType: 'Solo',
      performanceName: '',
      numParticipants: '1',
      description: '',
    });
  };

  const getCategoryTitle = (catId) => {
    const match = TALENT_CATEGORIES.find((c) => c.id === catId);
    return match ? match.title : catId;
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-[#F4E7D0] flex flex-col font-sans relative overflow-hidden">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-[#B5ACA0] hover:text-[#C96B35] mb-3 sm:mb-4 transition-colors min-h-[40px]">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Event Homepage
            </Link>
            <h1 className="font-bebas text-3xl xs:text-4xl sm:text-6xl uppercase tracking-wide text-[#F4E7D0] mb-1">
              OFFICIAL <span className="text-[#C96B35]">REGISTRATION</span>
            </h1>
            <p className="font-hand text-xl xs:text-2xl text-[#C49A3A]">
              "Take The Stage — 29 October 2026"
            </p>
          </div>

          {!submitted ? (
            <div className="bg-[#0f0e13] border border-[#C49A3A]/20 rounded-2xl p-4 xs:p-6 sm:p-10 shadow-2xl relative">
              
              {/* Step Progress Header */}
              <div className="mb-8 sm:mb-10">
                <div className="flex items-center justify-between mb-3 text-[10px] xs:text-xs font-mono">
                  <span className={`uppercase font-bold ${step >= 1 ? 'text-[#C96B35]' : 'text-[#B5ACA0]'}`}>
                    <span className="hidden sm:inline">STEP 01: YOUR DETAILS</span>
                    <span className="sm:hidden">01 DETAILS</span>
                  </span>
                  <span className={`uppercase font-bold ${step >= 2 ? 'text-[#C96B35]' : 'text-[#B5ACA0]'}`}>
                    <span className="hidden sm:inline">STEP 02: YOUR TALENT</span>
                    <span className="sm:hidden">02 TALENT</span>
                  </span>
                  <span className={`uppercase font-bold ${step === 3 ? 'text-[#C96B35]' : 'text-[#B5ACA0]'}`}>
                    <span className="hidden sm:inline">STEP 03: REVIEW</span>
                    <span className="sm:hidden">03 REVIEW</span>
                  </span>
                </div>
                
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#C96B35] transition-all duration-500"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* STEP 01: YOUR DETAILS */}
              {step === 1 && (
                <div className="space-y-5 sm:space-y-6">
                  <div className="border-b border-white/10 pb-4 mb-4 sm:mb-6">
                    <h2 className="font-bebas text-xl sm:text-2xl text-[#F4E7D0] flex items-center gap-2 tracking-wide">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#C96B35] shrink-0" /> STUDENT IDENTIFICATION
                    </h2>
                    <p className="text-xs text-[#B5ACA0] font-sans">Enter your verified GSFC University details.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#F4E7D0] uppercase mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Aarav Patel"
                      className="w-full bg-[#08080a] border border-[#C49A3A]/25 rounded-lg px-4 py-3 text-sm text-[#F4E7D0] placeholder-[#B5ACA0]/50 focus:outline-none focus:border-[#C96B35] transition-colors font-sans"
                    />
                    {errors.fullName && <p className="text-xs text-red-400 mt-1 font-mono">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#F4E7D0] uppercase mb-2">Enrollment Number *</label>
                    <input
                      type="text"
                      name="enrollmentNo"
                      value={formData.enrollmentNo}
                      onChange={handleChange}
                      placeholder="e.g. 230101042"
                      className="w-full bg-[#08080a] border border-[#C49A3A]/25 rounded-lg px-4 py-3 text-sm text-[#F4E7D0] placeholder-[#B5ACA0]/50 focus:outline-none focus:border-[#C96B35] transition-colors font-mono"
                    />
                    {errors.enrollmentNo && <p className="text-xs text-red-400 mt-1 font-mono">{errors.enrollmentNo}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs font-mono text-[#F4E7D0] uppercase mb-2">School / Department</label>
                      <select
                        name="schoolDept"
                        value={formData.schoolDept}
                        onChange={handleChange}
                        className="w-full bg-[#08080a] border border-[#C49A3A]/25 rounded-lg px-4 py-3 text-sm text-[#F4E7D0] focus:outline-none focus:border-[#C96B35] transition-colors font-sans"
                      >
                        <option value="School of Technology (SOT)">School of Technology (SOT)</option>
                        <option value="School of Science (SOS)">School of Science (SOS)</option>
                        <option value="School of Management (SOM)">School of Management (SOM)</option>
                        <option value="School of Chemical Sciences">School of Chemical Sciences</option>
                        <option value="Other Stream">Other Stream</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#F4E7D0] uppercase mb-2">Semester</label>
                      <select
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        className="w-full bg-[#08080a] border border-[#C49A3A]/25 rounded-lg px-4 py-3 text-sm text-[#F4E7D0] focus:outline-none focus:border-[#C96B35] transition-colors font-sans"
                      >
                        <option value="1st Semester">1st Semester</option>
                        <option value="2nd Semester">2nd Semester</option>
                        <option value="3rd Semester">3rd Semester</option>
                        <option value="4th Semester">4th Semester</option>
                        <option value="5th Semester">5th Semester</option>
                        <option value="6th Semester">6th Semester</option>
                        <option value="7th Semester">7th Semester</option>
                        <option value="8th Semester">8th Semester</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs font-mono text-[#F4E7D0] uppercase mb-2">WhatsApp / Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        className="w-full bg-[#08080a] border border-[#C49A3A]/25 rounded-lg px-4 py-3 text-sm text-[#F4E7D0] placeholder-[#B5ACA0]/50 focus:outline-none focus:border-[#C96B35] transition-colors font-sans"
                      />
                      {errors.phone && <p className="text-xs text-red-400 mt-1 font-mono">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#F4E7D0] uppercase mb-2">Student Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="student@gsfcuniversity.ac.in"
                        className="w-full bg-[#08080a] border border-[#C49A3A]/25 rounded-lg px-4 py-3 text-sm text-[#F4E7D0] placeholder-[#B5ACA0]/50 focus:outline-none focus:border-[#C96B35] transition-colors font-sans"
                      />
                      {errors.email && <p className="text-xs text-red-400 mt-1 font-mono">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="pt-4 sm:pt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full sm:w-auto bg-[#C96B35] hover:bg-[#B65A3A] text-[#F4E7D0] font-mono font-bold text-xs uppercase tracking-wider px-6 sm:px-8 py-3.5 rounded-md shadow-lg flex items-center justify-center gap-2 transition-all border border-[#C96B35] hover:border-[#B65A3A] min-h-[44px]"
                    >
                      PROCEED TO PERFORMANCE DETAILS <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 02: YOUR TALENT */}
              {step === 2 && (
                <div className="space-y-5 sm:space-y-6">
                  <div className="border-b border-white/10 pb-4 mb-4 sm:mb-6">
                    <h2 className="font-bebas text-xl sm:text-2xl text-[#F4E7D0] flex items-center gap-2 tracking-wide">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#C49A3A] shrink-0" /> PERFORMANCE SPECIFICATIONS
                    </h2>
                    <p className="text-xs text-[#B5ACA0] font-sans">Details about your act and technical needs.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs font-mono text-[#F4E7D0] uppercase mb-2">Talent Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full bg-[#08080a] border border-[#C49A3A]/25 rounded-lg px-4 py-3 text-sm text-[#F4E7D0] focus:outline-none focus:border-[#C96B35] transition-colors font-sans"
                      >
                        {TALENT_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.title} ({cat.subtitle})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#F4E7D0] uppercase mb-2">Participation Format</label>
                      <select
                        name="participationType"
                        value={formData.participationType}
                        onChange={handleChange}
                        className="w-full bg-[#08080a] border border-[#C49A3A]/25 rounded-lg px-4 py-3 text-sm text-[#F4E7D0] focus:outline-none focus:border-[#C96B35] transition-colors font-sans"
                      >
                        <option value="Solo">Solo Act</option>
                        <option value="Duo">Duo (2 Performers)</option>
                        <option value="Group">Group Act (3+ Performers)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#F4E7D0] uppercase mb-2">Performance Name / Title *</label>
                    <input
                      type="text"
                      name="performanceName"
                      value={formData.performanceName}
                      onChange={handleChange}
                      placeholder="e.g. Garba Fusion Beat / Acoustic Rhapsody / Skit on Campus Life"
                      className="w-full bg-[#08080a] border border-[#C49A3A]/25 rounded-lg px-4 py-3 text-sm text-[#F4E7D0] placeholder-[#B5ACA0]/50 focus:outline-none focus:border-[#C96B35] transition-colors font-sans"
                    />
                    {errors.performanceName && <p className="text-xs text-red-400 mt-1 font-mono">{errors.performanceName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#F4E7D0] uppercase mb-2">Total Performers on Stage</label>
                    <input
                      type="number"
                      name="numParticipants"
                      min="1"
                      max="15"
                      value={formData.numParticipants}
                      onChange={handleChange}
                      className="w-full bg-[#08080a] border border-[#C49A3A]/25 rounded-lg px-4 py-3 text-sm text-[#F4E7D0] focus:outline-none focus:border-[#C96B35] transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#F4E7D0] uppercase mb-2">Short Description & Stage Setup / Props Needed *</label>
                    <textarea
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your act, backing tracks, instruments or special props required..."
                      className="w-full bg-[#08080a] border border-[#C49A3A]/25 rounded-lg px-4 py-3 text-sm text-[#F4E7D0] placeholder-[#B5ACA0]/50 focus:outline-none focus:border-[#C96B35] transition-colors resize-none font-sans"
                    />
                    {errors.description && <p className="text-xs text-red-400 mt-1 font-mono">{errors.description}</p>}
                  </div>

                  <div className="pt-4 sm:pt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-3 rounded-md border border-[#C49A3A]/25 text-xs font-mono text-[#B5ACA0] hover:text-[#F4E7D0] uppercase transition-colors min-h-[44px] flex items-center justify-center"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-[#C96B35] hover:bg-[#B65A3A] text-[#F4E7D0] font-mono font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-md shadow-lg flex items-center justify-center gap-2 transition-all border border-[#C96B35] hover:border-[#B65A3A] min-h-[44px]"
                    >
                      REVIEW REGISTRATION <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 03: REVIEW & SUBMIT */}
              {step === 3 && (
                <div className="space-y-5 sm:space-y-6">
                  <div className="border-b border-white/10 pb-4 mb-4 sm:mb-6">
                    <h2 className="font-bebas text-xl sm:text-2xl text-[#F4E7D0] flex items-center gap-2 tracking-wide">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#C96B35] shrink-0" /> REVIEW SUMMARY
                    </h2>
                    <p className="text-xs text-[#B5ACA0] font-sans">Confirm your entry before final submission.</p>
                  </div>

                  <div className="space-y-4 font-sans text-xs">
                    <div className="p-4 rounded-lg bg-[#08080a] border border-[#C49A3A]/20 space-y-2">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="font-mono text-[#C49A3A] uppercase font-bold">STUDENT DETAILS</span>
                        <button onClick={() => setStep(1)} className="text-[11px] text-[#C96B35] font-mono hover:underline p-1">EDIT</button>
                      </div>
                      <p><span className="text-[#B5ACA0]">Full Name:</span> <strong className="text-[#F4E7D0]">{formData.fullName}</strong></p>
                      <p><span className="text-[#B5ACA0]">Enrollment No:</span> <strong className="text-[#F4E7D0] font-mono">{formData.enrollmentNo}</strong></p>
                      <p><span className="text-[#B5ACA0]">Department:</span> <span className="text-[#F4E7D0]">{formData.schoolDept}</span> ({formData.semester})</p>
                      <p className="break-all"><span className="text-[#B5ACA0]">Contact:</span> <span className="text-[#F4E7D0]">{formData.phone}</span> | <span className="text-[#F4E7D0]">{formData.email}</span></p>
                    </div>

                    <div className="p-4 rounded-lg bg-[#08080a] border border-[#C49A3A]/20 space-y-2">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="font-mono text-[#C49A3A] uppercase font-bold">PERFORMANCE DETAILS</span>
                        <button onClick={() => setStep(2)} className="text-[11px] text-[#C96B35] font-mono hover:underline p-1">EDIT</button>
                      </div>
                      <p><span className="text-[#B5ACA0]">Category:</span> <strong className="text-[#F4E7D0] font-bebas text-base uppercase tracking-wide">{getCategoryTitle(formData.category)}</strong> ({formData.participationType})</p>
                      <p><span className="text-[#B5ACA0]">Title:</span> <span className="text-[#C96B35] font-bold">{formData.performanceName}</span></p>
                      <p><span className="text-[#B5ACA0]">Performers:</span> <span className="text-[#F4E7D0] font-mono">{formData.numParticipants} Person(s)</span></p>
                      <p><span className="text-[#B5ACA0]">Description:</span> <span className="text-[#F4E7D0]">{formData.description}</span></p>
                    </div>
                  </div>

                  <div className="pt-4 sm:pt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-3 rounded-md border border-[#C49A3A]/25 text-xs font-mono text-[#B5ACA0] hover:text-[#F4E7D0] uppercase transition-colors min-h-[44px] flex items-center justify-center"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-[#C96B35] hover:bg-[#B65A3A] text-[#F4E7D0] font-mono font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-md shadow-xl flex items-center justify-center gap-2 transition-all border border-[#C96B35] hover:border-[#B65A3A] min-h-[44px]"
                    >
                      SUBMIT REGISTRATION →
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* SUCCESS STATE SCREEN */
            <div className="bg-[#0f0e13] border border-[#C96B35]/40 rounded-2xl p-6 sm:p-12 text-center shadow-2xl relative overflow-hidden">
              
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#68734A]/15 border border-[#68734A]/30 mx-auto mb-4 sm:mb-6 flex items-center justify-center text-[#68734A]">
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <span className="font-mono text-[10px] sm:text-xs tracking-widest text-[#C49A3A] uppercase block mb-2 font-bold">
                REGISTRATION RECEIVED
              </span>

              <h2 className="font-bebas text-3xl xs:text-4xl sm:text-5xl uppercase text-[#F4E7D0] mb-2 tracking-wide">
                REGISTRATION CONFIRMED
              </h2>

              <p className="text-xs sm:text-sm text-[#B5ACA0] max-w-md mx-auto mb-6 font-sans">
                Your entry has been successfully logged. Keep your official registration ID handy for audition reporting.
              </p>

              {/* ID Badge */}
              <div className="inline-block p-3.5 sm:p-4 rounded-xl bg-[#08080a] border border-[#C49A3A]/25 mb-6 sm:mb-8 max-w-full">
                <span className="text-[9px] sm:text-[10px] font-mono text-[#B5ACA0] block uppercase mb-1">YOUR OFFICIAL REGISTRATION ID</span>
                <span className="font-bebas text-3xl sm:text-4xl text-[#C96B35] tracking-wider block">
                  {registrationId}
                </span>
              </div>

              {/* WhatsApp Callout */}
              <div className="p-4 sm:p-6 rounded-xl bg-[#0f1712] border border-emerald-500/30 mb-6 sm:mb-8 max-w-md mx-auto text-left">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="font-bebas text-base sm:text-lg text-[#F4E7D0] tracking-wide">Join Official Audition Updates Group</h3>
                    <p className="text-[11px] sm:text-xs text-[#B5ACA0] font-sans">Receive instant reporting schedules and stage rules.</p>
                  </div>
                </div>

                <a
                  href={EVENT_DETAILS.whatsappGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors shadow-lg min-h-[44px]"
                >
                  JOIN THE OFFICIAL WHATSAPP GROUP <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  to="/"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-md bg-white/5 hover:bg-white/10 border border-[#C49A3A]/25 text-xs font-mono font-bold text-[#F4E7D0] uppercase tracking-wider transition-colors min-h-[44px] flex items-center justify-center"
                >
                  RETURN TO HOME
                </Link>

                <button
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-md bg-[#C96B35]/20 hover:bg-[#C96B35] text-[#C96B35] hover:text-[#F4E7D0] border border-[#C96B35]/40 text-xs font-mono font-bold uppercase tracking-wider transition-all min-h-[44px] flex items-center justify-center"
                >
                  REGISTER ANOTHER ACT
                </button>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
