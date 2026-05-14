"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

const SubscriptionCancelPage = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to profile with cancel flag to open subscription panel
        router.replace("/profile?subscription=cancel");
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <Spin size="large" />
            <p className="text-[16px] text-gray-600">Redirecting you back...</p>
        </div>
    );
};

export default SubscriptionCancelPage;