import { useRedirect } from "@/src/hooks/router.hooks";
import {
  goalLabels,
  styleLabels,
  subjectLabels,
} from "@/src/libs/constants/onboarding.constants";
import { Button } from "antd";
import Image from "next/image";
import React from "react";

const Final = ({ quiz }: { quiz: any }) => {
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
          Congratulation! Your study plan is ready.
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
            <p className="text-secondary">Subject</p>
            <p className="text-primary">
               {quiz.subjects.map((s: string) => subjectLabels[s]).join(", ")}
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
            <p className="text-secondary">Goal</p>
            <p className="text-primary">
              {goalLabels[quiz.learningGoal]}
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
            <p className="text-secondary">Learning Style</p>
            <p className="text-primary">
               {quiz.learningStyles.map((s: string) => styleLabels[s]).join(" + ")}
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
        Start Your Learning Journey
      </Button>
    </div >
  );
};

export default Final;
