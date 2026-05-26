"use client";
import { Button } from "antd";
import { FaArrowLeft } from "react-icons/fa";
import { Step4Options } from "@/src/libs/constants/onboarding.constants";
import { setSearchParam } from "@/src/hooks/router.hooks";
import { useTranslation } from "@/src/libs/i18n";

const Step4 = ({
  setCurrentStep,
  quiz,
  setQuiz,
}: {
  setCurrentStep: (step: number) => void;
  quiz: any;
  setQuiz: (fn: any) => void;
}) => {

  const handleSelect = (val: string) => {
    setQuiz((p: any) => ({ ...p, studyTimePerDay: val }));
  };

  const handleContinue = () => {
    setSearchParam("step", 5);
    setCurrentStep(5);
  };
  const { t } = useTranslation();

  const getTimeLabel = (value: string) => {
    const map: Record<string, string> = {
        'LESS_THAN_15_MIN': t('quiz.option.less15' as any),
        'MIN_15_TO_30': t('quiz.option.15to30' as any),
        'MIN_30_TO_60': t('quiz.option.30to60' as any),
        'ONE_HOUR': t('quiz.option.1hour' as any),
    };
    return map[value] || value;
};

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex flex-col items-center gap-3 mt-4">
        <h1 className="text-xl font-semibold">{t('onboarding.placementQuiz')}</h1>
        <p>{t('quiz.q4' as any)}</p>
      </div>

      <div className="w-[300px] grid grid-cols-1 gap-3">
        {Step4Options.map((level: any) => (
          <div
            key={level.value}
            className={`w-full h-11 px-3 border rounded-xl flex justify-between items-center gap-3 cursor-pointer transition-all ${
              quiz.studyTimePerDay === level.value
                ? "border-[#2563EB] bg-[#2563EB]"
                : "border-[#DADADA] hover:border-gray-400"
            }`}
            onClick={() => handleSelect(level.value)}
            style={quiz.studyTimePerDay === level.value ? { boxShadow: '0px 4px 16px 0px #2563EB40' } : undefined}
          >
            {/* <p className="text-sm">{level.label}</p> */}
            <p className={`text-sm ${quiz.studyTimePerDay === level.value ? "text-white" : "text-[#121212]"}`}>{getTimeLabel(level.value)}</p>
            <div
              className={`w-4 h-4 flex justify-center items-center border-2 rounded-full transition-all ${
                quiz.studyTimePerDay === level.value
                  ? "border-white"
                : "border-[#DADADA] hover:border-[#2563EB]"
              }`}
            >
              {quiz.studyTimePerDay === level.value && (
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
            setCurrentStep(3);
            setSearchParam("step", 3);
          }}
          className="flex-1 h-10! rounded-xl! border border-[#DADADA]! text-primary! bg-white! mt-4"
          icon={<FaArrowLeft />}
        >
          {t('common.back')}
        </Button>

        <Button
          disabled={!quiz.studyTimePerDay}
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

export default Step4;
