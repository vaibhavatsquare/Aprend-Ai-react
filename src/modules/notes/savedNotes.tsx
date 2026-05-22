"use client";

import { useEffect, useRef, useState } from "react";
import SavedCard from "../../components/Cards/savedCards";
import EmptyState from "@/src/components/Cards/emptyState";
import { GoArrowLeft } from "react-icons/go";
import { deleteNote, getNotes, renameNote } from "@/src/services/api/notes.api";
import RenameModal from "@/src/components/common/RenameModal";
import ConfirmModal from "@/src/components/common/ConfirmModal";
import { message } from "antd";
import { Note } from "@/src/libs/types/notes.types";
import { useInitialFetch } from "@/src/libs/helpersWithUseClient";

const PAGE_LIMIT = 10;

type SavedNotesProps = {
    showBack?: boolean; // default false
    onBack?: () => void;
};

const SavedNotes = ({ showBack = false, onBack }: SavedNotesProps) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const observerRef = useRef<HTMLDivElement | null>(null);

    useInitialFetch(() => fetchNotes(0, true));

    const fetchNotes = async (currentSkip: number, isFirst = false) => {
        if (loading) return;
        try {
            setLoading(true);

            const res = await getNotes({
                skip: currentSkip,
                take: PAGE_LIMIT,
                orderBy: "createdAt|desc",
            });

            if (isFirst) {
                setNotes(res.list);
            } else {
                setNotes((prev) => [...prev, ...res.list]);
            }

            setTotal(res.total);
            setHasMore(res.hasMany);
        } catch (err) {
            console.error("Failed to fetch notes", err);
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
                    fetchNotes(newSkip);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [loading, hasMore, skip]);

    const handleRename = async (id: string, title: string) => {
        try {
            setActionLoading(true);

            const res = await renameNote(id, title);

            setNotes((prev) =>
                prev.map((n) =>
                    n.id === id ? { ...n, title: res.title } : n
                )
            );

            setShowRenameModal(false);
            message.success("Note renamed successfully");
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedNote) return;

        try {
            setActionLoading(true);

            await deleteNote(selectedNote.id);

            setNotes((prev) =>
                prev.filter((n) => n.id !== selectedNote.id)
            );

            setShowDeleteModal(false);
            message.success("Note deleted successfully");
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="px-4">
            <div
                className="h-[calc(100vh-100px)] mt-1 mb-4 rounded-[32px] col-span-2 flex flex-col gap-4 overflow-hidden"
                style={{
                    boxShadow: "0px 0px 4px 0px #00000040",
                    backgroundColor: '#F7F9FC'
                }}
            >
                {/* 🔹 FIXED HEADER */}
                <div
                    className={`py-3 px-6 flex items-center relative ${!initialLoading && notes.length === 0 ? "mt-5" : ""}`}>
                    {showBack && (
                        <GoArrowLeft
                            className="text-xl absolute left-8 cursor-pointer"
                            onClick={onBack}
                        />
                    )}
                    <h1 className="text-[28px] font-semibold text-primaryText w-full text-center">
                        {!initialLoading && notes.length === 0 ? "" : "Saved Notes"}
                    </h1>
                </div>

                {/* 🔹 SCROLLABLE SECTION ONLY */}
                <div className="flex-1 overflow-y-auto px-6 scrollbar">
                    {initialLoading ? (
                        <div className="w-full">
                            <CardsShimmer count={5} />
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center mt-30">
                            <EmptyState type="notes" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 py-3 w-full">
                            {notes.map((note) => (
                                <SavedCard
                                    key={note.id}
                                    type="notes"
                                    item={note}
                                    onRename={(id, title) => {
                                        const note = notes.find((n) => n.id === id);
                                        if (!note) return;
                                        setSelectedNote(note);
                                        setShowRenameModal(true);
                                    }}

                                    onDelete={(id) => {
                                        const note = notes.find((n) => n.id === id);
                                        if (!note) return;
                                        setSelectedNote(note);
                                        setShowDeleteModal(true);
                                    }}
                                    onRemove={(id) => { }}
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

            <RenameModal
                isOpen={showRenameModal}
                initialValue={selectedNote?.title || ""}
                loading={actionLoading}
                onClose={() => setShowRenameModal(false)}
                onSubmit={(value) =>
                    selectedNote && handleRename(selectedNote.id, value)
                }
            />

            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete Note"
                description="Are you sure you want to delete this note?"
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

export default SavedNotes;
