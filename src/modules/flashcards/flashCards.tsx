"use client";

import { useEffect, useState } from "react";
import { darkenColor, lightenColor, QuestionSource } from "@/src/libs/helpers";
import { GoChevronLeft, GoChevronRight, GoX } from "react-icons/go";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { Question } from "@/src/libs/types/dashboard.types";
import { useTranslation } from "@/src/libs/i18n";
import { validateFlashcardAnswer } from "@/src/services/api/flashcards.api";
import { submitTaskAnswer } from "@/src/services/api/question.api";

const COLORS = ["#FDD891", "#D1C8DB", "#ADD4C5", "#F5B7B1", "#C0DAEB"];

type Props = {
  taskId?: string;
  initialQuestions?: Question[];
  source?: QuestionSource;
  onClose?: () => void;
};

const Flashcards = ({ taskId, initialQuestions, source, onClose }: Props) => {
  const [questions, setQuestions] = useState<Question[]>(
    initialQuestions || [],
  );
  const [loading, setLoading] = useState(!initialQuestions);
const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (!questions.length) return null;

  const current = questions[index];
  const total = questions.length;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const bgColor = COLORS[index % COLORS.length];
  const streak = Number(localStorage.getItem("streak")) || 0;

  const resetState = () => {
    setSelected(null);
    setRevealed(false);
    setShowResult(false);
    setChecking(false);
  };

  const handleSelect = async (i: number) => {
    if (checking || showResult) return;

    const option = current.options[i];

    setSelected(i);
    setChecking(true);

    try {
      let res;
      if (source === QuestionSource.HOME_PRACTICE_QUESTION) {
        res = await submitTaskAnswer({
          userTaskId: taskId!,
          questionId: current.id,
          selectedOptionId: option.id,
        });
      } else {
        res = await validateFlashcardAnswer({
          questionId: current.id,
          selectedOptionId: option.id,
        });
      }
      // update explanation from API

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === current.id
            ? {
                ...q,
                correctOptionId: res.correctOptionId,
                stepByStepExplanation: res.explanation ?? "",
                userQuestionAttempts: [
                  {
                    id: "local",
                    userId: "",
                    userTaskId: taskId ?? "",
                    questionId: current.id,
                    selectedOptionId: option.id,
                    isCorrect: res.isCorrect,
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : q,
        ),
      );
    } catch (err) {
      console.error("Flashcard validate error", err);
    } finally {
      setChecking(false);
      setShowResult(true);
    }
  };

  useEffect(() => {
    if (!current) return;

    const attempt = current.userQuestionAttempts?.[0];
    console.log("attempt: ", attempt);
    if (!attempt) {
      setSelected(null);
      setShowResult(false);
      setChecking(false);
      return;
    }

    const selectedIndex = current.options.findIndex(
      (o) => o.id === attempt.selectedOptionId,
    );
    console.log("selectedIndex: ", selectedIndex);
    if (selectedIndex !== -1) {
      setSelected(selectedIndex);
      setShowResult(true);
    }
  }, [current]);

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

    setTimeout(() => setDirection(null), 400);
  };

  const prev = () => {
    if (isFirst) return;

    setDirection("prev");

    setTimeout(() => {
      setIndex((prev) => prev - 1);
      resetState();
    }, 200);

    setTimeout(() => setDirection(null), 400);
  };

  const getQuestionFontSize = (text: string) => {
    if (text.length > 220) return "text-[14px]";
    if (text.length > 150) return "text-[16px]";
    if (text.length > 80) return "text-[18px]";
    return "text-[20px]";
  };

  return (
    <div className="px-4">
      <div
        className="h-[calc(100vh-100px)] mt-1 mb-4 py-6 rounded-[32px] flex flex-col"
        style={{ boxShadow: "0px 0px 4px 0px #00000040",backgroundColor: '#F7F9FC' }}
      >
        {/* HEADER */}
        <div className="relative flex justify-center items-center">
          <h1 className="text-[26px] font-semibold">{t("flashcards.title")}</h1>

          {streak > 0 && (
            <div className="absolute right-8 text-[22px]">{streak} 🔥</div>
          )}

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
                transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* FRONT SIDE */}
              <div
                className="absolute inset-0 flex flex-col"
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* Question */}
                <div className="text-center px-12">
                  <h2
                    className={`${getQuestionFontSize(
                      current.questionText,
                    )} font-semibold leading-relaxed break-words`}
                  >
                    {current.questionText}
                  </h2>
                </div>

                {/* Options */}
                <div className="px-10 mt-14 flex flex-col gap-6">
                  {current.options.map((option, i) => {
                    const isCorrect = option.id === current.correctOptionId;
                    const isSelected = i === selected;

                    return (
                      <div
                        key={i}
                        onClick={() => handleSelect(i)}
                        className="cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <p
                            className={`text-[16px] ml-2 ${
                              isSelected ? "font-semibold" : ""
                            }`}
                          >
                            {option.text}
                          </p>

                          {checking && isSelected && (
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          )}

                          {showResult && isCorrect && (
                            <IoCheckmark size={24} color="green" />
                          )}

                          {showResult && isSelected && !isCorrect && (
                            <IoClose size={24} color="red" />
                          )}
                        </div>

                        <div className="mt-2 h-[1px] bg-gray-400 opacity-40" />
                      </div>
                    );
                  })}
                </div>

                {/* Tap to flip */}
                {showResult && (
                  <div className="absolute bottom-4 w-full text-center">
                    <p
                      onClick={() => setRevealed(true)}
                      className="text-[16px] font-medium cursor-pointer"
                    >
                      Tap to view explanation
                    </p>
                  </div>
                )}

                {/* Arrows */}
                <div className="absolute bottom-[36px] left-0 w-full px-6 flex items-center justify-between mt-[20px]">
                  <button
                    onClick={prev}
                    disabled={isFirst}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow cursor-pointer ${
                      isFirst ? "opacity-30" : ""
                    }`}
                    style={{
                      backgroundColor: lightenColor(bgColor, 14),
                    }}
                  >
                    <GoChevronLeft size={24} color={darkenColor(bgColor, 64)} />
                  </button>

                  <button
                    onClick={next}
                    disabled={isLast}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow cursor-pointer ${
                      isLast ? "opacity-30" : ""
                    }`}
                    style={{
                      backgroundColor: lightenColor(bgColor, 14),
                    }}
                  >
                    <GoChevronRight
                      size={24}
                      color={darkenColor(bgColor, 64)}
                    />
                  </button>
                </div>
              </div>

              {/* BACK SIDE */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-start px-10 pt-10"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <h2 className="text-[22px] font-semibold text-center">
                  Correct Answer
                </h2>

                <p className="mt-3 text-[18px] font-medium text-green-600 text-center">
                  {
                    current.options.find(
                      (o) => o.id === current.correctOptionId,
                    )?.text
                  }
                </p>

                <div className="mt-10 text-center">
                  <h3 className="text-[18px] font-semibold mb-3">
                    Explanation
                  </h3>

                  <p className="text-[16px] text-gray-700 leading-relaxed">
                    {current.stepByStepExplanation}
                  </p>
                </div>

                <div className="absolute bottom-[36px] left-0 w-full px-6 flex items-center justify-between mt-[20px]">
                  <button
                    onClick={prev}
                    disabled={isFirst}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow cursor-pointer ${
                      isFirst ? "opacity-30" : ""
                    }`}
                    style={{
                      backgroundColor: lightenColor(bgColor, 14),
                    }}
                  >
                    <GoChevronLeft size={24} color={darkenColor(bgColor, 64)} />
                  </button>

                  <button
                    onClick={next}
                    disabled={isLast}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow cursor-pointer ${
                      isLast ? "opacity-30" : ""
                    }`}
                    style={{
                      backgroundColor: lightenColor(bgColor, 14),
                    }}
                  >
                    <GoChevronRight
                      size={24}
                      color={darkenColor(bgColor, 64)}
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
