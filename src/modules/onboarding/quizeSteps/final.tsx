import { useRedirect } from "@/src/hooks/router.hooks";
import { Button } from "antd";
import Image from "next/image";
import React from "react";

const Final = () => {
  return (
    <div className="flex flex-col gap-10 items-center">
      <div className="flex flex-col gap-6 items-center">
        <Image
          src="/images/onboarding/finalStepQuizeLogo.svg"
          alt="Final Step Quize Logo"
          width={110}
          height={110}
        />
        <h1 className="text-xl font-semibold text-primary">
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
            <p className="text-[#555555]">Subject</p>
            <p className="text-primary">English and Mathematics</p>
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
            <p className="text-[#555555]">Goal</p>
            <p className="text-primary">Learn a new topic from scratch</p>
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
            <p className="text-[#555555]">Learning Style</p>
            <p className="text-primary">Auditory + Reading/Writing</p>
          </div>
        </div>
      </div>

      <Button
          onClick={() => useRedirect("/home")}
          className="h-10! px-16! rounded-xl! text-white! bg-primary! mt-4"
        >
          Start Your Learning Journey
        </Button>
    </div>
  );
};

export default Final;
