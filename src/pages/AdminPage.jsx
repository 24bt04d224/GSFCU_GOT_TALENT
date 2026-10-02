import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DigitalPassModal from '../components/DigitalPassModal';
import {
  getRegistrations,
  updateRegistrationStatus,
  toggleCheckInStatus,
  deleteRegistration,
  exportRegistrationsCSV
} from '../services/registrationService';
import {
  Users, CheckCircle2, Award, Download, Search, Filter,
  Lock, ArrowLeft, QrCode, Trash2, Eye, RefreshCw
} from 'lucide-react';

const ADMIN_PASSCODE = "gsfcu2026";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('gsfcu_admin_auth') === 'true';
  });
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSchool, setSelectedSchool] = useState('ALL');
  const [selectedPass, setSelectedPass] = useState(null);
  const [quickCheckInId, setQuickCheckInId] = useState('');
  const [checkInMsg, setCheckInMsg] = useState('');

  const loadRegistrations = () => {
    const list = getRegistrations();
    setRegistrations(list);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadRegistrations();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcodeInput.trim() === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      sessionStorage.setItem('gsfcu_admin_auth', 'true');
      setPasscodeError('');
      loadRegistrations();
    } else {
      setPasscodeError('Invalid Committee Passcode. Access Restricted.');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = updateRegistrationStatus(id, newStatus);
    setRegistrations(updated);
  };

  const handleCheckInToggle = (id) => {
    const updated = toggleCheckInStatus(id);
    setRegistrations(updated);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} (${id})?`)) {
      const updated = deleteRegistration(id);
      setRegistrations(updated);
    }
  };

  const handleQuickCheckIn = (e) => {
    e.preventDefault();
    const query = quickCheckInId.trim().toUpperCase();
    if (!query) return;

    const candidate = registrations.find(
      (r) => r.id.toUpperCase() === query || r.enrollmentNo.toUpperCase() === query
    );

    if (candidate) {
      if (candidate.checkedIn) {
        setCheckInMsg(`Candidate ${candidate.fullName} (${candidate.id}) is ALREADY checked in!`);
      } else {
        handleCheckInToggle(candidate.id);
        setCheckInMsg(`Verified! ${candidate.fullName} (${candidate.id}) successfully CHECKED IN.`);
      }
      setQuickCheckInId('');
    } else {
      setCheckInMsg(`Error: Candidate with ID or Enrollment '${query}' was not found.`);
    }
  };

  // Filtered dataset
  const filteredData = registrations.filter((item) => {
    const matchSearch =
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.performanceName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory = selectedCategory === 'ALL' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSchool = selectedSchool === 'ALL' || item.schoolDept.toLowerCase().includes(selectedSchool.toLowerCase());

    return matchSearch && matchCategory && matchSchool;
  });

  // KPI Calculations
  const totalCount = registrations.length;
  const shortlistedCount = registrations.filter((r) => r.status.includes('Shortlist')).length;
  const checkedInCount = registrations.filter((r) => r.checkedIn).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08080a] text-[#F4E7D0] flex flex-col justify-between font-sans">
        <Navbar />
        <div className="flex-grow flex items-center justify-center px-4 py-24 sm:py-32">
          <div className="w-full max-w-md bg-[#0f0e13] border border-[#C49A3A]/25 rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
            
            <div className="w-14 h-14 rounded-full bg-[#C96B35]/15 border border-[#C96B35]/30 mx-auto mb-4 flex items-center justify-center text-[#C96B35]">
              <Lock className="w-6 h-6" />
            </div>

            <h1 className="font-bebas text-3xl sm:text-4xl text-[#F4E7D0] tracking-wider uppercase mb-1">
              ORGANIZER PORTAL
            </h1>
            <p className="text-xs text-[#B5ACA0] font-sans mb-6">
              Enter organizing committee credentials to manage auditions and registrations.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter Passcode (default: gsfcu2026)"
                  className="w-full bg-[#08080a] border border-[#C49A3A]/25 rounded-lg px-4 py-3 text-sm text-[#F4E7D0] placeholder-[#B5ACA0]/40 focus:outline-none focus:border-[#C96B35] font-mono text-center tracking-widest"
                  autoFocus
                />
                {passcodeError && (
                  <p className="text-xs text-red-400 mt-2 font-mono">{passcodeError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#C96B35] hover:bg-[#B65A3A] text-[#F4E7D0] font-mono font-bold text-xs uppercase tracking-wider py-3 rounded-md shadow-lg transition-colors border border-[#C96B35]"
              >
                UNLOCK AUDITION DESK →
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/5">
              <Link to="/" className="text-xs font-mono text-[#B5ACA0] hover:text-[#C96B35] inline-flex items-center gap-1.5 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Event Homepage
              </Link>
            </div>

          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-[#F4E7D0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#C49A3A]/20">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs text-[#C49A3A] uppercase tracking-widest font-bold">
                AUDITION DESK • LIVE CONSOLE
              </span>
            </div>
            <h1 className="font-bebas text-3xl sm:text-5xl uppercase tracking-wider text-[#F4E7D0] leading-none">
              EVENT <span className="text-[#C96B35]">MANAGEMENT DASHBOARD</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportRegistrationsCSV}
              className="bg-[#14141a] hover:bg-[#C49A3A]/10 text-[#C49A3A] border border-[#C49A3A]/30 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" /> EXPORT CALL SHEET (CSV)
            </button>
            <button
              onClick={loadRegistrations}
              className="p-2.5 rounded-lg bg-[#14141a] hover:bg-white/10 text-[#B5ACA0] border border-white/10"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KPI Metrics Summary Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="bg-[#0f0e13] border border-[#C49A3A]/20 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#C96B35]/15 border border-[#C96B35]/30 flex items-center justify-center text-[#C96B35] shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-[#B5ACA0] uppercase block">TOTAL REGISTRATIONS</span>
              <span className="font-bebas text-3xl sm:text-4xl text-[#F4E7D0] leading-none mt-0.5 block">
                {totalCount}
              </span>
            </div>
          </div>

          <div className="bg-[#0f0e13] border border-[#C49A3A]/20 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#C49A3A]/15 border border-[#C49A3A]/30 flex items-center justify-center text-[#C49A3A] shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-[#B5ACA0] uppercase block">AUDITION SHORTLISTED</span>
              <span className="font-bebas text-3xl sm:text-4xl text-[#C49A3A] leading-none mt-0.5 block">
                {shortlistedCount}
              </span>
            </div>
          </div>

          <div className="bg-[#0f0e13] border border-[#C49A3A]/20 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#68734A]/15 border border-[#68734A]/30 flex items-center justify-center text-[#68734A] shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-[#B5ACA0] uppercase block">CHECKED IN BACKSTAGE</span>
              <span className="font-bebas text-3xl sm:text-4xl text-[#68734A] leading-none mt-0.5 block">
                {checkedInCount} / {totalCount}
              </span>
            </div>
          </div>

        </div>

        {/* Quick Check-In Bar */}
        <div className="bg-[#121218] border border-[#C49A3A]/25 rounded-xl p-4 sm:p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#08080a] text-[#C96B35] border border-[#C96B35]/25">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-syne font-bold text-sm text-[#F4E7D0]">Express Candidate Check-In</h3>
              <p className="text-xs text-[#B5ACA0]">Enter candidate ID (e.g. GT26-1042) or Enrollment No.</p>
            </div>
          </div>

          <form onSubmit={handleQuickCheckIn} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={quickCheckInId}
              onChange={(e) => setQuickCheckInId(e.target.value)}
              placeholder="Candidate ID / Enrollment"
              className="bg-[#08080a] border border-[#C49A3A]/30 rounded-lg px-3.5 py-2 text-xs font-mono text-[#F4E7D0] focus:outline-none focus:border-[#C96B35] w-full md:w-60"
            />
            <button
              type="submit"
              className="bg-[#C96B35] hover:bg-[#B65A3A] text-[#F4E7D0] text-xs font-mono font-bold px-4 py-2 rounded-lg whitespace-nowrap uppercase tracking-wider"
            >
              CHECK IN
            </button>
          </form>
        </div>

        {checkInMsg && (
          <div className="mb-6 p-3 rounded-lg bg-[#C49A3A]/10 border border-[#C49A3A]/30 text-xs font-mono text-[#F4E7D0] flex items-center justify-between animate-in fade-in">
            <span>{checkInMsg}</span>
            <button onClick={() => setCheckInMsg('')} className="text-xs hover:text-[#C96B35] p-1">✕</button>
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="bg-[#0f0e13] border border-[#C49A3A]/20 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B5ACA0]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, ID, enrollment, or act..."
              className="w-full bg-[#08080a] border border-[#C49A3A]/25 rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#F4E7D0] placeholder-[#B5ACA0]/50 focus:outline-none focus:border-[#C96B35]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#C49A3A]" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#08080a] border border-[#C49A3A]/25 rounded-lg px-3 py-2 text-xs text-[#F4E7D0] focus:outline-none focus:border-[#C96B35]"
              >
                <option value="ALL">All Categories</option>
                <option value="singing">Singing</option>
                <option value="dance">Dance</option>
                <option value="drama">Drama</option>
                <option value="instrumental">Instrumental</option>
                <option value="comedy">Comedy</option>
                <option value="other">Other</option>
              </select>
            </div>

            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="bg-[#08080a] border border-[#C49A3A]/25 rounded-lg px-3 py-2 text-xs text-[#F4E7D0] focus:outline-none focus:border-[#C96B35]"
            >
              <option value="ALL">All Schools / Streams</option>
              <option value="Technology">School of Technology (SOT)</option>
              <option value="Science">School of Science (SOS)</option>
              <option value="Management">School of Management (SOM)</option>
              <option value="Chemical">Chemical Sciences</option>
            </select>
          </div>

        </div>

        {/* Data Table */}
        <div className="bg-[#0f0e13] border border-[#C49A3A]/20 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              
              <thead>
                <tr className="border-b border-[#C49A3A]/20 bg-[#14141c] font-mono text-[11px] text-[#C49A3A] uppercase tracking-wider">
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Candidate & Department</th>
                  <th className="py-3.5 px-4">Act Details</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Stage Check-In</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 font-sans">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#C96B35] whitespace-nowrap">
                        {item.id}
                      </td>

                      {/* Name & Dept */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#F4E7D0] text-sm">{item.fullName}</div>
                        <div className="font-mono text-[11px] text-[#B5ACA0]">
                          {item.enrollmentNo} • {item.schoolDept}
                        </div>
                        <div className="text-[10px] text-[#B5ACA0]/70 font-mono">
                          Ph: {item.phone}
                        </div>
                      </td>

                      {/* Performance */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#F4E7D0]">{item.performanceName}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] uppercase font-bold text-[#C49A3A]">
                            {item.category}
                          </span>
                          <span className="text-[#B5ACA0] text-[10px]">
                            ({item.participationType}, {item.numParticipants} performer)
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="bg-[#08080a] border border-[#C49A3A]/25 rounded px-2.5 py-1 text-[11px] font-mono text-[#F4E7D0] focus:outline-none focus:border-[#C96B35]"
                        >
                          <option value="Registered">Registered</option>
                          <option value="Shortlisted for Auditions">Shortlisted for Auditions</option>
                          <option value="Grand Finalist">Grand Finalist</option>
                          <option value="Disqualified">Disqualified</option>
                        </select>
                      </td>

                      {/* Check-In */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleCheckInToggle(item.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase transition-all ${
                            item.checkedIn
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-white/5 text-[#B5ACA0] border border-white/10 hover:border-[#C96B35]/40'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{item.checkedIn ? 'Checked In' : 'Pending'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedPass(item)}
                            className="p-1.5 rounded bg-white/5 hover:bg-[#C96B35] text-[#F4E7D0] transition-colors"
                            title="View Official Digital Pass & QR"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.fullName)}
                            className="p-1.5 rounded bg-white/5 hover:bg-red-500 text-[#B5ACA0] hover:text-white transition-colors"
                            title="Delete Candidate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-sm text-[#B5ACA0] font-mono">
                      No matching participants found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>

      </main>

      {/* Digital Pass Modal */}
      {selectedPass && (
        <DigitalPassModal
          registration={selectedPass}
          onClose={() => setSelectedPass(null)}
        />
      )}

      <Footer />
    </div>
  );
}
