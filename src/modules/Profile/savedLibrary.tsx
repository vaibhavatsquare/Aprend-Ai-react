"use client";

import React, { useEffect, useRef, useState } from "react";
import SavedCard from "../../components/Cards/savedCards";
import EmptyState from "@/src/components/Cards/emptyState";
import { GoArrowLeft } from "react-icons/go";
import { t } from "@/src/libs/i18n";

type LibraryItem = {
    id: string;
    title: string;
    createdAt: string;
};

const PAGE_LIMIT = 10;

type SavedLibraryProps = {
    showBack?: boolean; // default false
    onBack?: () => void;
};

const SavedLibrary = ({ showBack = false, onBack }: SavedLibraryProps) => {
    const [library, setLibrary] = useState<LibraryItem[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    const observerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        fetchLibrary(page);
    }, [page]);

    const fetchLibrary = async (pageNumber: number) => {
        try {
            setLoading(true);

            await new Promise((res) => setTimeout(res, 1000));

            const dummy: LibraryItem[] = Array.from({ length: 10 }).map(
                (_, i) => ({
                    id: `${pageNumber}-${i}`,
                    title:
                        i === 2
                            ? "Computer Science / Coding"
                            : i % 2 === 0
                                ? t('questions.history')
                                : t('questions.science'),
                    createdAt: "July 07, 2025 10:28 am",
                })
            );

            setLibrary((prev) => [...prev, ...dummy]);
            setHasMore(pageNumber < 3);
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    // Infinite Scroll (PAGE SCROLL, not container scroll)
    useEffect(() => {
        if (!observerRef.current || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    setPage((prev) => {
                        if (loading) return prev;
                        return prev + 1;
                    });
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [loading, hasMore]);


    return (
        <div className="px-4">
            <div
                className="h-[calc(100vh-100px)] mt-1 mb-4 rounded-[32px] col-span-2 flex flex-col gap-4 overflow-hidden"
                style={{
                    boxShadow: "0px 0px 4px 0px #00000040",
                }}
            >

                {/* 🔹 FIXED HEADER */}
                <div className="py-3 px-6 flex items-center relative">

                    {showBack && (
                        <GoArrowLeft
                            className="text-xl absolute left-8 cursor-pointer"
                            onClick={onBack}
                        />
                    )}

                    <h1 className="text-[28px] font-semibold text-primaryText w-full text-center">
                        {!initialLoading && library.length === 0 ? "" : t('library.savedLibrary')}
                    </h1>
                </div>

                {/* 🔹 SCROLLABLE SECTION ONLY */}
                <div className="flex-1 overflow-y-auto px-6 scrollbar">
                    {initialLoading ? (
                        <div className="w-full">
                            <CardsShimmer count={5} />
                        </div>
                    ) : library.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center mt-30">
                            <EmptyState type="library" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 py-3 w-full">
                            {library.map((item) => (
                                <SavedCard
                                    key={item.id}
                                    type="library"
                                    item={item}
                                    onRename={(id, title) =>
                                        setLibrary((prev) =>
                                            prev.map((n) =>
                                                n.id === id ? { ...n, title } : n
                                            )
                                        )
                                    }
                                    onDelete={(id) =>
                                        setLibrary((prev) =>
                                            prev.filter((n) => n.id !== id)
                                        )
                                    }
                                    onRemove={(id) =>
                                        setLibrary((prev) =>
                                            prev.filter((n) => n.id !== id)
                                        )
                                    }
                                />
                            ))}

                            {/* Pagination shimmer */}
                            {loading && !initialLoading && (
                                <CardsShimmer count={2} />
                            )}

                            {hasMore && <div ref={observerRef} className="h-10" />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CardsShimmer = ({ count = 3 }: { count?: number }) => {
    return (
        <div className="space-y-4 animate-pulse">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between px-6 h-[76px] rounded-[20px] bg-gray-100"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-[60px] h-[60px] rounded-full bg-gray-200" />
                        <div className="space-y-2">
                            <div className="w-[150px] h-4 bg-gray-200 rounded" />
                            <div className="w-[120px] h-3 bg-gray-200 rounded" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-[70px] h-[30px] bg-gray-200 rounded" />
                        <div className="w-[70px] h-[30px] bg-gray-200 rounded" />
                        <div className="w-[70px] h-[30px] bg-gray-200 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SavedLibrary;
