"use client";

import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { useTranslation } from "@/src/libs/i18n";
import { generateSimuladoQuestions, questionBankSimuladoQuestions } from "@/src/services/api/question.api";
import { useRedirect } from "@/src/hooks/router.hooks";
import { Question } from "@/src/libs/types/dashboard.types";
import { difficulties, QuestionSource, subjects } from "@/src/libs/helpers";
import { message } from "antd";

const ChooseSubjects = ({
  onBack,
  onStartQuestions,
  source,
  remainingQuestions = 40, // ✅ default 40 for premium, passed from parent for free users
}: {
  onBack?: () => void;
  onStartQuestions?: (task: { id: string; questions: Question[] }) => void;
  source: QuestionSource;
  remainingQuestions?: number;
}) => {
  // ✅ Initial slider value should not exceed remainingQuestions
  const [value, setValue] = useState(Math.min(12, remainingQuestions));
  const { t } = useTranslation();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSimulado = source === QuestionSource.SIMULADO;
  const isExplore = source === QuestionSource.EXPLORE_QUESTION;

  const getSubjectLabel = (value: string) => {
    const map: Record<string, string> = {
        'ALL': t('questions.allSubjects' as any),
        'MATHEMATICS': t('questions.mathematics' as any),
        'SCIENCE': t('questions.science' as any),
        'HISTORY': t('questions.history' as any),
        'GEOGRAPHY': t('questions.geography' as any),
        'ENGLISH': t('questions.english' as any),
        'COMPUTER_SCIENCE': 'Computer Science',
        'BUSINESS_ECONOMICS': 'Business / Economics',
        'LANGUAGES': 'Languages',
        'OTHER': t('common.other' as any),
    };
    return map[value] || value;
};

const getDifficultyLabel = (value: string) => {
    const map: Record<string, string> = {
        'EASY': t('home.simulados.easy' as any),
        'MEDIUM': t('home.simulados.medium' as any),
        'HARD': t('home.simulados.hard' as any),
        'MIX': t('home.simulados.mix' as any),
    };
    return map[value] || value;
};

  // TOGGLE SUBJECT
  const handleSubject = (value: string) => {

    // 👉 Explore = single select
    if (isExplore) {
      setSelectedSubjects([value]);
      return;
    }

    // 👉 Simulado = multi select (existing logic)
    if (value === "ALL") {
      setSelectedSubjects(["ALL"]);
      return;
    }

    setSelectedSubjects((prev) => {
      const filtered = prev.filter((s) => s !== "ALL");

      if (filtered.includes(value)) {
        return filtered.filter((s) => s !== value);
      }

      return [...filtered, value];
    });
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

    if ((isSimulado || isExplore) && !selectedDifficulty) {
      alert("Please select difficulty");
      return;
    }

    try {
      setLoading(true);

      let subjectsForApi = selectedSubjects;

      if (selectedSubjects.includes("ALL")) {
        subjectsForApi = subjects
          .filter((s) => s.value !== "ALL")
          .map((s) => s.value);
      }

      let res;
      console.log("isSimulado", subjectsForApi, selectedDifficulty)
      if (isSimulado) {
        res = await generateSimuladoQuestions({
          subject: subjectsForApi,
          numberOfQuestions: value,
          difficulty: selectedDifficulty!,
        });
      }

      if (isExplore) {
        res = await questionBankSimuladoQuestions({
          subject: Array.isArray(subjectsForApi)
            ? subjectsForApi
            : [subjectsForApi],
          numberOfQuestions: value,
          difficulty: selectedDifficulty || "EASY",
        });
      }

      onStartQuestions?.({
        id: res?.id || "",
        questions: res?.questions || [],
      });
    } catch (err: any) {

      console.log("ERROR RAW:", err);

      const errorMessage =
        err?.message || "Something went wrong";

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6">

      {/* TITLE */}
      <h1 className="text-[30px] font-medium text-[#121212] mb-3 mt-12">
        {t('questions.chooseSubject')}
      </h1>

      {/* SUBJECT BUTTONS */}
      <div className="flex gap-3 flex-wrap">
        {subjects
          .filter((item) => !(isExplore && item.value === "ALL"))
          .map((item) => {
            const isSelected = selectedSubjects.includes(item.value);

            return (
              <div
                key={item.value}
                onClick={() => handleSubject(item.value)}
                className="h-[36px] px-4 flex items-center rounded-[4px] border text-[18px] cursor-pointer transition-all"
                style={{
                  borderColor: isSelected ? "#0F3057" : "#DADADA",
                  // color: isSelected ? "#0F3057" : "#121212",
                  color: isSelected ? "#fff" : "#121212",
                  // background: isSelected ? "#F5F9FF" : "white",
                  background: isSelected ? "#2563EB" : "white",
                }}
              >
                {/* {item.label} */}
                {getSubjectLabel(item.value)}
              </div>
            );
          })}
      </div>

      {(isSimulado || isExplore) && (
        <>
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
                max={remainingQuestions} // ✅ limited to remainingQuestions for free users
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full accent-[#2563EB]"
              />

              {/* VALUE UNDER THUMB */}
              {/* ✅ position calculation now uses remainingQuestions instead of hardcoded 40 */}
              <div
                className="absolute top-6 text-[16px] text-[#121212] -translate-x-1/2"
                style={{
                  left: `calc(${(value - 0.5) / remainingQuestions * 100}%)`,
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
                      // borderColor: isSelected ? "#0F3057" : "#DADADA",
                      borderColor: isSelected ? "#2563EB" : "#DADADA",
                      // background: isSelected ? "#F5F9FF" : "white",
                      background: isSelected ? "#2563EB" : "white",
                    }}
                  >
                    <span
                      className="text-[18px]"
                      style={{
                        // color: isSelected ? "#0F3057" : "#121212",
                        color: isSelected ? "#fff" : "#121212",
                      }}
                    >
                      {/* {item.label} */}
                      {getDifficultyLabel(item.value)}
                    </span>

                    {/* RADIO */}
                    <div
                      className="w-4 h-4 rounded-full border flex items-center justify-center"
                      style={{
                        // borderColor: isSelected ? "#0F3057" : "#DADADA",
                        borderColor: isSelected ? "#fff" : "#DADADA",
                      }}
                    >
                      {isSelected && (
                        // <div className="w-2 h-2 rounded-full bg-[#0F3057]" />
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* BUTTONS */}
      <div className="flex justify-center gap-6 mt-20">

        {/* BACK */}
        <button
          onClick={onBack}
          className="w-40 h-[50px] px-10 border border-[#DADADA] rounded-[12px] flex items-center justify-center cursor-pointer"
        >
          <GoArrowLeft className="text-[#121212] text-[20px]" />
          <span className="text-[#121212] text-[16px] ml-2">
            {t('common.back')}
          </span>
        </button>

        {/* CONTINUE */}
       <div style={{ borderRadius: '12px', boxShadow: '0px 0px 50px 0px #1953CB40' }}>
  <div style={{
    position: 'relative', width: '320px', height: '50px',
    borderRadius: '12px', overflow: 'hidden',
    backgroundImage: "url('/images/buttonBg.svg')",
    backgroundSize: '350% 700%', backgroundPosition: 'center',
  }}>
    <button
      onClick={handleContinue}
      disabled={loading}
      style={{
        width: '100%', height: '100%', background: 'transparent',
        border: '1px solid rgba(255,255,255,0.35)', color: 'white',
        fontWeight: '600', fontSize: '16px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {t('common.loading')}
        </>
      ) : (
        t('common.continue')
      )}
    </button>
  </div>
</div>

      </div>
    </div>
  );
};

export default ChooseSubjects;