"use client";

import IconSparkel from "@/src/components/icons/iconSparkel";
import { useRedirect } from "@/src/hooks/router.hooks";
import { getCurrentWeek, QuestionSource } from "@/src/libs/helpers";
import { getDashboard } from "@/src/services/api/dashboard.api";
// import { getSubscription } from "@/src/services/api/subscription.api";
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
  const { t } = useTranslation();
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

useEffect(() => {
  setActiveTask(null);
}, [pathname]);

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

  // Add this ref
  const activeTaskRef = useRef<any>(null);

  // Keep ref in sync with state
  useEffect(() => {
    activeTaskRef.current = activeTask;
  }, [activeTask]);

  // Use ref inside popstate handler
  useEffect(() => {
    const handlePopState = () => {
      if (activeTaskRef.current) {
        setActiveTask(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // 👈 empty deps — only registers once


  const handleWeakSpotClick = () => {
    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }
    useRedirect("/home/weak-spot-tracker");
  };

  if (loading) {
    return (
      <div className="px-4 grid grid-cols-1 lg:grid-cols-3 gap-2 animate-pulse">
        {/* LEFT SIDE */}
        <div className="p-2 col-span-1 lg:col-span-2 flex flex-col gap-4">
          <div className="h-[120px] rounded-lg bg-gray-200" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="w-[56px] h-[66px] rounded-lg bg-gray-200" />
            ))}
          </div>
          <div className="flex justify-between items-center">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-6 w-24 bg-gray-200 rounded" />
          </div>
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[72px] rounded-[14px] bg-gray-200" />
            ))}
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4 p-2">
          <div className="h-[150px] rounded-xl bg-gray-200" />
          <div className="h-[150px] rounded-xl bg-gray-200" />
          <div className="h-[60px] rounded-xl bg-gray-200" />
          <div className="h-[60px] rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  const streak = dashboard?.currentStreak ?? 0;
  localStorage.setItem("streak", streak);
  const streakTitle =
    streak === 0
      ? t('home.streak.startJourney')
      : t('home.streak.studiedDays', { count: streak });

  const streakSub =
    streak === 0
      ? t('home.streak.consistencyMessage')
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

    if (type === "PRACTICE_QUESTION" || type === "CONCEPT_EXPLANATION") {
      return (
        <QuestionsBank
          taskId={activeTask.id}
          initialQuestions={activeTask.task.questions}
          source={type === "PRACTICE_QUESTION" ? QuestionSource.HOME_PRACTICE_QUESTION : QuestionSource.HOME_CONCEPT_EXPLANATION}
          onClose={() => setActiveTask(null)}
        />
      );
    }

    if (type === "FLASHCARD") {
      return (
        <Flashcards
          taskId={activeTask.id}
          initialQuestions={activeTask.task.questions}
          source={QuestionSource.HOME_PRACTICE_QUESTION}
          onClose={() => setActiveTask(null)}
        />
      );
    }
  }

  return (
    <div className="px-4 grid grid-cols-1 lg:grid-cols-3 gap-2">
      <div className="p-2 overflow-y-auto scrollbar col-span-1 lg:col-span-2 flex flex-col gap-4">

        {/* STREAK */}
        <div className="relative w-full flex items-start justify-between gap-4 rounded-lg px-4 py-6 bg-linear-to-r from-[#F97316] via-[#ED482F] to-[#EF4444]">
          <h1 className="text-xl text-white">
            {streakTitle}
            <br />
            {streakSub}
          </h1>
          <AiOutlineFire className="text-white text-4xl" />
          {streak >= 0 && (
            <div className="absolute -bottom-3 right-5 flex gap-2 items-center text-[#FFFFFF80] font-medium">
              <h2 className="text-5xl">{streak}</h2>
              <p className="text-xl">days</p>
            </div>
          )}
        </div>

       

        {/* WEEK */}
        <div className="flex gap-1 lg:gap-2 items-center overflow-x-auto scrollbar-hide">
          {week.map((date, index) => {
            const iso = date.toISOString().split("T")[0];
            const isSelected = iso === selectedDate;
            return (
              // <div
              //   key={index}
              //   onClick={() => setSelectedDate(iso)}
              //   className={`w-[56px] h-[66px] rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all border
              //     ${isSelected ? "text-white border-transparent" : "bg-white text-black border-[#E5E5E5]"}`}
              //   style={isSelected ? {
              //     backgroundImage: "url('/images/buttonBg.svg')",
              //     backgroundSize: '1700% 1400%',
              //     backgroundPosition: 'center',
              //     boxShadow: '0px 0px 50px 0px #1953CB40',
              //     border: '1px solid rgba(255,255,255,0.35)',
              //   } : { boxShadow: "0px 2px 6px rgba(0,0,0,0.06)" }}
              // >
              <div
                key={index}
                onClick={() => setSelectedDate(iso)}
                className={`w-[42px] lg:w-[56px] h-[60px] lg:h-[66px] shrink-0 rounded-lg flex flex-col items-center justify-center cursor-pointer border
    ${isSelected ? "text-white border-transparent reveal-from-center" : "bg-white text-black border-[#E5E5E5]"}`}
                style={isSelected ? {
                  backgroundImage: "url('/images/buttonBg.svg')",
                  backgroundSize: '1700% 1400%',
                  backgroundPosition: 'center',
                  boxShadow: '0px 0px 50px 0px #1953CB40',
                  border: '1px solid rgba(255,255,255,0.35)',
                } : { boxShadow: "0px 2px 6px rgba(0,0,0,0.06)" }}
              >
                <p className={`text-[16px] font-regular ${isSelected ? "text-white" : "text-secondary"}`}>
                  {date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
                </p>
                <p className="text-[16px] font-medium">{date.getDate()}</p>
              </div>
            );
          })}
        </div>

        {/* TASKS */}
        <div className="flex flex-col gap-6">
          <div className="flex gap-2 items-center justify-between">
            <h2 className="text-xl font-semibold">{isToday ? t('home.tasks.todaysTask') : ""}</h2>
            <p className="text-secondary">
              {t('home.tasks.progress')}: <span className="text-black font-medium">{progress}%</span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {tasksForDate.length === 0 && (
              <div className="p-3 border border-gray-200 rounded-lg text-secondary">
                {t('home.tasks.noTasksScheduled')}
              </div>
            )}

            {tasksForDate.map((task: any) => (
              <div
                key={task.id}
                // onClick={() => setActiveTask(task)}
                onClick={() => {
                  window.history.pushState({ task: true }, '');
                  setActiveTask(task);
                }}
                className="p-2 border border-gray-200 rounded-[14px] flex gap-1 items-center justify-between cursor-pointer"
                style={{ boxShadow: "0px 0px 1px 0px #00000040" }}
              >
                <div className="flex flex-col">
                  <h3 className="font-medium text-[17px]">
                    {task.task.topic} - {task.task.subtopic}
                  </h3>
                  <p className="text-[15px] text-secondary flex gap-2 items-center font-normal">
                    {formatTaskType(task.task.taskType)}
                    <GoDotFill className="text-primary" />
                    <span className="text-primary font-normal">
                      {task.status === "COMPLETED" ? t('home.tasks.completed') : t('home.tasks.pending')}
                    </span>
                  </p>
                </div>
                <LuChevronRight className="text-2xl text-secondary" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col gap-4 p-2 overflow-y-auto scrollbar">
        <div
          // className="relative h-[126px] border-2 border-[#3A86FF] flex flex-col justify-end gap-4 bg-primary rounded-xl p-4 cursor-pointer"
          // className="relative h-[126px] flex flex-col justify-end gap-4 rounded-xl p-4 cursor-pointer"
          className="relative h-[150px] flex flex-col justify-end gap-4 rounded-xl p-4 cursor-pointer"

          style={{
            backgroundImage: "url('/images/buttonBg.svg')",
            backgroundSize: '800% 1200%',
            backgroundPosition: 'center',
            // boxShadow: '0px 0px 50px 0px #1953CB40',
            border: '1px solid rgba(255,255,255,0.35)',
          }}
          onClick={() => useRedirect("/home/ai-tutor")}
        >
          <IconSparkel />
          <h2 className="text-white text-sm tracking-wider">
            {t('home.aiTutor.ready').split(' ').map((word, index, arr) => (
              <span key={index}>
                {index === 2 ? <span className="font-medium">{word}</span> : word}
                {index < arr.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h2>
          <img
            src="/images/home/robot.svg"
            alt="AI Tutor"
            // className="w-[120px] h-[120px] absolute bottom-0 right-0"
            className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] absolute bottom-0 right-0"

          />
        </div>

        <div
          // className="relative flex flex-col gap-3 justify-end p-4 rounded-xl h-[166px] bg-[#BDFF43] cursor-pointer"
          className="relative flex flex-col gap-3 justify-end p-4 rounded-xl h-[150px] bg-[#BDFF43] cursor-pointer"

          onClick={() => useRedirect("/home/ai-tutor?upload=true")}
        >
          <IoArrowForwardSharp className="text-xl -rotate-45 absolute top-4 right-4 cursor-pointer" />
          <h2 className="text-lg font-medium">{t('home.aiTutor.uploadNotes')}</h2>
          <p>{t('home.aiTutor.uploadDescription')}</p>
        </div>

        <div
          className="flex gap-2 items-center justify-between p-4 rounded-xl border border-[#DADADA] cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => useRedirect("/home/questions")}
        >
          <p className="text-sm font-medium">{t('home.questionBank.title')}</p>
          <IoArrowForwardSharp className="text-lg -rotate-45" />
        </div>

        {/* ── Weak Spot Tracker — premium only ── */}
        <div
          onClick={handleWeakSpotClick}
          className={`flex gap-2 items-center justify-between p-4 rounded-xl border transition-colors
            ${isPremium
              ? "border-[#DADADA] cursor-pointer hover:bg-gray-50"
              : "border-[#DADADA] cursor-pointer opacity-90"
            }`}
        >
          <div className="flex items-center gap-2">
            {!isPremium && (
              <svg width="16" height="13" viewBox="0 0 81 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.93797 44.4392L0.0332797 12.56C-0.329533 10.2058 2.35259 8.59866 4.25803 10.0284L19.5392 21.4879C19.9364 21.7855 20.39 21.9989 20.8725 22.1153C21.355 22.2317 21.8561 22.2485 22.3452 22.1648C22.8344 22.081 23.3014 21.8984 23.7177 21.6282C24.1339 21.358 24.4908 21.0057 24.7663 20.593L37.489 1.51172C38.8327 -0.503906 41.7943 -0.503906 43.1381 1.51172L55.8607 20.593C56.1363 21.0057 56.4931 21.358 56.9094 21.6282C57.3257 21.8984 57.7926 22.081 58.2818 22.1648C58.771 22.2485 59.2721 22.2317 59.7546 22.1153C60.237 21.9989 60.6907 21.7855 61.0879 21.4879L76.369 10.0284C78.2772 8.59866 80.9566 10.2058 80.5938 12.56L75.6891 44.4392H4.93797ZM71.9992 62.1283H8.6279C8.14334 62.1283 7.66351 62.0328 7.21583 61.8474C6.76814 61.662 6.36137 61.3902 6.01872 61.0475C5.32673 60.3555 4.93797 59.417 4.93797 58.4383V50.3355H75.6891V58.4383C75.6891 60.4755 74.0363 62.1283 71.9992 62.1283Z" fill="#9CA3AF" />
              </svg>
            )}
            <p className={`text-sm font-medium ${!isPremium ? "text-gray-400" : ""}`}>
              {t('home.weakSpotTracker.title')}
            </p>
          </div>
          <IoArrowForwardSharp className={`text-lg -rotate-45 ${!isPremium ? "text-gray-400" : ""}`} />
        </div>
      </div>

      {/* UPGRADE MODAL */}
      {/* UPGRADE MODAL */}
      <Modal
        open={showUpgradeModal}
        onCancel={() => setShowUpgradeModal(false)}
        footer={null}
        centered
        width={400}
        className="premium-modal"
      >
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Icon, title, description — keep horizontal padding */}
          <div className="flex flex-col items-center gap-4 px-6 w-full">
            <div className="w-16 h-16 flex items-center justify-center">
              <svg width="81" height="63" viewBox="0 0 81 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.93797 44.4392L0.0332797 12.56C-0.329533 10.2058 2.35259 8.59866 4.25803 10.0284L19.5392 21.4879C19.9364 21.7855 20.39 21.9989 20.8725 22.1153C21.355 22.2317 21.8561 22.2485 22.3452 22.1648C22.8344 22.081 23.3014 21.8984 23.7177 21.6282C24.1339 21.358 24.4908 21.0057 24.7663 20.593L37.489 1.51172C38.8327 -0.503906 41.7943 -0.503906 43.1381 1.51172L55.8607 20.593C56.1363 21.0057 56.4931 21.358 56.9094 21.6282C57.3257 21.8984 57.7926 22.081 58.2818 22.1648C58.771 22.2485 59.2721 22.2317 59.7546 22.1153C60.237 21.9989 60.6907 21.7855 61.0879 21.4879L76.369 10.0284C78.2772 8.59866 80.9566 10.2058 80.5938 12.56L75.6891 44.4392H4.93797ZM71.9992 62.1283H8.6279C8.14334 62.1283 7.66351 62.0328 7.21583 61.8474C6.76814 61.662 6.36137 61.3902 6.01872 61.0475C5.32673 60.3555 4.93797 59.417 4.93797 58.4383V50.3355H75.6891V58.4383C75.6891 60.4755 74.0363 62.1283 71.9992 62.1283Z" fill="#1B2A4A" />
              </svg>
            </div>
            <h3 className="text-[20px] font-bold text-gray-900 text-center">
            {/* Premium Feature */}
            {t('common.premiumFeature')}
              </h3>
            <p className="text-[14px] text-secondary text-center">
              {t('limits.weakSpotTracker')}
            </p>
          </div>

          {/* Button — full width, no horizontal padding */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '48px',
              borderRadius: '10px',
              overflow: 'hidden',
              backgroundImage: "url('/images/buttonBg.svg')",
              backgroundSize: '180% 600%',
              backgroundPosition: 'center',
              boxShadow: '0px 0px 50px 0px #1953CB40'

            }}
          >
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
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              {/* Upgrade To Premium */}
              {t('subscription.upgradeToPremium')}
            </button>
          </div>

          <button
            onClick={() => setShowUpgradeModal(false)}
            className="text-[14px] text-secondary hover:text-gray-700 transition-colors self-center"
          >
            {/* Maybe later */}
            {t('common.cancel')}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Home;