"use client";

import { useEffect, useState } from "react";
import { darkenColor, lightenColor } from "@/src/libs/helpers";
import { GoChevronLeft, GoChevronRight, GoX } from "react-icons/go";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { Question } from "@/src/libs/types/dashboard.types";
// import { getFlashcardTask } from "@/src/services/api/dashboard.api";

const COLORS = [
    "#FDD891",
    "#D1C8DB",
    "#ADD4C5",
    "#F5B7B1",
    "#C0DAEB",
];

type FlashQuestion = {
    question: string;
    options: string[];
    correctIndex: number;
};

type Props = {
    taskId?: string;
    initialQuestions?: Question[];
    onClose?: () => void;
};

const Flashcards = ({
    taskId,
    initialQuestions,
    onClose,
}: Props) => {
    const [questions, setQuestions] = useState<Question[]>(
        initialQuestions || []
    );
    const [loading, setLoading] = useState(!initialQuestions);

    const [index, setIndex] = useState(0);
    const [selected, setSelected] =
        useState<number | null>(null);
    const [revealed, setRevealed] = useState(false);
    const [direction, setDirection] =
        useState<"next" | "prev" | null>(null);

    // ================= FETCH IF NEEDED =================

    useEffect(() => {
        if (!initialQuestions && taskId) {
            fetchFlashcards();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchFlashcards = async () => {
        try {
            // const res = await getFlashcardTask(taskId!);
            // setQuestions(res.questions);
        } catch (err) {
            console.error("Flashcard fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    if (!questions.length) return null;

    const current = questions[index];
    const total = questions.length;

    const isFirst = index === 0;
    const isLast = index === total - 1;
    const bgColor = COLORS[index % COLORS.length];

    const resetState = () => {
        setSelected(null);
        setRevealed(false);
    };

    const next = () => {
        if (isLast) {
            onClose?.();
            return;
        }

        setDirection("next");

        setTimeout(() => {
            setIndex((prev) => prev + 1);
            resetState();
        }, 200);

        setTimeout(() => {
            setDirection(null);
        }, 400);
    };

    const prev = () => {
        if (isFirst) return;

        setDirection("prev");

        setTimeout(() => {
            setIndex((prev) => prev - 1);
            resetState();
        }, 200);

        setTimeout(() => {
            setDirection(null);
        }, 400);
    };

    const getQuestionFontSize = (text: string) => {
        if (text.length > 140) return "text-[16px]";
        if (text.length > 100) return "text-[18px]";
        return "text-[20px]";
    };

    const getOptionFontSize = (text: string) => {
        if (text.length > 80) return "text-[14px]";
        return "text-[16px]";
    };

    // ================= LOADING SHIMMER =================

    if (loading) {
        return (
            <div className="px-4">
                <div
                    className="h-[calc(100vh-100px)] mt-1 mb-4 py-6 rounded-[32px] flex flex-col animate-pulse"
                    style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                >
                    {/* Header shimmer */}
                    <div className="relative flex justify-center items-center">
                        <div className="h-7 w-40 bg-gray-200 rounded-md" />
                        <div className="absolute right-8 h-6 w-12 bg-gray-200 rounded-md" />
                    </div>

                    {/* Card area */}
                    <div className="flex-1 flex flex-col items-center justify-center mb-10">

                        {/* 1/25 shimmer */}
                        <div className="w-[640px] max-w-[90vw] mb-2 flex justify-end">
                            <div className="h-5 w-12 bg-gray-200 rounded-md" />
                        </div>

                        {/* Card shimmer */}
                        <div className="w-[640px] max-w-[90vw] min-h-[420px] rounded-[20px] p-8 bg-gray-200">

                            {/* Question shimmer */}
                            <div className="space-y-3 mt-6 px-12">
                                <div className="h-5 bg-gray-300 rounded w-3/4 mx-auto" />
                                <div className="h-5 bg-gray-300 rounded w-2/3 mx-auto" />
                                <div className="h-5 bg-gray-300 rounded w-1/2 mx-auto" />
                            </div>

                            {/* Options shimmer */}
                            <div className="mt-16 px-10 space-y-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i}>
                                        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
                                        {i !== 4 && (
                                            <div className="h-[1px] bg-gray-300 opacity-50" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Arrows shimmer */}
                            <div className="absolute bottom-[36px] left-0 w-full px-6 flex items-center justify-between">
                                <div className="w-9 h-9 bg-gray-300 rounded-full" />
                                <div className="w-9 h-9 bg-gray-300 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ================= DESIGN (UNCHANGED) =================

    return (
        <div className="px-4">
            <div
                className="h-[calc(100vh-100px)] mt-1 mb-4 py-6 rounded-[32px] flex flex-col"
                style={{
                    boxShadow: "0px 0px 4px 0px #00000040",
                }}
            >
                {/* HEADER */}
                <div className="relative flex justify-center items-center">
                    <h1 className="text-[26px] font-semibold text-[#121212]">
                        Flashcard
                    </h1>

                    <div className="absolute right-8 text-[22px]">
                        3 🔥
                    </div>

                    {onClose && (
                        <GoX
                            onClick={onClose}
                            className="absolute left-8 text-[24px] cursor-pointer"
                        />
                    )}
                </div>

                {/* CARD AREA */}
                <div className="flex-1 flex flex-col items-center justify-center mb-10">

                    <div className="relative w-[640px] max-w-[90vw] right-2 mb-2 text-right text-[20px] font-medium text-gray-600">
                        {index + 1}/{total}
                    </div>

                    <div
                        className="relative w-[640px] max-w-[90vw] min-h-[550px] py-10 rounded-[20px] p-6 transition-all duration-400"
                        style={{
                            background: bgColor,
                            perspective: "1000px",
                            transform:
                                direction === "next"
                                    ? "translateX(-40px)"
                                    : direction === "prev"
                                        ? "translateX(40px)"
                                        : "translateX(0)",
                            opacity: direction ? 0 : 1,
                        }}
                    >
                        <div
                            className="relative w-full h-full transition-transform duration-500"
                            style={{
                                transform: revealed
                                    ? "rotateY(180deg)"
                                    : "rotateY(0deg)",
                                transformStyle: "preserve-3d",
                            }}
                        >
                            {/* FRONT */}
                            <div
                                className="absolute inset-0 flex flex-col"
                                style={{ backfaceVisibility: "hidden" }}
                            >
                                <div className="flex items-center justify-center text-center">
                                    <h2
                                        className={`px-12 font-semibold text-[#121212] leading-relaxed text-center ${getQuestionFontSize(
                                            current.questionText
                                        )}`}
                                        style={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {current.questionText}
                                    </h2>
                                </div>

                                <div className="px-10 mt-14 flex flex-col gap-6">
                                    {current.options.map((option, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setSelected(i)}
                                            className="cursor-pointer"
                                        >
                                            <p
                                                className={`${getOptionFontSize(option.text)} ${selected === i ? "font-semibold" : "font-normal"
                                                    } text-[#121212] ml-2 leading-relaxed`}
                                                style={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {option.text}
                                            </p>

                                            {i !== current.options.length - 1 && (
                                                <div className="mt-2 h-[1px] bg-gray-400 opacity-40" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="absolute bottom-[36px] left-0 w-full px-6 flex items-center justify-between mt-[20px]">
                                    <button
                                        onClick={prev}
                                        disabled={isFirst}
                                        className={`w-9 h-9 rounded-full flex items-center justify-center shadow ${isFirst ? "opacity-30" : ""
                                            }`}
                                        style={{
                                            backgroundColor:
                                                lightenColor(bgColor, 14),
                                        }}
                                    >
                                        <GoChevronLeft
                                            size={24}
                                            color={darkenColor(
                                                bgColor,
                                                64
                                            )}
                                        />
                                    </button>

                                    <button
                                        onClick={next}
                                        disabled={isLast}
                                        className={`w-9 h-9 rounded-full flex items-center justify-center shadow ${isLast ? "opacity-30" : ""
                                            }`}
                                        style={{
                                            backgroundColor:
                                                lightenColor(bgColor, 14),
                                        }}
                                    >
                                        <GoChevronRight
                                            size={24}
                                            color={darkenColor(
                                                bgColor,
                                                64
                                            )}
                                        />
                                    </button>
                                </div>

                                <div className="absolute bottom-[1px] w-full text-center">
                                    {!revealed &&
                                        selected !== null && (
                                            <p
                                                onClick={() =>
                                                    setRevealed(true)
                                                }
                                                className="text-[16px] font-medium cursor-pointer"
                                            >
                                                Tap to reveal the answer
                                            </p>
                                        )}
                                </div>
                            </div>

                            {/* BACK */}
                            <div
                                className="absolute inset-0 flex flex-col"
                                style={{
                                    transform: "rotateY(180deg)",
                                    backfaceVisibility:
                                        "hidden",
                                }}
                            >
                                <div className="flex items-center justify-center text-center">
                                    <h2
                                        className={`px-12 font-semibold text-[#121212] leading-relaxed text-center ${getQuestionFontSize(
                                            current.questionText
                                        )}`}
                                        style={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {current.questionText}
                                    </h2>
                                </div>

                                <div className="px-10 mt-14 flex flex-col gap-6">
                                    {current.options.map((option, i) => {
                                        const isCorrect =
                                            option.id === current.correctOptionId;
                                        const isSelected =
                                            i === selected;

                                        return (
                                            <div key={i}>
                                                <div className="flex justify-between items-center">
                                                    <p
                                                        className={`${getOptionFontSize(option.text)} ${selected === i ? "font-semibold" : "font-normal"
                                                            } text-[#121212] ml-2 leading-relaxed`}
                                                        style={{
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: "vertical",
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        {option.text}
                                                    </p>

                                                    {isCorrect && (
                                                        <IoCheckmark
                                                            size={26}
                                                            color="green"
                                                        />
                                                    )}

                                                    {isSelected &&
                                                        !isCorrect && (
                                                            <IoClose
                                                                size={26}
                                                                color="red"
                                                            />
                                                        )}
                                                </div>

                                                {i !== current.options.length - 1 && (
                                                    <div className="mt-2 h-[1px] bg-gray-400 opacity-40" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="absolute bottom-[36px] left-0 w-full px-6 flex items-center justify-between mt-[20px]">
                                    <button
                                        onClick={prev}
                                        disabled={isFirst}
                                        className={`w-9 h-9 rounded-full flex items-center justify-center shadow ${isFirst ? "opacity-30" : ""
                                            }`}
                                        style={{
                                            backgroundColor:
                                                lightenColor(bgColor, 14),
                                        }}
                                    >
                                        <GoChevronLeft
                                            size={24}
                                            color={darkenColor(
                                                bgColor,
                                                64
                                            )}
                                        />
                                    </button>

                                    <button
                                        onClick={next}
                                        disabled={isLast}
                                        className={`w-9 h-9 rounded-full flex items-center justify-center shadow ${isLast ? "opacity-30" : ""
                                            }`}
                                        style={{
                                            backgroundColor:
                                                lightenColor(bgColor, 14),
                                        }}
                                    >
                                        <GoChevronRight
                                            size={24}
                                            color={darkenColor(
                                                bgColor,
                                                64
                                            )}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Flashcards;
