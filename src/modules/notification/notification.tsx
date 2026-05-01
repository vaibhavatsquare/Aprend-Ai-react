"use client";

import React, { useState } from "react";
import { useTranslation } from "@/src/libs/i18n";
import {
    getNotifications,
    NotificationItem,
} from "@/src/services/api/notification.api";
import { useInitialFetch } from "@/src/libs/helpersWithUseClient";

const PAGE_LIMIT = 10;

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // FETCH
    const fetchNotifications = async (currentSkip: number, isFirst = false) => {
        try {
            setLoading(true);

            const res = await getNotifications({
                skip: currentSkip,
                take: PAGE_LIMIT,
                orderBy: "createdAt|desc",
            });

            const data = res?.list || [];

            setNotifications((prev) =>
                isFirst ? data : [...prev, ...data]
            );

            setHasMore(res?.hasMany ?? false);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    // INITIAL LOAD
    useInitialFetch(() => fetchNotifications(0, true));

    // LOAD MORE
    const loadMore = () => {
        if (!hasMore || loading) return;

        const newSkip = skip + PAGE_LIMIT;
        fetchNotifications(newSkip);
        setSkip(newSkip);
    };

    // 🔥 GROUPING (FINAL)
    const grouped: Record<string, NotificationItem[]> = {};

    notifications.forEach((item) => {
        const date = new Date(item.createdAt);
        const now = new Date();

        const todayStr = now.toDateString();

        const y = new Date();
        y.setDate(y.getDate() - 1);
        const yesterdayStr = y.toDateString();

        let key = "";

        if (date.toDateString() === todayStr) {
            key = "Today";
        } else if (date.toDateString() === yesterdayStr) {
            key = "Yesterday";
        } else {
            key = date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        }

        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
    });

    // 🔥 SORT ORDER (Today → Yesterday → Dates desc)
    const sortedGroups = Object.entries(grouped).sort((a, b) => {
        const getDate = (key: string) => {
            if (key === "Today") return new Date();
            if (key === "Yesterday") {
                const d = new Date();
                d.setDate(d.getDate() - 1);
                return d;
            }
            return new Date(key);
        };

        return getDate(b[0]).getTime() - getDate(a[0]).getTime();
    });

    return (
        <div className="absolute top-[44px] right-0 w-[530px] bg-white rounded-xl p-6 z-50 border border-gray-100 shadow-[0_25px_80px_rgba(0,0,0,0.15)]">

            <h2 className="text-xl font-semibold text-center mb-6">
                {t("notifications.title")}
            </h2>

            <div
                className="max-h-[400px] overflow-y-auto pr-2 scrollbar-mini"
                onScroll={(e) => {
                    const target = e.currentTarget;

                    if (
                        target.scrollHeight - target.scrollTop <=
                        target.clientHeight + 10
                    ) {
                        loadMore();
                    }
                }}
            >

                {/* SHIMMER */}
                {initialLoading && <NotificationShimmer />}

                {/* EMPTY */}
                {!initialLoading && notifications.length === 0 && (
                    <div className="text-center text-gray-500 py-10">
                        No notifications yet
                    </div>
                )}

                {/* 🔥 DYNAMIC GROUPS */}
                {sortedGroups.map(([section, items]) => (
                    <div key={section} className="mb-4">

                        <h3 className="font-medium text-[18px] text-secondary mb-3">
                            {section === "Today"
                                ? t("notifications.today")
                                : section === "Yesterday"
                                    ? t("notifications.yesterday")
                                    : section}
                        </h3>

                        <div className="space-y-2">
                            {items.map((item) => (
                                <Card key={item.id} item={item} />
                            ))}
                        </div>

                    </div>
                ))}

                {/* PAGINATION SHIMMER */}
                {loading && !initialLoading && <NotificationShimmer />}

            </div>
        </div>
    );
};

// CARD (unchanged UI)
const Card = ({ item }: { item: NotificationItem }) => {
    const timeAgo = () => {
        const date = new Date(item.createdAt);
        const now = new Date();

        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        const minutes = Math.floor(diff / 60);
        const hours = Math.floor(diff / 3600);
        const days = Math.floor(diff / 86400);

        if (minutes < 1) return "1 min ago";
        if (minutes < 60) return `${minutes} min ago`;

        if (hours < 24) return `${hours}h ago`;

        if (days < 7) return `${days}d ago`;

        // fallback: full date
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className="bg-[#F5F5F5] rounded-xl p-3 flex flex-col gap-1">
            <h4 className="font-medium text-[18px] text-[#121212]">
                {item.title}
            </h4>

            <div className="flex justify-between items-start gap-4">
                <p className="text-[14px] text-secondary">
                    {item.body}
                </p>

                <span className="text-xs text-secondary whitespace-nowrap">
                    {timeAgo()}
                </span>
            </div>
        </div>
    );
};

// SHIMMER (unchanged)
const NotificationShimmer = () => {
    return (
        <div className="space-y-3 animate-pulse">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg" />
            ))}
        </div>
    );
};

export default NotificationDropdown;