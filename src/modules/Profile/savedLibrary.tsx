"use client";

import React, { useEffect, useRef, useState } from "react";
import SavedCard from "../../components/Cards/savedCards";
import EmptyState from "@/src/components/Cards/emptyState";
import { GoArrowLeft } from "react-icons/go";
import { t } from "@/src/libs/i18n";
import { getSummaries, removeSummary, Summary } from "@/src/services/api/summary.api";
import { message } from "antd";
import ConfirmModal from "@/src/components/common/ConfirmModal";
import SummaryDetail from "./SummaryDetail";
import Flashcards from "../flashcards/flashCards";

const PAGE_LIMIT = 10;

type SavedLibraryProps = {
    showBack?: boolean;
    onBack?: () => void;
};

const SavedLibrary = ({ showBack = false, onBack }: SavedLibraryProps) => {

    const [library, setLibrary] = useState<Summary[]>([]);
    const [skip, setSkip] = useState(0);

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [activeFlashcard, setActiveFlashcard] = useState<string | null>(null);
    const [initialQuestions, setInitialQuestions] = useState<any[]>([]);

    const observerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        fetchLibrary(0, true);
    }, []);

    const fetchLibrary = async (currentSkip: number, isFirst = false) => {
        try {

            setLoading(true);

            const res = await getSummaries({
                skip: currentSkip,
                take: PAGE_LIMIT,
                orderBy: "createdAt|desc"
            });

            const list = res.list || [];

            if (isFirst) {
                setLibrary(list);
            } else {
                setLibrary((prev) => [...prev, ...list]);
            }

            setHasMore(res.hasMany);

        } catch (err) {
            console.error("summary fetch error", err);
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    // infinite scroll
    useEffect(() => {
        if (!observerRef.current || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {

                if (entries[0].isIntersecting && !loading) {

                    const newSkip = skip + PAGE_LIMIT;

                    setSkip(newSkip);
                    fetchLibrary(newSkip);
                }

            },
            { threshold: 0.5 }
        );

        observer.observe(observerRef.current);

        return () => observer.disconnect();

    }, [loading, hasMore, skip]);

    // REMOVE SUMMARY
    const handleRemove = async () => {

        if (!selectedSummary) return;

        try {

            setActionLoading(true);

            await removeSummary(selectedSummary.id);

            setLibrary((prev) =>
                prev.filter((item) => item.id !== selectedSummary.id)
            );

            message.success("Summary removed successfully");
            setShowRemoveModal(false);

        } catch (err) {

            console.error(err);
            message.error("Failed to remove summary");

        } finally {

            setActionLoading(false);

        }
    };

    if (activeFlashcard) {
        return (
            <Flashcards
                taskId={activeFlashcard}
                initialQuestions={initialQuestions}
                onClose={() => {
                    setActiveFlashcard(null);
                    setInitialQuestions([]);
                }}
            />
        );
    }

    if (selectedSummary) {
        return (
            <SummaryDetail
                summary={selectedSummary}
                onBack={() => setSelectedSummary(null)}
                onFlashcardReady={(id, questions) => {
                    setActiveFlashcard(id);
                    setInitialQuestions(questions);
                }}
            />
        );
    }

    return (
        <div className="px-4">

            <div
                className="h-[calc(100vh-100px)] mt-1 mb-4 rounded-[32px] col-span-2 flex flex-col gap-4 overflow-hidden"
                style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
            >

                {/* HEADER */}
                <div
                    className={`py-3 px-6 flex items-center relative ${!initialLoading && library.length === 0 ? "mt-5" : ""}`}>
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

                {/* LIST */}
                <div className="flex-1 overflow-y-auto px-6 scrollbar">

                    {initialLoading ? (

                        <CardsShimmer count={5} />

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
                                    onRename={() => { }}
                                    onDelete={() => { }}
                                    onRemove={() => {
                                        setSelectedSummary(item);
                                        setShowRemoveModal(true);
                                    }}
                                    onOpenFlashcard={(id) => {
                                        const found = library.find((c) => c.id === id);
                                        if (!found) return;
                                        setSelectedSummary(found);
                                    }}
                                />

                            ))}

                            {loading && !initialLoading && (
                                <CardsShimmer count={2} />
                            )}

                            {hasMore && (
                                <div ref={observerRef} className="h-10" />
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={showRemoveModal}
                title="Remove Summary"
                description="Are you sure you want to remove this summary?"
                confirmText="Remove"
                cancelText="Cancel"
                confirmColor="red"
                loading={actionLoading}
                onClose={() => setShowRemoveModal(false)}
                onConfirm={handleRemove}
            />
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
                    </div>

                </div>

            ))}

        </div>
    );
};

export default SavedLibrary;