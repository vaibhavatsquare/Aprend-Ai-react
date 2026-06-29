"use client";
import { Button, Input, Spin } from "antd";
import { FaArrowLeft } from "react-icons/fa";
import { canGoBack, setSearchParam, useBack } from "@/src/hooks/router.hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "@/src/libs/i18n";
import { getSubjectsByLevel } from "@/src/services/api/user.api";

const Step1 = ({
  setCurrentStep,
  quiz,
  setQuiz,
  educationLevelId,
}: {
  setCurrentStep: (step: number) => void;
  quiz: any;
  setQuiz: (fn: any) => void;
  educationLevelId: string;
}) => {
  
  const [showBack, setShowBack] = useState(false);
  const [subjectOptions, setSubjectOptions] = useState<any[]>([]);
const [loadingSubjects, setLoadingSubjects] = useState(true);
const [otherSubjectId, setOtherSubjectId] = useState<string | null>(null);
const [customSubjectText, setCustomSubjectText] = useState("");


useEffect(() => {
  console.log("educationLevelId in step1:", educationLevelId);
  if (!educationLevelId) return;
  const cached = localStorage.getItem("subjectsByLevel");
  if (cached) {
    const data = JSON.parse(cached);
    setSubjectOptions(data);
    const other = data.find((s: any) => s.name === "Other");
    if (other) setOtherSubjectId(other.id);
    setLoadingSubjects(false);
    return;
  }
  setLoadingSubjects(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const language = user?.user_language || "ENGLISH";
  getSubjectsByLevel(educationLevelId, language)
    .then((data) => {
      setSubjectOptions(data);
      const other = data.find((s: any) => s.name === "Other");
      if (other) setOtherSubjectId(other.id);
      localStorage.setItem("subjectsByLevel", JSON.stringify(data));
    })
    .catch(() => {})
    .finally(() => setLoadingSubjects(false));
}, [educationLevelId]);


const { t } = useTranslation();

const getSubjectLabel = (value: string) => {
    const map: Record<string, string> = {
        'ENGLISH': t('quiz.option.english' as any),
        'MATHEMATICS': t('quiz.option.mathematics' as any),
        'SCIENCE': t('quiz.option.science' as any),
        'HISTORY': t('quiz.option.history' as any),
        'GEOGRAPHY': t('quiz.option.geography' as any),
        'COMPUTER_SCIENCE': t('quiz.option.computerScience' as any),
        'BUSINESS_ECONOMICS': t('quiz.option.business' as any),
        'LANGUAGES': t('quiz.option.languages' as any),
        'OTHER': t('quiz.option.other' as any),
    };
    return map[value] || value;
};

  useEffect(() => {
    setShowBack(canGoBack());
  }, []);

  const handleContinue = () => {
    setSearchParam("step", 2);
    setCurrentStep(2);
  };


const toggle = (val: string, name: string) => {
  if (val === otherSubjectId && quiz.subjects.includes(val)) {
    setCustomSubjectText("");
  }
  setQuiz((p: any) => {
    const isSelected = p.subjects.includes(val);
    const newSubjects = isSelected
      ? p.subjects.filter((v: string) => v !== val)
      : [...p.subjects, val];
    const newSubjectNames = isSelected
      ? (p.subjectNames || []).filter((_: string, i: number) => p.subjects[i] !== val)
      : [...(p.subjectNames || []), name];

    localStorage.setItem("selectedSubjectNames", JSON.stringify(newSubjectNames));

    return {
      ...p,
      subjects: newSubjects,
      subjectNames: newSubjectNames,
    };
  });
};

const handleCustomSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setCustomSubjectText(text);
    setQuiz((p: any) => {
      const otherIndex = p.subjects.indexOf(otherSubjectId);
      if (otherIndex === -1) return p;
      const newSubjectNames = [...(p.subjectNames || [])];
      newSubjectNames[otherIndex] = text || "Other";
      localStorage.setItem("selectedSubjectNames", JSON.stringify(newSubjectNames));
      return { ...p, subjectNames: newSubjectNames };
    });
  };

  const isOtherSelected = otherSubjectId !== null && quiz.subjects.includes(otherSubjectId);
  return (
  <>
    {/* {loadingSubjects && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <Loader />
      </div>
    )} */}
    {/* {loadingSubjects && <MiniLoader />} */}
    <div className="flex flex-col gap-6 items-center">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-xl font-semibold">{t('onboarding.placementQuiz')}</h1>
        <p>{t('quiz.q1' as any)}</p>
      </div>

     <div className="w-[650px] grid grid-cols-2 gap-3 mt-4">
  {loadingSubjects ? (
    [...Array(6)].map((_, i) => (
      <div key={i} className="w-full h-11 rounded-xl bg-gray-100 animate-pulse" />
    ))
  ) : subjectOptions.map((level: any) => (

          <div
            key={level.id}
            className={`w-full h-11 px-3 border rounded-xl flex justify-between items-center gap-3 cursor-pointer transition-all ${quiz.subjects.includes(level.id)
              ? "border-[#2563EB] bg-[#2563EB]"
                : "border-[#DADADA] hover:border-gray-400"
              }`}
            onClick={() => toggle(level.id,level.name)}
            style={quiz.subjects.includes(level.id) ? { boxShadow: '0px 4px 16px 0px #2563EB40' } : undefined}
          >
            {/* <p className="text-sm">{level.label}</p> */}
            <div className="flex items-center gap-2">
              {level.imageUrl ? (
                <img
                  src={level.imageUrl}
                  alt={level.name}
                  width={20}
                  height={20}
                  style={{ objectFit: 'contain', flexShrink: 0 }}
                />
              ) : (
                <span style={{ fontSize: '18px', lineHeight: 1 }}>📚</span>
              )}
              <p className={`text-sm ${quiz.subjects.includes(level.id) ? "text-white" : "text-[#121212]"}`}>{level.name}</p>
            </div>
            <div
              className={`w-4 h-4 flex justify-center items-center border-2 rounded-[4px] transition-all ${quiz.subjects.includes(level.id)
                ? "border-white bg-white"
                : "border-[#DADADA]"
                }`}
            >
              {quiz.subjects.includes(level.id) && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
        ))}

        {isOtherSelected && (
            <div className="col-span-2 w-full h-11">
              <Input
                placeholder={t('quiz.writeSubjectHere' as any)}
                value={customSubjectText}
                onChange={handleCustomSubjectChange}
                className="w-full h-full border-t-0! border-r-0! border-l-0! border-b! rounded-none! outline-none! shadow-none! hover:border-primary! focus-within:border-primary!"
              />
            </div>
          )}
      </div>

      <div className="w-[300px] flex gap-3 items-center mt-6">
        {showBack && (
          <Button
            onClick={useBack}
            className="flex-1 h-10! rounded-xl! border border-[#DADADA]! text-primary! bg-white! mt-4"
            icon={<FaArrowLeft />}
          >
            {t('common.back')}
          </Button>
        )}
        <Button
          disabled={
            loadingSubjects ||
            quiz.subjects.length === 0 ||
            (isOtherSelected && customSubjectText.trim() === "")
          }
          onClick={handleContinue}
          className="w-[180px] h-10! rounded-xl! text-white! mt-4"
          style={{
            backgroundImage: "url('/images/buttonBg.svg')",
            backgroundSize: '350% 700%', backgroundPosition: 'center',
            boxShadow: '0px 0px 50px 0px #1953CB40',
            border: '1px solid rgba(255,255,255,0.35)',
          }}
        >
          {t('common.continue')}
        </Button>
      </div>
    </div>
    </>

  );
};

export default Step1;
