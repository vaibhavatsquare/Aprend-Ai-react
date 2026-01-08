"use client";
import Image from "next/image";
import {
  educationLevels,
  languages,
} from "@/src/libs/constants/onboarding.constants";
import { useEffect, useState } from "react";
import { Button, Progress } from "antd";
import Step1 from "./quizeSteps/step1";
import Step2 from "./quizeSteps/step2";
import Step3 from "./quizeSteps/step3";
import Step4 from "./quizeSteps/step4";
import Step5 from "./quizeSteps/step5";
import { useSearchParams } from "next/navigation";

const PlacementQuize = () => {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(
    searchParams.get("step") ? parseInt(searchParams.get("step")!) : 1
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 {...{ setCurrentStep }} />;
      case 2:
        return <Step2 {...{ setCurrentStep }} />;
      case 3:
        return <Step3 {...{ setCurrentStep }} />;
      case 4:
        return <Step4 {...{ setCurrentStep }} />;
      case 5:
        return <Step5 {...{ setCurrentStep }} />;
      default:
        return <></>;
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col gap-6 items-center">
        <div className="w-[250px] flex flex-col items-center gap-2">
          <p className="text-xs text-primary font-medium">{currentStep}/5</p>
          <Progress
            percent={currentStep * 20}
            size="small"
            showInfo={false}
            strokeColor="#0F3057"
            strokeWidth={3}
          />
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

export default PlacementQuize;
