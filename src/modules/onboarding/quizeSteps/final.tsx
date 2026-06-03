import { useRedirect } from "@/src/hooks/router.hooks";
import {
  goalLabels,
  styleLabels,
  subjectLabels,
} from "@/src/libs/constants/onboarding.constants";
import { useTranslation } from "@/src/libs/i18n";
import { Button } from "antd";
import Image from "next/image";
import React from "react";

const Final = ({ quiz }: { quiz: any }) => {

  const subjectNames = JSON.parse(localStorage.getItem("selectedSubjectNames") || "[]");
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

  const getGoalLabel = (value: string) => {
    const map: Record<string, string> = {
      'PREPARE_FOR_EXAM': t('quiz.option.exam' as any),
      'REVISE_PREVIOUS_KNOWLEDGE': t('quiz.option.revise' as any),
      'IMPROVE_GRADES': t('quiz.option.grades' as any),
      'IMPROVE_STUDY_HABITS': t('quiz.option.consistency' as any),
      'LEARN_FROM_SCRATCH': t('quiz.option.newTopic' as any),
      'BUILD_LONG_TERM_MASTERY': t('quiz.option.mastery' as any),
    };
    return map[value] || value;
  };

  const getStyleLabel = (value: string) => {
    const map: Record<string, string> = {
      'VISUAL': t('quiz.option.visual' as any),
      'AI_GUIDED': t('quiz.option.aiGuided' as any),
      'AUDITORY': t('quiz.option.auditory' as any),
      'READING_WRITING': t('quiz.option.reading' as any),
      'KINESTHETIC': t('quiz.option.kinesthetic' as any),
    };
    return map[value] || value;
  };

  return (
    <div className="flex flex-col gap-10 items-center">
      <div className="flex flex-col gap-6 items-center">
        <Image
          src="/images/onboarding/finalStepQuizeLogo.svg"
          alt="Final Step Quize Logo"
          width={110}
          height={110}
        />
        <h1 className="text-xl font-semibold text-[#1D47A5] ">
          {t('quiz.congratulations' as any)}
        </h1>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex gap-3 items-center">
          <Image
            src="/images/onboarding/subject.svg"
            alt="Final Step Quize Logo"
            width={48}
            height={48}
          />
          <div className="flex flex-col">
            <p className="text-secondary">{t('quiz.subject' as any)}</p>
            <p className="text-primary">
               {/* {quiz.subjects.map((s: string) => getSubjectLabel(s)).join(", ")} */}
               {subjectNames.length > 0 ? subjectNames.join(", ") : quiz.subjects.join(", ")}
            </p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <Image
            src="/images/onboarding/goal.svg"
            alt="Final Step Quize Logo"
            width={48}
            height={48}
          />
          <div className="flex flex-col">
            <p className="text-secondary">{t('quiz.goal' as any)}</p>
            <p className="text-primary">
              {getGoalLabel(quiz.learningGoal)}
            </p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <Image
            src="/images/onboarding/learningStyle.svg"
            alt="Final Step Quize Logo"
            width={48}
            height={48}
          />
          <div className="flex flex-col">
            <p className="text-secondary">{t('quiz.learningStyle' as any)}</p>
            <p className="text-primary">
              {quiz.learningStyles.map((s: string) => getStyleLabel(s)).join(" + ")}
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={() => useRedirect("/home")}
        // className="h-10! px-16! rounded-xl! text-white! bg-primary! mt-4"
        className="h-10! px-16! rounded-xl! text-white! mt-4"
        style={{
          backgroundImage: "url('/images/buttonBg.svg')",
          backgroundSize: '350% 700%', backgroundPosition: 'center',
          boxShadow: '0px 0px 50px 0px #1953CB40',
          border: '1px solid rgba(255,255,255,0.35)',
        }}
      >
        {t('quiz.startJourney' as any)}
      </Button>
    </div >
  );
};

export default Final;
