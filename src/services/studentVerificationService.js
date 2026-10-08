/**
 * GSFC University Academic Student Verification Service
 * 
 * Validates participant enrollment strictly using official GSFCU algorithmic rules & patterns:
 * - Purely rule and pattern driven (zero static database dependency).
 * - Matches Batches 21 to 26 (1st, 2nd, 3rd, 4th, & Final Year students).
 * - Validates official branch codes (BT, BCA, BBA, BCOM, SC, MSC, MBA, PHDSC).
 * - Intelligently determines School, Department, Degree Course, and Semester.
 */

/**
 * Clean & normalize enrollment number string
 */
export function normalizeEnrollment(enrollmentNo) {
  if (!enrollmentNo) return '';
  return enrollmentNo.toString().trim().toUpperCase();
}

/**
 * Official GSFC University branch suffix regex patterns:
 * - BT (B.Tech): 
 *   - BT + 5 digits (e.g. BT01001, BT02001, BT03001, BT04001)
 *   - BT + 2 digits + D + 3 digits for D2D lateral entry (e.g. BT04D224)
 * - BCA: BCA + 3 to 5 digits (e.g. BCA001, BCA050)
 * - BBA: BBA + 4 to 6 digits (e.g. BBA01088, BBA01001)
 * - BCOM: BCOM + 3 to 5 digits (e.g. BCOM001, BCOM048)
 * - SC (B.Sc): SC + 4 to 6 digits (e.g. SC01001, SC02001, SC03001)
 * - MSC (M.Sc): MSC + 4 to 6 digits (e.g. MSC02010)
 * - MBA: MBA + 4 to 6 digits (e.g. MBA01001)
 * - PHDSC: PHDSC + 4 to 6 digits (e.g. PHDSC0402, PHDSC02001)
 */
export const GSFCU_BRANCH_SUFFIX_REGEX = /^(BT(\d{4,6}|\d{2}D\d{2,4})|BCA\d{3,5}|BBA\d{4,6}|BCOM\d{3,5}|SC\d{4,6}|MSC\d{4,6}|MBA\d{4,6}|PHDSC\d{4,5})$/i;

/**
 * Intelligently infer school, department, course, and semester from GSFCU enrollment structure
 */
export function getDetailsFromEnrollmentPattern(enrollmentNo) {
  const clean = normalizeEnrollment(enrollmentNo);
  const yearCode = clean.substring(0, 2);

  // Inferred semester based on academic batch year
  let semester = '1st Semester';
  if (yearCode === '25') semester = '3rd Semester';
  else if (yearCode === '24') semester = '5th Semester';
  else if (yearCode === '23') semester = '7th Semester';
  else if (yearCode === '22' || yearCode === '21') semester = '8th Semester';

  const suffix = clean.substring(2);
  let school = 'School of Information and Communication Technology (SOICT)';
  let dept = 'Computer Science & Engineering';
  let course = 'B.Tech. Computer Science & Engineering';

  // Rule-based branch and school mapping
  if (suffix.startsWith('BCA')) {
    school = 'School of Information and Communication Technology (SOICT)';
    dept = 'Computer Application';
    course = 'Bachelor of Computer Application (BCA)';
  } else if (suffix.startsWith('BBA')) {
    school = 'School of Management and Enterprise (SOM&E)';
    dept = 'Management Studies';
    course = 'Bachelor of Business Administration (BBA)';
  } else if (suffix.startsWith('BCOM')) {
    school = 'School of Management and Enterprise (SOM&E)';
    dept = 'Management Studies';
    course = 'Bachelor of Commerce (B.Com.)';
  } else if (suffix.startsWith('MBA')) {
    school = 'School of Management and Enterprise (SOM&E)';
    dept = 'Management Studies';
    course = 'Master of Business Administration (MBA)';
  } else if (suffix.startsWith('BT01')) {
    school = 'School of Chemical and Fire Safety (SOCEFS)';
    dept = 'Chemical Engineering';
    course = 'B.Tech. Chemical Engineering';
  } else if (suffix.startsWith('BT02')) {
    school = 'School of Chemical and Fire Safety (SOCEFS)';
    dept = 'Fire and Safety Health Environment';
    course = 'B.Tech. Fire & Environment, Health, Safety';
  } else if (suffix.startsWith('BT')) {
    school = 'School of Information and Communication Technology (SOICT)';
    dept = 'Computer Science & Engineering';
    course = suffix.includes('D') ? 'B.Tech. CSE (Lateral D2D)' : 'B.Tech. Computer Science & Engineering';
  } else if (suffix.startsWith('SC01') || suffix.startsWith('MSC01')) {
    school = 'School of Chemical and Industry Sciences (SOCIS)';
    dept = 'Chemical Sciences';
    course = suffix.startsWith('MSC') ? 'M.Sc. Industrial Chemistry' : 'B.Sc. Chemistry';
  } else if (suffix.startsWith('SC02') || suffix.startsWith('MSC02')) {
    school = 'School of Life Sciences (SOLS)';
    dept = 'Biotechnology';
    course = suffix.startsWith('MSC') ? 'M.Sc. Biotechnology' : 'B.Sc. Biotechnology';
  } else if (suffix.startsWith('SC03') || suffix.startsWith('MSC03')) {
    school = 'School of Life Sciences (SOLS)';
    dept = 'Microbiology';
    course = suffix.startsWith('MSC') ? 'M.Sc. Microbiology' : 'B.Sc. Microbiology';
  } else if (suffix.startsWith('SC') || suffix.startsWith('MSC') || suffix.startsWith('PHDSC')) {
    school = 'School of Life Sciences (SOLS)';
    dept = 'Life Sciences';
    course = suffix.startsWith('PHD') ? 'Ph.D. Research Scholar' : 'Science Degree Program';
  }

  return { school, dept, course, semester, yearBatch: yearCode };
}

/**
 * Validate enrollment purely using GSFC University rules and patterns:
 * - Rule 1: Must be at least 6 characters.
 * - Rule 2: Must start with a valid year batch code (21 to 26).
 * - Rule 3: Suffix must match an official GSFCU branch pattern (BT, BCA, BBA, BCOM, SC, MSC, MBA, PHDSC).
 * 
 * @param {string} enrollmentNo 
 * @returns {{ valid: boolean, error: string, student: object|null, isFirstYear: boolean, isPatternMatch: boolean }}
 */
export function validateStudentEnrollment(enrollmentNo) {
  const clean = normalizeEnrollment(enrollmentNo);

  if (!clean) {
    return {
      valid: false,
      error: 'Enrollment number is required.',
      student: null,
      isFirstYear: false,
      isPatternMatch: false
    };
  }

  // Length requirement
  if (clean.length < 6) {
    return {
      valid: false,
      error: 'Please enter a valid GSFC University enrollment number (min 6 characters).',
      student: null,
      isFirstYear: false,
      isPatternMatch: false
    };
  }

  const yearCode = clean.substring(0, 2);
  const isValidYear = /^2[1-6]$/.test(yearCode);

  // Validate Year Batch rule (2021 to 2026 batches)
  if (!isValidYear) {
    return {
      valid: false,
      error: 'Enrollment must begin with a valid year batch (e.g. 26 for 1st Year, 25 for 2nd Year, 24 for 3rd Year, 23 for 4th Year).',
      student: null,
      isFirstYear: false,
      isPatternMatch: false
    };
  }

  const suffix = clean.substring(2);

  // Validate Branch code & serial pattern rule
  if (!GSFCU_BRANCH_SUFFIX_REGEX.test(suffix)) {
    return {
      valid: false,
      error: 'Invalid GSFCU branch code. Must follow university format (e.g. 24BT04D224, 26BT01001, 26BCA001, 25BBA01088, 25SC02001).',
      student: null,
      isFirstYear: yearCode === '26',
      isPatternMatch: false
    };
  }

  // All rules satisfied: Extract inferred details
  const details = getDetailsFromEnrollmentPattern(clean);

  return {
    valid: true,
    error: '',
    student: {
      enrollmentNo: clean,
      name: '',
      school: details.school,
      department: details.dept,
      course: details.course,
      semester: details.semester,
      yearBatch: details.yearBatch,
      suggestedEmail: `${clean.toLowerCase()}@gsfcuniversity.ac.in`
    },
    isFirstYear: yearCode === '26',
    isPatternMatch: true
  };
}
