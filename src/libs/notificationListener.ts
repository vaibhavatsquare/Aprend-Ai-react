import { onMessage } from "firebase/messaging";
import { messaging } from "@/src/configs/firebase.config";
import { notification } from "antd";
import { getFocusMode } from "@/src/libs/helpers";

export const listenForNotifications = () => {

    if (!messaging) return;

    onMessage(messaging, (payload) => {

        console.log("Foreground notification:", payload);

        const focusMode = getFocusMode();

        if (!focusMode) return;

        if (!payload?.notification) return;

        notification.open({
            title: payload?.notification?.title || "Notification",
            description: payload?.notification?.body || "",
            placement: "bottomRight",
        });

    });

};