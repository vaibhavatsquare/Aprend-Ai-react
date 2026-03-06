"use client";

import { useEffect, useState } from "react";
import { GoX } from "react-icons/go";
import { Question } from "@/src/libs/types/dashboard.types";
import { validateSimuladoAnswer } from "@/src/services/api/question.api";
import { QuestionSource } from "@/src/libs/constants/helper";
// import { getTaskQuestions } from "@/src/services/api/dashboard.api";

type Props = {
    taskId?: string;
    initialQuestions?: Question[];
    source?: QuestionSource;
    onClose?: () => void;
};

type Status =
    | "idle"
    | "correct"
    | "wrong"
    | "showAnswer"
    | "explanation";

const QuestionsBank = ({
    taskId,
    initialQuestions,
    source,
    onClose,
}: Props) => {
    const [questions, setQuestions] = useState<Question[]>(
        initialQuestions || []
    );
    const [loading, setLoading] = useState(!initialQuestions);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] =
        useState<string | null>(null);
    const [status, setStatus] = useState<Status>("idle");
    const [submitting, setSubmitting] = useState(false);

    // ================= FETCH IF NO DATA =================

    useEffect(() => {
        if (!initialQuestions && taskId) {
            fetchQuestions();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchQuestions = async () => {
        try {
            // const res = await getTaskQuestions(taskId!);
            // setQuestions(res.questions);
        } catch (err) {
            console.error("Question fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    // ================= LOADING =================

    if (loading) {
        return (
            <div className="px-4">
                <div
                    className="h-[calc(100vh-100px)] mt-1 mb-4 py-6 rounded-[32px] flex flex-col animate-[pulse_1.2s_ease-in-out_infinite]"
                    style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                >
                    <div className="px-6 flex items-center gap-4">
                        <div className="w-6 h-6 bg-gray-200 rounded-full" />
                        <div className="flex-1 h-[6px] bg-gray-200 rounded-full" />
                    </div>

                    <div className="mt-[40px] px-10 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto" />
                        <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto" />
                    </div>

                    <div className="mt-[45px] flex flex-col items-center gap-5 flex-1">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="w-[50%] h-[56px] bg-gray-200 rounded-[14px]"
                            />
                        ))}
                    </div>

                    <div className="px-16 pb-6">
                        <div className="w-[60%] h-[48px] bg-gray-200 rounded-xl mx-auto" />
                    </div>
                </div>
            </div>
        );
    }

    if (!questions.length) return null;

    const currentQuestion = questions[currentIndex];
    const isLast = currentIndex === questions.length - 1;
    const progress =
        ((currentIndex + 1) / questions.length) * 100;

    // ================= ACTIONS =================

    const handleSelect = (id: string) => {
        if (status !== "idle") return;
        setSelectedOption(id);
    };

    const handleSubmit = async () => {
        if (!selectedOption) return;

        try {
            setSubmitting(true);

            if (source === QuestionSource.SIMULADO) {
                const res = await validateSimuladoAnswer({
                    questionId: currentQuestion.id,
                    selectedOptionId: selectedOption,
                });

                setStatus(res.isCorrect ? "correct" : "wrong");

                // update explanation if API sends
                currentQuestion.stepByStepExplanation = res.explanation;

            } else {
                // normal flow
                setStatus(
                    selectedOption === currentQuestion.correctOptionId
                        ? "correct"
                        : "wrong"
                );
            }

        } catch (err) {
            console.error("Validate error", err);
        } finally {
            setSubmitting(false);
        }
    };

    const resetState = () => {
        setSelectedOption(null);
        setStatus("idle");
    };

    const handleTryAgain = () => resetState();

    const handleSeeAnswer = () => {
        setSelectedOption(currentQuestion.correctOptionId);
        setStatus("showAnswer");
    };

    const handleWhy = () => setStatus("explanation");

    const handleNext = () => {
        if (isLast) {
            onClose?.();
            return;
        }

        resetState();
        setCurrentIndex((prev) => prev + 1);
    };

    // ================= HELPER FOR BORDER =================

    const getBorderColor = (
        optionId: string,
        isCorrectOption: boolean
    ) => {
        if (status === "correct" && isCorrectOption)
            return "#22C55E";

        if (status === "wrong" && selectedOption === optionId)
            return "#EF4444";

        if (status === "showAnswer" && isCorrectOption)
            return "#0F3057";

        if (status === "explanation") {
            if (isCorrectOption) return "#22C55E";
            if (selectedOption === optionId) return "#EF4444";
        }
        if (status === "idle" && selectedOption === optionId)
            return "#0F3057";

        return "#DADADA";
    };

    const shouldFill = (
        optionId: string,
        isCorrectOption: boolean
    ) =>
        (status === "idle" &&
            selectedOption === optionId) ||
        (status === "wrong" &&
            selectedOption === optionId) ||
        (status === "correct" &&
            isCorrectOption) ||
        (status === "showAnswer" &&
            isCorrectOption) ||
        (status === "explanation" &&
            selectedOption === optionId);

    // ================= RENDER =================

    return (
        <div className="px-4">
            <div
                className="h-[calc(100vh-100px)] mt-1 mb-4 py-6 rounded-[32px] flex flex-col overflow-hidden"
                style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
            >
                {/* TOP BAR */}
                <div className="px-6 flex items-center gap-4">
                    <GoX
                        className="text-[24px] cursor-pointer"
                        onClick={onClose}
                    />

                    <div className="flex-1 h-[6px] bg-[#0F305729] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#0F3057]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* QUESTION */}
                <div className="mt-[40px] text-center px-10">
                    <h2 className="text-[28px] font-medium text-[#121212]">
                        {currentQuestion.questionText}
                    </h2>
                </div>

                {/* OPTIONS */}
                <div className="mt-[45px] flex flex-col items-center gap-5 flex-1 overflow-y-auto px-2">
                    {currentQuestion.options.map((option) => {
                        const isCorrectOption =
                            option.id ===
                            currentQuestion.correctOptionId;

                        const borderColor = getBorderColor(
                            option.id,
                            isCorrectOption
                        );

                        return (
                            <div
                                key={option.id}
                                onClick={() =>
                                    handleSelect(option.id)
                                }
                                className="w-[50%] min-h-[56px] rounded-[14px] px-6 py-4 flex items-center justify-between cursor-pointer transition-all"
                                style={{
                                    border: `1px solid ${borderColor}`,
                                }}
                            >
                                <span className="text-[18px] text-[#121212] leading-6 pr-4">
                                    {option.text}
                                </span>

                                <div
                                    className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0"
                                    style={{ borderColor }}
                                >
                                    {shouldFill(
                                        option.id,
                                        isCorrectOption
                                    ) && (
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{
                                                    background: borderColor,
                                                }}
                                            />
                                        )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* BOTTOM PANEL */}
                <div className="px-16 pb-6">
                    {status === "idle" && (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-[60%] h-[48px] mx-auto bg-[#0F3057] text-white rounded-xl flex justify-center items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Checking...
                                </>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    )}

                    {status === "correct" && (
                        <div className="bg-green-50 p-5 rounded-xl">
                            <p className="text-green-600 font-medium mb-4">
                                🎉 Correct Answer
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleWhy}
                                    className="px-6 h-[48px] bg-white border rounded-xl"
                                >
                                    Why?
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="flex-1 h-[48px] bg-[#22C55E] text-white rounded-xl"
                                >
                                    {isLast
                                        ? "Finish"
                                        : "Continue"}
                                </button>
                            </div>
                        </div>
                    )}

                    {status === "wrong" && (
                        <div className="bg-red-50 p-5 rounded-xl">
                            <p className="text-red-600 font-medium mb-4">
                                ❌ Wrong Answer
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleSeeAnswer}
                                    className="px-6 h-[48px] bg-white border rounded-xl"
                                >
                                    See answer
                                </button>
                                <button
                                    onClick={handleTryAgain}
                                    className="flex-1 h-[48px] bg-red-600 text-white rounded-xl"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {status === "showAnswer" && (
                        <div className="bg-blue-50 p-5 rounded-xl">
                            <p className="text-[#0F3057] font-medium mb-4">
                                🧠 Here’s the solution
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleWhy}
                                    className="px-6 h-[48px] bg-white border rounded-xl"
                                >
                                    Why?
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="flex-1 h-[48px] bg-[#0F3057] text-white rounded-xl"
                                >
                                    Skip explanation
                                </button>
                            </div>
                        </div>
                    )}

                    {status === "explanation" && (
                        <div className="bg-white p-6 rounded-xl border mt-4">
                            <h3 className="font-semibold mb-3">
                                Explanation:
                            </h3>
                            <p className="text-[#555] mb-6">
                                {
                                    currentQuestion.stepByStepExplanation
                                }
                            </p>
                            <button
                                onClick={handleNext}
                                className="w-full h-[50px] bg-[#0F3057] text-white rounded-xl"
                            >
                                {isLast ? "Finish" : "Got it"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionsBank;
