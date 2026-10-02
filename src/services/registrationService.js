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
    participationType: "Group",
    performanceName: "Navratri Garba Beats & Contemporary Hip-Hop",
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
    fullName: "Pooja Mehta & Group",
    enrollmentNo: "230104018",
    schoolDept: "School of Technology (SOT)",
    semester: "4th Semester",
    phone: "9712345678",
    email: "pooja.m23@gsfcuniversity.ac.in",
    category: "drama",
    participationType: "Group",
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
    participationType: "Solo",
    performanceName: "Fingerstyle Acoustic Guitar Medley",
    numParticipants: "1",
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
      const mapped = data.map((row) => ({
        id: row.id,
        fullName: row.full_name,
        enrollmentNo: row.enrollment_no,
        schoolDept: row.school_dept,
        semester: row.semester,
        phone: row.phone,
        email: row.email,
        category: row.category,
        participationType: row.participation_type,
        performanceName: row.performance_name,
        numParticipants: row.num_participants,
        description: row.description,
        trackUrl: row.track_url || '',
        trackFileName: row.track_file_name || '',
        driveLink: row.drive_link || '',
        status: row.status,
        checkedIn: Boolean(row.checked_in),
        slotTime: "22 Oct 2026 • TBA",
        registeredAt: row.created_at
      }));

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

  // Duplicate Check
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

  const newRegistration = {
    ...data,
    id: newId,
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

  const updated = current.map((item) =>
    item.id === id ? { ...item, checkedIn: newCheckedIn } : item
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('registrations').update({ checked_in: newCheckedIn }).eq('id', id);
    } catch (e) {
      console.warn("Supabase check-in update exception:", e);
    }
  }

  return updated;
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
🏢 *Department*: ${candidate.schoolDept}
📍 *Audition Venue*: ${EVENT_DETAILS.location}
📅 *Audition Date*: 22 October 2026

⚠️ *Backstage Instructions*:
1. Please report 20 minutes prior to your time slot with your digital pass.
2. If using backing audio tracks, verify it at the Sound Console desk.

Official Portal: ${typeof window !== 'undefined' ? window.location.origin : 'https://github.com/Maanpatel8436/GSFCU_GOT_TALENT'}
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

Congratulations! Your official registration for GSFCU GOT TALENT 2026 (Navratri Special Edition) has been recorded.

REGISTRATION SUMMARY:
------------------------------------------
• Registration ID : ${candidate.id}
• Candidate Name  : ${candidate.fullName}
• Enrollment No   : ${candidate.enrollmentNo}
• Category        : ${candidate.category.toUpperCase()} (${candidate.participationType})
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
    "Full Name",
    "Enrollment No",
    "Department",
    "Semester",
    "Phone",
    "Email",
    "Category",
    "Format",
    "Performance Title",
    "Performers Count",
    "Audio Track URL",
    "Audio Track File",
    "Drive Link",
    "Status",
    "Checked In",
    "Slot Time",
    "Registered Date"
  ];

  const rows = data.map((item) => [
    `"${item.id}"`,
    `"${item.fullName.replace(/"/g, '""')}"`,
    `"${item.enrollmentNo}"`,
    `"${item.schoolDept}"`,
    `"${item.semester}"`,
    `"${item.phone}"`,
    `"${item.email}"`,
    `"${item.category}"`,
    `"${item.participationType}"`,
    `"${item.performanceName.replace(/"/g, '""')}"`,
    item.numParticipants,
    `"${item.trackUrl || ''}"`,
    `"${item.trackFileName || ''}"`,
    `"${item.driveLink || ''}"`,
    `"${item.status}"`,
    item.checkedIn ? "YES" : "NO",
    `"${item.slotTime || 'TBA'}"`,
    `"${new Date(item.registeredAt).toLocaleDateString()}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `GSFCU_Got_Talent_2026_Call_Sheet_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
