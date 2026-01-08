"use client";
import Image from "next/image";
import {
  educationLevels,
  languages,
} from "@/src/libs/constants/onboarding.constants";
import { useState } from "react";
import { Button } from "antd";
import { useRedirect } from "@/src/hooks/router.hooks";

const ChooseEducationLevel = () => {
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<
    string | null
  >(null);

  const handleContinue = () => {
    useRedirect("/onboarding/placement-quize");
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="text-xl font-semibold">Choose your education level</h1>

        <div className="flex flex-col gap-3">
          {educationLevels.map((level: any) => (
            <div
              key={level.value}
              className={`w-[280px] h-11 px-3 border rounded-xl flex justify-between items-center gap-3 cursor-pointer transition-all ${
                selectedEducationLevel === level.value
                  ? "border-primary"
                  : "border-[#DADADA] hover:border-primary"
              }`}
              onClick={() => setSelectedEducationLevel(level.value)}
            >
              <p className="text-sm">{level.label}</p>
              <div
                className={`w-4 h-4 flex justify-center items-center border-2 rounded-full transition-all ${
                  selectedEducationLevel === level.value
                    ? "border-primary"
                    : "border-[#DADADA] hover:border-primary"
                }`}
              >
                {selectedEducationLevel === level.value && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedEducationLevel && (
          <Button onClick={handleContinue} className="w-[280px] h-10! rounded-xl! text-white! bg-primary! mt-4">
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChooseEducationLevel;

