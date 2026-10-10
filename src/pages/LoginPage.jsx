import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheck, Sparkles, Key, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine redirection target (default to /register)
  const queryParams = new URLSearchParams(location.search);
  const redirectTarget = queryParams.get('redirect') || '/register';

  // State for optional committee passcode toggle
  const [showPasscodeOption, setShowPasscodeOption] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [passcodeLoading, setPasscodeLoading] = useState(false);

  // Auto-login check: redirect already authenticated users
  useEffect(() => {
    if (!loading && user) {
      navigate(redirectTarget, { replace: true });
    }
  }, [user, loading, navigate, redirectTarget]);

  const handleGoogleSuccess = (authedUser, userRole) => {
    // If admin/committee redirect to portal or requested destination
    if (userRole === 'admin' || userRole === 'committee') {
      navigate('/portal', { replace: true });
    } else {
      navigate(redirectTarget, { replace: true });
    }
  };

  const handlePasscodeSubmit = async (e) => {
    e.preventDefault();
    setPasscodeError('');
    setPasscodeLoading(true);
    try {
      const res = await login({ passcode });
      if (res.success) {
        navigate('/portal', { replace: true });
      } else {
        setPasscodeError(res.error || 'Invalid passcode.');
      }
    } finally {
      setPasscodeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#F4E7D0] flex flex-col justify-between font-sans selection:bg-[#FFBF00]/30 selection:text-white relative overflow-hidden">
      {/* Golden Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#FFBF00]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#C96B35]/15 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-28 sm:py-36 z-10">
        <div className="w-full max-w-md">
          
          {/* Card Wrapper with Gold Subtle Accents */}
          <div className="relative rounded-3xl bg-[#08080a]/90 backdrop-blur-xl border border-[#FFBF00]/30 p-7 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-center overflow-hidden">
            
            {/* Top Golden Light Strip */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent" />

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFBF00]/10 border border-[#FFBF00]/30 text-[#FFBF00] text-[10px] font-mono tracking-widest uppercase mb-6">
              <Sparkles className="w-3 h-3" />
              <span>GSFC UNIVERSITY TALENT HUNT 2026</span>
            </div>

            {/* Title */}
            <h1 className="font-bebas text-4xl sm:text-5xl text-[#F4E7D0] tracking-wider uppercase mb-2">
              STUDENT SIGN IN
            </h1>
            
            <p className="text-xs text-[#C9C5BD] leading-relaxed font-sans mb-5">
              Verify your identity to complete stage registration, generate your <strong className="text-[#FFBF00]">Digital Stage Pass</strong>, and submit your audition track.
            </p>

            {/* University Domain Restriction Notice */}
            <div className="mb-6 py-2 px-3.5 rounded-xl bg-[#FFBF00]/10 border border-[#FFBF00]/25 text-xs font-mono text-[#FFBF00]">
              Only <strong className="text-white">@gsfcuniversity.ac.in</strong> email accounts are permitted
            </div>

            {/* Google Authentication Button */}
            <GoogleSignInButton
              buttonText="CONTINUE WITH GOOGLE"
              onSuccess={handleGoogleSuccess}
              className="mb-5"
            />

            {/* Student Notice */}
            <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[#C9C5BD]/70 mb-8">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFBF00]" />
              <span>Official GSFC University Domain Verification</span>
            </div>

            {/* Secondary Option: Committee Passcode Drawer */}
            <div className="pt-6 border-t border-white/10 text-center">
              {!showPasscodeOption ? (
                <button
                  type="button"
                  onClick={() => setShowPasscodeOption(true)}
                  className="text-[11px] font-mono text-[#FFBF00]/75 hover:text-[#FFBF00] hover:underline transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <Key className="w-3 h-3" />
                  <span>Are you an Organizer or Committee Member? Enter Passcode</span>
                </button>
              ) : (
                <form onSubmit={handlePasscodeSubmit} className="space-y-3 animate-in fade-in duration-200">
                  <p className="text-[10px] font-mono tracking-widest text-[#FFBF00] uppercase">
                    COMMITTEE DESK PASSCODE
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Passcode (e.g. gsfcu2026)"
                      className="flex-1 bg-[#000000] border border-[#FFBF00]/30 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 font-mono focus:outline-none focus:border-[#FFBF00]"
                    />
                    <button
                      type="submit"
                      disabled={passcodeLoading}
                      className="bg-[#FFBF00] hover:bg-[#e6ac00] text-black font-mono font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      {passcodeLoading ? '...' : 'VERIFY'}
                    </button>
                  </div>
                  {passcodeError && (
                    <p className="text-[11px] font-mono text-red-400">{passcodeError}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPasscodeOption(false)}
                    className="text-[10px] text-[#C9C5BD] hover:underline"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>

            {/* Back to Home Link */}
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#C9C5BD] hover:text-[#FFBF00] transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to Event Homepage</span>
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
