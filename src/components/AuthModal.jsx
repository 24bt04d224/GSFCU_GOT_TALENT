import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, ShieldCheck } from 'lucide-react';
import GoogleSignInButton from './GoogleSignInButton';

export default function AuthModal({ isOpen, onClose, redirectPath = '/register' }) {
  const navigate = useNavigate();

  // Prevent background scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSuccess = (user, role) => {
    onClose();
    if (role === 'admin' || role === 'committee') {
      navigate('/portal');
    } else {
      navigate(redirectPath);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
        className="relative w-full max-w-md rounded-3xl bg-[#000000] border border-[#FFBF00]/40 p-7 sm:p-9 shadow-[0_0_60px_rgba(255,191,0,0.25)] text-center overflow-hidden z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Golden Top Shimmer Stripe */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent" />

        {/* Ambient Gold Halo */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#FFBF00]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 rounded-full text-[#C9C5BD] hover:text-[#FFBF00] hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFBF00]/10 border border-[#FFBF00]/30 text-[#FFBF00] text-[10px] font-mono tracking-widest uppercase mb-4">
          <Sparkles className="w-3 h-3" />
          <span>STUDENT VERIFICATION REQUIRED</span>
        </div>

        {/* Headline */}
        <h2
          id="modal-headline"
          className="font-bebas text-3xl sm:text-4xl text-[#F4E7D0] tracking-wider uppercase mb-2"
        >
          STAGE REGISTRATION SIGN IN
        </h2>

        <p className="text-xs text-[#C9C5BD] leading-relaxed font-sans mb-5">
          To register your act, upload audio, and claim your verified <strong className="text-[#FFBF00]">Digital Stage Pass</strong>, please continue with your official university Google account.
        </p>

        {/* Domain restriction notice pill */}
        <div className="mb-5 py-1.5 px-3 rounded-lg bg-[#FFBF00]/10 border border-[#FFBF00]/25 text-[11px] font-mono text-[#FFBF00]">
          Only <strong className="text-white">@gsfcuniversity.ac.in</strong> email accounts are permitted
        </div>

        {/* Central Gold Action Button */}
        <GoogleSignInButton
          buttonText="CONTINUE WITH GOOGLE"
          onSuccess={handleSuccess}
          className="mb-4"
        />

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#C9C5BD]/60 mt-3">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FFBF00]" />
          <span>GSFC University • Restricted Domain Authentication</span>
        </div>
      </div>
    </div>
  );
}
