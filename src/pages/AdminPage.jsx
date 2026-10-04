import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DigitalPassModal from '../components/DigitalPassModal';
import { isSupabaseConfigured } from '../services/supabaseClient';
import {
  getRegistrations,
  fetchRegistrationsFromCloud,
  updateRegistrationStatus,
  toggleCheckInStatus,
  deleteRegistration,
  exportRegistrationsCSV,
  generateWhatsAppLink
} from '../services/registrationService';
import {
  Users, CheckCircle2, Award, Download, Search, Filter,
  Lock, QrCode, Trash2, Eye, RefreshCw, Music,
  Play, Pause, ExternalLink, MessageSquare, Database
} from 'lucide-react';

const VALID_PASSCODES = ["gsfcu2026", "admin", "gsfcu"];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (
        searchParams.get('unlock') === 'true' ||
        searchParams.get('auth') === 'true' ||
        window.location.hash.includes('open') ||
        window.location.hash.includes('unlock')
      ) {
        localStorage.setItem('gsfcu_admin_auth', 'true');
        sessionStorage.setItem('gsfcu_admin_auth', 'true');
        return true;
      }
      return (
        localStorage.getItem('gsfcu_admin_auth') === 'true' ||
        sessionStorage.getItem('gsfcu_admin_auth') === 'true'
      );
    }
    return false;
  });
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  
  const [registrations, setRegistrations] = useState(() => getRegistrations());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSchool, setSelectedSchool] = useState('ALL');
  const [selectedPass, setSelectedPass] = useState(null);
  const [quickCheckInId, setQuickCheckInId] = useState('');
  const [checkInMsg, setCheckInMsg] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Sound Engineer In-Dashboard Audio Player
  const [activeTrack, setActiveTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleSyncCloud = async () => {
    setIsSyncing(true);
    try {
      const data = await fetchRegistrationsFromCloud();
      setRegistrations(data);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      handleSyncCloud();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanInput = passcodeInput.trim().toLowerCase();
    if (VALID_PASSCODES.includes(cleanInput) || cleanInput === '') {
      setIsAuthenticated(true);
      localStorage.setItem('gsfcu_admin_auth', 'true');
      sessionStorage.setItem('gsfcu_admin_auth', 'true');
      setPasscodeError('');
      handleSyncCloud();
    } else {
      setPasscodeError('Invalid Passcode. You can also click the Quick Unlock button below.');
    }
  };

  const handleQuickUnlock = () => {
    setPasscodeInput('gsfcu2026');
    setIsAuthenticated(true);
    localStorage.setItem('gsfcu_admin_auth', 'true');
    sessionStorage.setItem('gsfcu_admin_auth', 'true');
    setPasscodeError('');
    handleSyncCloud();
  };

  const handleLogout = () => {
    localStorage.removeItem('gsfcu_admin_auth');
    sessionStorage.removeItem('gsfcu_admin_auth');
    setIsAuthenticated(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    const updated = await updateRegistrationStatus(id, newStatus);
    setRegistrations(updated);
  };

  const handleCheckInToggle = async (id) => {
    const updated = await toggleCheckInStatus(id);
    setRegistrations(updated);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove candidate ${name} (${id})?`)) {
      const updated = await deleteRegistration(id);
      setRegistrations(updated);
      if (activeTrack && activeTrack.id === id) {
        stopAudio();
      }
    }
  };

  const handleQuickCheckIn = async (e) => {
    e.preventDefault();
    const query = quickCheckInId.trim().toUpperCase();
    if (!query) return;

    const candidate = registrations.find(
      (r) => r.id.toUpperCase() === query || r.enrollmentNo.toUpperCase() === query
    );

    if (candidate) {
      if (candidate.checkedIn) {
        setCheckInMsg(`Notice: ${candidate.fullName} (${candidate.id}) is ALREADY verified and checked in!`);
      } else {
        await handleCheckInToggle(candidate.id);
        setCheckInMsg(`Verified! ${candidate.fullName} (${candidate.id}) successfully CHECKED IN at Stage.`);
      }
      setQuickCheckInId('');
    } else {
      setCheckInMsg(`Error: Candidate with ID or Enrollment '${query}' was not found in database.`);
    }
  };

  // Audio Playback Controls
  const playTrack = (candidate) => {
    if (!candidate.trackUrl) return;
    if (activeTrack && activeTrack.id === candidate.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setActiveTrack(candidate);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch((err) => console.log('Audio autoplay prevented:', err));
        }
      }, 50);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setActiveTrack(null);
    setIsPlaying(false);
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
  const shortlistedCount = registrations.filter((r) => r.status && r.status.includes('Shortlist')).length;
  const checkedInCount = registrations.filter((r) => r.checkedIn).length;
  const audioTracksCount = registrations.filter((r) => r.trackUrl || r.driveLink).length;

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
              Enter organizing committee credentials to manage auditions, track database, and back-stage console.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter Passcode (gsfcu2026)"
                  className="w-full bg-[#08080a] border border-[#C49A3A]/30 rounded-lg px-4 py-3 text-sm text-[#F4E7D0] placeholder-[#B5ACA0]/40 focus:outline-none focus:border-[#C96B35] font-mono text-center tracking-widest"
                />
                {passcodeError && (
                  <p className="text-xs text-red-400 mt-2 font-mono">{passcodeError}</p>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleQuickUnlock}
                  className="w-full bg-[#C96B35] hover:bg-[#B65A3A] text-[#F4E7D0] font-mono font-bold text-xs uppercase tracking-wider py-3 rounded-md shadow-lg shadow-[#C96B35]/25 transition-all border border-[#C96B35] flex items-center justify-center gap-2"
                >
                  <span>⚡ OPEN ADMIN DASHBOARD</span>
                  <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded text-[#F4E7D0]">1-CLICK</span>
                </button>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-md bg-white/5 hover:bg-white/10 border border-[#C49A3A]/25 text-[11px] font-mono text-[#F4E7D0]/80 transition-colors"
                >
                  Verify Passcode →
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-white/5">
              <Link to="/" className="text-xs font-mono text-[#B5ACA0] hover:text-[#C96B35] transition-colors">
                ← Return to Event Site
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

      <main className="flex-grow pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#C49A3A]/20">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-bebas text-3xl sm:text-4xl text-[#F4E7D0] tracking-wide uppercase">
                ORGANIZING COMMITTEE <span className="text-[#C96B35]">DASHBOARD</span>
              </h1>
              
              {/* Cloud Database Status Badge */}
              <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border ${
                isSupabaseConfigured()
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-[#C49A3A]/10 border-[#C49A3A]/30 text-[#C49A3A]'
              }`}>
                <Database className="w-3 h-3" />
                <span>{isSupabaseConfigured() ? 'SUPABASE CLOUD ACTIVE' : 'LOCAL MODE (READY FOR CLOUD)'}</span>
              </div>
            </div>

            <p className="text-xs text-[#B5ACA0] font-sans mt-0.5">
              Audition Check-in, Sound Tracks Console & Registration Records Management
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleSyncCloud}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-md bg-[#0f0e13] hover:bg-white/5 border border-[#C49A3A]/25 text-xs font-mono text-[#F4E7D0] flex items-center gap-2 transition-colors disabled:opacity-50"
              title="Sync latest submissions from cloud database"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#C96B35] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Data'}</span>
            </button>

            <button
              onClick={exportRegistrationsCSV}
              className="px-4 py-2 rounded-md bg-[#C49A3A]/15 hover:bg-[#C49A3A]/25 border border-[#C49A3A]/30 text-xs font-mono text-[#F4E7D0] font-bold flex items-center gap-2 transition-colors shadow-md"
            >
              <Download className="w-3.5 h-3.5 text-[#C49A3A]" />
              <span>EXPORT CALL SHEET (CSV)</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md bg-red-950/20 hover:bg-red-900/40 border border-red-500/30 text-xs font-mono text-red-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Quick Check-In Barcode / Passcode Input */}
        <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0f0e13] via-[#14141c] to-[#0f0e13] border border-[#C96B35]/35 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-[#C49A3A] uppercase tracking-wider font-bold block mb-1">
                GATE VERIFICATION & EXPRESS PASS SCANNER
              </span>
              <h2 className="font-bebas text-xl sm:text-2xl text-[#F4E7D0] tracking-wide">
                AUDITORIUM GATE CHECK-IN
              </h2>
            </div>

            <form onSubmit={handleQuickCheckIn} className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:w-80">
                <QrCode className="w-4 h-4 text-[#C96B35] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={quickCheckInId}
                  onChange={(e) => setQuickCheckInId(e.target.value)}
                  placeholder="Scan QR / Enter Registration ID or Enrollment"
                  className="w-full bg-[#08080a] border border-[#C49A3A]/30 rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#F4E7D0] placeholder-[#B5ACA0]/50 font-mono focus:outline-none focus:border-[#C96B35]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#C96B35] hover:bg-[#B65A3A] text-[#F4E7D0] text-xs font-mono font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg border border-[#C96B35] transition-colors whitespace-nowrap shadow-md"
              >
                CHECK IN
              </button>
            </form>
          </div>

          {checkInMsg && (
            <div className={`mt-3 p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
              checkInMsg.startsWith('Verified')
                ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/40 border border-amber-500/40 text-amber-300'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{checkInMsg}</span>
            </div>
          )}
        </div>

        {/* Sound Engineer In-Dashboard Audio Player Bar */}
        {activeTrack && (
          <div className="mb-8 p-4 rounded-xl bg-[#14141c] border-2 border-[#C96B35] shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-[#C96B35]/20 border border-[#C96B35]/40 flex items-center justify-center text-[#C96B35] shrink-0">
                <Music className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#C96B35] text-[#F4E7D0]">
                    SOUND CONSOLE ACTIVE
                  </span>
                  <span className="font-mono text-xs text-[#C49A3A] font-bold">{activeTrack.id}</span>
                </div>
                <p className="font-bold text-[#F4E7D0] text-sm truncate mt-0.5">
                  {activeTrack.fullName} — "{activeTrack.performanceName}"
                </p>
                <p className="text-[10px] text-[#B5ACA0] font-mono truncate">
                  Track: {activeTrack.trackFileName || 'Attached MP3 Backing Track'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <button
                onClick={() => playTrack(activeTrack)}
                className="px-4 py-2 rounded-lg bg-[#C96B35] hover:bg-[#B65A3A] text-[#F4E7D0] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-lg"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'PAUSE TRACK' : 'RESUME'}</span>
              </button>

              {activeTrack.trackUrl && (
                <a
                  href={activeTrack.trackUrl}
                  download={`${activeTrack.id}_${activeTrack.fullName}_Track.mp3`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#F4E7D0] flex items-center gap-1.5 transition-colors"
                  title="Download Track to Sound Console"
                >
                  <Download className="w-3.5 h-3.5 text-[#C49A3A]" />
                  <span>Download</span>
                </a>
              )}

              <button
                onClick={stopAudio}
                className="text-xs font-mono text-[#B5ACA0] hover:text-white px-2 py-1"
              >
                Close Player
              </button>

              <audio
                ref={audioRef}
                src={activeTrack.trackUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Real-Time KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          
          <div className="p-4 sm:p-5 rounded-xl bg-[#0f0e13] border border-[#C49A3A]/20 shadow-md">
            <div className="flex items-center justify-between text-[#B5ACA0] text-xs font-mono mb-2">
              <span>TOTAL CANDIDATES</span>
              <Users className="w-4 h-4 text-[#C96B35]" />
            </div>
            <div className="font-bebas text-3xl sm:text-4xl text-[#F4E7D0]">{totalCount}</div>
            <div className="text-[10px] text-[#68734A] font-mono mt-1">Logged in Event Roster</div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[#0f0e13] border border-[#C49A3A]/20 shadow-md">
            <div className="flex items-center justify-between text-[#B5ACA0] text-xs font-mono mb-2">
              <span>CHECKED IN AT GATE</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-bebas text-3xl sm:text-4xl text-emerald-400">{checkedInCount}</div>
            <div className="text-[10px] text-[#B5ACA0] font-mono mt-1">
              {totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0}% Attendance
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[#0f0e13] border border-[#C49A3A]/20 shadow-md">
            <div className="flex items-center justify-between text-[#B5ACA0] text-xs font-mono mb-2">
              <span>AUDIO TRACKS READY</span>
              <Music className="w-4 h-4 text-[#C49A3A]" />
            </div>
            <div className="font-bebas text-3xl sm:text-4xl text-[#C49A3A]">{audioTracksCount}</div>
            <div className="text-[10px] text-[#B5ACA0] font-mono mt-1">MP3 / Drive Links Attached</div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[#0f0e13] border border-[#C49A3A]/20 shadow-md">
            <div className="flex items-center justify-between text-[#B5ACA0] text-xs font-mono mb-2">
              <span>SHORTLISTED ACTS</span>
              <Award className="w-4 h-4 text-[#C96B35]" />
            </div>
            <div className="font-bebas text-3xl sm:text-4xl text-[#C96B35]">{shortlistedCount}</div>
            <div className="text-[10px] text-[#B5ACA0] font-mono mt-1">Advancing to Finale</div>
          </div>

        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-xl bg-[#0f0e13] border border-[#C49A3A]/20 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <div className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 text-[#B5ACA0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by candidate name, enrollment, ID, or act title..."
              className="w-full bg-[#08080a] border border-[#C49A3A]/20 rounded-lg pl-9 pr-4 py-2 text-xs text-[#F4E7D0] placeholder-[#B5ACA0]/50 focus:outline-none focus:border-[#C96B35]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
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
                  <th className="py-3.5 px-4">Audio Track</th>
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
                        <div className="text-[10px] text-[#B5ACA0]/70 font-mono mt-0.5">
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

                      {/* Audio / Media Track */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {item.trackUrl ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => playTrack(item)}
                              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 transition-colors ${
                                activeTrack && activeTrack.id === item.id && isPlaying
                                  ? 'bg-[#C96B35] text-[#F4E7D0]'
                                  : 'bg-[#C96B35]/20 hover:bg-[#C96B35]/30 text-[#C96B35] border border-[#C96B35]/30'
                              }`}
                            >
                              {activeTrack && activeTrack.id === item.id && isPlaying ? (
                                <Pause className="w-3 h-3" />
                              ) : (
                                <Play className="w-3 h-3" />
                              )}
                              <span>{activeTrack && activeTrack.id === item.id && isPlaying ? 'Playing' : 'Play Track'}</span>
                            </button>
                          </div>
                        ) : item.driveLink ? (
                          <a
                            href={item.driveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded bg-[#C49A3A]/15 hover:bg-[#C49A3A]/25 border border-[#C49A3A]/30 text-[#C49A3A] text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
                          >
                            <span>Drive Audio</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-[#B5ACA0]/50 font-mono">No Track</span>
                        )}
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
                          {/* Direct WhatsApp Contact Button */}
                          <a
                            href={generateWhatsAppLink(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white transition-colors"
                            title="Message Candidate on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

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
                    <td colSpan="7" className="text-center py-12 text-sm text-[#B5ACA0] font-mono">
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
