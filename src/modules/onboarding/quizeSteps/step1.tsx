"use client";
import { step1Options } from "@/src/libs/constants/onboarding.constants";
import { Button, Input } from "antd";
import { FaArrowLeft } from "react-icons/fa";
import { canGoBack, setSearchParam, useBack } from "@/src/hooks/router.hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "@/src/libs/i18n";

const Step1 = ({
  setCurrentStep,
  quiz,
  setQuiz,
}: {
  setCurrentStep: (step: number) => void;
  quiz: any;
  setQuiz: (fn: any) => void;
}) => {
  
  const [showBack, setShowBack] = useState(false);
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

  const toggle = (val: string) => {
    setQuiz((p: any) => ({
      ...p,
      subjects: p.subjects.includes(val)
        ? p.subjects.filter((v: string) => v !== val)
        : [...p.subjects, val],
    }));
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-xl font-semibold">{t('onboarding.placementQuiz')}</h1>
        <p>{t('quiz.q1' as any)}</p>
      </div>

      <div className="w-[650px] grid grid-cols-2 gap-3 mt-4">
        {step1Options.map((level: any) => (
          <div
            key={level.value}
            className={`w-full h-11 px-3 border rounded-xl flex justify-between items-center gap-3 cursor-pointer transition-all ${quiz.subjects.includes(level.value)
              ? "border-[#2563EB] bg-[#2563EB]"
                : "border-[#DADADA] hover:border-gray-400"
              }`}
            onClick={() => toggle(level.value)}
          >
            {/* <p className="text-sm">{level.label}</p> */}
            <p className={`text-sm ${quiz.subjects.includes(level.value) ? "text-white" : "text-[#121212]"}`}>{getSubjectLabel(level.value)}</p>
            <div
              className={`w-4 h-4 flex justify-center items-center border-2 rounded-[4px] transition-all ${quiz.subjects.includes(level.value)
                ? "border-white bg-white"
                : "border-[#DADADA]"
                }`}
            >
              {quiz.subjects.includes(level.value) && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
        ))}

        <div className="w-full h-11">
          <Input
            placeholder={t('quiz.writeSubjectHere' as any)}
            className="w-full h-full border-t-0! border-r-0! border-l-0! border-b! rounded-none! outline-none! shadow-none! hover:border-primary! focus-within:border-primary!"
          />
        </div>
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
          disabled={quiz.subjects.length === 0}
          onClick={handleContinue}
          // className="w-[180px] h-10! rounded-xl! text-white! bg-primary! mt-4"
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
  );
};

export default Step1;
