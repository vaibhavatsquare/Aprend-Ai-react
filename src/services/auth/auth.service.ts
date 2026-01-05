import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../configs/firebase.config";

export const signInWithFirebase = async (
    email: string,
    password: string
): Promise<any> => {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );
    const idToken = await userCredential.user.getIdToken();
    return { userCredential, idToken };
};

export const forgotPasswordWithFirebase = async (
    email: string
): Promise<any> => {
    await sendPasswordResetEmail(auth, email);
};

export const signOutUser = async () => {
    await signOut(auth);
};