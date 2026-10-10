import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAdmin, isCommittee } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#FFBF00] flex flex-col items-center justify-center font-mono">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest text-[#C9C5BD]">
          Verifying Identity...
        </span>
      </div>
    );
  }

  // Not authenticated at all
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Admin / Committee access restriction
  if (requireAdmin && !isAdmin && !isCommittee) {
    return <Navigate to="/" replace />;
  }

  return children;
}
