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
  const [questions, setQuestions] = useState<Question[]>(() => {
    if (taskId) {
      try {
        const cached = sessionStorage.getItem(`flashcard_questions_${taskId}`);
        if (cached) return JSON.parse(cached);
      } catch { }
    }
    return initialQuestions || [];
  });
  const [loading, setLoading] = useState(!initialQuestions);
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);

  useEffect(() => { setLoading(false); }, []);

  useEffect(() => {
    if (taskId && questions.length) {
      try {
        sessionStorage.setItem(`flashcard_questions_${taskId}`, JSON.stringify(questions));
      } catch { }
    }
  }, [questions, taskId]);

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
    if (!attempt) {
      setSelected(null);
      setShowResult(false);
      setChecking(false);
      return;
    }
    const selectedIndex = current.options.findIndex(
      (o) => o.id === attempt.selectedOptionId,
    );
    if (selectedIndex !== -1) {
      setSelected(selectedIndex);
      setShowResult(true);
    }
  }, [current]);

  const next = () => {
    if (isLast) { onClose?.(); return; }
    setDirection("next");
    setTimeout(() => { setIndex((prev) => prev + 1); resetState(); }, 200);
    setTimeout(() => setDirection(null), 400);
  };

  const prev = () => {
    if (isFirst) return;
    setDirection("prev");
    setTimeout(() => { setIndex((prev) => prev - 1); resetState(); }, 200);
    setTimeout(() => setDirection(null), 400);
  };

  // ONE base font-size on card scales with viewport (1vw ≈ 16px at 1600px)
  // All text inside uses % relative to this base — so everything scales together
  // Base: clamp(10px, 1vw, 16px)
  // % mapping (base=16px):
  //   87.5%  = 14px  (tap to reveal, counter)
  //   100%   = 16px  (options)
  //   112.5% = 18px  (back answer, explanation heading)
  //   125%   = 20px  (question short)
  //   137.5% = 22px  (back heading)

  const getQuestionFontPercent = (text: string) => {
    if (text.length > 220) return '87.5%';   // 14px at base 16px
    if (text.length > 150) return '100%';    // 16px
    if (text.length > 80)  return '112.5%';  // 18px
    return '125%';                           // 20px
  };

  const arrowStyle: React.CSSProperties = {
    width: 'clamp(24px, 3vw, 36px)',
    height: 'clamp(24px, 3vw, 36px)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: 'none',
    flexShrink: 0,
    cursor: 'pointer',
  };

  return (
    <div style={{ padding: '0 2%' }}>
      <div
        style={{
          height: 'calc(100vh - 100px)',
          marginTop: '0.5vh',
          marginBottom: '1vh',
          paddingTop: '2vh',
          paddingBottom: '2vh',
          borderRadius: 'clamp(16px, 2.5vw, 32px)',
          boxShadow: '0px 0px 4px 0px #00000040',
          backgroundColor: '#F7F9FC',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >

        {/* ── HEADER ── */}
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 3%',
          flexShrink: 0,
          // Header base: slightly bigger than card base
          fontSize: 'clamp(14px, 1.2vw, 16px)',
        }}>
          <h1 style={{ fontSize: '162.5%', fontWeight: 600 }}> {/* 26px at base 16px */}
            {t("flashcards.title")}
          </h1>
          {streak > 0 && (
            <div style={{ position: 'absolute', right: '3%', fontSize: '137.5%' }}> {/* 22px */}
              {streak} 🔥
            </div>
          )}
          {onClose && (
            <GoX
              onClick={onClose}
              style={{ position: 'absolute', left: '3%', fontSize: '150%', cursor: 'pointer' }} // 24px
            />
          )}
        </div>

        {/* ── CARD AREA ── */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1vh 2%',
          minHeight: 0,
        }}>

          {/* Counter */}
          <div style={{
            width: 'clamp(280px, 30vw, 520px)',
            textAlign: 'right',
            fontSize: 'clamp(11px, 1vw, 16px)',
            fontWeight: 500,
            color: '#4B5563',
            marginBottom: '0.5vh',
            flexShrink: 0,
          }}>
            {index + 1}/{total}
          </div>

          {/* Card —
              Single clamp on fontSize = the ONE scaling unit
              All text inside uses % of this base
              base 16px at 1600px, 10px at 1000px, min 10px
          */}
          <div
            style={{
              position: 'relative',
              width: 'clamp(280px, 30vw, 520px)',
              height: 'clamp(320px, 56vh, 580px)',
              borderRadius: 'clamp(14px, 1.8vw, 24px)',
              padding: 'clamp(10px, 2vw, 28px)',
              background: bgColor,
              // ★ ONE base font-size — all % inside scale with this
              fontSize: 'clamp(10px, 1vw, 16px)',
              perspective: '1000px',
              transform: direction === "next"
                ? "translateX(-40px)"
                : direction === "prev"
                  ? "translateX(40px)"
                  : "translateX(0)",
              opacity: direction ? 0 : 1,
              transition: "transform 0.2s ease, opacity 0.2s ease",
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transition: 'transform 0.5s',
                transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
                transformStyle: "preserve-3d",
              }}
            >

              {/* ══ FRONT SIDE ══ */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  backfaceVisibility: 'hidden',
                } as React.CSSProperties}
              >
                {/* Question — % of base font */}
                <div style={{ textAlign: 'center', padding: '0 8%', flexShrink: 0 }}>
                  <h2 style={{
                    fontSize: getQuestionFontPercent(current.questionText),
                    fontWeight: 600,
                    lineHeight: 1.4,
                    wordBreak: 'break-word',
                  }}>
                    {current.questionText}
                  </h2>
                </div>

                {/* Options — 100% of base = 16px on large screens */}
                <div style={{
                  padding: '0 6%',
                  marginTop: '5%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4%',
                  flex: 1,
                  minHeight: 0,
                  justifyContent: 'center',
                }}>
                  {current.options.map((option, i) => {
                    const isCorrect = option.id === current.correctOptionId;
                    const isSelected = i === selected;
                    return (
                      <div key={i} onClick={() => handleSelect(i)} style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p style={{
                            fontSize: '100%', // 16px at base 16px
                            marginLeft: '2%',
                            fontWeight: isSelected ? 600 : 400,
                            lineHeight: 1.3,
                          }}>
                            {option.text}
                          </p>
                          {checking && isSelected && (
                            <div style={{
                              width: '1.2em',
                              height: '1.2em',
                              border: '2px solid black',
                              borderTopColor: 'transparent',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite',
                              flexShrink: 0,
                            }} />
                          )}
                          {showResult && isCorrect && (
                            <IoCheckmark style={{ flexShrink: 0, fontSize: '125%' }} color="green" />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <IoClose style={{ flexShrink: 0, fontSize: '125%' }} color="red" />
                          )}
                        </div>
                        <div style={{
                          marginTop: '3%',
                          height: 1,
                          backgroundColor: '#9CA3AF',
                          opacity: 0.4,
                        }} />
                      </div>
                    );
                  })}
                </div>

                {/* Arrows */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 2%',
                  marginTop: '3%',
                  marginBottom: '12%',
                  flexShrink: 0,
                }}>
                  <button
                    onClick={prev}
                    disabled={isFirst}
                    style={{ ...arrowStyle, opacity: isFirst ? 0.3 : 1, backgroundColor: lightenColor(bgColor, 14) }}
                  >
                    <GoChevronLeft style={{ fontSize: '120%' }} color={darkenColor(bgColor, 64)} />
                  </button>
                  <button
                    onClick={next}
                    disabled={isLast}
                    style={{ ...arrowStyle, opacity: isLast ? 0.3 : 1, backgroundColor: lightenColor(bgColor, 14) }}
                  >
                    <GoChevronRight style={{ fontSize: '120%' }} color={darkenColor(bgColor, 64)} />
                  </button>
                </div>

                {/* Tap to reveal */}
                <div style={{ position: 'absolute', bottom: '4%', left: 0, right: 0, textAlign: 'center' }}>
                  <p
                    onClick={() => setRevealed(true)}
                    style={{ fontSize: '87.5%', fontWeight: 500, cursor: 'pointer' }}
                  >
                    {t('flashcards.tapToReveal')}
                  </p>
                </div>
              </div>

              {/* ══ BACK SIDE ══ */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  padding: '4% 6%',
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                } as React.CSSProperties}
              >
                <h2 style={{ fontSize: '137.5%', fontWeight: 600, textAlign: 'center', flexShrink: 0 }}> {/* 22px */}
                  Correct Answer
                </h2>

                <p style={{ fontSize: '112.5%', fontWeight: 500, color: '#16a34a', textAlign: 'center', marginTop: '3%', flexShrink: 0 }}> {/* 18px */}
                  {current.options.find((o) => o.id === current.correctOptionId)?.text}
                </p>

                {/* Explanation — no scroll */}
                <div style={{ flex: 1, textAlign: 'center', marginTop: '4%', minHeight: 0, overflow: 'hidden' }}>
                  <h3 style={{ fontSize: '112.5%', fontWeight: 600, marginBottom: '3%' }}> {/* 18px */}
                    Explanation
                  </h3>
                  <p style={{ fontSize: '100%', color: '#374151', lineHeight: 1.4 }}> {/* 16px */}
                    {current.stepByStepExplanation}
                  </p>
                </div>

                {/* Arrows */}
                <div style={{
                  position: 'absolute',
                  bottom: '12%',
                  left: '2%',
                  right: '2%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <button
                    onClick={prev}
                    disabled={isFirst}
                    style={{ ...arrowStyle, opacity: isFirst ? 0.3 : 1, backgroundColor: lightenColor(bgColor, 14) }}
                  >
                    <GoChevronLeft style={{ fontSize: '120%' }} color={darkenColor(bgColor, 64)} />
                  </button>
                  <button
                    onClick={next}
                    disabled={isLast}
                    style={{ ...arrowStyle, opacity: isLast ? 0.3 : 1, backgroundColor: lightenColor(bgColor, 14) }}
                  >
                    <GoChevronRight style={{ fontSize: '120%' }} color={darkenColor(bgColor, 64)} />
                  </button>
                </div>

                {/* Tap to flip back */}
                <div style={{ position: 'absolute', bottom: '4%', left: 0, right: 0, textAlign: 'center' }}>
                  <p
                    onClick={() => setRevealed(false)}
                    style={{ fontSize: '87.5%', fontWeight: 500, cursor: 'pointer' }}
                  >
                    {t('flashcards.tapToFlipBack')}
                  </p>
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