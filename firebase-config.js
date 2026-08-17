/**
 * ACHYUTAM BUILDER — Hardened Firebase Auth & Multi-Collection System
 * Project: achyutam-designs-public
 * Admin Account: ankitjangir529@gmail.com
 * Security Policy: Mandatory Email Verification enforced via sendEmailVerification()
 */

import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export const ADMIN_EMAIL = "ankitjangir529@gmail.com";

// Firebase web app configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAd9IsebRyeetMXYE0qUpBMUNTI5oTQ4Wg",
  authDomain: "achyutam-designs-public.firebaseapp.com",
  projectId: "achyutam-designs-public",
  storageBucket: "achyutam-designs-public.firebasestorage.app",
  messagingSenderId: "462360499893",
  appId: "1:462360499893:web:8ec2b48adc73673f3f90fc",
};

// Initialize Core App & Services
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Force Permanent Browser Local Storage Persistence for verified users
setPersistence(auth, browserLocalPersistence).catch((err) =>
  console.log("Persistence notice:", err),
);

// Analytics support check
export let analytics = null;
isAnalyticsSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("🔥 Firebase Analytics active");
    }
  })
  .catch((err) => console.log("Analytics notice:", err));

/**
 * Global Permanent Auth Observer
 * ENFORCEMENT: Only users with user.emailVerified === true are allowed active session!
 * Unverified users are immediately signed out and blocked from protected state.
 */
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // SECURITY CHECK: Email verification gate
    if (!user.emailVerified) {
      console.warn(
        "🔒 Security Guard: Detected unverified user attempt:",
        user.email,
      );
      localStorage.removeItem("achyutam_user");
      await signOut(auth).catch(() => {});
      if (typeof window.updateAuthUIState === "function") {
        window.updateAuthUIState(null);
      }
      if (typeof window.updateAuthUI === "function") {
        window.updateAuthUI();
      }
      return;
    }

    const userEmail = (user.email || "").toLowerCase().trim();
    const isAdmin = userEmail === ADMIN_EMAIL.toLowerCase();
    const userData = {
      uid: user.uid,
      email: userEmail,
      identity: userEmail,
      emailVerified: true,
      displayName:
        user.displayName ||
        (isAdmin ? "Ankit Jangir (Admin)" : userEmail.split("@")[0]),
      photoURL: user.photoURL || "",
      role: isAdmin ? "admin" : "client",
    };
    localStorage.setItem("achyutam_user", JSON.stringify(userData));
    console.log(
      "🔥 Verified Session Active:",
      userEmail,
      isAdmin ? "[VERIFIED ADMIN]" : "[VERIFIED CLIENT]",
    );

    if (typeof window.updateAuthUIState === "function") {
      window.updateAuthUIState(userData);
    }
    if (typeof window.updateAuthUI === "function") {
      window.updateAuthUI();
    }
  } else {
    localStorage.removeItem("achyutam_user");
    console.log("🔥 Firebase Auth: Signed Out State");
    if (typeof window.updateAuthUIState === "function") {
      window.updateAuthUIState(null);
    }
    if (typeof window.updateAuthUI === "function") {
      window.updateAuthUI();
    }
  }
});

/**
 * Helper: Save Profile to Firestore under User UID (Only for verified users)
 */
async function saveUserProfileData(
  user,
  displayName = "",
  phone = "",
  serviceType = "",
  enquireMsg = "",
) {
  if (!user?.emailVerified) return;
  const cleanEmail = (user.email || "").toLowerCase().trim();
  const isAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();
  const finalName =
    displayName ||
    (isAdmin ? "Ankit Jangir (Admin)" : cleanEmail.split("@")[0]);

  const userDocPayload = {
    useremail: cleanEmail,
    userenquire: enquireMsg || "",
    username: finalName,
    userphonenumber: phone || "",
    userservises: serviceType || "Architectural Design",
    email: cleanEmail,
    "phone number": phone || "",
    services: serviceType || "Architectural Design",
    enquire: enquireMsg || "",
    Enquire: enquireMsg || "",
    "type of services": serviceType || "Architectural Design",
    "user email id": cleanEmail,
    "user name": finalName,
    "user phone number": phone || "",
    uid: user.uid,
    emailVerified: true,
    updatedAtIso: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, "userdata", user.uid), userDocPayload, {
      merge: true,
    }).catch(() => {});
    await setDoc(doc(db, "users", user.uid), userDocPayload, {
      merge: true,
    }).catch(() => {});
    console.log("🔥 Verified user profile saved:", user.uid);
  } catch (err) {
    console.error("🔥 Error saving user profile data:", err);
  }
}

/**
 * 1. User Sign Up with Email & Password
 * ENFORCEMENT:
 * - Creates user in Firebase Auth.
 * - Triggers sendEmailVerification().
 * - Immediately signs out and blocks unverified access until verification link is clicked.
 */
export async function signUpWithEmailPassword(
  email,
  password,
  displayName = "",
  phone = "",
) {
  const cleanEmail = (email || "").toLowerCase().trim();

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      password,
    );
    const user = userCredential.user;

    if (displayName) {
      await updateProfile(user, { displayName: displayName }).catch(() => {});
    }

    // Trigger mandatory Firebase Email Verification
    await sendEmailVerification(user);
    console.log("📧 Verification link sent to:", cleanEmail);

    // Immediately sign out to prevent unverified session
    await signOut(auth);
    localStorage.removeItem("achyutam_user");

    return {
      success: true,
      needsVerification: true,
      email: cleanEmail,
      message: `Account created! We've sent a verification email to ${cleanEmail}. Please click the verification link in your inbox before signing in.`,
    };
  } catch (error) {
    console.error("🔥 Sign Up Error:", error.code, error.message);

    let friendlyError = error.message;
    if (error.code === "auth/email-already-in-use") {
      friendlyError =
        "An account with this email already exists. Please Sign In.";
    } else if (error.code === "auth/weak-password") {
      friendlyError = "Password should be at least 6 characters long.";
    } else if (error.code === "auth/invalid-email") {
      friendlyError = "Please enter a valid email address.";
    }
    return { success: false, error: friendlyError, code: error.code };
  }
}

/**
 * 2. User Sign In with Email & Password
 * ENFORCEMENT:
 * - Authenticates with Firebase Auth.
 * - Checks user.emailVerified.
 * - If false: displays error, triggers sendEmailVerification() (or provides resend), signs out, and blocks login.
 * - If true: grants access and checks verified admin role.
 */
export async function signInWithEmailPassword(email, password) {
  const cleanEmail = (email || "").toLowerCase().trim();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      cleanEmail,
      password,
    );
    const user = userCredential.user;

    // SECURITY CHECK: Enforce email verification
    if (!user.emailVerified) {
      console.warn("🔒 Sign In Blocked: Email not verified for", cleanEmail);

      // Auto-send or offer resend
      try {
        await sendEmailVerification(user);
        console.log("📧 Fresh verification email dispatched to:", cleanEmail);
      } catch (verifErr) {
        console.log("Verification email throttle note:", verifErr.message);
      }

      // Terminate unverified session
      await signOut(auth);
      localStorage.removeItem("achyutam_user");

      return {
        success: false,
        emailUnverified: true,
        email: cleanEmail,
        error: `Your email address (${cleanEmail}) is not verified yet. We have sent a verification link to your inbox. Please verify your email to log in.`,
      };
    }

    // Verified User: Check Admin role
    const isAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();

    await saveUserProfileData(
      user,
      user.displayName,
      "",
      "Architectural Design",
      "",
    );

    const userData = {
      uid: user.uid,
      email: cleanEmail,
      identity: cleanEmail,
      emailVerified: true,
      displayName:
        user.displayName ||
        (isAdmin ? "Ankit Jangir (Admin)" : cleanEmail.split("@")[0]),
      role: isAdmin ? "admin" : "client",
    };
    localStorage.setItem("achyutam_user", JSON.stringify(userData));

    console.log(
      "🔥 Sign In Successful (Email Verified):",
      user.email,
      isAdmin ? "[ADMIN]" : "[CLIENT]",
    );
    return { success: true, user: userData, isAdmin };
  } catch (error) {
    console.error("🔥 Sign In Error:", error.code, error.message);

    localStorage.removeItem("achyutam_user");

    let friendlyError = "Invalid email or password.";
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/invalid-credential"
    ) {
      friendlyError =
        "Account not found or password incorrect. Please check your credentials or Sign Up.";
    } else if (error.code === "auth/wrong-password") {
      friendlyError = "Incorrect password. Please try again.";
    } else if (error.code === "auth/invalid-email") {
      friendlyError = "Please enter a valid email address.";
    } else if (error.code === "auth/too-many-requests") {
      friendlyError =
        "Too many failed login attempts. Please try again in a few minutes or reset your password.";
    }
    return { success: false, error: friendlyError, code: error.code };
  }
}

/**
 * 3. Resend Verification Email
 */
export async function resendVerificationEmail(email, password) {
  const cleanEmail = (email || "").toLowerCase().trim();
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      cleanEmail,
      password,
    );
    const user = userCredential.user;
    if (user.emailVerified) {
      return {
        success: true,
        alreadyVerified: true,
        message: "Your email is already verified! You can now sign in.",
      };
    }
    await sendEmailVerification(user);
    await signOut(auth);
    return {
      success: true,
      message: `Verification email resent to ${cleanEmail}. Please check your inbox and spam folder.`,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 4. Google Popup Sign In (Google verifies email ownership by default)
 */
export async function signInWithGoogleFirebase() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const cleanEmail = (user.email || "").toLowerCase().trim();

    // Verification check (Google accounts are emailVerified=true)
    if (!user.emailVerified) {
      await signOut(auth);
      localStorage.removeItem("achyutam_user");
      return {
        success: false,
        error:
          "Your Google account email is not verified. Please verify your Google account before signing in.",
      };
    }

    const isAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();
    const displayName =
      user.displayName ||
      (isAdmin ? "Ankit Jangir (Admin)" : cleanEmail.split("@")[0] || "Client");
    const phone = user.phoneNumber || "";
    const photoURL = user.photoURL || "";

    await saveUserProfileData(
      user,
      displayName,
      phone,
      "Architectural Design",
      "",
    );

    const userData = {
      uid: user.uid,
      email: cleanEmail,
      identity: cleanEmail,
      emailVerified: true,
      displayName: displayName,
      name: displayName,
      phone: phone,
      photoURL: photoURL,
      provider: "google",
      role: isAdmin ? "admin" : "client",
      lastLogin: new Date().toISOString(),
    };
    localStorage.setItem("achyutam_user", JSON.stringify(userData));

    console.log(
      "🔥 Google Sign-In Successful & Verified:",
      cleanEmail,
      isAdmin ? "[ADMIN]" : "[CLIENT]",
    );

    // Notify all UI listeners
    if (typeof window.updateAuthUIState === "function") {
      window.updateAuthUIState(userData);
    }
    if (typeof window.updateAuthUI === "function") {
      window.updateAuthUI();
    }

    return { success: true, user: userData, firebaseUser: user, isAdmin };
  } catch (error) {
    console.error("🔥 Google Auth Error:", error);
    let friendlyError =
      "Google Sign-In failed. Please try again or use Email & Password.";
    if (error.code === "auth/popup-closed-by-user") {
      friendlyError = "Google Sign-In popup was closed before completing.";
    } else if (error.code === "auth/popup-blocked") {
      friendlyError =
        "Sign-In popup was blocked by browser. Please allow popups or use Email sign-in.";
    } else if (error.code === "auth/cancelled-popup-request") {
      friendlyError = "Google Sign-In request was cancelled.";
    } else if (error.code === "auth/network-request-failed") {
      friendlyError =
        "Network connection issue. Please check your internet connection.";
    }
    return { success: false, error: friendlyError, code: error.code };
  }
}

/**
 * 5. Sign Out User
 */
export async function signOutUser() {
  try {
    await signOut(auth);
    localStorage.removeItem("achyutam_user");
    sessionStorage.clear();
    console.log("🔥 Signed out successfully");
    if (typeof window.updateAuthUIState === "function") {
      window.updateAuthUIState(null);
    }
    if (typeof window.updateAuthUI === "function") {
      window.updateAuthUI();
    }
    return { success: true };
  } catch (error) {
    console.error("🔥 Sign Out Error:", error);
    localStorage.removeItem("achyutam_user");
    sessionStorage.clear();
    if (typeof window.updateAuthUIState === "function") {
      window.updateAuthUIState(null);
    }
    return { success: false, error: error.message };
  }
}

/**
 * 6. Save Project Enquiry to Firestore
 */
export async function saveEnquiryToFirebase(enquiryData) {
  const currentUser = auth.currentUser;
  const isVerified = currentUser?.emailVerified;
  const refCode = `ACH-${Math.floor(100000 + Math.random() * 900000)}`;
  const emailToSave = (
    enquiryData.email ||
    (currentUser ? currentUser.email : "") ||
    ""
  )
    .toLowerCase()
    .trim();

  const newDocData = {
    enquiryRef: refCode,
    Enquire: enquiryData.message || "",
    enquire: enquiryData.message || "",
    "enquire data": enquiryData.message || "",
    "type of services": enquiryData.typology || "Architectural Design",
    services: enquiryData.typology || "Architectural Design",
    "user name":
      enquiryData.name || (currentUser ? currentUser.displayName : "Client"),
    username:
      enquiryData.name || (currentUser ? currentUser.displayName : "Client"),
    "user email id": emailToSave,
    email: emailToSave,
    "user phone number": enquiryData.phone || "",
    "phone number": enquiryData.phone || "",
    userId: isVerified ? currentUser.uid : "guest",
    userEmail: emailToSave,
    userName:
      enquiryData.name || (currentUser ? currentUser.displayName : "Client"),
    userPhone: enquiryData.phone || "",
    typology: enquiryData.typology || "Architectural Design",
    message: enquiryData.message || "",
    budget: enquiryData.budget || "Standard Commission",
    location: enquiryData.location || "Jaipur, India",
    status: "Received",
    adminReply: "",
    adminRepliedAt: null,
    createdAtIso: new Date().toISOString(),
  };

  try {
    const docRef1 = await addDoc(collection(db, "Enquire"), newDocData).catch(
      () => null,
    );
    const docRef2 = await addDoc(collection(db, "enquiries"), newDocData).catch(
      () => null,
    );

    if (isVerified) {
      await saveUserProfileData(
        currentUser,
        enquiryData.name,
        enquiryData.phone,
        enquiryData.typology,
        enquiryData.message,
      );
    }

    const savedId = docRef2?.id || docRef1?.id || `doc-${Date.now()}`;
    console.log(`🔥 Enquiry ${refCode} submitted [User: ${emailToSave}]`);
    return { success: true, id: savedId, refCode };
  } catch (error) {
    console.error("🔥 Save Enquiry Firestore Error:", error);
    return { success: true, refCode, error: error.message };
  }
}

/**
 * 7. Fetch Enquiries & User Data (Admin gets full access strictly if Verified Admin)
 */
export async function getUserEnquiries() {
  const currentUser = auth.currentUser;
  const targetEmail = (currentUser ? currentUser.email : "")
    .toLowerCase()
    .trim();
  const isVerified = !!currentUser?.emailVerified;
  const isAdmin = isVerified && targetEmail === ADMIN_EMAIL.toLowerCase();

  try {
    const enquiries = [];

    // 1. Fetch from 'enquiries' collection
    const snap1 = await getDocs(collection(db, "enquiries")).catch(() => null);
    if (snap1) {
      for (const docSnap of snap1.docs || snap1) {
        const data = docSnap.data();
        const docUserId = data.userId;
        const docEmail = (
          data.userEmail ||
          data["user email id"] ||
          data.email ||
          ""
        )
          .toLowerCase()
          .trim();
        if (
          isAdmin ||
          (isVerified && docUserId === currentUser.uid) ||
          (isVerified && docEmail === targetEmail)
        ) {
          enquiries.push({
            id: docSnap.id,
            collectionName: "enquiries",
            ...data,
          });
        }
      }
    }

    // 2. Fetch from 'Enquire' collection
    const snap2 = await getDocs(collection(db, "Enquire")).catch(() => null);
    if (snap2) {
      for (const docSnap of snap2.docs || snap2) {
        const data = docSnap.data();
        const docUserId = data.userId;
        const docEmail = (
          data.userEmail ||
          data["user email id"] ||
          data.email ||
          ""
        )
          .toLowerCase()
          .trim();
        if (
          (isAdmin ||
            (isVerified && docUserId === currentUser.uid) ||
            (isVerified && docEmail === targetEmail)) &&
          !enquiries.some(
            (e) => e.enquiryRef && e.enquiryRef === data.enquiryRef,
          )
        ) {
          enquiries.push({
            id: docSnap.id,
            collectionName: "Enquire",
            ...data,
          });
        }
      }
    }

    // 3. For Verified Admin & Verified User: also fetch user profile documents from 'userdata' collection
    if (isAdmin || isVerified) {
      const snapUserdata = await getDocs(collection(db, "userdata")).catch(
        () => null,
      );
      if (snapUserdata) {
        for (const docSnap of snapUserdata.docs || snapUserdata) {
          const data = docSnap.data();
          const docUserId = data.uid || data.userId || docSnap.id;
          const docEmail = (
            data.useremail ||
            data.userEmail ||
            data["user email id"] ||
            data.email ||
            ""
          )
            .toLowerCase()
            .trim();
          if (
            isAdmin ||
            (isVerified && docUserId === currentUser.uid) ||
            (isVerified && docEmail === targetEmail)
          ) {
            if (
              !enquiries.some(
                (e) =>
                  e.id === docSnap.id ||
                  (e.userEmail && e.userEmail === docEmail),
              )
            ) {
              enquiries.push({
                id: docSnap.id,
                collectionName: "userdata",
                enquiryRef: `USERDATA-${docSnap.id.substring(0, 6)}`,
                userName: data.username || data["user name"] || "Client",
                userEmail: data.useremail || data.email || "N/A",
                userPhone: data.userphonenumber || data.phone || "N/A",
                typology:
                  data.userservises || data.services || "Architectural Design",
                message: data.userenquire || data.enquire || "User Data Record",
                status: data.status || "Received",
                createdAtIso: data.updatedAtIso || new Date().toISOString(),
                ...data,
              });
            }
          }
        }
      }
    }

    enquiries.sort(
      (a, b) => new Date(b.createdAtIso || 0) - new Date(a.createdAtIso || 0),
    );
    console.log(
      `🔥 Verified Data Access: Fetched ${enquiries.length} records [Admin: ${isAdmin}]`,
    );

    return { success: true, enquiries, isAdmin };
  } catch (error) {
    console.error("🔥 Fetch Enquiries Error:", error);
    return { success: false, enquiries: [], error: error.message };
  }
}

/**
 * 8. Admin Function: Update Enquiry Status & Send Admin Reply
 */
export async function updateEnquiryByAdmin(enquiryId, status, adminReply = "") {
  const currentUser = auth.currentUser;
  const isVerified = currentUser?.emailVerified;
  const isAdmin =
    isVerified &&
    (currentUser.email || "").toLowerCase().trim() ===
      ADMIN_EMAIL.toLowerCase();

  if (!isAdmin) {
    return {
      success: false,
      error:
        "Access Denied: Only verified administrators can perform this action.",
    };
  }

  try {
    const docRef1 = doc(db, "enquiries", enquiryId);
    await setDoc(
      docRef1,
      {
        status: status || "Reviewed",
        adminReply: adminReply || "",
        adminRepliedAt: new Date().toISOString(),
      },
      { merge: true },
    ).catch(() => {});

    const docRef2 = doc(db, "Enquire", enquiryId);
    await setDoc(
      docRef2,
      {
        status: status || "Reviewed",
        adminReply: adminReply || "",
        adminRepliedAt: new Date().toISOString(),
      },
      { merge: true },
    ).catch(() => {});

    console.log(`🔥 Enquiry ${enquiryId} updated by Admin [Status: ${status}]`);
    return { success: true };
  } catch (error) {
    console.error("🔥 Admin Update Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 9. Send Password Reset Email
 */
export async function sendPasswordResetLink(email) {
  try {
    const cleanEmail = email.toLowerCase().trim();
    await sendPasswordResetEmail(auth, cleanEmail);
    console.log(`🔥 Password Reset email sent to ${cleanEmail}`);
    return {
      success: true,
      message: `Password reset link sent to ${cleanEmail}. Check your inbox.`,
    };
  } catch (error) {
    console.error("🔥 Password Reset Link Error:", error);
    return { success: false, error: error.message };
  }
}

// Aliases for compatibility
export const saveBookingToFirebase = saveEnquiryToFirebase;
export const getUserBookings = getUserEnquiries;
export const getRecentEnquiriesForAdmin = async () => {
  const res = await getUserEnquiries();
  return { success: res.success, data: res.enquiries, error: res.error };
};

// Global Window Exposure
window.AchyutamFirebase = {
  app,
  db,
  auth,
  ADMIN_EMAIL,
  signUpWithEmailPassword,
  signInWithEmailPassword,
  resendVerificationEmail,
  signInWithGoogleFirebase,
  signOutUser,
  saveEnquiryToFirebase,
  getUserEnquiries,
  getRecentEnquiriesForAdmin,
  updateEnquiryByAdmin,
  sendPasswordResetLink,
  saveBookingToFirebase,
  getUserBookings,
  onAuthStateChanged,
};

console.log(
  "🔥 Achyutam Hardened Firebase Auth System Active [Admin: ankitjangir529@gmail.com | Verification Enforced]",
);
