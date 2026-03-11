"use client";

import React, { useEffect, useRef, useState } from "react";
import SavedCard from "../../components/Cards/savedCards";
import EmptyState from "@/src/components/Cards/emptyState";
import { GoArrowLeft } from "react-icons/go";
import {
    getFlashcards,
    renameFlashcard,
    deleteFlashcard,
} from "@/src/services/api/flashcards.api";
import RenameModal from "@/src/components/common/RenameModal";
import ConfirmModal from "@/src/components/common/ConfirmModal";
import { message } from "antd";
import { Flashcard, FlashcardUI, mapFlashcardQuestions } from "@/src/libs/types/flashcards.types";
import Flashcards from "./flashCards";

const PAGE_LIMIT = 10;

const SavedFlashCards = ({
    showBack = false,
    onBack,
}: {
    showBack?: boolean;
    onBack?: () => void;
}) => {
    const [flashCards, setFlashCards] = useState<FlashcardUI[]>([]);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    const [selectedCard, setSelectedCard] = useState<FlashcardUI | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [activeFlashcard, setActiveFlashcard] = useState<string | null>(null);

    const observerRef = useRef<HTMLDivElement | null>(null);

    const fetched = useRef(false);

    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;

        fetchFlashCards(0, true);
    }, []);

    const fetchFlashCards = async (
        currentSkip: number,
        isFirst = false
    ) => {
        if (loading) return;
        try {
            setLoading(true);

            const res = await getFlashcards({
                skip: currentSkip,
                take: PAGE_LIMIT,
                include: "questions",
                orderBy: "createdAt|desc",
            });

            const mappedList: FlashcardUI[] = res.list.map((card) => ({
                ...card,
                questions: mapFlashcardQuestions(card.questions || []),
            }));

            if (isFirst) {
                setFlashCards(mappedList);
            } else {
                setFlashCards((prev) => [...prev, ...mappedList]);
            }

            setHasMore(res.hasMany);

        } catch (err) {
            console.error("Failed to fetch flashcards", err);
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        if (!observerRef.current || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {

                if (
                    entries[0].isIntersecting &&
                    !loading &&
                    !initialLoading &&
                    hasMore
                ) {
                    const newSkip = skip + PAGE_LIMIT;
                    setSkip(newSkip);
                    fetchFlashCards(newSkip);
                }

            },
            { threshold: 0.5 }
        );

        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [loading, hasMore, skip]);

    // Rename
    const handleRename = async (id: string, title: string) => {
        try {
            setActionLoading(true);

            const res = await renameFlashcard(id, title);

            setFlashCards((prev) =>
                prev.map((card) =>
                    card.id === id ? { ...card, title: res.title } : card
                )
            );

            setShowRenameModal(false);
            message.success("Flashcard renamed successfully");
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    // Delete
    const handleDelete = async () => {
        if (!selectedCard) return;

        try {
            setActionLoading(true);

            await deleteFlashcard(selectedCard.id);

            setFlashCards((prev) =>
                prev.filter((card) => card.id !== selectedCard.id)
            );

            setShowDeleteModal(false);
            message.success("Flashcard deleted successfully");
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    if (activeFlashcard) {
        return (
            <Flashcards
                taskId={activeFlashcard}
                initialQuestions={selectedCard?.questions || []}
                onClose={() => {
                    setSelectedCard(null);
                    setActiveFlashcard(null);
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
                <div
                    className={`py-3 px-6 flex items-center relative ${!initialLoading && flashCards.length === 0 ? "mt-5" : ""}`}>
                    {showBack && (
                        <GoArrowLeft
                            className="text-xl absolute left-8 cursor-pointer"
                            onClick={onBack}
                        />
                    )}
                    <h1 className="text-[28px] font-semibold text-primaryText w-full text-center">
                        {!initialLoading && flashCards.length === 0
                            ? ""
                            : "Saved Flashcards"}
                    </h1>
                </div>

                <div className="flex-1 overflow-y-auto px-6 scrollbar">
                    {initialLoading ? (
                        <CardsShimmer count={5} />
                    ) : flashCards.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center mt-30">
                            <EmptyState type="flashcards" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 py-3 w-full">
                            {flashCards.map((card) => (
                                <SavedCard
                                    key={card.id}
                                    type="flashcards"
                                    item={card}
                                    onRename={(id) => {
                                        const found = flashCards.find((c) => c.id === id);
                                        if (!found) return;
                                        setSelectedCard(found);
                                        setShowRenameModal(true);
                                    }}
                                    onDelete={(id) => {
                                        const found = flashCards.find((c) => c.id === id);
                                        if (!found) return;
                                        setSelectedCard(found);
                                        setShowDeleteModal(true);
                                    }}
                                    onRemove={() => { }}
                                    onOpenFlashcard={(id) => {
                                        const found = flashCards.find((c) => c.id === id);
                                        if (!found) return;
                                        setActiveFlashcard(id);
                                        setSelectedCard(found);
                                    }}
                                />
                            ))}

                            {loading && !initialLoading && (
                                <CardsShimmer count={2} />
                            )}

                            {hasMore && <div ref={observerRef} className="h-10" />}
                        </div>
                    )}
                </div>
            </div>

            {/* Rename Modal */}
            <RenameModal
                isOpen={showRenameModal}
                initialValue={selectedCard?.title || ""}
                loading={actionLoading}
                onClose={() => setShowRenameModal(false)}
                onSubmit={(value) =>
                    selectedCard && handleRename(selectedCard.id, value)
                }
            />

            {/* Delete Confirm Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete Flashcard"
                description="Are you sure you want to delete this flashcard?"
                confirmText="Delete"
                cancelText="Cancel"
                confirmColor="red"
                loading={actionLoading}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
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
                        <div className="w-[70px] h-[30px] bg-gray-200 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SavedFlashCards;
