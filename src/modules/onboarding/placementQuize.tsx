"use client";
import { useState } from "react";
import { Progress } from "antd";
import { useSearchParams } from "next/navigation";

import Step1 from "./quizeSteps/step1";
import Step2 from "./quizeSteps/step2";
import Step3 from "./quizeSteps/step3";
import Step4 from "./quizeSteps/step4";
import Step5 from "./quizeSteps/step5";
import Final from "./quizeSteps/final";

const PlacementQuize = () => {
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(
    searchParams.get("step") ? Number(searchParams.get("step")) : 1
  );

  // ✅ MUST be inside component
  const [quiz, setQuiz] = useState({
    subjects: [] as string[],
    learningGoal: "",
    learningStyles: [] as string[],
    studyTimePerDay: "",
    preferredTime: "",
  });

  const renderStep = () => {
    const props = { setCurrentStep, quiz, setQuiz };

    switch (currentStep) {
      case 1:
        return <Step1 {...props} />;
      case 2:
        return <Step2 {...props} />;
      case 3:
        return <Step3 {...props} />;
      case 4:
        return <Step4 {...props} />;
      case 5:
        return <Step5 {...props} />;
      default:
        return <Final quiz={quiz} />;
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col gap-6 items-center">
        {currentStep <= 5 && (
          <div className="w-[250px] flex flex-col items-center gap-2">
            {/* <p className="text-xs text-primary font-medium"> */}
            <p className="text-xs text-[#2563EB] font-medium">
              {currentStep}/5
            </p>
            <Progress
              percent={currentStep * 20}
              size="small"
              showInfo={false}
              // strokeColor="#0F3057"
              strokeColor="#2563EB"
            />
          </div>
        )}
        {renderStep()}
      </div>
    </div>
  );
};

export default PlacementQuize;
