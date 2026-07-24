"use client";

import { useEffect, useState } from "react";
import { GoX } from "react-icons/go";
import { Question } from "@/src/libs/types/dashboard.types";
import {
  submitTaskAnswer,
  validateSimuladoAnswer,
} from "@/src/services/api/question.api";
import { QuestionSource } from "@/src/libs/helpers";
import { message } from "antd";

type Props = {
  taskId?: string;
  initialQuestions?: Question[];
  source?: QuestionSource;
  onClose?: () => void;
  isCompleted?: boolean;
};

type Status = "idle" | "correct" | "wrong" | "showAnswer" | "explanation";

const QuestionsBank = ({ taskId, initialQuestions, source, onClose, isCompleted }: Props) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions || []);
  const [loading, setLoading] = useState(!initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);

  useEffect(() => {
    if (!initialQuestions && taskId) fetchQuestions();
    else setLoading(false);
  }, []);

  // On mount/reopen: skip correct and retry-exhausted questions
  useEffect(() => {
    if (loading || !questions.length) return;
    if (isCompleted) {
      setReviewMode(true);
      setCurrentIndex(0);
      return;
    }
    const attemptsMap = JSON.parse(localStorage.getItem(`attempts_${taskId}`) || "{}");
    const correctList = JSON.parse(localStorage.getItem(`correct_${taskId}`) || "[]");
    const firstIncomplete = questions.findIndex((q) => {
      if (correctList.includes(q.id)) return false;
      const a = q.userQuestionAttempts?.[0];
      if (a?.isCorrect) return false;
      if ((attemptsMap[q.id] || 0) >= 2) return false;
      return true;
    });
    if (firstIncomplete === -1) {
      setReviewMode(true);
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex(firstIncomplete);
  }, [loading]);

  const fetchQuestions = async () => {
    try {
    } catch (err) {
      console.error("Question fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '0 2%' }}>
        <div style={{
          height: 'calc(100vh - 100px)',
          marginTop: '0.5vh',
          marginBottom: '1vh',
          padding: '2% 0',
          borderRadius: 'clamp(16px, 2.5vw, 32px)',
          boxShadow: '0px 0px 4px 0px #00000040',
          backgroundColor: '#F7F9FC',
          display: 'flex',
          flexDirection: 'column',
          animation: 'pulse 1.2s ease-in-out infinite',
        }}>
          <div style={{ padding: '0 3%', display: 'flex', alignItems: 'center', gap: '2%' }}>
            <div style={{ width: '3%', aspectRatio: '1', backgroundColor: '#E5E7EB', borderRadius: '50%', minWidth: 18 }} />
            <div style={{ flex: 1, height: '0.6vh', backgroundColor: '#E5E7EB', borderRadius: '99px', minHeight: 4 }} />
          </div>
          <div style={{ marginTop: '4%', padding: '0 8%', display: 'flex', flexDirection: 'column', gap: '1.5%' }}>
            <div style={{ height: '2.5vh', backgroundColor: '#E5E7EB', borderRadius: '6px', width: '75%', margin: '0 auto', minHeight: 16 }} />
            <div style={{ height: '2.5vh', backgroundColor: '#E5E7EB', borderRadius: '6px', width: '60%', margin: '0 auto', minHeight: 16 }} />
          </div>
          <div style={{ marginTop: '4%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2%', flex: 1 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ width: '50%', height: '6vh', backgroundColor: '#E5E7EB', borderRadius: 'clamp(10px, 1.2vw, 14px)', minHeight: 40 }} />
            ))}
          </div>
          <div style={{ padding: '0 8%' }}>
            <div style={{ width: '60%', height: '5vh', backgroundColor: '#E5E7EB', borderRadius: 'clamp(8px, 1vw, 12px)', margin: '0 auto', minHeight: 36 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!questions.length) return null;

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const progress = (currentIndex / questions.length) * 100;

  const handleSelect = (id: string) => {
    if (status !== "idle" || reviewMode) return;
    setSelectedOption(id);
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      message.error("Please select an answer before submitting.");
      return;
    }
    try {
      setSubmitting(true);
      let res;
      if (source === QuestionSource.SIMULADO || source === QuestionSource.EXPLORE_QUESTION) {
        res = await validateSimuladoAnswer({ questionId: currentQuestion.id, selectedOptionId: selectedOption });
      } else {
        res = await submitTaskAnswer({ userTaskId: taskId!, questionId: currentQuestion.id, selectedOptionId: selectedOption });
      }
      setStatus(res.isCorrect ? "correct" : "wrong");
      currentQuestion.correctOptionId = res.correctOptionId;
      currentQuestion.stepByStepExplanation = res.explanation ?? "";

      // Persist answered state for reopen
      const reviewKey = `review_${taskId}`;
      const reviewData = JSON.parse(localStorage.getItem(reviewKey) || "{}");
      reviewData[currentQuestion.id] = {
        selectedOptionId: selectedOption,
        correctOptionId: res.correctOptionId,
        explanation: res.explanation ?? "",
        isCorrect: res.isCorrect,
      };
      localStorage.setItem(reviewKey, JSON.stringify(reviewData));

      if (!res.isCorrect) {
        const key = `attempts_${taskId}`;
        const attemptsMap = JSON.parse(localStorage.getItem(key) || "{}");
        const newCount = (attemptsMap[currentQuestion.id] || 0) + 1;
        attemptsMap[currentQuestion.id] = newCount;
        localStorage.setItem(key, JSON.stringify(attemptsMap));
        setRetryCount(Math.max(0, newCount - 1));
        const selMap = JSON.parse(localStorage.getItem(`selected_${taskId}`) || "{}");
        selMap[currentQuestion.id] = selectedOption;
        localStorage.setItem(`selected_${taskId}`, JSON.stringify(selMap));
      } else {
        const correctList = JSON.parse(localStorage.getItem(`correct_${taskId}`) || "[]");
        if (!correctList.includes(currentQuestion.id)) {
          correctList.push(currentQuestion.id);
          localStorage.setItem(`correct_${taskId}`, JSON.stringify(correctList));
        }
      }
    } catch (err) {
      console.error("Validate error", err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!currentQuestion) return;

    // Completed task reopened — restore finished state
    if (reviewMode) {
      const reviewData = JSON.parse(localStorage.getItem(`review_${taskId}`) || "{}");
      const qReview = reviewData[currentQuestion.id];
      const latestAttempt = (currentQuestion.userQuestionAttempts || [])[0];

      if (qReview) {
        currentQuestion.correctOptionId = qReview.correctOptionId;
        currentQuestion.stepByStepExplanation = qReview.explanation || "";
        setSelectedOption(qReview.selectedOptionId);
        setStatus(qReview.isCorrect ? "correct" : "wrong");
        setRetryCount(qReview.isCorrect ? 0 : 1);
      } else if (latestAttempt) {
        setSelectedOption(latestAttempt.selectedOptionId);
        setStatus(latestAttempt.isCorrect ? "correct" : "wrong");
        setRetryCount(latestAttempt.isCorrect ? 0 : 1);
      } else {
        setSelectedOption(null);
        setStatus("wrong");
        setRetryCount(1);
      }
      return;
    }

    const attemptsMap = JSON.parse(localStorage.getItem(`attempts_${taskId}`) || "{}");
    const correctList = JSON.parse(localStorage.getItem(`correct_${taskId}`) || "[]");
    const selMap = JSON.parse(localStorage.getItem(`selected_${taskId}`) || "{}");
    const usedAttempts = attemptsMap[currentQuestion.id] || 0;
    const isCorrectInStorage = correctList.includes(currentQuestion.id);
    const attempts = currentQuestion.userQuestionAttempts || [];
    const latestAttempt = attempts[0];

    // Correct from localStorage or API
    if (isCorrectInStorage || latestAttempt?.isCorrect) {
      setSelectedOption(latestAttempt?.selectedOptionId || null);
      setStatus("correct");
      setRetryCount(0);
      return;
    }

    // Has wrong attempts in localStorage (even if API has no data)
    if (usedAttempts > 0) {
      setSelectedOption(selMap[currentQuestion.id] || latestAttempt?.selectedOptionId || null);
      setStatus("wrong");
      setRetryCount(Math.max(0, usedAttempts - 1));
      return;
    }

    // Has API attempt but no localStorage (fallback)
    if (latestAttempt) {
      setSelectedOption(latestAttempt.selectedOptionId);
      setStatus("wrong");
      setRetryCount(1);
      return;
    }

    // Fresh question
    setSelectedOption(null);
    setStatus("idle");
    setRetryCount(0);
  }, [currentQuestion, reviewMode]);

  const resetState = (isNextQuestion = false) => {
    setSelectedOption(null);
    setStatus("idle");
    if (isNextQuestion) setRetryCount(0);
  };

  const handleTryAgain = () => { setRetryCount((p) => p + 1); resetState(); };
  const handleSeeAnswer = () => { setSelectedOption(currentQuestion.correctOptionId); setStatus("showAnswer"); };
  const handleWhy = () => setStatus("explanation");
  const handleNext = () => {
    if (isLast) { onClose?.(); return; }

    // Review mode: just go next sequentially
    if (reviewMode) {
      setCurrentIndex((p) => p + 1);
      return;
    }

    // Active mode: skip correct and exhausted questions
    const attemptsMap = JSON.parse(localStorage.getItem(`attempts_${taskId}`) || "{}");
    const correctList = JSON.parse(localStorage.getItem(`correct_${taskId}`) || "[]");
    let next = currentIndex + 1;
    while (next < questions.length) {
      if (correctList.includes(questions[next].id)) { next++; continue; }
      const a = questions[next].userQuestionAttempts?.[0];
      if (a?.isCorrect) { next++; continue; }
      if ((attemptsMap[questions[next].id] || 0) >= 2) { next++; continue; }
      break;
    }
    if (next >= questions.length) { onClose?.(); return; }
    setCurrentIndex(next);
  };

  const getBorderColor = (optionId: string, isCorrectOption: boolean) => {
    if (status === "correct" && isCorrectOption) return "#22C55E";
    if (status === "wrong" && selectedOption === optionId) return "#EF4444";
    if (status === "showAnswer" && isCorrectOption) return "#2563EB";
    if (status === "showAnswer" && selectedOption === optionId && !isCorrectOption) return "#EF4444";
    if (status === "explanation") {
      if (isCorrectOption) return "#22C55E";
      if (selectedOption === optionId) return "#EF4444";
    }
    if (status === "idle" && selectedOption === optionId) return "#2563EB";
    return "#DADADA";
  };

  const shouldFill = (optionId: string, isCorrectOption: boolean) =>
    (status === "idle" && selectedOption === optionId) ||
    (status === "wrong" && selectedOption === optionId) ||
    (status === "correct" && isCorrectOption) ||
    (status === "showAnswer" && (isCorrectOption || selectedOption === optionId)) ||
    (status === "explanation" && selectedOption === optionId);

  const getOptionBg = (optionId: string, isCorrectOption: boolean) => {
    if ((status === "correct" || status === "explanation") && isCorrectOption) return "#22C55E";
    if (status === "showAnswer" && isCorrectOption) return "#2563EB";
    if (status === "showAnswer" && selectedOption === optionId && !isCorrectOption) return "#EF4444";
    if ((status === "wrong" || (status === "explanation" && !isCorrectOption)) && selectedOption === optionId) return "#EF4444";
    if (status === "idle" && selectedOption === optionId) return "#2563EB";
    return "white";
  };

  const isHighlighted = (optionId: string, isCorrectOption: boolean) =>
    (status === "idle" && selectedOption === optionId) ||
    (status === "correct" && isCorrectOption) ||
    (status === "showAnswer" && (isCorrectOption || (selectedOption === optionId && !isCorrectOption))) ||
    (status === "explanation" && isCorrectOption) ||
    (status === "wrong" && selectedOption === optionId) ||
    (status === "explanation" && selectedOption === optionId && !isCorrectOption);

  // ONE base font-size — all % text scales with this
  const getQuestionFontPercent = (text: string) => {
    if (text.length > 220) return '87.5%';
    if (text.length > 150) return '100%';
    if (text.length > 80) return '112.5%';
    return '125%';
  };

  // Shared button style
  const actionBtnBase: React.CSSProperties = {
    height: '5vh',
    minHeight: 34,
    maxHeight: 52,
    borderRadius: 'clamp(8px, 1vw, 12px)',
    cursor: 'pointer',
    fontSize: '100%',
    fontWeight: 500,
    border: 'none',
  };

  return (
    <div style={{ padding: '0 2%' }}>
      <div
        style={{
          height: 'calc(100vh - 100px)',
          marginTop: '0.5vh',
          marginBottom: '1vh',
          paddingTop: '1.5%',
          paddingBottom: '1.5%',
          borderRadius: 'clamp(16px, 2.5vw, 32px)',
          boxShadow: '0px 0px 4px 0px #00000040',
          backgroundColor: '#F7F9FC',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          // ONE base — all % text inside scales with this
          fontSize: 'clamp(10px, 1vw, 16px)',
        }}
      >

        {/* ── TOP BAR ── */}
        <div style={{
          padding: '0 3%',
          display: 'flex',
          alignItems: 'center',
          gap: '2%',
          flexShrink: 0,
        }}>
          <GoX
            onClick={onClose}
            style={{ fontSize: '150%', cursor: 'pointer', flexShrink: 0 }} // 24px at base 16px
          />
          <div style={{
            flex: 1,
            height: '0.6vh',
            minHeight: 4,
            backgroundColor: '#0F305729',
            borderRadius: '99px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              backgroundColor: '#2563EB',
              width: `${progress}%`,
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* ── QUESTION ── */}
        <div style={{
          marginTop: '2%',
          textAlign: 'center',
          padding: '0 5%',
          flexShrink: 0,
        }}>
          <h2 style={{
            fontSize: getQuestionFontPercent(currentQuestion.questionText),
            fontWeight: 500,
            color: '#121212',
            lineHeight: 1.4,
          }}>
            {currentQuestion.questionText}
          </h2>
        </div>

        {/* ── OPTIONS ──
            flex:1 fills remaining space
            justifyContent:center centers options vertically
            gap and padding all in %/vh — no fixed px
        */}
        <div style={{
          marginTop: '1.5%',       // reduced from 2vh — less top spacing
          marginBottom: '1%',      // reduced — less bottom spacing
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1%',               // gap between options in %
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          padding: '0 3%',
          justifyContent: 'center',
        }}>
          {currentQuestion.options.map((option) => {
            const isCorrectOption = option.id === currentQuestion.correctOptionId;
            const borderColor = getBorderColor(option.id, isCorrectOption);
            const highlighted = isHighlighted(option.id, isCorrectOption);

            return (
              <div
                key={option.id}
                onClick={() => handleSelect(option.id)}
                style={{
                  width: '100%',
                  maxWidth: 'clamp(280px, 60vw, 700px)',
                  borderRadius: 'clamp(10px, 1.2vw, 14px)',
                  // padding in % — scales with container
                  padding: '1.2% clamp(10px, 2%, 24px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: `1px solid ${borderColor}`,
                  background: getOptionBg(option.id, isCorrectOption),
                  boxShadow:
                    status === "idle" && selectedOption === option.id ? "0px 4px 16px 0px #2563EB40"
                      : (status === "correct" && isCorrectOption) ? "0px 4px 16px 0px #22C55E40"
                        : (status === "wrong" && selectedOption === option.id) ? "0px 4px 16px 0px #EF444440"
                          : "none",
                }}
              >
                {/* Option text — 100% of base */}
                <span style={{
                  fontSize: '100%',
                  lineHeight: 1.4,
                  paddingRight: '2%',
                  color: highlighted ? '#fff' : '#121212',
                }}>
                  {option.text}
                </span>

                {/* Radio circle */}
                <div style={{
                  width: 'clamp(14px, 1.5vw, 22px)',
                  height: 'clamp(14px, 1.5vw, 22px)',
                  borderRadius: '50%',
                  border: `1px solid ${highlighted ? 'white' : borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {shouldFill(option.id, isCorrectOption) && (
                    <div style={{
                      width: 'clamp(6px, 0.8vw, 10px)',
                      height: 'clamp(6px, 0.8vw, 10px)',
                      borderRadius: '50%',
                      background: highlighted ? '#fff' : borderColor,
                    }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── BOTTOM PANEL ── */}
        <div style={{
          padding: '0 3% 1.5%',
          flexShrink: 0,
        }}>

          {/* SUBMIT */}
          {status === "idle" && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  width: '100%',
                  maxWidth: 'clamp(200px, 30vw, 380px)',
                  height: '5vh',
                  minHeight: 36,
                  maxHeight: 52,
                  borderRadius: 'clamp(8px, 1vw, 12px)',
                  color: 'white',
                  fontSize: '100%',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2%',
                  opacity: submitting ? 0.6 : 1,
                  backgroundImage: "url('/images/buttonBg.svg')",
                  backgroundSize: '350% 900%',
                  backgroundPosition: 'center',
                  boxShadow: '0px 0px 50px 0px #1953CB40',
                  border: '1px solid rgba(255,255,255,0.35)',
                }}
              >
                {submitting ? (
                  <>
                    <div style={{ width: '1.2em', height: '1.2em', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Checking...
                  </>
                ) : "Submit"}
              </button>
            </div>
          )}

          {/* CORRECT */}
          {status === "correct" && (
            <div style={{ backgroundColor: '#F0FDF4', padding: '2%', borderRadius: 'clamp(8px, 1vw, 12px)' }}>
              <p style={{ color: '#16A34A', fontWeight: 500, marginBottom: '1.5%', fontSize: '100%' }}>🎉 Correct Answer</p>
              <div style={{ display: 'flex', gap: '2%', flexWrap: 'wrap' }}>
                <button onClick={handleWhy} style={{ ...actionBtnBase, padding: '0 4%', backgroundColor: 'white', border: '1px solid #E5E7EB' }}>Why?</button>
                <button onClick={handleNext} style={{ ...actionBtnBase, flex: 1, backgroundColor: '#22C55E', color: 'white' }}>{isLast ? "Finish" : "Continue"}</button>
              </div>
            </div>
          )}

          {/* WRONG */}
          {status === "wrong" && (
            <div style={{ backgroundColor: '#FEF2F2', padding: '2%', borderRadius: 'clamp(8px, 1vw, 12px)' }}>
              <p style={{ color: '#DC2626', fontWeight: 500, marginBottom: '1.5%', fontSize: '100%' }}>❌ Wrong Answer</p>
              <div style={{ display: 'flex', gap: '2%', flexWrap: 'wrap' }}>
                <button onClick={handleSeeAnswer} style={{ ...actionBtnBase, padding: '0 4%', backgroundColor: 'white', border: '1px solid #E5E7EB' }}>See answer</button>
                {retryCount < 1 ? (
                  <button onClick={handleTryAgain} style={{ ...actionBtnBase, flex: 1, backgroundColor: '#DC2626', color: 'white' }}>Try Again</button>
                ) : (
                  <button onClick={handleNext} style={{ ...actionBtnBase, flex: 1, color: 'white', backgroundImage: "url('/images/buttonBg.svg')", backgroundSize: '1200% 1400%', backgroundPosition: 'center', boxShadow: '0px 0px 50px 0px #1953CB40', border: '1px solid rgba(255,255,255,0.35)' }}>{isLast ? "Finish" : "Continue"}</button>
                )}
              </div>
            </div>
          )}

          {/* SHOW ANSWER */}
          {status === "showAnswer" && (
            <div style={{ backgroundColor: '#EFF6FF', padding: '2%', borderRadius: 'clamp(8px, 1vw, 12px)' }}>
              <p style={{ color: '#0F3057', fontWeight: 500, marginBottom: '1.5%', fontSize: '100%' }}>🧠 Here's the solution</p>
              <div style={{ display: 'flex', gap: '2%', flexWrap: 'wrap' }}>
                <button onClick={handleWhy} style={{ ...actionBtnBase, padding: '0 4%', backgroundColor: 'white', border: '1px solid #E5E7EB' }}>Why?</button>
                <button onClick={handleNext} style={{ ...actionBtnBase, flex: 1, color: 'white', backgroundImage: "url('/images/buttonBg.svg')", backgroundSize: '900% 1400%', backgroundPosition: 'center', boxShadow: '0px 0px 50px 0px #1953CB40', border: '1px solid rgba(255,255,255,0.35)' }}>Skip explanation</button>
              </div>
            </div>
          )}

          {/* EXPLANATION */}
          {status === "explanation" && (
            <div style={{ backgroundColor: 'white', padding: '2%', borderRadius: 'clamp(8px, 1vw, 12px)', border: '1px solid #E5E7EB' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '1%', fontSize: '87.5%' }}>Explanation:</h3>
              <p style={{ color: '#555', marginBottom: '2%', fontSize: '87.5%' }}>{currentQuestion.stepByStepExplanation}</p>
              <button onClick={handleNext} style={{ ...actionBtnBase, width: '100%', color: 'white', fontWeight: 600, backgroundImage: "url('/images/buttonBg.svg')", backgroundSize: '800% 1400%', backgroundPosition: 'center', boxShadow: '0px 0px 50px 0px #1953CB40', border: '1px solid rgba(255,255,255,0.35)' }}>{isLast ? "Finish" : "Got it"}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionsBank;