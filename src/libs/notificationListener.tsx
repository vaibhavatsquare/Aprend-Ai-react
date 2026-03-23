import { onMessage } from "firebase/messaging";
import { messaging } from "@/src/configs/firebase.config";
import { notification } from "antd";
import { getFocusMode } from "@/src/libs/helpers";
// import { useRouter } from "next/navigation"; navigation 

export const listenForNotifications = () => {

    if (!messaging) return;

    onMessage(messaging, (payload) => {

        console.log("Foreground notification:", payload);

        const focusMode = getFocusMode();

        if (!focusMode) return;

        if (!payload?.notification) return;

        const title = payload.notification.title || "Notification";
        const body = payload.notification.body || "";

        notification.open({
            placement: "bottomRight",
            duration: 5,
            className: "custom-notification",

            title: (
                <div className="flex items-start gap-3">

                    {/* CONTENT */}
                    <div className="flex-1">

                        <h4 className="font-semibold text-[15px] text-[#121212] leading-snug">
                            {title}
                        </h4>

                        <p className="text-sm text-gray-500 mt-1 leading-snug">
                            {body}
                        </p>

                        {/* CTA */}
                        {/* <button
                            className="mt-2 text-blue-600 text-sm font-medium hover:underline"
                            onClick={() => {
                                console.log("Notification clicked");
                                // router.push("/task")
                            }}
                        >
                            View
                        </button> */}

                    </div>
                </div>
            ),

            onClick: () => {
                console.log("Notification clicked");
            },
        });

    });

};