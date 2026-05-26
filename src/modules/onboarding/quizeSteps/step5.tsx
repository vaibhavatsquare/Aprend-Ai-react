"use client";
import { Button } from "antd";
import { FaArrowLeft } from "react-icons/fa";
import { Step5Options } from "@/src/libs/constants/onboarding.constants";
import { setSearchParam, useRedirect } from "@/src/hooks/router.hooks";
import { savePlacementQuiz } from "@/src/services/api/user.api";
import { useTranslation } from "@/src/libs/i18n";

const Step5 = ({
  setCurrentStep,
  quiz,
  setQuiz,
}: {
  setCurrentStep: (step: number) => void;
  quiz: any;
  setQuiz: (fn: any) => void;
}) => {

  const handleSelect = (val: string) => {
    setQuiz((p: any) => ({ ...p, preferredTime: val }));
  };
  const { t } = useTranslation();
  const getTimeLabel = (value: string) => {
    const map: Record<string, string> = {
        'MORNING': t('quiz.option.morning' as any),
        'AFTERNOON': t('quiz.option.afternoon' as any),
        'EVENING': t('quiz.option.evening' as any),
        'FLEXIBLE': t('quiz.option.flexible' as any),
    };
    return map[value] || value;
};

  const handleFinish = async () => {
    try {
      await savePlacementQuiz(quiz);
      setCurrentStep(6);
      setSearchParam("step", 6);
    } catch (e: any) {
      console.error("Failed to save placement quiz", e);
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex flex-col items-center gap-3 mt-4">
        <h1 className="text-xl font-semibold">{t('onboarding.placementQuiz')}</h1>
        <p>{t('quiz.q5' as any)}</p>
      </div>

      <div className="w-[300px] grid grid-cols-1 gap-3">
        {Step5Options.map((level: any) => (
          <div
            key={level.value}
            className={`w-full h-11 px-3 border rounded-xl flex justify-between items-center gap-3 cursor-pointer transition-all ${
              quiz.preferredTime === level.value
                ? "border-[#2563EB] bg-[#2563EB]"
                : "border-[#DADADA] hover:border-gray-400"
            }`}
            onClick={() => handleSelect(level.value)}
            style={quiz.preferredTime === level.value ? { boxShadow: '0px 4px 16px 0px #2563EB40' } : undefined}
          >
            {/* <p className="text-sm">{level.label}</p> */}
            <p className={`text-sm ${quiz.preferredTime === level.value ? "text-white" : "text-[#121212]"}`}>{getTimeLabel(level.value)}</p>
            <div
              className={`w-4 h-4 flex justify-center items-center border-2 rounded-full transition-all ${
                quiz.preferredTime === level.value
                  ? "border-white"
                : "border-[#DADADA] hover:border-[#2563EB]"
              }`}
            >
              {quiz.preferredTime === level.value && (
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
            setCurrentStep(4);
            setSearchParam("step", 4);
          }}
          className="flex-1 h-10! rounded-xl! border border-[#DADADA]! text-primary! bg-white! mt-4"
          icon={<FaArrowLeft />}
        >
          {t('common.back')}
        </Button>

        <Button
          disabled={!quiz.preferredTime}
          onClick={handleFinish}
          // className="w-[180px] h-10! rounded-xl! text-white! bg-primary! mt-4"
          className="w-[180px] h-10! rounded-xl! text-white! mt-4"
          style={{
            backgroundImage: "url('/images/buttonBg.svg')",
            backgroundSize: '350% 700%', backgroundPosition: 'center',
            boxShadow: '0px 0px 50px 0px #1953CB40',
            border: '1px solid rgba(255,255,255,0.35)',
          }}
        >
          {t('common.finish')}
        </Button>
      </div>
    </div>
  );
};

export default Step5;
