import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration exclusively loaded from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

// Admin email whitelist for role assignment
export const ADMIN_EMAILS = [
  'admin@gsfcu.ac.in',
  'talent@gsfcu.ac.in',
  'organizers@gsfcu.ac.in',
  'gsfcutalent2026@gmail.com',
  ...(import.meta.env.VITE_ADMIN_EMAILS ? import.meta.env.VITE_ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) : [])
];

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
