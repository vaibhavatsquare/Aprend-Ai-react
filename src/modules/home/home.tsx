"use client";

import IconSparkel from "@/src/components/icons/iconSparkel";
import { useRedirect } from "@/src/hooks/router.hooks";
import { getCurrentWeek, getGreeting, getStoredUser } from "@/src/libs/helpers";
import { getDashboard } from "@/src/services/api/dashboard.api";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineFire } from "react-icons/ai";
import { GoDotFill } from "react-icons/go";
import { IoArrowForwardSharp } from "react-icons/io5";
import { LuChevronRight } from "react-icons/lu";
import QuestionsBank from "./questions/questionsBank";
import Flashcards from "../flashcards/flashCards";

const formatTaskType = (type: string) => {
  if (type === "FLASHCARD") return "Flashcards";
  if (type === "PRACTICE_QUESTION") return "Practice Questions";
  if (type === "CONCEPT_EXPLANATION") return "Concept Explanation";
  return type;
};

const Home = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const week = useMemo(() => getCurrentWeek(), []);
  const todayIso = new Date().toISOString().split("T")[0];
  const isToday = selectedDate === todayIso;
  const [activeTask, setActiveTask] = useState<any>(null);

  useEffect(() => {
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
  }, []);

  if (loading) {
  return (
    <div className="px-4 grid grid-cols-3 gap-2 animate-pulse">
      
      {/* LEFT SIDE */}
      <div className="h-[calc(100vh-80px)] p-2 col-span-2 flex flex-col gap-4">

        {/* Streak Card */}
        <div className="h-[120px] rounded-lg bg-gray-200" />

        {/* Week Selector */}
        <div className="flex gap-2">
          {[1,2,3,4,5,6,7].map((i) => (
            <div
              key={i}
              className="w-[56px] h-[66px] rounded-lg bg-gray-200"
            />
          ))}
        </div>

        {/* Task Header */}
        <div className="flex justify-between items-center">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-6 w-24 bg-gray-200 rounded" />
        </div>

        {/* Task List */}
        <div className="flex flex-col gap-3">
          {[1,2,3,4].map((i) => (
            <div
              key={i}
              className="h-[72px] rounded-[14px] bg-gray-200"
            />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col gap-4 h-[calc(100vh-80px)] p-2">
        
        {/* AI Tutor Card */}
        <div className="h-[126px] rounded-xl bg-gray-200" />

        {/* Upload Notes */}
        <div className="h-[166px] rounded-xl bg-gray-200" />

        {/* Question Bank */}
        <div className="h-[60px] rounded-xl bg-gray-200" />

        {/* Weak Spot */}
        <div className="h-[60px] rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}

  const streak = dashboard?.currentStreak ?? 0;
  localStorage.setItem("streak", streak);
  const streakTitle =
    streak === 0
      ? "Start your learning journey today 🚀"
      : `You've studied ${streak} days in a row!`;

  const streakSub =
    streak === 0
      ? "Consistency builds mastery. Let's begin!"
      : "Keep it up 💪";

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

    if (type === "PRACTICE_QUESTION") {
      return (
        <QuestionsBank
          taskId={activeTask.task.id}
          initialQuestions={activeTask.task.questions}
          onClose={() => setActiveTask(null)}
        />
      );
    }

    if (type === "FLASHCARD") {
      return (
        <Flashcards
          taskId={activeTask.task.id}
          initialQuestions={activeTask.task.questions}
          onClose={() => setActiveTask(null)}
        />
      );
    }

    // if (type === "CONCEPT_EXPLANATION") {
    //   return (
    //     <ConceptExplanationScreen
    //       taskId={activeTask.task.id}
    //       initialData={activeTask.task}
    //       onClose={() => setActiveTask(null)}
    //     />
    //   );
    // }
  }

  return (
    <div className="px-4 grid grid-cols-3 gap-2">
      <div className="h-[calc(100vh-80px)] p-2 overflow-y-auto scrollbar col-span-2 flex flex-col gap-4">

        {/* SAME STREAK DESIGN */}
        <div className="relative w-full flex items-start justify-between gap-4 rounded-lg px-4 py-6 bg-linear-to-r from-[#F97316] via-[#ED482F] to-[#EF4444]">
          <h1 className="text-xl text-white">
            {streakTitle}
            <br />
            {streakSub}
          </h1>
          <AiOutlineFire className="text-white text-4xl" />
          {streak > 0 && (
            <div className="absolute -bottom-3 right-5 flex gap-2 items-center text-[#FFFFFF80] font-medium">
              <h2 className="text-5xl">{streak}</h2>
              <p className="text-xl">days</p>
            </div>
          )}
        </div>

        {/* SAME WEEK DESIGN */}
        <div className="flex gap-2 items-center">
          {week.map((date, index) => {
            const iso = date.toISOString().split("T")[0];
            const isSelected = iso === selectedDate;

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(iso)}
                className={`w-[56px] h-[66px] rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all border
          ${isSelected
                    ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                    : "bg-white text-black border-[#E5E5E5]"
                  }`}
                style={{
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.06)",
                }}
              >
                <p
                  className={`text-[16px] font-regular ${isSelected ? "text-white" : "text-secondary"
                    }`}
                >
                  {date
                    .toLocaleDateString("en-US", { weekday: "short" })
                    .toUpperCase()}
                </p>

                <p className="text-[16px] font-medium">
                  {date.getDate()}
                </p>
              </div>
            );
          })}
        </div>

        {/* TASK SECTION SAME */}
        <div className="flex flex-col gap-6">
          <div className="flex gap-2 items-center justify-between">
            <h2 className="text-xl font-semibold">{isToday ? "Today's Task" : ""}</h2>
            <p className="text-secondary">
              Progress: <span className="text-black font-medium">{progress}%</span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {tasksForDate.length === 0 && (
              <div className="p-3 border border-gray-200 rounded-lg text-secondary">
                No tasks scheduled
              </div>
            )}

            {tasksForDate.map((task: any) => (
              <div
                key={task.id}
                onClick={() => setActiveTask(task)}
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
                      {task.status === "COMPLETED" ? "Completed" : "Pending"}
                    </span>
                  </p>
                </div>

                <LuChevronRight className="text-2xl text-secondary" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE UNTOUCHED */}
      <div className="flex flex-col gap-4 h-[calc(100vh-80px)] p-2 overflow-y-auto scrollbar">
        <div
          className="relative h-[126px] border-2 border-[#3A86FF] flex flex-col justify-end gap-4 bg-primary rounded-xl p-4 cursor-pointer"
          onClick={() => useRedirect("/home/ai-tutor")}
        >
          <IconSparkel />
          <h2 className="text-white text-sm tracking-wider">
            YOUR <span className="font-medium">AI TUTOR</span> IS READY TO HELP
          </h2>
          <Image
            src="/images/home/robot.svg"
            alt="AI Tutor"
            width={120}
            height={120}
            className="absolute bottom-0 right-0"
          />
        </div>

        <div className="relative flex flex-col gap-3 justify-end p-4 rounded-xl h-[166px] bg-[#BDFF43]">
          <IoArrowForwardSharp className="text-xl -rotate-45 absolute top-4 right-4 cursor-pointer" />
          <h2 className="text-lg font-medium">Upload Notes</h2>
          <p>
            Upload images to create new <br />
            study sets.
          </p>
        </div>

        <div
          className="flex gap-2 items-center justify-between p-4 rounded-xl border border-[#DADADA] cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => useRedirect("/home/questions")}
        >
          <p className="text-sm font-medium">Question Bank</p>
          <IoArrowForwardSharp className="text-lg -rotate-45" />
        </div>

        <div className="flex gap-2 items-center justify-between p-4 rounded-xl border border-[#DADADA]">
          <p className="text-sm font-medium">Weak Spot Tracker</p>
          <IoArrowForwardSharp className="text-lg -rotate-45 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Home;
