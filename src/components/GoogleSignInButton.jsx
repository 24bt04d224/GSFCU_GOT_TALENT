import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function GoogleSignInButton({
  onSuccess,
  onError,
  className = '',
  buttonText = 'CONTINUE WITH GOOGLE'
}) {
  const { signInWithGoogle, loading: authGlobalLoading, error: contextError } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const isLoading = localLoading || authGlobalLoading;

  const handleClick = async () => {
    if (isLoading) return;
    setErrorMessage(null);
    setLocalLoading(true);

    try {
      const res = await signInWithGoogle();
      if (res.success) {
        if (onSuccess) onSuccess(res.user, res.role);
      } else {
        const errorText = res.error || 'Authentication could not be completed.';
        setErrorMessage(errorText);
        if (onError) onError(errorText);
      }
    } catch (err) {
      const errText = err.message || 'An unexpected error occurred during Google sign in.';
      setErrorMessage(errText);
      if (onError) onError(errText);
    } finally {
      setLocalLoading(false);
    }
  };

  const displayError = errorMessage || contextError;

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      {/* Error Banner */}
      {displayError && (
        <div className="w-full mb-4 px-4 py-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-mono flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 shadow-lg shadow-red-950/30">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="flex-1 leading-snug">{displayError}</span>
        </div>
      )}

      {/* Modern Gold/Black Pill Button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        aria-label="Continue with Google"
        className={`
          relative w-full overflow-hidden rounded-full
          bg-[#000000] text-[#FFBF00]
          border border-[#FFBF00]
          px-6 py-4
          flex items-center justify-center
          font-mono font-bold text-xs sm:text-sm tracking-wider uppercase
          cursor-pointer select-none
          transition-all duration-300 ease-out
          shadow-[0_0_20px_rgba(255,191,0,0.22)]
          hover:shadow-[0_0_35px_rgba(255,191,0,0.45)]
          hover:border-[#FFD700] hover:text-[#FFF]
          hover:scale-[1.02] active:scale-[0.98]
          disabled:opacity-75 disabled:cursor-wait disabled:hover:scale-100
        `}
      >
        {/* Continuous Animated Shimmer Ray across the button */}
        <div
          className="absolute inset-0 pointer-events-none w-1/2 h-full bg-gradient-to-r from-transparent via-[#FFBF00]/25 to-transparent animate-gold-shimmer"
        />

        {/* Button Content */}
        <div className="relative z-10 flex items-center justify-center w-full">
          {/* Left: Google Logo Icon */}
          <div className="flex items-center shrink-0">
            <svg
              className="w-5 h-5 drop-shadow-sm"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          </div>

          {/* Subtle Vertical Divider */}
          <div className="h-5 w-[1px] bg-[#FFBF00]/30 mx-4 shrink-0" />

          {/* Text / Loading State */}
          <div className="flex-1 text-center pr-2">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#FFBF00]" />
                <span className="tracking-widest">CONNECTING TO GOOGLE...</span>
                <span className="inline-flex gap-1 items-center ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFBF00] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFBF00] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFBF00] animate-bounce" />
                </span>
              </div>
            ) : (
              <span className="tracking-widest drop-shadow-[0_0_8px_rgba(255,191,0,0.3)]">
                {buttonText}
              </span>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}
