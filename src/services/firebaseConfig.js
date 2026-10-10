import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from environment variables with production defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDlmdtmEjQrj50vz-ULK7jwYeGckhyPzAw',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'gsfu-got-talent-2026.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'gsfu-got-talent-2026',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'gsfu-got-talent-2026.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '135773223458',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:135773223458:web:d2899e476b9ee383d3e87b',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-EZ8HMB5796',
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
          apiKey: 'AIzaSyDemoPlaceholderKeyForGSFCUEvent2026',
          authDomain: 'gsfcu-got-talent-2026.firebaseapp.com',
          projectId: 'gsfcu-got-talent-2026',
          storageBucket: 'gsfcu-got-talent-2026.appspot.com',
          messagingSenderId: '123456789012',
          appId: '1:123456789012:web:abcdef1234567890'
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
