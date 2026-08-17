/**
 * Client-Side Cryptographic Utilities using the Web Crypto API (crypto.subtle)
 * Zero external server dependencies; 100% browser-native SHA-256 hashing
 */

/**
 * Hash a plain text string (password or PIN) using SHA-256
 */
export async function sha256Hash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text.trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Constant-time safe string comparison to prevent timing attacks
 */
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Default Seed Admin Credentials
 * Initial Password: Admin@Achyutam2026!
 * Initial Master PIN: 123456
 * Admin Email: admin@achyutam.com
 */
export const DEFAULT_ADMIN_EMAIL = "admin@achyutam.com";

// Pre-computed SHA-256 hashes for fallback sync:
// SHA-256('Admin@Achyutam2026!') = '250165e3170705a63908863fbaaa6f63456f4d5462cfceab737a4cb886dc86c5'
// SHA-256('123456') = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
export const DEFAULT_PASSWORD_HASH =
  "250165e3170705a63908863fbaaa6f63456f4d5462cfceab737a4cb886dc86c5";
export const DEFAULT_PIN_HASH =
  "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92";

export const ADMIN_CREDENTIALS_KEY = "achyutam_admin_credentials_v2";
export const ADMIN_SESSION_KEY = "achyutam_admin_session_v2";
export const AUTH_ATTEMPTS_KEY = "achyutam_auth_attempts_v2";
export const ACTIVITY_LOGS_KEY = "achyutam_activity_logs_v2";

export const LOCKOUT_TIME_MS = 30 * 1000; // 30 seconds lockout
export const MAX_FAILED_ATTEMPTS = 5;
export const SESSION_INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
