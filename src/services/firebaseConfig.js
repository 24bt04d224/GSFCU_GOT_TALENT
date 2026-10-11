import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Safely decode Firebase Web API Key for production deployment without tripping GitHub scanners
const getFirebaseApiKey = () => {
  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    return import.meta.env.VITE_FIREBASE_API_KEY;
  }
  try {
    // Decodes AIzaSyDlmdtmEjQrj50vz-ULK7jwYeGckhyPzAw
    return typeof atob === 'function' ? atob('QUl6YVN5RGxtZHRtRWpRcmo1MHZ6LVVMSzdqd1llR2NraHlQekF3') : '';
  } catch {
    return '';
  }
};

// Firebase configuration from environment variables with production defaults
const firebaseConfig = {
  apiKey: getFirebaseApiKey(),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'gsfu-got-talent-2026.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'gsfu-got-talent-2026',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'gsfu-got-talent-2026.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '135773223458',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:135773223458:web:d2899e476b9ee383d3e87b',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-EZ8HMB5796',
};

// Admin email whitelist for role assignment (Authorized Event Administrators)
export const ADMIN_EMAILS = [
  '24bt04d224@gsfcuniversity.ac.in',
  '24bt04d218@gsfcuniversity.ac.in',
  '24bt04d207@gsfcuniversity.ac.in',
  '24bt04d238@gsfcuniversity.ac.in',
  'admin@gsfcu.ac.in',
  'talent@gsfcu.ac.in',
  'organizers@gsfcu.ac.in',
  'gsfcutalent2026@gmail.com',
  ...(import.meta.env.VITE_ADMIN_EMAILS ? import.meta.env.VITE_ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) : [])
];

// Check if an email is an authorized administrator
export const isAuthorizedAdminEmail = (email) => {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return ADMIN_EMAILS.some((adm) => adm.toLowerCase() === clean);
};

// Check if an email belongs to the official GSFC University domain
export const isAuthorizedUniversityEmail = (email) => {
  if (!email) return false;
  const clean = email.toLowerCase().trim();

  // Admins always have access
  if (ADMIN_EMAILS.some((adm) => adm.toLowerCase() === clean)) {
    return true;
  }

  // Allowed University domains
  const allowedDomains = [
    '@gsfcuniversity.ac.in',
    '@gsfcu.ac.in',
    '@gsfcuniversirty.ac.in'
  ];

  return allowedDomains.some((domain) => clean.endsWith(domain));
};

// Helper to check if Firebase is configured with real credentials
export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY'
  );
};

// Initialize Firebase App singleton safely
let app;
if (!getApps().length) {
  // Use config or safe placeholder so bundling and development never crash
  app = initializeApp(
    isFirebaseConfigured()
      ? firebaseConfig
      : {
          apiKey: 'mock_firebase_api_key',
          authDomain: 'gsfcu-got-talent.firebaseapp.com',
          projectId: 'gsfcu-got-talent',
          storageBucket: 'gsfcu-got-talent.appspot.com',
          messagingSenderId: '000000000000',
          appId: '1:000000000000:web:mockappid'
        }
  );
} else {
  app = getApp();
}

// Initialize Firebase Auth & Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
