/**
 * GSFCU Got Talent 2026 - Registration & Data Persistence Service
 * Supports dual-engine operation:
 *  1. Supabase Cloud PostgreSQL & Audio Bucket (when VITE_SUPABASE_URL and KEY are set)
 *  2. LocalStorage Persistence Fallback (zero configuration mode)
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { EVENT_DETAILS } from '../data/eventData';

const STORAGE_KEY = 'gsfcu_got_talent_2026_registrations';

// Pre-seeded authentic registrations for testing & demo purposes
const SAMPLE_REGISTRATIONS = [
  {
    id: "GT26-1042",
    fullName: "Aarav Sharma",
    enrollmentNo: "230101042",
    schoolDept: "School of Technology (SOT)",
    semester: "4th Semester",
    phone: "9876543210",
    email: "aarav.s23@gsfcuniversity.ac.in",
    category: "singing",
    participationType: "Solo",
    participationFormat: "solo",
    teamMembers: [],

    performanceName: "Raag Bhairavi Classical & Bollywood Fusion",
    numParticipants: "1",
    description: "Semi-classical vocal performance with electronic tanpura backing track.",
    status: "Shortlisted for Auditions",
    checkedIn: true,
    slotTime: "22 Oct 2026 • 10:00 AM",
    trackUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    trackFileName: "Aarav_Tanpura_Backing_Track.mp3",
    driveLink: "",
    registeredAt: "2026-10-01T14:20:00Z"
  },
  {
    id: "GT26-2189",
    fullName: "Diya Vaghela",
    enrollmentNo: "220202115",
    schoolDept: "School of Science (SOS)",
    semester: "6th Semester",
    phone: "9823456781",
    email: "diya.v22@gsfcuniversity.ac.in",
    category: "dance",
    participationType: "Team",
    participationFormat: "team",
    teamMembers: [
      { name: "Kavya Patel", enrollmentNumber: "220202116" },
      { name: "Pooja Vaghela", enrollmentNumber: "220202117" },
      { name: "Riya Shah", enrollmentNumber: "220202118" },
      { name: "Neha Joshi", enrollmentNumber: "220202119" },
      { name: "Anjali Parmar", enrollmentNumber: "220202120" }
    ],
    performanceName: "Garba Beats & Contemporary Hip-Hop",

    numParticipants: "6",
    description: "High-energy Garba fusion routine with traditional Gujarati chaniya choli and modern street formations.",
    status: "Shortlisted for Auditions",
    checkedIn: false,
    slotTime: "22 Oct 2026 • 10:45 AM",
    trackUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    trackFileName: "Garba_Fusion_Mix_Final.mp3",
    driveLink: "https://drive.google.com/drive/folders/sample-dance-track",
    registeredAt: "2026-10-01T16:45:00Z"
  },
  {
    id: "GT26-3401",
    fullName: "Rohan Trivedi",
    enrollmentNo: "240301089",
    schoolDept: "School of Management (SOM)",
    semester: "2nd Semester",
    phone: "9898123456",
    email: "rohan.t24@gsfcuniversity.ac.in",
    category: "comedy",
    participationType: "Solo",
    participationFormat: "solo",
    teamMembers: [],

    performanceName: "Engineering vs MBA: Campus Tales",
    numParticipants: "1",
    description: "Clean stand-up comedy set exploring hostel life, mess food, and semester exams.",
    status: "Registered",
    checkedIn: false,
    slotTime: "22 Oct 2026 • 11:30 AM",
    trackUrl: "",
    trackFileName: "",
    driveLink: "",
    registeredAt: "2026-10-02T09:15:00Z"
  },
  {
    id: "GT26-4820",
    fullName: "Pooja Mehta",

    enrollmentNo: "230104018",
    schoolDept: "School of Technology (SOT)",
    semester: "4th Semester",
    phone: "9712345678",
    email: "pooja.m23@gsfcuniversity.ac.in",
    category: "drama",
    participationType: "Team",
    participationFormat: "team",
    teamMembers: [
      { name: "Aarav Patel", enrollmentNumber: "230104019" },
      { name: "Smit Shah", enrollmentNumber: "230104020" },
      { name: "Meera Trivedi", enrollmentNumber: "230104021" }
    ],

    performanceName: "The Digital Canvas (Campus Skit)",
    numParticipants: "4",
    description: "10-minute comedic and thought-provoking theatrical street play about social media addiction.",
    status: "Registered",
    checkedIn: false,
    slotTime: "22 Oct 2026 • 01:15 PM",
    trackUrl: "",
    trackFileName: "",
    driveLink: "https://drive.google.com/file/d/sample-drama-bgm/view",
    registeredAt: "2026-10-02T11:30:00Z"
  },
  {
    id: "GT26-5509",
    fullName: "Kabir Joshi",
    enrollmentNo: "220102065",
    schoolDept: "School of Chemical Sciences",
    semester: "6th Semester",
    phone: "9909876543",
    email: "kabir.j22@gsfcuniversity.ac.in",
    category: "instrumental",
    participationType: "Duo",
    participationFormat: "duo",
    teamMembers: [
      { name: "Rohan Patel", enrollmentNumber: "220102066" }
    ],
    performanceName: "Fingerstyle Acoustic Guitar & Percussion Duo",
    numParticipants: "2",

    description: "Acoustic guitar instrumental covering popular folk melodies and contemporary hits.",
    status: "Shortlisted for Auditions",
    checkedIn: true,
    slotTime: "22 Oct 2026 • 02:00 PM",
    trackUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    trackFileName: "Acoustic_Click_Track.mp3",
    driveLink: "",
    registeredAt: "2026-10-02T13:00:00Z"
  }
];

export const getRegistrations = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_REGISTRATIONS));
      return SAMPLE_REGISTRATIONS;
    }
    return JSON.parse(stored);
  } catch {
    return SAMPLE_REGISTRATIONS;
  }
};

/**
 * Fetch registrations from Supabase Cloud (if connected), else fallback to localStorage
 */
export const fetchRegistrationsFromCloud = async () => {
  if (!isSupabaseConfigured() || !supabase) {
    return getRegistrations();
  }

  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn("Supabase query error, using local fallback:", error);
      return getRegistrations();
    }

    if (data && data.length > 0) {
      const mapped = data.map((row) => {
        let parsedMembers = [];
        if (row.team_members) {
          try {
            parsedMembers = typeof row.team_members === 'string' ? JSON.parse(row.team_members) : row.team_members;
          } catch (e) {
            parsedMembers = [];
          }
        }
        return {
          id: row.id,
          fullName: row.full_name,
          enrollmentNo: row.enrollment_no,
          schoolDept: row.school_dept,
          semester: row.semester,
          phone: row.phone,
          email: row.email,
          category: row.category,
          participationType: row.participation_type || 'Solo',
          participationFormat: row.participation_format || (row.participation_type ? row.participation_type.toLowerCase() : 'solo'),
          teamMembers: parsedMembers,
          performanceName: row.performance_name,
          numParticipants: row.num_participants || (1 + parsedMembers.length),
          description: row.description,
          trackUrl: row.track_url || '',
          trackFileName: row.track_file_name || '',
          driveLink: row.drive_link || '',
          status: row.status,
          checkedIn: Boolean(row.checked_in),
          slotTime: "22 Oct 2026 • TBA",
          registeredAt: row.created_at
        };
      });


      // Cache locally
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      return mapped;
    }

    return getRegistrations();
  } catch (err) {
    console.warn("Could not sync from Supabase, using local fallback:", err);
    return getRegistrations();
  }
};

/**
 * Upload Audio File to Supabase Storage or create client-side Blob URL
 */
export const uploadAudioTrack = async (file, candidateId) => {
  if (!file) return { url: '', fileName: '' };

  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

  if (isSupabaseConfigured() && supabase) {
    try {
      const filePath = `${candidateId}/${Date.now()}_${sanitizedFileName}`;
      const { error: uploadError } = await supabase.storage
        .from('audio-tracks')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('audio-tracks')
          .getPublicUrl(filePath);

        return {
          url: publicUrlData.publicUrl,
          fileName: sanitizedFileName
        };
      }
      console.warn("Supabase storage upload error:", uploadError);
    } catch (e) {
      console.warn("Storage upload exception:", e);
    }
  }

  // Local fallback: create Blob URL
  const localUrl = URL.createObjectURL(file);
  return {
    url: localUrl,
    fileName: sanitizedFileName
  };
};

/**
 * Save Registration (Dual Engine: Supabase Cloud + LocalStorage)
 */
export const saveRegistration = async (data, audioFile = null) => {
  const current = getRegistrations();

  // Duplicate Check for Primary Participant

  const existing = current.find(
    (item) => item.enrollmentNo.toLowerCase().trim() === data.enrollmentNo.toLowerCase().trim()
  );

  if (existing) {
    throw new Error(`Enrollment number ${data.enrollmentNo} is already registered under ID ${existing.id}.`);
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newId = `GT26-${randomNum}`;

  let trackUrl = data.trackUrl || '';
  let trackFileName = data.trackFileName || '';

  if (audioFile) {
    const uploaded = await uploadAudioTrack(audioFile, newId);
    trackUrl = uploaded.url;
    trackFileName = uploaded.fileName;
  }

  const cleanTeamMembers = Array.isArray(data.teamMembers) ? data.teamMembers : [];
  const pType = data.participationType || 'Solo';
  const pFormat = (pType === 'Solo' ? 'solo' : pType === 'Duo' ? 'duo' : 'team');
  const calcParticipants = pFormat === 'solo' ? 1 : pFormat === 'duo' ? 2 : (1 + cleanTeamMembers.length);

  const newRegistration = {
    ...data,
    id: newId,
    participationType: pType,
    participationFormat: pFormat,
    teamMembers: cleanTeamMembers,
    numParticipants: calcParticipants,

    trackUrl,
    trackFileName,
    driveLink: data.driveLink || '',
    status: "Registered",
    checkedIn: false,
    slotTime: "22 Oct 2026 • TBA",
    registeredAt: new Date().toISOString()
  };

  // 1. Save to Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from('registrations').insert({
        id: newRegistration.id,
        full_name: newRegistration.fullName,
        enrollment_no: newRegistration.enrollmentNo,
        school_dept: newRegistration.schoolDept,
        semester: newRegistration.semester,
        phone: newRegistration.phone,
        email: newRegistration.email,
        category: newRegistration.category,
        participation_type: newRegistration.participationType,
        participation_format: newRegistration.participationFormat,
        team_members: JSON.stringify(newRegistration.teamMembers),

        performance_name: newRegistration.performanceName,
        num_participants: newRegistration.numParticipants,
        description: newRegistration.description,
        track_url: newRegistration.trackUrl,
        track_file_name: newRegistration.trackFileName,
        drive_link: newRegistration.driveLink,
        status: newRegistration.status,
        checked_in: newRegistration.checkedIn,
        created_at: newRegistration.registeredAt
      });

      if (error) {
        console.warn("Supabase insert error (saving locally instead):", error);
      }
    } catch (e) {
      console.warn("Supabase cloud insert exception:", e);
    }
  }

  // 2. Always persist locally
  const updated = [newRegistration, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }

  return newRegistration;
};

/**
 * Update Full Registration Record (including team members)
 */
export const updateRegistrationRecord = async (id, updatedFields) => {
  const current = getRegistrations();
  const updated = current.map((item) => {
    if (item.id === id) {
      const merged = { ...item, ...updatedFields };
      const teamCount = (merged.teamMembers || []).length;
      if (merged.participationType === 'Solo' || merged.participationFormat === 'solo') {
        merged.numParticipants = 1;
        merged.teamMembers = [];
      } else if (merged.participationType === 'Duo' || merged.participationFormat === 'duo') {
        merged.numParticipants = 2;
      } else {
        merged.numParticipants = 1 + teamCount;
      }
      return merged;
    }
    return item;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  if (isSupabaseConfigured() && supabase) {
    try {
      const target = updated.find(r => r.id === id);
      if (target) {
        await supabase.from('registrations').update({
          full_name: target.fullName,
          enrollment_no: target.enrollmentNo,
          school_dept: target.schoolDept,
          semester: target.semester,
          phone: target.phone,
          email: target.email,
          category: target.category,
          participation_type: target.participationType,
          participation_format: target.participationFormat,
          team_members: JSON.stringify(target.teamMembers || []),
          performance_name: target.performanceName,
          num_participants: target.numParticipants,
          description: target.description
        }).eq('id', id);
      }
    } catch (e) {
      console.warn("Supabase update exception:", e);
    }
  }

  return updated;
};


export const updateRegistrationStatus = async (id, newStatus) => {
  const current = getRegistrations();
  const updated = current.map((item) =>
    item.id === id ? { ...item, status: newStatus } : item
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('registrations').update({ status: newStatus }).eq('id', id);
    } catch (e) {
      console.warn("Supabase status update exception:", e);
    }
  }

  return updated;
};

export const toggleCheckInStatus = async (id) => {
  const current = getRegistrations();
  const target = current.find((item) => item.id === id);
  const newCheckedIn = target ? !target.checkedIn : true;
  const checkInTime = newCheckedIn ? new Date().toISOString() : null;

  const updated = current.map((item) =>
    item.id === id ? { ...item, checkedIn: newCheckedIn, checkInTime } : item

  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('registrations').update({ checked_in: newCheckedIn, check_in_time: checkInTime }).eq('id', id);

    } catch (e) {
      console.warn("Supabase check-in update exception:", e);
    }
  }

  return updated;
};

export const processQrCheckIn = async (qrInput) => {
  if (!qrInput || typeof qrInput !== 'string') {
    return { status: 'INVALID_QR', message: 'Empty or invalid QR payload' };
  }

  let targetId = '';
  const trimmed = qrInput.trim();

  // Try parsing JSON payload (which digital passes generate: { id, name, enroll, category, event })
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && parsed.id) {
      targetId = String(parsed.id).trim();
    }
  } catch {
    // If not JSON, search for registration ID pattern or exact string
    const match = trimmed.match(/GT26-\d+/i) || trimmed.match(/REG-\d+/i) || trimmed.match(/SPON-\d+/i);
    if (match) {
      targetId = match[0].toUpperCase();
    } else {
      targetId = trimmed.toUpperCase();
    }
  }

  if (!targetId) {
    return { status: 'INVALID_QR', message: 'Could not extract valid registration ID' };
  }

  const current = getRegistrations();
  const target = current.find((item) => 
    item.id.toUpperCase() === targetId.toUpperCase() ||
    (item.enrollmentNo && item.enrollmentNo.toLowerCase().trim() === targetId.toLowerCase().trim())
  );


  if (!target) {
    return {
      status: 'INVALID_QR',
      message: `No registration found for ID: ${targetId}. Check-in rejected.`,
      targetId
    };
  }

  if (target.checkedIn) {
    return {
      status: 'ALREADY_CHECKED_IN',
      registration: target,
      checkInTime: target.checkInTime || target.updatedAt || new Date().toISOString(),
      message: `${target.fullName} (${target.id}) has ALREADY been checked in!`
    };
  }

  // Mark registration as Checked In
  const checkInTime = new Date().toISOString();
  const updated = current.map((item) =>
    item.id === target.id
      ? { ...item, checkedIn: true, checkInTime }
      : item
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase
        .from('registrations')
        .update({ checked_in: true, check_in_time: checkInTime })
        .eq('id', target.id);
    } catch (e) {
      console.warn("Supabase QR check-in exception:", e);
    }
  }

  const updatedRecord = updated.find(r => r.id === target.id);
  return {
    status: 'SUCCESS',
    registration: updatedRecord,
    checkInTime,
    allRegistrations: updated,
    message: `Check-In Successful! ${target.fullName} (${target.id}) is verified.`
  };
};


export const deleteRegistration = async (id) => {
  const current = getRegistrations();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('registrations').delete().eq('id', id);
    } catch (e) {
      console.warn("Supabase delete exception:", e);
    }
  }

  return updated;
};

/**
 * Generate Direct WhatsApp Confirmation / Alert URL
 */
export const generateWhatsAppLink = (candidate, customMessage = null) => {
  if (!candidate) return '#';
  const cleanPhone = candidate.phone ? candidate.phone.replace(/[^0-9]/g, '') : '';
  const phoneParam = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  const text = customMessage || 
`🌟 *GSFCU GOT TALENT 2026 — REGISTRATION CONFIRMATION* 🌟

Hello *${candidate.fullName}*,
Your audition registration for *GSFCU GOT TALENT 2026* has been officially received!

🎫 *Registration ID*: ${candidate.id}
🎭 *Category*: ${candidate.category.toUpperCase()} (${candidate.participationType})
🎵 *Act Title*: ${candidate.performanceName}
👥 *Total Performers*: ${candidate.numParticipants}

🏢 *Department*: ${candidate.schoolDept}
📍 *Audition Venue*: ${EVENT_DETAILS.location}
📅 *Audition Date*: 22 October 2026

⚠️ *Backstage Instructions*:
1. Please report 20 minutes prior to your time slot with your digital pass.
2. If using backing audio tracks, verify it at the Sound Console desk.

Official Portal: ${typeof window !== 'undefined' ? window.location.origin : 'https://github.com/24bt04d224/GSFCU_GOT_TALENT'}
Best of luck, and make the stage yours!`;

  return `https://wa.me/${phoneParam}?text=${encodeURIComponent(text)}`;
};

/**
 * Generate Direct Email Confirmation Link
 */
export const generateEmailLink = (candidate) => {
  if (!candidate || !candidate.email) return '#';
  const subject = `Registration Confirmed: ${candidate.id} — GSFCU Got Talent 2026`;
  const body = 
`Dear ${candidate.fullName},

Congratulations! Your official registration for GSFCU GOT TALENT 2026 has been recorded.


REGISTRATION SUMMARY:
------------------------------------------
• Registration ID : ${candidate.id}
• Candidate Name  : ${candidate.fullName}
• Enrollment No   : ${candidate.enrollmentNo}
• Format / Type   : ${candidate.participationType} (${candidate.numParticipants} Performer(s))
• Category        : ${candidate.category.toUpperCase()}

• Performance     : "${candidate.performanceName}"
• Department      : ${candidate.schoolDept}
• Date & Venue    : 22 October 2026 at ${EVENT_DETAILS.location}

Please keep your digital pass and QR code ticket ready on your mobile device during entry.

Warm regards,
Organizing Committee
GSFC University Got Talent 2026
Contact: ${EVENT_DETAILS.contactEmail}`;

  return `mailto:${candidate.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Export Registrations to CSV Call Sheet
 */
export const exportRegistrationsCSV = () => {
  const data = getRegistrations();
  if (!data || data.length === 0) return;

  const headers = [
    "Registration ID",
    "Participation Format",
    "Primary Participant / Team Lead",
    "Primary Enrollment",
    "Team Members",
    "Team Enrollment Numbers",

    "Department",
    "Semester",
    "Phone",
    "Email",
    "Talent Category",
    "Performance Title",
    "Total Performers",

    "Audio Track URL",
    "Audio Track File",
    "Drive Link",
    "Status",
    "Checked In",
    "Registered Date"
  ];

  const rows = data.map((item) => {
    const members = item.teamMembers || [];
    const membersStr = members.map(m => `${m.name} (${m.enrollmentNumber})`).join('; ');
    const memberEnrolls = members.map(m => m.enrollmentNumber).join('; ');

    return [
      `"${item.id}"`,
      `"${item.participationType || 'Solo'}"`,
      `"${item.fullName.replace(/"/g, '""')}"`,
      `"${item.enrollmentNo}"`,
      `"${membersStr.replace(/"/g, '""')}"`,
      `"${memberEnrolls}"`,
      `"${item.schoolDept}"`,
      `"${item.semester}"`,
      `"${item.phone}"`,
      `"${item.email}"`,
      `"${item.category}"`,
      `"${item.performanceName.replace(/"/g, '""')}"`,
      item.numParticipants || (1 + members.length),
      `"${item.trackUrl || ''}"`,
      `"${item.trackFileName || ''}"`,
      `"${item.driveLink || ''}"`,
      `"${item.status}"`,
      item.checkedIn ? "YES" : "NO",
      `"${new Date(item.registeredAt).toLocaleDateString()}"`
    ];
  });


  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `GSFCU_Got_Talent_2026_Call_Sheet_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const SPONSOR_ENQUIRIES_KEY = 'gsfcu_got_talent_2026_sponsor_enquiries';

export const getSponsorEnquiries = () => {
  try {
    const stored = localStorage.getItem(SPONSOR_ENQUIRIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveSponsorEnquiry = async (data) => {
  const current = getSponsorEnquiries();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newEnquiry = {
    id: `SP-${randomNum}`,
    brandName: data.brandName,
    contactPerson: data.contactPerson,
    phone: data.phone,
    email: data.email,
    sponsorshipType: data.sponsorshipType || 'Title / Presenting Sponsor',
    message: data.message || '',
    submittedAt: new Date().toISOString()
  };

  const updated = [newEnquiry, ...current];
  try {
    localStorage.setItem(SPONSOR_ENQUIRIES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save sponsor enquiry locally", e);
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('sponsor_enquiries').insert({
        id: newEnquiry.id,
        brand_name: newEnquiry.brandName,
        contact_person: newEnquiry.contactPerson,
        phone: newEnquiry.phone,
        email: newEnquiry.email,
        sponsorship_type: newEnquiry.sponsorshipType,
        message: newEnquiry.message,
        created_at: newEnquiry.submittedAt
      });
    } catch (e) {
      console.warn("Supabase sponsor enquiry insert fallback:", e);
    }
  }

  return newEnquiry;
};

// ==========================================
// SPONSOR MANAGEMENT DATA & BACKEND ENGINE
// ==========================================
const SPONSORS_STORAGE_KEY = 'gsfcu_got_talent_2026_sponsors';

export const getSponsors = () => {
  try {
    const stored = localStorage.getItem(SPONSORS_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const fetchSponsorsFromCloud = async () => {
  if (!isSupabaseConfigured() || !supabase) {
    return getSponsors();
  }

  try {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data) {
      return getSponsors();
    }

    const mapped = data.map((row) => ({
      id: row.id,
      name: row.name,
      logoUrl: row.logo_url || '',
      category: row.category || 'GOLD',
      description: row.description || '',
      websiteUrl: row.website_url || '',
      contactPerson: row.contact_person || '',
      contactEmail: row.contact_email || '',
      status: row.status || 'ACTIVE',
      displayOrder: typeof row.display_order === 'number' ? row.display_order : 1,
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString()
    }));

    localStorage.setItem(SPONSORS_STORAGE_KEY, JSON.stringify(mapped));
    return mapped;
  } catch (err) {
    console.warn("Could not sync sponsors from Supabase, using local fallback:", err);
    return getSponsors();
  }
};

export const uploadSponsorLogo = async (file, sponsorId) => {
  if (!file) return '';

  if (typeof file === 'string') return file;

  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

  if (isSupabaseConfigured() && supabase) {
    try {
      const filePath = `sponsors/${sponsorId}/${Date.now()}_${sanitizedFileName}`;
      const { error: uploadError } = await supabase.storage
        .from('sponsor-logos')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('sponsor-logos')
          .getPublicUrl(filePath);
        return publicUrlData.publicUrl;
      }
    } catch (e) {
      console.warn("Storage upload exception for sponsor logo:", e);
    }
  }

  // Local fallback: convert file to Base64 or Blob URL for client-side persistence
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => resolve(URL.createObjectURL(file));
    reader.readAsDataURL(file);
  });
};

const notifySponsorsChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('sponsorsUpdated'));
    window.dispatchEvent(new Event('storage'));
  }
};

export const saveSponsorRecord = async (sponsorData, logoFile = null) => {
  const current = getSponsors();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newId = `SPON-${randomNum}`;

  let logoUrl = sponsorData.logoUrl || '';
  if (logoFile) {
    logoUrl = await uploadSponsorLogo(logoFile, newId);
  }

  const newSponsor = {
    id: newId,
    name: sponsorData.name.trim(),
    logoUrl,
    category: (sponsorData.category || 'GOLD').toUpperCase(),
    description: sponsorData.description || '',
    websiteUrl: sponsorData.websiteUrl || '',
    contactPerson: sponsorData.contactPerson || '',
    contactEmail: sponsorData.contactEmail || '',
    status: (sponsorData.status || 'ACTIVE').toUpperCase(),
    displayOrder: parseInt(sponsorData.displayOrder, 10) || (current.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updated = [newSponsor, ...current];
  try {
    localStorage.setItem(SPONSORS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save sponsor locally", e);
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('sponsors').insert({
        id: newSponsor.id,
        name: newSponsor.name,
        logo_url: newSponsor.logoUrl,
        category: newSponsor.category,
        description: newSponsor.description,
        website_url: newSponsor.websiteUrl,
        contact_person: newSponsor.contactPerson,
        contact_email: newSponsor.contactEmail,
        status: newSponsor.status,
        display_order: newSponsor.displayOrder,
        created_at: newSponsor.createdAt
      });
    } catch (e) {
      console.warn("Supabase sponsor insert fallback:", e);
    }
  }

  notifySponsorsChanged();
  return updated;
};

export const updateSponsorRecord = async (id, updatedFields, logoFile = null) => {
  const current = getSponsors();
  let logoUrl = updatedFields.logoUrl;

  if (logoFile) {
    logoUrl = await uploadSponsorLogo(logoFile, id);
  }

  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        ...updatedFields,
        logoUrl: logoUrl !== undefined ? logoUrl : item.logoUrl,
        category: (updatedFields.category || item.category).toUpperCase(),
        status: (updatedFields.status || item.status).toUpperCase(),
        displayOrder: parseInt(updatedFields.displayOrder, 10) || item.displayOrder,
        updatedAt: new Date().toISOString()
      };
    }
    return item;
  });

  localStorage.setItem(SPONSORS_STORAGE_KEY, JSON.stringify(updated));

  if (isSupabaseConfigured() && supabase) {
    try {
      const target = updated.find(s => s.id === id);
      if (target) {
        await supabase.from('sponsors').update({
          name: target.name,
          logo_url: target.logoUrl,
          category: target.category,
          description: target.description,
          website_url: target.websiteUrl,
          contact_person: target.contactPerson,
          contact_email: target.contactEmail,
          status: target.status,
          display_order: target.displayOrder,
          updated_at: target.updatedAt
        }).eq('id', id);
      }
    } catch (e) {
      console.warn("Supabase sponsor update fallback:", e);
    }
  }

  notifySponsorsChanged();
  return updated;
};

export const deleteSponsorRecord = async (id) => {
  const current = getSponsors();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(SPONSORS_STORAGE_KEY, JSON.stringify(updated));

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('sponsors').delete().eq('id', id);
    } catch (e) {
      console.warn("Supabase sponsor delete fallback:", e);
    }
  }

  notifySponsorsChanged();
  return updated;
};

// ==========================================
// SPONSORSHIP BROCHURE PERSISTENCE ENGINE
// ==========================================
const BROCHURE_STORAGE_KEY = 'gsfcu_got_talent_2026_sponsorship_brochure';

const DEFAULT_BROCHURE = {
  id: 'DEFAULT_BROCHURE',
  url: '/Sponsorship_Broucher_Updated_Updated.pdf',
  fileName: 'Sponsorship_Broucher_Updated_Updated.pdf',
  fileSize: 'Official PDF',
  uploadedAt: new Date().toISOString()
};

export const getBrochure = () => {
  try {
    const stored = localStorage.getItem(BROCHURE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_BROCHURE;
  } catch {
    return DEFAULT_BROCHURE;
  }
};

export const fetchBrochureFromCloud = async () => {
  if (!isSupabaseConfigured() || !supabase) {
    return getBrochure();
  }

  try {
    const { data, error } = await supabase
      .from('brochures')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return getBrochure();
    }

    const row = data[0];
    const brochureObj = {
      id: row.id,
      url: row.url || DEFAULT_BROCHURE.url,
      fileName: row.file_name || 'Sponsorship_Broucher_Updated_Updated.pdf',
      fileSize: row.file_size || 'Official PDF',
      uploadedAt: row.created_at || new Date().toISOString()
    };

    localStorage.setItem(BROCHURE_STORAGE_KEY, JSON.stringify(brochureObj));
    return brochureObj;
  } catch (err) {
    console.warn("Could not sync brochure from Supabase, using local fallback:", err);
    return getBrochure();
  }
};

export const uploadBrochurePDF = async (file) => {
  if (!file) return null;

  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

  if (isSupabaseConfigured() && supabase) {
    try {
      const filePath = `brochures/${Date.now()}_${sanitizedFileName}`;
      const { error: uploadError } = await supabase.storage
        .from('brochures')
        .upload(filePath, file, { contentType: 'application/pdf', upsert: true });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('brochures')
          .getPublicUrl(filePath);

        const brochureObj = {
          id: `BROCH-${Date.now()}`,
          url: publicUrlData.publicUrl,
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          uploadedAt: new Date().toISOString()
        };

        try {
          await supabase.from('brochures').insert({
            id: brochureObj.id,
            url: brochureObj.url,
            file_name: brochureObj.fileName,
            file_size: brochureObj.fileSize,
            created_at: brochureObj.uploadedAt
          });
        } catch (e) {
          console.warn("Supabase brochures insert error:", e);
        }

        localStorage.setItem(BROCHURE_STORAGE_KEY, JSON.stringify(brochureObj));
        return brochureObj;
      }
    } catch (e) {
      console.warn("Supabase storage brochure upload exception:", e);
    }
  }

  // Local fallback using Base64 Data URL or Blob URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const brochureObj = {
        id: `BROCH-${Date.now()}`,
        url: reader.result,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString()
      };
      localStorage.setItem(BROCHURE_STORAGE_KEY, JSON.stringify(brochureObj));
      resolve(brochureObj);
    };
    reader.readAsDataURL(file);
  });
};

export const deleteBrochureRecord = async () => {
  localStorage.removeItem(BROCHURE_STORAGE_KEY);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('brochures').delete().neq('id', '0');
    } catch (e) {
      console.warn("Supabase delete brochure error:", e);
    }
  }

  return null;
};





