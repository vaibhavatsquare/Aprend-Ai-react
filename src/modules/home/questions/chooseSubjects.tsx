"use client";

import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { t } from "@/src/libs/i18n";
import { generateSimuladoQuestions } from "@/src/services/api/question.api";
import QuestionsBank from "./questionsBank";
import { useRedirect } from "@/src/hooks/router.hooks";
import { Question } from "@/src/libs/types/dashboard.types";
import { difficulties, subjects } from "@/src/libs/constants/helper";

const ChooseSubjects = ({
  onBack,
  onStartQuestions,
}: {
  onBack?: () => void;
  onStartQuestions?: () => void;
}) => {
  const [value, setValue] = useState(12);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<{
    id: string;
    questions: Question[];
  } | null>(null);


  // TOGGLE SUBJECT
  const handleSubject = (value: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(value)
        ? prev.filter((i) => i !== value)
        : [...prev, value]
    );
  };

  // SELECT DIFFICULTY
  const handleDifficulty = (item: string) => {
    setSelectedDifficulty(item);
  };

  const handleContinue = async () => {
    if (!selectedSubjects.length) {
      alert("Please select at least one subject");
      return;
    }

    if (!selectedDifficulty) {
      alert("Please select difficulty");
      return;
    }

    try {
      setLoading(true);

      const res = await generateSimuladoQuestions({
        subject: selectedSubjects,
        numberOfQuestions: value,
        difficulty: selectedDifficulty,
      });

      setActiveTask({
        id: res.id,
        questions: res.questions,
      });

      onStartQuestions?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (activeTask) {
    return (
      <QuestionsBank
        taskId={activeTask.id}
        initialQuestions={activeTask.questions}
        onClose={() => useRedirect("/home", true)}
      />
    );
  }

  return (
    <div className="px-6">

      {/* TITLE */}
      <h1 className="text-[30px] font-medium text-[#121212] mb-3 mt-12">
        {t('questions.chooseSubject')}
      </h1>

      {/* SUBJECT BUTTONS */}
      <div className="flex gap-3 flex-wrap">
        {subjects.map((item) => {
          const isSelected = selectedSubjects.includes(item.value);

          return (
            <div
              key={item.value}
              onClick={() => handleSubject(item.value)}
              className="h-[36px] px-4 flex items-center rounded-[4px] border text-[18px] cursor-pointer transition-all"
              style={{
                borderColor: isSelected ? "#0F3057" : "#DADADA",
                color: isSelected ? "#0F3057" : "#121212",
                background: isSelected ? "#F5F9FF" : "white",
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>

      {/* SPACING */}
      <div className="h-[34px]" />

      {/* NUMBER */}
      <h1 className="text-[30px] font-medium text-[#121212] mb-4">
        {t('questions.numberOfQuestions')}
      </h1>

      {/* SLIDER */}
      <div className="flex justify-start">
        <div className="relative w-[60%]">

          <input
            type="range"
            min={1}
            max={40}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full accent-[#0F3057]"
          />

          {/* VALUE UNDER THUMB */}
          <div
            className="absolute top-6 text-[16px] text-[#121212] -translate-x-1/2"
            style={{
              left: `calc(${(value - 0.5) / 40 * 100}%)`,
            }}
          >
            {value}
          </div>
        </div>
      </div>

      {/* SPACING */}
      <div className="h-[52px]" />

      {/* DIFFICULTY */}
      <h1 className="text-[30px] font-medium text-[#121212] mb-6">
        {t('questions.selectDifficulty')}
      </h1>

      <div className="w-full flex justify-left">
        <div className="grid grid-cols-5 gap-4 w-full max-w-[900px]">
          {difficulties.map((item) => {
            const isSelected = selectedDifficulty === item.value;

            return (
              <div
                key={item.value}
                onClick={() => handleDifficulty(item.value)}
                className="w-full h-[70px] border rounded-[12px] px-4 flex items-center justify-between cursor-pointer transition-all"
                style={{
                  borderColor: isSelected ? "#0F3057" : "#DADADA",
                  background: isSelected ? "#F5F9FF" : "white",
                }}
              >
                <span
                  className="text-[18px]"
                  style={{
                    color: isSelected ? "#0F3057" : "#121212",
                  }}
                >
                  {item.label}
                </span>

                {/* RADIO */}
                <div
                  className="w-4 h-4 rounded-full border flex items-center justify-center"
                  style={{
                    borderColor: isSelected ? "#0F3057" : "#DADADA",
                  }}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[#0F3057]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-center gap-6 mt-20">

        {/* BACK */}
        <button
          onClick={onBack}
          className="w-40 h-[50px] px-10 border border-[#DADADA] rounded-[12px] flex items-center justify-center cursor-pointer"
        >
          <GoArrowLeft className="text-[#121212] text-[20px]" />
          {/* Text */}
          <span className="text-[#121212] text-[16px] ml-2">
            Back
          </span>

        </button>

        {/* CONTINUE */}
        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-80 h-[50px] px-16 bg-[#0F3057] text-white rounded-[12px] flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            "Continue"
          )}
        </button>

      </div>
    </div>
  );
};

export default ChooseSubjects;