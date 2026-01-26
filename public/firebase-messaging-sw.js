importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCfZ6L2g_hlxmzM6qFwDnkniXynsZHxBr0",
    authDomain: "aprendeai-3d337.firebaseapp.com",
    projectId: "aprendeai-3d337",
    storageBucket: "aprendeai-3d337.firebasestorage.appp",
    messagingSenderId: "441486356360",
    appId: "1:441486356360:web:e6b42153ca32fb233b143d",
});

const messaging = firebase.messaging();

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










