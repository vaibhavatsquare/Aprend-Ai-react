import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

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

/* FCM */
const getFCMToken = async (registration: any): Promise<string> => {
    if (typeof window !== "undefined" && "Notification" in window) {
        try {
            let permission = Notification.permission;

            while (permission !== "granted") {
                permission = await Notification.requestPermission();

                if (permission === "denied") {
                    throw new Error("Notification permission denied by the user");
                }
            }

            const currentToken = await getToken(messaging, {
                vapidKey: process.env.FB_VAPID_KEY,
                serviceWorkerRegistration: registration,
            });

            if (currentToken) {
                return currentToken;
            } else {
                throw new Error("No registration token available.");
            }
        } catch (error) {
            console.error("An error occurred while retrieving token:", error);
            throw error;
        }
    } else {
        throw new Error("Notifications are not supported in this environment.");
    }
};

export { auth, app, db, getFCMToken, messaging };
