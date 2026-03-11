import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, Messaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    projectId: process.env.FB_PROJECT_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
    appId: process.env.FB_APP_ID

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let messaging: any = null;
if (typeof window !== "undefined") {
    if ("Notification" in window && "serviceWorker" in navigator) {
        try {
            messaging = getMessaging(app);
        } catch (error) {
            console.error("Error initializing Firebase Messaging:", error);
        }
    } else {
        console.warn(
            "Notifications or Service Workers are not supported in this browser."
        );
    }
}

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    try {
        messaging = getMessaging(app);
    } catch (error) {
        console.error("Firebase messaging init error:", error);
    }
}

/* FCM */
const getFCMToken = async (
    registration: ServiceWorkerRegistration
): Promise<string | null> => {
    if (!messaging) return null;

    try {
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            console.warn("Notification permission not granted.");
            return null;
        }

        const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FB_VAPID_KEY,
            serviceWorkerRegistration: registration,
        });

        return token || null;
    } catch (error) {
        console.error("Error retrieving FCM token:", error);
        return null;
    }
};
export { auth, app, db, getFCMToken, messaging };