import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext({
  user: null,
  role: null, // 'student' | 'participant' | 'committee' | 'admin' | null
  loading: true,
  login: async () => {},
  logout: () => {},
  canAccessPortal: false,
  isAdmin: false,
  isCommittee: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth & role from Supabase or localStorage fallback
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        // First check local storage cache/session for instant restore or demo sessions
        const storedRole = localStorage.getItem('gsfcu_user_role') || sessionStorage.getItem('gsfcu_user_role');
        const storedUser = localStorage.getItem('gsfcu_user_info') || sessionStorage.getItem('gsfcu_user_info');
        const legacyAuth = localStorage.getItem('gsfcu_admin_auth') === 'true' || sessionStorage.getItem('gsfcu_admin_auth') === 'true';

        let activeUser = storedUser ? JSON.parse(storedUser) : null;
        let activeRole = storedRole || (legacyAuth ? 'committee' : null);

        if (isSupabaseConfigured()) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch user profile from Supabase user_profiles table if exists
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('role, name, email')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              activeRole = profile.role || 'student';
              activeUser = {
                id: session.user.id,
                email: profile.email || session.user.email,
                name: profile.name || session.user.email?.split('@')[0] || 'User',
                role: activeRole
              };
            } else {
              activeUser = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.email?.split('@')[0] || 'User',
                role: activeRole || 'student'
              };
            }
          }
        }

        if (mounted) {
          setUser(activeUser);
          setRole(activeRole);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initAuth();

    let authListener = null;
    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role, name, email')
            .eq('id', session.user.id)
            .single();

          const newRole = profile?.role || 'student';
          const newUser = {
            id: session.user.id,
            email: session.user.email,
            name: profile?.name || session.user.email,
            role: newRole
          };
          setUser(newUser);
          setRole(newRole);
          localStorage.setItem('gsfcu_user_role', newRole);
          localStorage.setItem('gsfcu_user_info', JSON.stringify(newUser));
        } else {
          // If Supabase signed out and no legacy passcode session exists
          if (!localStorage.getItem('gsfcu_admin_auth')) {
            setUser(null);
            setRole(null);
            localStorage.removeItem('gsfcu_user_role');
            localStorage.removeItem('gsfcu_user_info');
          }
        }
        setLoading(false);
      });
      authListener = data?.subscription;
    }

    return () => {
      mounted = false;
      if (authListener) authListener.unsubscribe();
    };
  }, []);

  // Login handler supporting Passcode & Supabase Email/Password
  const login = async ({ passcode, email, password, roleChoice }) => {
    setLoading(true);
    try {
      if (passcode) {
        const cleanPasscode = passcode.trim().toLowerCase();
        if (['gsfcu2026', 'admin', 'gsfcu'].includes(cleanPasscode)) {
          const assignedRole = cleanPasscode === 'admin' ? 'admin' : 'committee';
          const authUser = {
            name: assignedRole === 'admin' ? 'Event Administrator' : 'Committee Member',
            email: `${assignedRole}@gsfcu.ac.in`,
            role: assignedRole
          };
          setUser(authUser);
          setRole(assignedRole);
          localStorage.setItem('gsfcu_admin_auth', 'true');
          sessionStorage.setItem('gsfcu_admin_auth', 'true');
          localStorage.setItem('gsfcu_user_role', assignedRole);
          localStorage.setItem('gsfcu_user_info', JSON.stringify(authUser));
          return { success: true, role: assignedRole };
        } else {
          return { success: false, error: 'Invalid Committee Passcode. Access denied.' };
        }
      }

      if (email && isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Fetch role
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role, name, email')
          .eq('id', data.user.id)
          .single();

        const userRole = profile?.role || roleChoice || 'student';
        const authUser = {
          id: data.user.id,
          email: data.user.email,
          name: profile?.name || email,
          role: userRole
        };
        setUser(authUser);
        setRole(userRole);
        localStorage.setItem('gsfcu_user_role', userRole);
        localStorage.setItem('gsfcu_user_info', JSON.stringify(authUser));
        return { success: true, role: userRole };
      }

      // Demo role selection when no cloud auth or passcode is entered
      if (roleChoice) {
        const authUser = {
          name: `${roleChoice.toUpperCase()} User`,
          email: `${roleChoice}@example.com`,
          role: roleChoice
        };
        setUser(authUser);
        setRole(roleChoice);
        localStorage.setItem('gsfcu_user_role', roleChoice);
        localStorage.setItem('gsfcu_user_info', JSON.stringify(authUser));
        if (['committee', 'admin'].includes(roleChoice)) {
          localStorage.setItem('gsfcu_admin_auth', 'true');
        } else {
          localStorage.removeItem('gsfcu_admin_auth');
          sessionStorage.removeItem('gsfcu_admin_auth');
        }
        return { success: true, role: roleChoice };
      }

      return { success: false, error: 'Authentication details missing.' };
    } catch (err) {
      return { success: false, error: err.message || 'Authentication failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.error("Sign out error:", e);
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

  const canAccessPortal = Boolean(role === 'committee' || role === 'admin');
  const isAdmin = role === 'admin';
  const isCommittee = role === 'committee';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        login,
        logout,
        canAccessPortal,
        isAdmin,
        isCommittee,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
