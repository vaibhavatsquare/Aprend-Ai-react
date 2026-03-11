importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    projectId: process.env.FB_PROJECT_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
    appId: process.env.FB_APP_ID

};

const app = initializeApp(firebaseConfig);
const messaging = app.messaging();

// ✅ Manually handle background notifications
messaging.onBackgroundMessage((payload) => {
    console.log("Received background message:", payload);

    if (!payload.notification) {
        console.warn("No notification payload found, skipping.");
        return;
    }

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
        data: { url: payload.fcmOptions?.link || "/" },
    };

    // ✅ Prevent Duplicate Notifications
    self.registration.getNotifications().then((existingNotifications) => {
        const alreadyExists = existingNotifications.some(
            (n) => n.title === notificationTitle && n.body === notificationOptions.body
        );
        if (!alreadyExists) {
            console.log("Showing notification:", notificationTitle);
            self.registration.showNotification(notificationTitle, notificationOptions);
        } else {
            console.log("Duplicate notification prevented:", notificationTitle);
        }
    });
});

self.addEventListener("notificationclick", (event) => {

    event.notification.close();

    const url = event.notification?.data?.url || "/";

    event.waitUntil(
        clients.openWindow(url)
    );

});









