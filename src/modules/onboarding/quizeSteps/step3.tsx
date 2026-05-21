"use client";
import { Button } from "antd";
import { FaArrowLeft } from "react-icons/fa";
import { Step3Options } from "@/src/libs/constants/onboarding.constants";
import { setSearchParam } from "@/src/hooks/router.hooks";

const Step3 = ({
  setCurrentStep,
  quiz,
  setQuiz,
}: {
  setCurrentStep: (step: number) => void;
  quiz: any;
  setQuiz: (fn: any) => void;
}) => {

  const toggle = (val: string) => {
    setQuiz((p: any) => ({
      ...p,
      learningStyles: p.learningStyles.includes(val)
        ? p.learningStyles.filter((v: string) => v !== val)
        : [...p.learningStyles, val],
    }));
  };

  const handleContinue = () => {
    setSearchParam("step", 4);
    setCurrentStep(4);
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex flex-col items-center gap-3 mt-4">
        <h1 className="text-xl font-semibold">Placement Quiz</h1>
        <p>What's your learning style?</p>
      </div>

      <div className="w-[650px] grid grid-cols-2 gap-3">
        {Step3Options.map((level: any) => (
          <div
            key={level.value}
            className={`w-full h-11 px-3 border rounded-xl flex justify-between items-center gap-3 cursor-pointer transition-all ${
              quiz.learningStyles.includes(level.value)
                ? "border-[#2563EB] bg-[#2563EB]"
                : "border-[#DADADA] hover:border-gray-400"
            }`}
            onClick={() => toggle(level.value)}
          >
            {/* <p className="text-sm">{level.label}</p> */}
            <p className={`text-sm ${quiz.learningStyles.includes(level.value) ? "text-white" : "text-[#121212]"}`}>{level.label}</p>
            <div
              className={`w-4 h-4 flex justify-center items-center border-2 rounded-[4px] transition-all ${
                quiz.learningStyles.includes(level.value)
                  ? "border-white bg-white"
                  : "border-[#DADADA]"
              }`}
            >
              {quiz.learningStyles.includes(level.value) && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="w-[300px] flex gap-3 items-center mt-6">
        <Button
          onClick={() => {
            setCurrentStep(2);
            setSearchParam("step", 2);
          }}
          className="flex-1 h-10! rounded-xl! border border-[#DADADA]! text-primary! bg-white! mt-4"
          icon={<FaArrowLeft />}
        >
          Back
        </Button>

        <Button
          disabled={quiz.learningStyles.length === 0}
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
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Step3;