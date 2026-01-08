"use client";
import { useState } from "react";
import { Button, Input } from "antd";
import { FaArrowLeft } from "react-icons/fa";
import { Step5Options } from "@/src/libs/constants/onboarding.constants";
import { setSearchParam } from "@/src/hooks/router.hooks";

const Step5 = ({
  setCurrentStep,
}: {
  setCurrentStep: (step: number) => void;
}) => {
  const [selectedLearningTime, setSelectedLearningTime] = useState<string>("");

  const handleContinue = () => {
    // setCurrentStep(5);
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex flex-col items-center gap-3 mt-4">
        <h1 className="text-xl font-semibold">Placement Quiz</h1>
        <p>When do you prefer to study?</p>
      </div>

      <div className="w-[300px] grid grid-cols-1 gap-3">
        {Step5Options.map((level: any) => (
          <div
            key={level.value}
            className={`w-full h-11 px-3 border rounded-xl flex justify-between items-center gap-3 cursor-pointer transition-all ${
              selectedLearningTime === level.value
                ? "border-primary"
                : "border-[#DADADA] hover:border-gray-400"
            }`}
            onClick={() => setSelectedLearningTime(level.value)}
          >
            <p className="text-sm">{level.label}</p>
            <div
              className={`w-4 h-4 flex justify-center items-center border-2 rounded-full transition-all ${
                selectedLearningTime === level.value
                  ? "border-primary"
                  : "border-[#DADADA] hover:border-primary"
              }`}
            >
              {selectedLearningTime === level.value && (
                <div className="w-2 h-2 bg-primary rounded-full" />
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
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="w-[180px] h-10! rounded-xl! text-white! bg-primary! mt-4"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Step5;
