/**
 * GSFCU Got Talent 2026 - Registration & Data Persistence Service
 * Supports localStorage persistence with cloud sync architecture (Supabase / Firebase ready).
 */

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

export const saveRegistration = (data) => {
  const current = getRegistrations();
  
  // Check if enrollment number is already registered
  const existing = current.find(
    (item) => item.enrollmentNo.toLowerCase().trim() === data.enrollmentNo.toLowerCase().trim()
  );

  if (existing) {
    throw new Error(`Enrollment number ${data.enrollmentNo} is already registered under ID ${existing.id}. Duplicate entries are not permitted.`);
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newRegistration = {
    ...data,
    id: `GT26-${randomNum}`,
    status: "Registered",
    checkedIn: false,
    slotTime: "22 Oct 2026 • TBA",
    registeredAt: new Date().toISOString()
  };

  const updated = [newRegistration, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }

  return newRegistration;
};

export const updateRegistrationStatus = (id, newStatus) => {
  const current = getRegistrations();
  const updated = current.map((item) =>
    item.id === id ? { ...item, status: newStatus } : item
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const toggleCheckInStatus = (id) => {
  const current = getRegistrations();
  const updated = current.map((item) =>
    item.id === id ? { ...item, checkedIn: !item.checkedIn } : item
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteRegistration = (id) => {
  const current = getRegistrations();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

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
