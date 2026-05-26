"use client";
import { Button } from "antd";
import { FaArrowLeft } from "react-icons/fa";
import { step2Options } from "@/src/libs/constants/onboarding.constants";
import { setSearchParam } from "@/src/hooks/router.hooks";
import { useTranslation } from "@/src/libs/i18n";

const Step2 = ({
  setCurrentStep,
  quiz,
  setQuiz,
}: {
  setCurrentStep: (step: number) => void;
  quiz: any;
  setQuiz: (fn: any) => void;
}) => {

  const handleSelect = (val: string) => {
    setQuiz((p: any) => ({ ...p, learningGoal: val }));
  };
const { t } = useTranslation();
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
  const handleContinue = () => {
    setSearchParam("step", 3);
    setCurrentStep(3);
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex flex-col items-center gap-3 mt-4">
        <h1 className="text-xl font-semibold">{t('onboarding.placementQuiz')}</h1>
        <p>{t('quiz.q2' as any)}</p>
      </div>

      <div className="w-[650px] grid grid-cols-2 gap-3">
        {step2Options.map((level: any) => (
          <div
            key={level.value}
            className={`w-full h-11 px-3 border rounded-xl flex justify-between items-center gap-3 cursor-pointer transition-all ${
              quiz.learningGoal === level.value
                ? "border-[#2563EB] bg-[#2563EB]"
                : "border-[#DADADA] hover:border-gray-400"
            }`}
            onClick={() => handleSelect(level.value)}
            style={quiz.learningGoal === level.value ? { boxShadow: '0px 4px 16px 0px #2563EB40' } : undefined}
          >
            {/* <p className="text-sm">{level.label}</p> */}
            <p className={`text-sm ${quiz.learningGoal === level.value ? "text-white" : "text-[#121212]"}`}>{getGoalLabel(level.value)}</p>
            <div
              className={`w-4 h-4 flex justify-center items-center border-2 rounded-full transition-all ${
                quiz.learningGoal === level.value
                  ? "border-white"
                : "border-[#DADADA] hover:border-[#2563EB]"
              }`}
            >
              {quiz.learningGoal === level.value && (
                // <div className="w-2 h-2 bg-primary rounded-full" />
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="w-[300px] flex gap-3 items-center mt-6">
        <Button
          onClick={() => {
            setCurrentStep(1);
            setSearchParam("step", 1);
          }}
          className="flex-1 h-10! rounded-xl! border border-[#DADADA]! text-primary! bg-white! mt-4"
          icon={<FaArrowLeft />}
        >
          {t('common.back')}
        </Button>

        <Button
          disabled={!quiz.learningGoal}
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

export default Step2;