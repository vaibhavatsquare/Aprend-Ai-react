"use client";
import { useEffect, useState } from "react";
import { useRedirect } from "@/src/hooks/router.hooks";
import { getSubscription, cancelSubscription } from "@/src/services/api/subscription.api";
import { Spin, message } from "antd";
import { GoArrowLeft } from "react-icons/go";

const ManageSubscriptionPage = () => {
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    // const redirect = useRedirect();

    const loadSubscription = async () => {
        try {
            setLoading(true);
            const res = await getSubscription();
            setSubscription(res);
        } catch {
            setSubscription(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubscription();
    }, []);
    
    useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
        if (e.persisted) {
            setLoading(false);
        }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
}, []);

    const handleCancel = async () => {
        if (cancelling) return;
        setCancelling(true);
        try {
            await cancelSubscription();
            message.success("Subscription cancelled successfully.");
            await loadSubscription();
        } catch {
            message.error("Failed to cancel subscription. Please try again.");
        } finally {
            setCancelling(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const planLabel = subscription?.planType
        ? `Your ${subscription.planType.charAt(0).toUpperCase() + subscription.planType.slice(1).toLowerCase()} Plan`
        : "Your Plan";

    const isActive = subscription?.subscriptionStatus === "ACTIVE";

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <button onClick={() => useRedirect("/profile")} className="p-1">
                    <GoArrowLeft className="text-xl text-gray-900" />
                </button>
                <h1 className="text-[18px] font-semibold text-gray-900">
                    Manage Subscription
                </h1>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Spin size="large" />
                </div>
            ) : !subscription || !isActive ? (
                /* No active subscription */
                <div className="flex-1 flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-3xl">📋</span>
                    </div>
                    <div className="text-center">
                        <h2 className="text-[20px] font-bold text-gray-900 mb-2">
                            No Active Subscription
                        </h2>
                        <p className="text-secondary text-[14px]">
                            {subscription?.subscriptionStatus === "CANCELLED"
                                ? "Your subscription has been cancelled."
                                : "You are currently on the free plan."}
                        </p>
                    </div>
                    <button
                        onClick={() => useRedirect("/profile")}
                        className="w-full max-w-sm h-[52px] bg-gray-900 text-white rounded-[14px] text-[16px] font-semibold hover:opacity-90 transition-opacity"
                    >
                        Back to Profile
                    </button>
                </div>
            ) : (
                /* Active subscription */
                <div className="flex-1 flex flex-col items-center justify-center gap-8">
                    {/* Plan Overview Card */}
                    <div
                        className="w-full max-w-sm bg-white rounded-[20px] p-6 flex flex-col gap-4"
                        style={{ boxShadow: "0px 2px 12px rgba(0,0,0,0.08)" }}
                    >
                        <p className="text-[14px] text-secondary">
                            Check Your Plan Overview :
                        </p>

                        <h2 className="text-[24px] font-bold text-gray-900">
                            {planLabel}
                        </h2>

                        {/* Timeline */}
                        <div className="flex flex-col gap-0">
                            {/* Active From */}
                            <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="w-px h-8 border-l-2 border-dashed border-gray-300 mt-1" />
                                </div>
                                <p className="text-[15px] text-gray-700 mt-0.5">
                                    Active From{" "}
                                    <span className="font-bold">
                                        {subscription?.purchasedAt ? formatDate(subscription.purchasedAt) : "—"}
                                    </span>
                                </p>
                            </div>

                            {/* Expire On */}
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="text-[15px] text-gray-700 mt-0.5">
                                    Expire on{" "}
                                    <span className="font-bold">
                                        {subscription?.endsAt ? formatDate(subscription.endsAt) : "—"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Status */}
                        <p className="text-[14px] text-gray-600 mt-2">
                            <span className="font-semibold underline">Status:</span>{" "}
                            You can explore all features and content without limits.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="w-full max-w-sm flex flex-col gap-3">
                        <button
                            onClick={() => useRedirect("/home")}
                            className="w-full h-[52px] bg-gray-900 text-white rounded-[14px] text-[16px] font-semibold hover:opacity-90 transition-opacity"
                        >
                            Back to Home
                        </button>

                        <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="w-full text-center text-[14px] text-secondary hover:text-red-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {cancelling && <Spin size="small" />}
                            {cancelling ? "Cancelling..." : "Cancel or change subscription"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSubscriptionPage;