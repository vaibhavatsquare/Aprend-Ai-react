"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spin } from "antd";
import { getUserProfile } from "@/src/services/api/user.api";

const SubscriptionSuccessPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const sessionId = searchParams.get("session_id");

        const handleSuccess = async () => {
            try {
                // Refresh user profile so isPremium and subscription data are up to date
                const res = await getUserProfile();
                localStorage.setItem("user", JSON.stringify(res));
            } catch {
                // Even if profile fetch fails, still redirect
            } finally {
                // Redirect to profile with success flag to open subscription panel
                // router.replace("/profile?subscription=success");
                router.replace("/home");
            }
        };

        handleSuccess();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <Spin size="large" />
            <p className="text-[16px] text-gray-600">Processing your subscription...</p>
        </div>
    );
};

export default SubscriptionSuccessPage;