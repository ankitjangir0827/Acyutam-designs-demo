"use client";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { useAuth } from "../projects/useAuth";

interface AdminGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  auth: ReturnType<typeof useAuth>;
}

export const AdminGateModal: React.FC<AdminGateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  auth,
}) => {
  const {
    session,
    lockoutRemainingSeconds,
    verifyStep1,
    verifyStep2,
    resetToStep1,
  } = auth;

  // Step 1 inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step1Error, setStep1Error] = useState<string | null>(null);
  const [isVerifying1, setIsVerifying1] = useState(false);

  // Step 2 inputs
  const [pin, setPin] = useState("");
  const [step2Error, setStep2Error] = useState<string | null>(null);
  const [isVerifying2, setIsVerifying2] = useState(false);

  const [showDemoHelp, setShowDemoHelp] = useState(false);

  if (!isOpen) return null;

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep1Error(null);
    setIsVerifying1(true);

    try {
      const res = await verifyStep1(email, password);
      if (!res.success) {
        setStep1Error(res.error || "Authentication failed");
      } else {
        setPin("");
        setStep2Error(null);
      }
    } catch (err: unknown) {
      setStep1Error(
        (err as Error)?.message || "Error during cryptographic hashing",
      );
    } finally {
      setIsVerifying1(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Error(null);
    setIsVerifying2(true);

    try {
      const res = await verifyStep2(pin);
      if (!res.success) {
        setStep2Error(res.error || "PIN verification failed");
      } else {
        onSuccess();
      }
    } catch (err: unknown) {
      setStep2Error((err as Error)?.message || "Error verifying PIN");
    } finally {
      setIsVerifying2(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail("admin@achyutam.com");
    setPassword("Admin@Achyutam2026!");
    setPin("123456");
    setStep1Error(null);
    setStep2Error(null);
  };

  const handlePinKeypadClick = (digit: string) => {
    if (digit === "BACK") {
      setPin((prev) => prev.slice(0, -1));
    } else if (digit === "CLEAR") {
      setPin("");
    } else if (pin.length < 8) {
      setPin((prev) => prev + digit);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-2xl bg-black/85 animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-[#13131a] border border-white/15 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#191924]/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/15 border border-primary/40 text-primary">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                Admin Security Gate
              </h3>
              <p className="text-[10px] font-mono text-on-surface-variant/70">
                Web Crypto SHA-256 Dual-Layer Protocol
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-surface-container hover:bg-white/10 text-on-surface-variant hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lockout Warning Banner */}
        {lockoutRemainingSeconds > 0 && (
          <div className="p-4 bg-red-900/30 border-b border-red-500/40 text-red-200 text-xs font-mono flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
            <div>
              <p className="font-bold">Security Lockout Active!</p>
              <p className="opacity-90">
                Please wait {lockoutRemainingSeconds}s before attempting next
                authentication.
              </p>
            </div>
          </div>
        )}

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-2 border-b border-white/10 text-center font-mono text-xs">
          <div
            className={`py-3 flex items-center justify-center gap-2 transition-colors ${
              !session.isStep1Passed
                ? "bg-primary/10 text-primary border-b-2 border-primary font-bold"
                : "text-emerald-400 font-semibold"
            }`}
          >
            {session.isStep1Passed ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            <span>Step 1: Identity</span>
          </div>

          <div
            className={`py-3 flex items-center justify-center gap-2 transition-colors ${
              session.isStep1Passed
                ? "bg-primary/10 text-primary border-b-2 border-primary font-bold"
                : "text-on-surface-variant/40"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Step 2: Master PIN</span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* STEP 1: Email + Password Form */}
          {!session.isStep1Passed ? (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-email-input"
                  className="block text-xs font-mono text-on-surface-variant uppercase tracking-wider"
                >
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70" />
                  <input
                    id="admin-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@achyutam.com"
                    disabled={lockoutRemainingSeconds > 0}
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-lg pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="admin-password-input"
                  className="block text-xs font-mono text-on-surface-variant uppercase tracking-wider"
                >
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70" />
                  <input
                    id="admin-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    disabled={lockoutRemainingSeconds > 0}
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-lg pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {step1Error && (
                <div className="p-3 bg-red-900/30 border border-red-500/40 rounded-lg text-red-200 text-xs font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{step1Error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying1 || lockoutRemainingSeconds > 0}
                className="w-full py-3 bg-gradient-to-r from-primary to-amber-500 hover:opacity-90 disabled:opacity-40 text-background font-mono text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {isVerifying1 ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Verifying
                    SHA-256 Hash...
                  </>
                ) : (
                  <>
                    Proceed to Step 2 <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: Numerical Master PIN / Passkey Form */
            <form
              onSubmit={handleStep2Submit}
              className="space-y-4 animate-fadeIn"
            >
              <div className="text-center space-y-1">
                <p className="text-xs font-mono text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Step 1 Verified:{" "}
                  {email || "admin@achyutam.com"}
                </p>
                <h4 className="text-sm font-semibold text-white font-mono uppercase">
                  Enter 6-Digit Master PIN
                </h4>
                <p className="text-[11px] text-on-surface-variant">
                  Secondary cryptographic passkey protection for full portal
                  access
                </p>
              </div>

              {/* PIN Display Boxes */}
              <div className="flex justify-center gap-2 my-3">
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const digit = pin[idx];
                  return (
                    <div
                      key={idx}
                      className={`w-11 h-12 rounded-lg border-2 flex items-center justify-center font-mono text-lg font-bold transition-all ${
                        digit
                          ? "border-primary bg-primary/20 text-primary shadow-[0_0_10px_rgba(255,119,34,0.3)]"
                          : "border-outline-variant/40 bg-surface-container text-white/20"
                      }`}
                    >
                      {digit ? "•" : ""}
                    </div>
                  );
                })}
              </div>

              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter PIN"
                className="w-full text-center tracking-widest font-mono text-lg bg-surface-container border border-outline-variant/40 rounded-lg py-2 text-white focus:border-primary focus:outline-none"
              />

              {/* Interactive Keypad */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "CLEAR",
                  "0",
                  "BACK",
                ].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handlePinKeypadClick(key)}
                    className="py-2.5 rounded-lg bg-surface-container hover:bg-white/10 text-white font-mono text-xs font-bold transition-all border border-white/5 active:scale-95 cursor-pointer"
                  >
                    {key === "BACK" ? "⌫" : key}
                  </button>
                ))}
              </div>

              {step2Error && (
                <div className="p-3 bg-red-900/30 border border-red-500/40 rounded-lg text-red-200 text-xs font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{step2Error}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetToStep1}
                  className="w-1/3 py-3 bg-surface-container hover:bg-white/10 text-on-surface-variant font-mono text-xs uppercase rounded-lg transition-colors border border-white/10"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  disabled={
                    isVerifying2 ||
                    pin.length < 4 ||
                    lockoutRemainingSeconds > 0
                  }
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 disabled:opacity-40 text-background font-mono text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  {isVerifying2 ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Unlocking
                      Portal...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" /> Unlock Admin Portal
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Credentials Helper */}
          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowDemoHelp((prev) => !prev)}
              className="text-[11px] font-mono text-primary/80 hover:text-primary flex items-center gap-1.5 mx-auto transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {showDemoHelp
                ? "Hide Test Helper"
                : "Evaluation Credentials / 1-Click Fill"}
            </button>

            {showDemoHelp && (
              <div className="mt-3 p-3 bg-surface-container border border-primary/30 rounded-lg text-[11px] font-mono space-y-2 text-on-surface-variant">
                <div className="flex justify-between">
                  <span className="opacity-60">Admin Email:</span>
                  <span className="text-white font-bold">
                    admin@achyutam.com
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Password:</span>
                  <span className="text-white font-bold">
                    Admin@Achyutam2026!
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Master PIN:</span>
                  <span className="text-white font-bold">123456</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemoCredentials}
                  className="w-full mt-2 py-1.5 bg-primary/20 hover:bg-primary text-primary hover:text-background font-bold rounded transition-colors text-center cursor-pointer"
                >
                  ⚡ Auto-Fill Demo Credentials
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
