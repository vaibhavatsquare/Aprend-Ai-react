"use client";

import IconSparkel from "@/src/components/icons/iconSparkel";
import { useRedirect } from "@/src/hooks/router.hooks";
import { getCurrentWeek, QuestionSource } from "@/src/libs/helpers";
import { getDashboard } from "@/src/services/api/dashboard.api";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineFire } from "react-icons/ai";
import { GoDotFill } from "react-icons/go";
import { IoArrowForwardSharp } from "react-icons/io5";
import { LuChevronRight } from "react-icons/lu";
import QuestionsBank from "./questions/questionsBank";
import Flashcards from "../flashcards/flashCards";
import { useTranslation } from "@/src/libs/i18n";
import { Modal } from "antd";
import ProChip from "@/src/components/common/ProChip";
import { usePathname } from "next/navigation";

const Home = () => {
  const { t, language } = useTranslation();

  const localeMap: Record<string, string> = {
    ENGLISH: "en-US",
    SPANISH: "es-ES",
    PORTUGUESE: "pt-BR",
  };
  const dateLocale = localeMap[language] || "en-US";
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const week = useMemo(() => getCurrentWeek(), []);
  const todayIso = new Date().toISOString().split("T")[0];
  const isToday = selectedDate === todayIso;
  const [activeTask, setActiveTask] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setActiveTask(null); }, [pathname]);

  const fetched = useRef(false);

  const formatTaskType = (type: string) => {
    if (type === "FLASHCARD") return t('flashcards.title');
    if (type === "PRACTICE_QUESTION") return t('questions.practiceTopicWise');
    if (type === "CONCEPT_EXPLANATION") return t('home.tasks.conceptExplanation');
    return type;
  };

  useEffect(() => {
    const img = new window.Image();
    img.src = '/images/buttonBg.svg';
  }, []);

  useEffect(() => {
    const checkPremium = () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setIsPremium(
        user?.isPremium === true ||
        user?.subscriptions?.some((s: any) => s.subscriptionStatus === "ACTIVE")
      );
    };
    checkPremium();
    const timer = setTimeout(checkPremium, 1000);

    if (fetched.current) return;
    fetched.current = true;

    const load = async () => {
      try {
        const res = await getDashboard();
        setDashboard(res);
        setSelectedDate(new Date().toISOString().split("T")[0]);
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => clearTimeout(timer);
  }, []);

  const activeTaskRef = useRef<any>(null);
  useEffect(() => { activeTaskRef.current = activeTask; }, [activeTask]);

  useEffect(() => {
    const handlePopState = () => {
      if (activeTaskRef.current) setActiveTask(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleWeakSpotClick = () => {
    if (!isPremium) { setShowUpgradeModal(true); return; }
    useRedirect("/home/weak-spot-tracker");
  };

  if (loading) {
    return (
      <div className="px-[2%] grid grid-cols-1 lg:grid-cols-3 gap-[1%] animate-pulse">
        <div className="p-[1%] col-span-1 lg:col-span-2 flex flex-col gap-[2vh]">
          <div className="h-[12vh] rounded-lg bg-gray-200" />
          <div className="flex gap-[1%]">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="w-[6vw] h-[7vh] rounded-lg bg-gray-200" />
            ))}
          </div>
          <div className="flex justify-between items-center">
            <div className="h-[3vh] w-[20%] bg-gray-200 rounded" />
            <div className="h-[3vh] w-[15%] bg-gray-200 rounded" />
          </div>
          <div className="flex flex-col gap-[1.5vh]">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[8vh] rounded-[14px] bg-gray-200" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-[2vh] p-[1%]">
          <div className="h-[16vh] rounded-xl bg-gray-200" />
          <div className="h-[16vh] rounded-xl bg-gray-200" />
          <div className="h-[7vh] rounded-xl bg-gray-200" />
          <div className="h-[7vh] rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  const streak = dashboard?.currentStreak ?? 0;
  localStorage.setItem("streak", streak);

  const streakTitle =
    streak === 0
      ? t('home.streak.startJourney')
      : streak >= 7
      ? t('home.streak.milestone', { count: streak })
      : t('home.streak.studiedDays', { count: streak });

  const streakSub =
    streak === 0
      ? t('home.streak.consistencyMessage')
      : streak >= 7
      ? t('home.streak.milestoneSubtext')
      : t('home.streak.keepItUp');

  const tasksForDate =
    dashboard?.tasks?.filter(
      (t: any) => t.scheduledDate.split("T")[0] === selectedDate
    ) || [];

  const completedCount = tasksForDate.filter(
    (t: any) => t.status === "COMPLETED"
  ).length;

  const progress =
    tasksForDate.length > 0
      ? Math.round((completedCount / tasksForDate.length) * 100)
      : 0;

  if (activeTask) {
    const type = activeTask.task.taskType;

    const handleTaskClose = () => {
      setActiveTask(null);
      setTimeout(async () => {
        try {
          const res = await getDashboard();
          setDashboard(res);
        } catch (err) {
          console.error("Dashboard refresh error", err);
        }
      }, 500);
    };

    if (type === "PRACTICE_QUESTION" || type === "CONCEPT_EXPLANATION") {
      return (
        <QuestionsBank
          taskId={activeTask.id}
          initialQuestions={activeTask.task.questions}
          source={type === "PRACTICE_QUESTION" ? QuestionSource.HOME_PRACTICE_QUESTION : QuestionSource.HOME_CONCEPT_EXPLANATION}
          onClose={handleTaskClose}
          isCompleted={activeTask.status === "COMPLETED"}
        />
      );
    }

    if (type === "FLASHCARD") {
      return (
        <Flashcards
          taskId={activeTask.id}
          initialQuestions={activeTask.task.questions}
          source={QuestionSource.HOME_PRACTICE_QUESTION}
          onClose={handleTaskClose}
        />
      );
    }
  }

  return (
    <div
      style={{ padding: '0 2%', gap: '1%' }}
      className="grid grid-cols-1 lg:grid-cols-3"
    >
      {/* ── LEFT PANEL ── */}
      <div
        style={{ padding: '1%' }}
        className="col-span-1 lg:col-span-2 overflow-y-auto scrollbar"
      >
        <div className="flex flex-col" style={{ gap: 'clamp(12px, 2vh, 24px)' }}>

          {/* STREAK */}
          <div style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '4%',
            borderRadius: 'clamp(8px, 1vw, 12px)',
            padding: 'clamp(12px, 2vh, 24px) clamp(12px, 2vw, 24px)',
            background: 'linear-gradient(to right, #F97316, #ED482F, #EF4444)',
            minHeight: 'clamp(80px, 12vh, 130px)',
          }}>
            <h1 style={{ fontSize: 'clamp(14px, 1.4vw, 20px)', color: 'white', lineHeight: 1.4 }}>
              {streakTitle}<br />{streakSub}
            </h1>
            <AiOutlineFire style={{ color: 'white', fontSize: 'clamp(24px, 3vw, 40px)', flexShrink: 0 }} />
            {streak >= 0 && (
              <div style={{
                position: 'absolute',
                bottom: 'clamp(-10px, -1.5vh, -12px)',
                right: 'clamp(12px, 2vw, 20px)',
                display: 'flex',
                gap: 'clamp(4px, 0.5vw, 8px)',
                alignItems: 'center',
                color: '#FFFFFF80',
                fontWeight: 500,
              }}>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>{streak}</h2>
                <p style={{ fontSize: 'clamp(14px, 1.5vw, 20px)' }}>{t('home.streak.days')}</p>
              </div>
            )}
          </div>

          {/* WEEK CALENDAR */}
          <div style={{
            display: 'flex',
            gap: 'clamp(4px, 0.8vw, 10px)',
            alignItems: 'center',
            overflowX: 'auto',
            paddingBottom: '2px',
          }}>
            {week.map((date, index) => {
              const iso = date.toISOString().split("T")[0];
              const isSelected = iso === selectedDate;
              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(iso)}
                  style={{
                    width: 'clamp(36px, 4vw, 56px)',
                    height: 'clamp(52px, 7vh, 70px)',
                    flexShrink: 0,
                    borderRadius: 'clamp(6px, 0.8vw, 10px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: isSelected ? '1px solid rgba(255,255,255,0.35)' : '1px solid #E5E5E5',
                    backgroundImage: isSelected ? "url('/images/buttonBg.svg')" : undefined,
                    backgroundSize: isSelected ? '2400% 1600%' : undefined,
                    backgroundPosition: isSelected ? 'center' : undefined,
                    backgroundColor: isSelected ? undefined : 'white',
                    boxShadow: isSelected ? '0px 0px 50px 0px #1953CB40' : '0px 2px 6px rgba(0,0,0,0.06)',
                    color: isSelected ? 'white' : 'black',
                  }}
                  className={isSelected ? "reveal-from-center" : ""}
                >
                  <p style={{ fontSize: 'clamp(9px, 0.9vw, 13px)', color: isSelected ? 'white' : '#6B7280' }}>
                    {date.toLocaleDateString(dateLocale, { weekday: "short" }).toUpperCase()}
                  </p>
                  <p style={{ fontSize: 'clamp(10px, 1vw, 16px)', fontWeight: 500 }}>
                    {date.getDate()}
                  </p>
                </div>
              );
            })}
          </div>

          {/* TASKS SECTION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vh, 24px)' }}>

            {/* Tasks header */}
            <div style={{ display: 'flex', gap: '2%', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 'clamp(15px, 1.5vw, 20px)', fontWeight: 600 }}>
                {isToday ? t('home.tasks.todaysTask') : ""}
              </h2>
              <p style={{ fontSize: 'clamp(12px, 1.1vw, 15px)', color: '#6B7280' }}>
                {t('home.tasks.progress')}:{" "}
                <span style={{ color: 'black', fontWeight: 500 }}>{progress}%</span>
              </p>
            </div>

            {/* Task list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.2vh, 14px)' }}>
              {tasksForDate.length === 0 && (
                <div style={{
                  padding: 'clamp(8px, 1.5vh, 14px)',
                  border: '1px solid #E5E7EB',
                  borderRadius: 'clamp(8px, 1vw, 12px)',
                  color: '#6B7280',
                  fontSize: 'clamp(12px, 1.1vw, 15px)',
                }}>
                  {t('home.tasks.noTasksScheduled')}
                </div>
              )}

              {tasksForDate.map((task: any) => (
                <div
                  key={task.id}
                  onClick={() => {
                    window.history.pushState({ task: true }, '');
                    setActiveTask(task);
                  }}
                  style={{
                    padding: 'clamp(8px, 1.2vh, 14px) clamp(10px, 1.2vw, 16px)',
                    border: '1px solid #E5E7EB',
                    borderRadius: 'clamp(10px, 1.2vw, 14px)',
                    display: 'flex',
                    gap: '2%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0px 0px 1px 0px #00000040',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2px, 0.3vh, 4px)' }}>
                    <h3 style={{ fontWeight: 500, fontSize: 'clamp(13px, 1.3vw, 17px)' }}>
                      {task.task.topic} - {task.task.subtopic}
                    </h3>
                    <p style={{
                      fontSize: 'clamp(11px, 1.1vw, 15px)',
                      color: '#6B7280',
                      display: 'flex',
                      gap: 'clamp(4px, 0.5vw, 8px)',
                      alignItems: 'center',
                    }}>
                      {formatTaskType(task.task.taskType)}
                      {task.status === "COMPLETED" && (
                        <>
                          <GoDotFill style={{ color: '#1953CB' }} />
                          <span style={{ color: '#1953CB', fontWeight: 400 }}>
                            {t('home.tasks.completed')}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <LuChevronRight style={{ fontSize: 'clamp(16px, 1.8vw, 24px)', color: '#6B7280', flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.5vh, 20px)', padding: '1%', overflowY: 'auto' }}
        className="scrollbar pb-[2vh] lg:max-h-[calc(100vh-4vw)]"
      >
        {/* AI Tutor card */}
        <div
          style={{
            position: 'relative',
            height: 'clamp(110px, 15vh, 160px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            gap: 'clamp(6px, 1vh, 12px)',
            borderRadius: 'clamp(10px, 1.2vw, 16px)',
            padding: 'clamp(10px, 1.5vw, 20px)',
            cursor: 'pointer',
            backgroundImage: "url('/images/buttonBg.svg')",
            backgroundSize: '900% 1200%',
            backgroundPosition: 'center',
            border: '1px solid rgba(255,255,255,0.35)',
          }}
          onClick={() => useRedirect("/home/ai-tutor")}
        >
          <IconSparkel />
          <h2 style={{ color: 'white', fontSize: 'clamp(11px, 1.1vw, 14px)', letterSpacing: '0.05em' }}>
            {t('home.aiTutor.ready').split(' ').map((word: string, index: number, arr: string[]) => (
              <span key={index}>
                {index === 2 ? <span style={{ fontWeight: 500 }}>{word}</span> : word}
                {index < arr.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h2>
          <img
            src="/images/home/robot.svg"
            alt="AI Tutor"
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 'clamp(60px, 8vw, 120px)',
              height: 'clamp(60px, 8vw, 120px)',
            }}
          />
        </div>

        {/* Upload Notes card */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(6px, 1vh, 12px)',
            justifyContent: 'flex-end',
            padding: 'clamp(10px, 1.5vw, 20px)',
            borderRadius: 'clamp(10px, 1.2vw, 16px)',
            height: 'clamp(110px, 15vh, 160px)',
            backgroundColor: '#BDFF43',
            cursor: 'pointer',
          }}
          onClick={() => useRedirect("/home/ai-tutor?upload=true")}
        >
          <IoArrowForwardSharp style={{
            fontSize: 'clamp(14px, 1.5vw, 20px)',
            transform: 'rotate(-45deg)',
            position: 'absolute',
            top: 'clamp(10px, 1.5vw, 16px)',
            right: 'clamp(10px, 1.5vw, 16px)',
            cursor: 'pointer',
          }} />
          <h2 style={{ fontSize: 'clamp(13px, 1.3vw, 18px)', fontWeight: 500 }}>
            {t('home.aiTutor.uploadNotes')}
          </h2>
          <p style={{ fontSize: 'clamp(11px, 1.1vw, 15px)' }}>
            {t('home.aiTutor.uploadDescription')}
          </p>
        </div>

        {/* Question Bank */}
        <div
          style={{
            display: 'flex',
            gap: '4%',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'clamp(10px, 1.5vh, 16px) clamp(10px, 1.5vw, 16px)',
            borderRadius: 'clamp(10px, 1.2vw, 16px)',
            border: '1px solid #DADADA',
            cursor: 'pointer',
          }}
          className="hover:bg-gray-50 transition-colors"
          onClick={() => useRedirect("/home/questions")}
        >
          <p style={{ fontSize: 'clamp(12px, 1.1vw, 15px)', fontWeight: 500 }}>
            {t('home.questionBank.title')}
          </p>
          <IoArrowForwardSharp style={{ fontSize: 'clamp(14px, 1.5vw, 18px)', transform: 'rotate(-45deg)', flexShrink: 0 }} />
        </div>

        {/* Weak Spot Tracker */}
        <div
          onClick={handleWeakSpotClick}
          style={{
            display: 'flex',
            gap: '4%',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'clamp(10px, 1.5vh, 16px) clamp(10px, 1.5vw, 16px)',
            borderRadius: 'clamp(10px, 1.2vw, 16px)',
            border: '1px solid #DADADA',
            cursor: 'pointer',
            opacity: isPremium ? 1 : 0.9,
          }}
          className={isPremium ? "hover:bg-gray-50 transition-colors" : ""}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 0.8vw, 10px)' }}>
            {!isPremium && (
              <svg width="16" height="13" viewBox="0 0 81 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.93797 44.4392L0.0332797 12.56C-0.329533 10.2058 2.35259 8.59866 4.25803 10.0284L19.5392 21.4879C19.9364 21.7855 20.39 21.9989 20.8725 22.1153C21.355 22.2317 21.8561 22.2485 22.3452 22.1648C22.8344 22.081 23.3014 21.8984 23.7177 21.6282C24.1339 21.358 24.4908 21.0057 24.7663 20.593L37.489 1.51172C38.8327 -0.503906 41.7943 -0.503906 43.1381 1.51172L55.8607 20.593C56.1363 21.0057 56.4931 21.358 56.9094 21.6282C57.3257 21.8984 57.7926 22.081 58.2818 22.1648C58.771 22.2485 59.2721 22.2317 59.7546 22.1153C60.237 21.9989 60.6907 21.7855 61.0879 21.4879L76.369 10.0284C78.2772 8.59866 80.9566 10.2058 80.5938 12.56L75.6891 44.4392H4.93797ZM71.9992 62.1283H8.6279C8.14334 62.1283 7.66351 62.0328 7.21583 61.8474C6.76814 61.662 6.36137 61.3902 6.01872 61.0475C5.32673 60.3555 4.93797 59.417 4.93797 58.4383V50.3355H75.6891V58.4383C75.6891 60.4755 74.0363 62.1283 71.9992 62.1283Z" fill="#9CA3AF" />
              </svg>
            )}
            <p style={{ fontSize: 'clamp(12px, 1.1vw, 15px)', fontWeight: 500, color: isPremium ? 'inherit' : '#9CA3AF' }}>
              {t('home.weakSpotTracker.title')}
            </p>
          </div>
          <IoArrowForwardSharp style={{
            fontSize: 'clamp(14px, 1.5vw, 18px)',
            transform: 'rotate(-45deg)',
            flexShrink: 0,
            color: isPremium ? 'inherit' : '#9CA3AF',
          }} />
        </div>
      </div>

      {/* ── UPGRADE MODAL ── */}
      <Modal
        open={showUpgradeModal}
        onCancel={() => setShowUpgradeModal(false)}
        footer={null}
        centered
        width="clamp(280px,25vw,400px)"
        className="premium-modal"
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 1.5vh, 16px)', width: '100%' }}>
          {/* Icon + texts */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.2vh, 16px)', padding: '0 6%', width: '100%' }}>
            <div style={{ width: 'clamp(48px, 5vw, 64px)', height: 'clamp(48px, 5vw, 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="81" height="63" viewBox="0 0 81 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.93797 44.4392L0.0332797 12.56C-0.329533 10.2058 2.35259 8.59866 4.25803 10.0284L19.5392 21.4879C19.9364 21.7855 20.39 21.9989 20.8725 22.1153C21.355 22.2317 21.8561 22.2485 22.3452 22.1648C22.8344 22.081 23.3014 21.8984 23.7177 21.6282C24.1339 21.358 24.4908 21.0057 24.7663 20.593L37.489 1.51172C38.8327 -0.503906 41.7943 -0.503906 43.1381 1.51172L55.8607 20.593C56.1363 21.0057 56.4931 21.358 56.9094 21.6282C57.3257 21.8984 57.7926 22.081 58.2818 22.1648C58.771 22.2485 59.2721 22.2317 59.7546 22.1153C60.237 21.9989 60.6907 21.7855 61.0879 21.4879L76.369 10.0284C78.2772 8.59866 80.9566 10.2058 80.5938 12.56L75.6891 44.4392H4.93797ZM71.9992 62.1283H8.6279C8.14334 62.1283 7.66351 62.0328 7.21583 61.8474C6.76814 61.662 6.36137 61.3902 6.01872 61.0475C5.32673 60.3555 4.93797 59.417 4.93797 58.4383V50.3355H75.6891V58.4383C75.6891 60.4755 74.0363 62.1283 71.9992 62.1283Z" fill="#1B2A4A" />
              </svg>
            </div>
            <h3 style={{ fontSize: 'clamp(16px, 1.5vw, 20px)', fontWeight: 700, color: '#111827', textAlign: 'center' }}>
              {t('common.premiumFeature')}
            </h3>
            <p style={{ fontSize: 'clamp(12px, 1.1vw, 14px)', color: '#6B7280', textAlign: 'center' }}>
              {t('limits.weakSpotTracker')}
            </p>
          </div>

          {/* Upgrade button */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(40px, 5vh, 52px)',
            borderRadius: 'clamp(8px, 0.8vw, 12px)',
            overflow: 'hidden',
            backgroundImage: "url('/images/buttonBg.svg')",
            backgroundSize: '180% 600%',
            backgroundPosition: 'center',
            boxShadow: '0px 0px 50px 0px #1953CB40',
          }}>
            <button
              onClick={() => {
                setShowUpgradeModal(false);
                useRedirect("/profile?open=subscription");
              }}
              style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                height: '100%',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.35)',
                color: 'white',
                fontWeight: 600,
                fontSize: 'clamp(13px, 1.2vw, 15px)',
                cursor: 'pointer',
              }}
            >
              {t('subscription.upgradeToPremium')}
            </button>
          </div>

          {/* Cancel */}
          <button
            onClick={() => setShowUpgradeModal(false)}
            style={{ fontSize: 'clamp(12px, 1.1vw, 14px)', color: '#6B7280', cursor: 'pointer', background: 'none', border: 'none' }}
            className="hover:text-gray-700 transition-colors"
          >
            {t('common.cancel')}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Home;