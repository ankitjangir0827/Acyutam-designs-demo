import { useCallback, useEffect, useRef, useState } from "react";
import {
  ADMIN_CREDENTIALS_KEY,
  ADMIN_SESSION_KEY,
  AUTH_ATTEMPTS_KEY,
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_PASSWORD_HASH,
  DEFAULT_PIN_HASH,
  LOCKOUT_TIME_MS,
  MAX_FAILED_ATTEMPTS,
  SESSION_INACTIVITY_TIMEOUT_MS,
  safeCompare,
  sha256Hash,
} from "./cryptoUtils";
import type { AdminCredentials, AdminSession, AuthAttemptState } from "./types";

export function useAuth() {
  // Load or initialize stored credentials (SHA-256 hashed)
  const [credentials, setCredentials] = useState<AdminCredentials>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.warn("Failed to load admin credentials from localStorage:", e);
      }
    }
    return {
      email: DEFAULT_ADMIN_EMAIL,
      passwordHash: DEFAULT_PASSWORD_HASH,
      masterPinHash: DEFAULT_PIN_HASH,
      lastUpdated: new Date().toISOString(),
    };
  });

  // Session state in sessionStorage (auto-cleared on browser tab close)
  const [session, setSession] = useState<AdminSession>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(ADMIN_SESSION_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Check if session has expired due to inactivity
          if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn("Failed to load session from sessionStorage:", e);
      }
    }
    return {
      isAuthenticated: false,
      isStep1Passed: false,
      isStep2Passed: false,
      authenticatedEmail: null,
      loginTimestamp: null,
      expiresAt: null,
    };
  });

  // Rate Limiting & Lockout state
  const [attemptState, setAttemptState] = useState<AuthAttemptState>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(AUTH_ATTEMPTS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.lockoutUntil && Date.now() < parsed.lockoutUntil) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn("Failed to load attempt state:", e);
      }
    }
    return { failedAttempts: 0, lockoutUntil: null };
  });

  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] =
    useState<number>(0);
  const lastActivityRef = useRef<number>(Date.now());

  // Save credentials when updated
  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(credentials));
    } catch (e) {
      console.error("Error saving admin credentials:", e);
    }
  }, [credentials]);

  // Save session when updated
  useEffect(() => {
    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error("Error saving admin session:", e);
    }
  }, [session]);

  // Save attempt state
  useEffect(() => {
    try {
      localStorage.setItem(AUTH_ATTEMPTS_KEY, JSON.stringify(attemptState));
    } catch (e) {
      console.error("Error saving attempt state:", e);
    }
  }, [attemptState]);

  // Cooldown countdown timer
  useEffect(() => {
    if (!attemptState.lockoutUntil) {
      setLockoutRemainingSeconds(0);
      return;
    }

    const checkLockout = () => {
      if (!attemptState.lockoutUntil) return;
      const diff = Math.ceil((attemptState.lockoutUntil - Date.now()) / 1000);
      if (diff <= 0) {
        setAttemptState({ failedAttempts: 0, lockoutUntil: null });
        setLockoutRemainingSeconds(0);
      } else {
        setLockoutRemainingSeconds(diff);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [attemptState.lockoutUntil]);

  /**
   * Logout and clear active session
   */
  const logout = useCallback((reason?: string) => {
    setSession({
      isAuthenticated: false,
      isStep1Passed: false,
      isStep2Passed: false,
      authenticatedEmail: null,
      loginTimestamp: null,
      expiresAt: null,
    });
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    if (reason) {
      console.log("Admin session logged out:", reason);
    }
  }, []);

  // Inactivity auto-lock listener (15 mins)
  useEffect(() => {
    if (!session.isAuthenticated) return;

    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const interval = setInterval(() => {
      if (
        Date.now() - lastActivityRef.current >
        SESSION_INACTIVITY_TIMEOUT_MS
      ) {
        logout("Session timed out after 15 minutes of inactivity.");
      }
    }, 10000);

    window.addEventListener("mousemove", handleUserActivity, { passive: true });
    window.addEventListener("keydown", handleUserActivity, { passive: true });
    window.addEventListener("click", handleUserActivity, { passive: true });
    window.addEventListener("scroll", handleUserActivity, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
    };
  }, [session.isAuthenticated, logout]);

  const recordFailedAttempt = useCallback(() => {
    setAttemptState((prev) => {
      const nextCount = prev.failedAttempts + 1;
      if (nextCount >= MAX_FAILED_ATTEMPTS) {
        return {
          failedAttempts: nextCount,
          lockoutUntil: Date.now() + LOCKOUT_TIME_MS,
        };
      }
      return {
        ...prev,
        failedAttempts: nextCount,
      };
    });
  }, []);

  const resetFailedAttempts = useCallback(() => {
    setAttemptState({ failedAttempts: 0, lockoutUntil: null });
  }, []);

  /**
   * STEP 1: Verify Identity (Email + Password)
   */
  const verifyStep1 = useCallback(
    async (
      emailInput: string,
      passwordInput: string,
    ): Promise<{ success: boolean; error?: string }> => {
      if (attemptState.lockoutUntil && Date.now() < attemptState.lockoutUntil) {
        const remaining = Math.ceil(
          (attemptState.lockoutUntil - Date.now()) / 1000,
        );
        return {
          success: false,
          error: `Security lockout active. Please wait ${remaining}s before trying again.`,
        };
      }

      if (!emailInput.trim() || !passwordInput.trim()) {
        return {
          success: false,
          error: "Please provide both admin email and password.",
        };
      }

      const cleanEmail = emailInput.trim().toLowerCase();
      const inputPasswordHash = await sha256Hash(passwordInput.trim());

      const emailMatches = cleanEmail === credentials.email.toLowerCase();
      const passwordMatches = safeCompare(
        inputPasswordHash,
        credentials.passwordHash,
      );

      if (emailMatches && passwordMatches) {
        resetFailedAttempts();
        setSession((prev) => ({
          ...prev,
          isStep1Passed: true,
          authenticatedEmail: cleanEmail,
        }));
        return { success: true };
      }
      recordFailedAttempt();
      const currentFails = attemptState.failedAttempts + 1;
      const attemptsLeft = Math.max(0, MAX_FAILED_ATTEMPTS - currentFails);
      if (attemptsLeft === 0) {
        return {
          success: false,
          error:
            "Too many failed attempts! Security lockout triggered for 30 seconds.",
        };
      }
      return {
        success: false,
        error: `Invalid email or password. ${attemptsLeft} attempts remaining before security lockout.`,
      };
    },
    [credentials, attemptState, recordFailedAttempt, resetFailedAttempts],
  );

  /**
   * STEP 2: Verify Master Security PIN / Passkey
   */
  const verifyStep2 = useCallback(
    async (pinInput: string): Promise<{ success: boolean; error?: string }> => {
      if (!session.isStep1Passed) {
        return {
          success: false,
          error:
            "Step 1 verification required before entering Security Passkey.",
        };
      }

      if (attemptState.lockoutUntil && Date.now() < attemptState.lockoutUntil) {
        const remaining = Math.ceil(
          (attemptState.lockoutUntil - Date.now()) / 1000,
        );
        return {
          success: false,
          error: `Security lockout active. Please wait ${remaining}s.`,
        };
      }

      if (!pinInput.trim()) {
        return {
          success: false,
          error: "Please enter your Master Numerical PIN.",
        };
      }

      const inputPinHash = await sha256Hash(pinInput.trim());
      const pinMatches = safeCompare(inputPinHash, credentials.masterPinHash);

      if (pinMatches) {
        resetFailedAttempts();
        const now = Date.now();
        setSession({
          isAuthenticated: true,
          isStep1Passed: true,
          isStep2Passed: true,
          authenticatedEmail: credentials.email,
          loginTimestamp: now,
          expiresAt: now + SESSION_INACTIVITY_TIMEOUT_MS,
        });
        return { success: true };
      }
      recordFailedAttempt();
      const currentFails = attemptState.failedAttempts + 1;
      const attemptsLeft = Math.max(0, MAX_FAILED_ATTEMPTS - currentFails);
      if (attemptsLeft === 0) {
        return {
          success: false,
          error:
            "Master PIN incorrect! Security lockout triggered for 30 seconds.",
        };
      }
      return {
        success: false,
        error: `Invalid Master PIN. ${attemptsLeft} attempts remaining.`,
      };
    },
    [
      session.isStep1Passed,
      credentials,
      attemptState,
      recordFailedAttempt,
      resetFailedAttempts,
    ],
  );

  /**
   * Update Credentials inside Admin Settings Panel
   */
  const updateSecurityCredentials = useCallback(
    async (
      newEmail?: string,
      newPassword?: string,
      newPin?: string,
    ): Promise<{ success: boolean; message: string }> => {
      if (!session.isAuthenticated) {
        return {
          success: false,
          message: "Unauthorized. Admin session required.",
        };
      }

      const updated = { ...credentials };

      if (newEmail?.trim()) {
        updated.email = newEmail.trim().toLowerCase();
      }

      if (newPassword?.trim()) {
        if (newPassword.length < 8) {
          return {
            success: false,
            message: "Password must be at least 8 characters long.",
          };
        }
        updated.passwordHash = await sha256Hash(newPassword.trim());
      }

      if (newPin?.trim()) {
        if (!/^\d{4,8}$/.test(newPin.trim())) {
          return {
            success: false,
            message: "Master PIN must be between 4 to 8 digits.",
          };
        }
        updated.masterPinHash = await sha256Hash(newPin.trim());
      }

      updated.lastUpdated = new Date().toISOString();
      setCredentials(updated);
      return {
        success: true,
        message: "Security credentials updated and re-hashed successfully.",
      };
    },
    [session.isAuthenticated, credentials],
  );

  /**
   * Reset Step 1 to go back to identity prompt
   */
  const resetToStep1 = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      isStep1Passed: false,
      isStep2Passed: false,
    }));
  }, []);

  return {
    credentials,
    session,
    attemptState,
    lockoutRemainingSeconds,
    verifyStep1,
    verifyStep2,
    updateSecurityCredentials,
    logout,
    resetToStep1,
  };
}
