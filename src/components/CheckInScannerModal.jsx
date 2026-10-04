import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  X, Camera, QrCode, CheckCircle2, AlertTriangle, AlertCircle, 
  RotateCcw, ShieldCheck, User, Users, Clock, ArrowRight, RefreshCw, Volume2
} from 'lucide-react';
import { processQrCheckIn } from '../services/registrationService';

export default function CheckInScannerModal({ isOpen, onClose, onCheckInComplete }) {
  const [cameraState, setCameraState] = useState('initializing'); // 'initializing' | 'active' | 'error'
  const [cameraErrorMessage, setCameraErrorMessage] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [manualInput, setManualInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef(null);
  const isComponentMounted = useRef(true);

  useEffect(() => {
    isComponentMounted.current = true;
    if (!isOpen) {
      cleanupScanner();
      setScanResult(null);
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        cleanupScanner();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    startScanner();

    return () => {
      isComponentMounted.current = false;
      window.removeEventListener('keydown', handleKeyDown);
      cleanupScanner();
    };
  }, [isOpen]);


  const cleanupScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (err) {
        console.warn("Error cleaning up QR scanner:", err);
      } finally {
        scannerRef.current = null;
      }
    }
  };

  const startScanner = async () => {
    setCameraState('initializing');
    setCameraErrorMessage('');
    await cleanupScanner();

    // Give DOM time to render the scanner container element
    await new Promise((res) => setTimeout(res, 250));

    const element = document.getElementById('qr-reader-viewfinder');
    if (!element) return;

    try {
      const html5Qrcode = new Html5Qrcode('qr-reader-viewfinder');
      scannerRef.current = html5Qrcode;

      const config = {
        fps: 10,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const minDim = Math.min(viewfinderWidth, viewfinderHeight);
          return {
            width: Math.floor(minDim * 0.75),
            height: Math.floor(minDim * 0.75)
          };
        },
        aspectRatio: 1.0
      };

      await html5Qrcode.start(
        { facingMode: 'environment' }, // Prefer rear camera on mobile/tablet
        config,
        handleQrScanSuccess,
        handleQrScanError
      );

      if (isComponentMounted.current) {
        setCameraState('active');
      }
    } catch (err) {
      console.warn("Camera start failed, trying fallback camera:", err);
      try {
        if (scannerRef.current) {
          await scannerRef.current.start(
            { facingMode: 'user' },
            { fps: 10, qrbox: { width: 240, height: 240 } },
            handleQrScanSuccess,
            handleQrScanError
          );
          if (isComponentMounted.current) {
            setCameraState('active');
          }
          return;
        }
      } catch (fallbackErr) {
        console.error("Camera access error:", fallbackErr);
        if (isComponentMounted.current) {
          setCameraState('error');
          if (err?.name === 'NotAllowedError' || err?.toString().includes('Permission')) {
            setCameraErrorMessage('Camera permission was denied. Please enable camera access in your browser settings or enter the candidate ID manually below.');
          } else {
            setCameraErrorMessage('Camera is unavailable or in use by another app. You can still enter or paste candidate registration IDs below.');
          }
        }
      }
    }
  };

  const handleQrScanSuccess = async (decodedText) => {
    if (isProcessing) return;
    setIsProcessing(true);

    // Pause scanner scanning temporarily while showing result
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.pause(true);
      } catch {}
    }

    try {
      // Audio feedback / beep synthesis
      playFeedbackSound();

      const result = await processQrCheckIn(decodedText);
      setScanResult(result);

      if (result.status === 'SUCCESS' && onCheckInComplete) {
        onCheckInComplete(result.allRegistrations, result);
      }
    } catch (e) {
      console.error("Scan processing error:", e);
      setScanResult({
        status: 'INVALID_QR',
        message: 'An error occurred while processing the QR code.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQrScanError = () => {
    // Non-critical frame-by-frame scanning noise, ignore
  };

  const handleManualCheckIn = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!manualInput.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await processQrCheckIn(manualInput);
      setScanResult(result);
      if (result.status === 'SUCCESS' && onCheckInComplete) {
        onCheckInComplete(result.allRegistrations, result);
      }
      setManualInput('');
    } catch (err) {
      console.error("Manual check-in error:", err);
      setScanResult({
        status: 'INVALID_QR',
        message: 'Failed to process manual ID entry.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetForNextScan = async () => {
    setScanResult(null);
    if (scannerRef.current) {
      try {
        await scannerRef.current.resume();
      } catch {
        startScanner();
      }
    } else {
      startScanner();
    }
  };

  const playFeedbackSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // 880Hz A5 note
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          cleanupScanner();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-modal-backdrop font-sans"
    >
      <div className="relative w-full max-w-lg bg-[#0e0e13] border border-[#C49A3A]/35 rounded-2xl shadow-2xl p-5 sm:p-7 text-[#F4E7D0] my-6 animate-modal-content">

        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C49A3A]/25">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#C96B35]/20 border border-[#C96B35]/40 flex items-center justify-center text-[#C96B35] shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#C49A3A] uppercase tracking-wider font-bold block">
                GATE VERIFICATION & EXPRESS SCANNER
              </span>
              <h2 className="font-bebas text-2xl text-[#F4E7D0] tracking-wide leading-none">
                CHECK-IN QR SCANNER
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              cleanupScanner();
              onClose();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#B5ACA0] hover:text-[#F4E7D0] transition-colors cursor-pointer"
            aria-label="Close Scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCANNER BODY */}
        <div className="mt-5 space-y-4">

          {/* CASE A: SCAN RESULT PRESENTED */}
          {scanResult ? (
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              
              {/* RESULT 1: SUCCESSFUL CHECK-IN */}
              {scanResult.status === 'SUCCESS' && (
                <div className="p-5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/60 text-center relative overflow-hidden shadow-2xl">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-widest inline-block mb-2">
                    ✓ CHECK-IN SUCCESSFUL — ENTRY ALLOWED
                  </span>

                  <h3 className="font-bebas text-3xl text-[#F4E7D0] tracking-wide uppercase leading-tight">
                    {scanResult.registration?.fullName}
                  </h3>

                  <div className="mt-3 p-3 bg-[#08080a] rounded-xl border border-emerald-500/30 text-left text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-[#B5ACA0]">REGISTRATION ID:</span>
                      <span className="font-bold text-[#C96B35]">{scanResult.registration?.id}</span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-[#B5ACA0]">ENROLLMENT NO:</span>
                      <span className="font-bold text-[#F4E7D0]">{scanResult.registration?.enrollmentNo}</span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-[#B5ACA0]">TALENT CATEGORY:</span>
                      <span className="font-bold text-[#C49A3A] uppercase">{scanResult.registration?.category}</span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-[#B5ACA0]">FORMAT:</span>
                      <span className="font-bold text-[#F4E7D0]">{scanResult.registration?.participationType || 'Solo'}</span>
                    </div>

                    <div className="flex justify-between pt-0.5">
                      <span className="text-[#B5ACA0]">CHECKED IN AT:</span>
                      <span className="text-emerald-400 font-bold">{new Date(scanResult.checkInTime).toLocaleTimeString()}</span>
                    </div>

                    {scanResult.registration?.teamMembers?.length > 0 && (
                      <div className="pt-1 border-t border-white/10">
                        <span className="text-[#C96B35] block font-bold mb-0.5">TEAM MEMBERS:</span>
                        <span className="text-[11px] text-[#F4E7D0]">
                          {scanResult.registration.teamMembers.map(m => m.name).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleResetForNextScan}
                    className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-[#F4E7D0] font-mono font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg border border-emerald-500 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" /> SCAN NEXT PASS
                  </button>
                </div>
              )}

              {/* RESULT 2: ALREADY CHECKED IN */}
              {scanResult.status === 'ALREADY_CHECKED_IN' && (
                <div className="p-5 rounded-2xl bg-amber-950/40 border-2 border-amber-500/60 text-center relative overflow-hidden shadow-2xl">
                  <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 mx-auto mb-3 shadow-lg">
                    <AlertTriangle className="w-8 h-8" />
                  </div>

                  <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[11px] font-mono text-amber-300 font-bold uppercase tracking-widest inline-block mb-2">
                    ⚠ ALREADY CHECKED IN — DUPLICATE PREVENTED
                  </span>

                  <h3 className="font-bebas text-3xl text-[#F4E7D0] tracking-wide uppercase leading-tight">
                    {scanResult.registration?.fullName}
                  </h3>

                  <p className="text-xs text-amber-200 font-sans mt-1">
                    This candidate's QR pass has already been used for entry.
                  </p>

                  <div className="mt-3 p-3 bg-[#08080a] rounded-xl border border-amber-500/30 text-left text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-[#B5ACA0]">REGISTRATION ID:</span>
                      <span className="font-bold text-[#C96B35]">{scanResult.registration?.id}</span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-[#B5ACA0]">ENROLLMENT NO:</span>
                      <span className="font-bold text-[#F4E7D0]">{scanResult.registration?.enrollmentNo}</span>
                    </div>

                    <div className="flex justify-between pt-0.5">
                      <span className="text-[#B5ACA0]">PREVIOUS CHECK-IN TIME:</span>
                      <span className="text-amber-300 font-bold">
                        {new Date(scanResult.checkInTime).toLocaleTimeString()} ({new Date(scanResult.checkInTime).toLocaleDateString()})
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleResetForNextScan}
                    className="mt-4 w-full bg-amber-600 hover:bg-amber-500 text-[#F4E7D0] font-mono font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg border border-amber-500 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" /> SCAN NEXT PASS
                  </button>
                </div>
              )}

              {/* RESULT 3: INVALID QR CODE */}
              {scanResult.status === 'INVALID_QR' && (
                <div className="p-5 rounded-2xl bg-red-950/40 border-2 border-red-500/60 text-center relative overflow-hidden shadow-2xl">
                  <div className="w-14 h-14 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-400 mx-auto mb-3 shadow-lg">
                    <AlertCircle className="w-8 h-8" />
                  </div>

                  <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-[11px] font-mono text-red-300 font-bold uppercase tracking-widest inline-block mb-2">
                    🚫 INVALID QR CODE — ENTRY REJECTED
                  </span>

                  <h3 className="font-bebas text-2xl text-[#F4E7D0] tracking-wide uppercase leading-tight">
                    UNRECOGNIZED PASS
                  </h3>

                  <p className="text-xs text-red-200 font-sans mt-2 max-w-sm mx-auto leading-relaxed">
                    {scanResult.message || 'This QR code does not belong to any valid registration in the GSFCU GOT TALENT database.'}
                  </p>

                  <button
                    onClick={handleResetForNextScan}
                    className="mt-5 w-full bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg border border-red-500 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" /> SCAN AGAIN / TRY ANOTHER
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* CASE B: ACTIVE SCANNER VIEWFINDER */
            <div className="space-y-4">
              
              {/* Camera Viewfinder Box */}
              <div className="relative w-full aspect-square max-w-sm mx-auto bg-[#08080a] border-2 border-[#C49A3A]/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center">
                
                {/* Scanner Target Container for html5-qrcode */}
                <div id="qr-reader-viewfinder" className="w-full h-full overflow-hidden" />

                {/* Animated Laser Overlay */}
                {cameraState === 'active' && (
                  <div className="absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-between p-6">
                    {/* Viewfinder Corner Brackets */}
                    <div className="w-full h-full border-2 border-dashed border-[#C96B35]/70 rounded-xl relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#C96B35]" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#C96B35]" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#C96B35]" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#C96B35]" />
                      
                      {/* Scanning Animated Line */}
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#C96B35] to-transparent shadow-[0_0_12px_#C96B35] animate-pulse relative top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                )}

                {/* Initializing Loading State */}
                {cameraState === 'initializing' && (
                  <div className="absolute inset-0 bg-[#08080a] flex flex-col items-center justify-center p-6 text-center z-30">
                    <RefreshCw className="w-8 h-8 text-[#C96B35] animate-spin mb-3" />
                    <span className="font-mono text-xs text-[#F4E7D0] uppercase font-bold">STARTING CAMERA SCANNER...</span>
                    <span className="text-[10px] text-[#B5ACA0] font-mono mt-1">Requesting video permissions</span>
                  </div>
                )}

                {/* Camera Permission Error State */}
                {cameraState === 'error' && (
                  <div className="absolute inset-0 bg-[#0e0e13] p-6 flex flex-col items-center justify-center text-center z-30 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-400">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs text-red-300 uppercase font-bold">CAMERA UNAVAILABLE</span>
                    <p className="text-[11px] text-[#B5ACA0] font-sans leading-relaxed">
                      {cameraErrorMessage}
                    </p>
                    <button
                      onClick={startScanner}
                      className="px-4 py-2 rounded-md bg-[#C96B35] hover:bg-[#B65A3A] text-[#F4E7D0] text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      RETRY CAMERA ACCESS
                    </button>
                  </div>
                )}

              </div>

              <p className="text-center text-xs text-[#B5ACA0] font-sans">
                Align the candidate's digital pass QR code inside the frame.
              </p>

            </div>
          )}

          {/* MANUAL ID FALLBACK BAR */}
          <div className="pt-4 border-t border-white/10">
            <span className="text-[10px] font-mono text-[#B5ACA0] uppercase block mb-2 font-bold">
              OR ENTER REGISTRATION / ENROLLMENT ID MANUALLY
            </span>
            
            <form onSubmit={handleManualCheckIn} className="flex items-center gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="e.g. GT26-1042 or 230101042"
                className="flex-grow bg-[#08080a] border border-[#C49A3A]/30 rounded-lg px-3.5 py-2.5 text-xs text-[#F4E7D0] placeholder-[#B5ACA0]/40 font-mono focus:outline-none focus:border-[#C96B35]"
              />
              <button
                type="submit"
                disabled={!manualInput.trim() || isProcessing}
                className="px-5 py-2.5 rounded-lg bg-[#C96B35] hover:bg-[#B65A3A] text-[#F4E7D0] text-xs font-mono font-bold uppercase tracking-wider border border-[#C96B35] transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {isProcessing ? 'CHECKING...' : 'VERIFY & CHECK IN'}
              </button>
            </form>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#B5ACA0]">
          <span className="text-[10px]">GSFCU GOT TALENT — 2026 STAGE CONTROL</span>
          <button
            onClick={() => {
              cleanupScanner();
              onClose();
            }}
            className="px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-[#F4E7D0] uppercase transition-colors cursor-pointer"
          >
            CLOSE SCANNER
          </button>
        </div>

      </div>
    </div>
  );
}
