import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  getIdToken,
} from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
import { auth } from "../../configs/firebase.config";
import { setCookie } from "@/src/services/coockies/coockie.service";
import { logoutUser } from "@/src/services/api/auth.api";
import { OAuthProvider } from "firebase/auth"; 

const googleProvider = new GoogleAuthProvider();

/* EMAIL + PASSWORD LOGIN */
export const signInWithFirebase = async (
  email: string,
  password: string
): Promise<{ user: User; idToken: string }> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;
  const idToken = await getIdToken(user, true);

  return { user, idToken };
};

/* SIGN UP */
export const signUpWithFirebase = async (
  email: string,
  password: string,
  displayName?: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  if (displayName && auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName });
  }

  return userCredential.user;
};

/* GOOGLE SIGN IN */
export const signInWithGoogle = async (): Promise<{
  user: User;
  idToken: string;
} | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const idToken = await getIdToken(user, true);

    return { user, idToken };
  } catch (error: any) {
    // ✅ USER closed popup or multiple popup triggered
    if (error?.code === "auth/cancelled-popup-request") {
      return null; // silently ignore
    }

    // ✅ Popup blocked by browser
    if (error?.code === "auth/popup-blocked") {
      throw new Error("Popup was blocked. Please allow popups and try again.");
    }

    // ❌ Real error
    throw error;
  }
};

/* LOGOUT */
export const signOutUser = async (): Promise<void> => {
  const sessionId = localStorage.getItem("sessionId");

  // ✅ Try backend logout if sessionId exists, but don't block signout if it doesn't
  if (sessionId) {
    try {
      await logoutUser();
    } catch {
      console.warn("Backend logout failed, continuing...");
    }
  }

  // ✅ Always clear everything regardless of sessionId
  await signOut(auth);
  localStorage.clear();
  document.cookie = "idToken=; max-age=0";
  setCookie("idToken", "");
};

/* FORGOT PASSWORD (EMAIL LINK) */
export const forgotPasswordWithFirebase = async (
  email: string
): Promise<void> => {
  await sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}/login`,
  });
};

/* AUTH STATE LISTENER */
export const onAuthStateChangedListener = (
  callback: (user: User | null) => void
) => onAuthStateChanged(auth, callback);

/* CURRENT USER */
export const getCurrentUser = (): User | null => auth.currentUser;

export const signInWithApple = async (): Promise<{
  user: User;
  idToken: string;
} | null> => {
  try {
    const provider = new OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");

    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idToken = await getIdToken(user, true);

    return { user, idToken };
  } catch (error: any) {
    if (error?.code === "auth/cancelled-popup-request") {
      return null; // user closed popup
    }
    if (error?.code === "auth/popup-blocked") {
      throw new Error("Popup was blocked. Please allow popups and try again.");
    }
    throw error;
  }
};
