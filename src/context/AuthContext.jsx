import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  ADMIN_EMAILS,
  isFirebaseConfigured,
  isAuthorizedUniversityEmail
} from '../services/firebaseConfig';

const AuthContext = createContext({
  user: null,
  role: null, // 'student' | 'participant' | 'committee' | 'admin' | null
  loading: true,
  isAdmin: false,
  isCommittee: false,
  canAccessPortal: false,
  signInWithGoogle: async () => {},
  login: async () => {}, // Backwards-compatible passcode/credentials
  logout: async () => {},
  error: null,
  authModalOpen: false,
  authModalRedirect: '/register',
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRedirect, setAuthModalRedirect] = useState('/register');

  const openAuthModal = (targetPath = '/register') => {
    setAuthModalRedirect(targetPath);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // Sync / create user profile document in Firestore
  const syncUserProfile = async (firebaseUser) => {
    if (!firebaseUser) return null;

    const email = (firebaseUser.email || '').toLowerCase().trim();
    const isWhitelistedAdmin = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === email);
    const assignedDefaultRole = isWhitelistedAdmin ? 'admin' : 'student';

    let userRole = assignedDefaultRole;
    let profileData = {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || email.split('@')[0] || 'GSFCU Student',
      email: firebaseUser.email,
      avatar: firebaseUser.photoURL || '',
      role: userRole,
    };

    if (isFirebaseConfigured() && db) {
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          // Returning user: read existing profile from Firestore
          const existingData = userSnap.data();
          userRole = isWhitelistedAdmin ? 'admin' : (existingData.role || 'student');
          profileData = {
            ...profileData,
            ...existingData,
            role: userRole,
          };
        } else {
          // New user: create record in Firestore
          const newDoc = {
            name: profileData.name,
            email: profileData.email,
            avatar: profileData.avatar,
            role: userRole,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          };
          await setDoc(userRef, newDoc);
        }
      } catch (err) {
        console.warn('Firestore user profile sync error (falling back to auth token):', err);
      }
    }

    // Cache locally for instant offline hydration
    const fullUser = {
      uid: firebaseUser.uid,
      id: firebaseUser.uid,
      email: firebaseUser.email,
      name: profileData.name,
      displayName: profileData.name,
      photoURL: profileData.avatar || firebaseUser.photoURL,
      avatar: profileData.avatar || firebaseUser.photoURL,
      role: userRole,
    };

    localStorage.setItem('gsfcu_user_role', userRole);
    localStorage.setItem('gsfcu_user_info', JSON.stringify(fullUser));

    return { user: fullUser, role: userRole };
  };

  // Auth State Listener using Firebase modular SDK
  useEffect(() => {
    let unsubscribe = () => {};

    const initAuth = async () => {
      // 1. Instant check from localStorage
      const cachedRole = localStorage.getItem('gsfcu_user_role');
      const cachedUserInfo = localStorage.getItem('gsfcu_user_info');
      const cachedAdminAuth = localStorage.getItem('gsfcu_admin_auth') === 'true';

      if (cachedUserInfo) {
        try {
          setUser(JSON.parse(cachedUserInfo));
          setRole(cachedRole || (cachedAdminAuth ? 'committee' : 'student'));
        } catch {
          // ignore cache parse failure
        }
      } else if (cachedAdminAuth) {
        const committeeUser = {
          name: cachedRole === 'admin' ? 'Event Administrator' : 'Committee Member',
          email: `${cachedRole || 'committee'}@gsfcu.ac.in`,
          role: cachedRole || 'committee',
        };
        setUser(committeeUser);
        setRole(cachedRole || 'committee');
      }

      // 2. Firebase onAuthStateChanged listener
      if (auth) {
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const userEmail = (firebaseUser.email || '').toLowerCase().trim();
            if (!isAuthorizedUniversityEmail(userEmail)) {
              await firebaseSignOut(auth);
              setUser(null);
              setRole(null);
              localStorage.removeItem('gsfcu_user_role');
              localStorage.removeItem('gsfcu_user_info');
              setAuthError(`Access restricted: '${userEmail}' is not authorized. Please use your official @gsfcuniversity.ac.in student email.`);
              setLoading(false);
              return;
            }

            const synced = await syncUserProfile(firebaseUser);
            if (synced) {
              setUser(synced.user);
              setRole(synced.role);
            }
          } else {
            // Signed out of Firebase
            // If user did not use passcode fallback, clear session
            const isPasscodeSession = localStorage.getItem('gsfcu_admin_auth') === 'true';
            if (!isPasscodeSession) {
              setUser(null);
              setRole(null);
              localStorage.removeItem('gsfcu_user_role');
              localStorage.removeItem('gsfcu_user_info');
            }
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      unsubscribe();
    };
  }, []);

  // 1. Google Authentication with Popup
  const signInWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);

    // If Firebase is in placeholder/offline mode, provide interactive demo authentication
    if (!isFirebaseConfigured()) {
      console.warn('Firebase credentials not set in .env. Simulating Google Sign-In for development...');
      await new Promise((res) => setTimeout(res, 800));
      const demoUser = {
        uid: 'demo_google_user_' + Date.now(),
        id: 'demo_google_user_' + Date.now(),
        displayName: 'GSFCU Verified Student',
        name: 'GSFCU Verified Student',
        email: 'student@gsfcuniversity.ac.in',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        role: 'student',
      };
      setUser(demoUser);
      setRole('student');
      localStorage.setItem('gsfcu_user_role', 'student');
      localStorage.setItem('gsfcu_user_info', JSON.stringify(demoUser));
      setLoading(false);
      return { success: true, user: demoUser, role: 'student' };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = (result.user?.email || '').toLowerCase().trim();

      // Enforce university domain restriction
      if (!isAuthorizedUniversityEmail(userEmail)) {
        await firebaseSignOut(auth);
        setUser(null);
        setRole(null);
        localStorage.removeItem('gsfcu_user_role');
        localStorage.removeItem('gsfcu_user_info');
        const domainError = `Access restricted: '${userEmail}' is not an authorized university email. Please sign in with your official @gsfcuniversity.ac.in account.`;
        setAuthError(domainError);
        return { success: false, error: domainError };
      }

      const synced = await syncUserProfile(result.user);
      if (synced) {
        setUser(synced.user);
        setRole(synced.role);
        return { success: true, user: synced.user, role: synced.role };
      }
      return { success: true, user: result.user };
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      let userFriendlyMessage = 'Sign-in failed. Please try again.';
      if (err.code === 'auth/popup-closed-by-user') {
        userFriendlyMessage = 'Sign-in popup was closed before completing.';
      } else if (err.code === 'auth/popup-blocked') {
        userFriendlyMessage = 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        userFriendlyMessage = 'Only one sign-in window can be open at a time.';
      } else if (err.message) {
        userFriendlyMessage = err.message;
      }
      setAuthError(userFriendlyMessage);
      return { success: false, error: userFriendlyMessage };
    } finally {
      setLoading(false);
    }
  };

  // 2. Passcode / Legacy login for Event Administrators & Committee Desk
  const login = async ({ passcode, roleChoice }) => {
    setLoading(true);
    setAuthError(null);
    try {
      if (passcode) {
        const cleanPasscode = passcode.trim().toLowerCase();
        if (['gsfcu2026', 'admin', 'gsfcu'].includes(cleanPasscode)) {
          const assignedRole = cleanPasscode === 'admin' ? 'admin' : 'committee';
          const authUser = {
            uid: `staff_${assignedRole}`,
            id: `staff_${assignedRole}`,
            name: assignedRole === 'admin' ? 'Event Administrator' : 'Committee Member',
            displayName: assignedRole === 'admin' ? 'Event Administrator' : 'Committee Member',
            email: `${assignedRole}@gsfcu.ac.in`,
            role: assignedRole,
          };
          setUser(authUser);
          setRole(assignedRole);
          localStorage.setItem('gsfcu_admin_auth', 'true');
          sessionStorage.setItem('gsfcu_admin_auth', 'true');
          localStorage.setItem('gsfcu_user_role', assignedRole);
          localStorage.setItem('gsfcu_user_info', JSON.stringify(authUser));
          return { success: true, role: assignedRole, user: authUser };
        } else {
          const msg = 'Invalid Committee Passcode. Access denied.';
          setAuthError(msg);
          return { success: false, error: msg };
        }
      }

      if (roleChoice) {
        const authUser = {
          uid: `demo_${roleChoice}`,
          name: `${roleChoice.toUpperCase()} Member`,
          email: `${roleChoice}@gsfcu.ac.in`,
          role: roleChoice,
        };
        setUser(authUser);
        setRole(roleChoice);
        localStorage.setItem('gsfcu_user_role', roleChoice);
        localStorage.setItem('gsfcu_user_info', JSON.stringify(authUser));
        return { success: true, role: roleChoice, user: authUser };
      }

      return { success: false, error: 'Authentication details missing.' };
    } finally {
      setLoading(false);
    }
  };

  // 3. Global Sign Out
  const logout = async () => {
    setLoading(true);
    try {
      if (auth) {
        await firebaseSignOut(auth);
      }
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setUser(null);
      setRole(null);
      localStorage.removeItem('gsfcu_admin_auth');
      sessionStorage.removeItem('gsfcu_admin_auth');
      localStorage.removeItem('gsfcu_user_role');
      localStorage.removeItem('gsfcu_user_info');
      setLoading(false);
    }
  };

  const isAdmin = role === 'admin';
  const isCommittee = role === 'committee';
  const canAccessPortal = Boolean(isAdmin || isCommittee);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAdmin,
        isCommittee,
        canAccessPortal,
        signInWithGoogle,
        login,
        logout,
        error: authError,
        authModalOpen,
        authModalRedirect,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
