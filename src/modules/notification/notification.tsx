"use client";

import React, { useEffect, useState } from "react";
import { t } from "@/src/libs/i18n";
import { getNotifications, NotificationItem } from "@/src/services/api/notification.api";
import { useInitialFetch } from "@/src/libs/helpersWithUseClient";

const PAGE_LIMIT = 10;

const NotificationDropdown = () => {

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);


    // FETCH NOTIFICATIONS
    const fetchNotifications = async (
        currentSkip: number,
        isFirst = false
    ) => {
        try {
            setLoading(true);

            const res = await getNotifications({
                skip: currentSkip,
                take: PAGE_LIMIT,
                orderBy: "createdAt|desc",
            });

            const data = res?.list

            if (isFirst) {
                setNotifications(data);
            } else {
                setNotifications((prev) => [...prev, ...data]);
            }

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
        setSkip(newSkip);

        fetchNotifications(newSkip);
    };

    // GROUPING
    const today: NotificationItem[] = [];
    const yesterday: NotificationItem[] = [];

    notifications.forEach((item) => {

        const date = new Date(item.createdAt);
        const now = new Date();

        const isToday =
            date.toDateString() === now.toDateString();

        const y = new Date();
        y.setDate(y.getDate() - 1);

        const isYesterday =
            date.toDateString() === y.toDateString();

        if (isToday) today.push(item);
        else if (isYesterday) yesterday.push(item);

    });

    return (
        <div
            className="absolute top-[44px] right-0 w-[530px]
      bg-white rounded-xl p-6 z-50
      border border-gray-100
      shadow-[0_25px_80px_rgba(0,0,0,0.15)]"
        >

            <h2 className="text-xl font-semibold text-center mb-6">
                {t("notifications.title")}
            </h2>

            <div
                className="max-h-[400px] overflow-y-auto pr-2"
                onScroll={(e) => {

                    const target = e.currentTarget;

                    if (
                        target.scrollHeight - target.scrollTop ===
                        target.clientHeight
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

                {/* TODAY */}
                {today.length > 0 && (
                    <>
                        <h3 className="font-medium text-[18px] text-secondary mb-3">
                            {t("notifications.today")}
                        </h3>

                        <div className="space-y-2 mb-4">
                            {today.map((item) => (
                                <Card key={item.id} item={item} />
                            ))}
                        </div>
                    </>
                )}

                {/* YESTERDAY */}
                {yesterday.length > 0 && (
                    <>
                        <h3 className="font-medium text-[18px] text-secondary mb-3">
                            {t("notifications.yesterday")}
                        </h3>

                        <div className="space-y-2">
                            {yesterday.map((item) => (
                                <Card key={item.id} item={item} />
                            ))}
                        </div>
                    </>
                )}

                {/* PAGINATION SHIMMER */}
                {loading && !initialLoading && <NotificationShimmer />}

            </div>

        </div>
    );
};

const Card = ({ item }: { item: NotificationItem }) => {

    const timeAgo = () => {

        const date = new Date(item.createdAt);
        const now = new Date();

        const diff = Math.floor(
            (now.getTime() - date.getTime()) / 1000
        );

        const hours = Math.floor(diff / 3600);

        if (hours < 1) return "Just now";
        if (hours < 24) return `${hours}h ago`;

        const days = Math.floor(hours / 24);

        return `${days}d ago`;
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

const NotificationShimmer = () => {

    return (
        <div className="space-y-3 animate-pulse">

            {[...Array(3)].map((_, i) => (

                <div
                    key={i}
                    className="h-16 bg-gray-200 rounded-lg"
                />

            ))}

        </div>
    );
};

export default NotificationDropdown;