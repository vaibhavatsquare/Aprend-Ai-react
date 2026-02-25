"use client";

import { useState } from "react";
import Image from "next/image";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { useBack, useRedirect } from "@/src/hooks/router.hooks";
import ChooseSubjects from "./chooseSubjects";

const Questions = () => {

    const [step, setStep] = useState<"question" | "chooseSubject">("question");

    const ChooseSubject = async () => {
        setStep("chooseSubject")
    };

    const ChooseQuestionsBank = async () => {
        useRedirect("/home/questions-bank");
    };

    return (
        <>
            {step === "question" && (
                // your 
                <div className="px-4">
                    <div
                        className="h-[calc(100vh-100px)] mt-1 mb-4 py-4 rounded-[32px] col-span-2 flex flex-col gap-4"
                        style={{
                            boxShadow: "0px 0px 4px 0px #00000040",
                        }}
                    >
                        {/* Back Arrow */}
                        <div className="mx-4 flex relative justify-center">
                            <GoArrowLeft
                                className="text-xl absolute left-0 cursor-pointer"
                                onClick={() => useBack()}
                            />
                        </div>

                        {/* Main Container */}
                        {/* Title */}
                        <h1 className="text-[32px] font-semibold text-[#121212] text-center mt-16">
                            Choose How You Want to Practice ✍️
                        </h1>

                        {/* Subtitle */}
                        <p className="text-[22px] text-[#121212] text-center">
                            Select a mode to continue
                        </p>

                        {/* Cards */}


                        <div className="w-full flex justify-center mt-14">
                            <div className="grid grid-cols-2 gap-16 w-full max-w-[900px]">


                                {/* Question Bank */}
                                <div
                                    className="rounded-[20px] bg-white"
                                    style={{
                                        boxShadow: "0px 0px 4px 0px #00000040",
                                    }}
                                >
                                    <div className="p-4 flex flex-col items-start">

                                        {/* ICON */}
                                        <div className="w-[90px] h-[90px] mb-4">
                                            <Image
                                                src="/images/home/questionBank.svg"
                                                alt="Question Bank"
                                                width={90}
                                                height={90}
                                            />
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-[26px] font-medium text-[#121212] mb-1">
                                            Question bank
                                        </h3>

                                        {/* Subtitle */}
                                        <p className="text-[21px] text-[#555555] mb-6">
                                            Practice topic wise questions
                                        </p>

                                        {/* Button */}
                                        <button
                                            onClick={() => ChooseQuestionsBank()} 
                                            className="w-full h-[50px] bg-primary rounded-[16px] flex items-center justify-center cursor-pointer"
                                        >
                                            {/* Text */}
                                            <span className="text-white text-[18px] font-semibold">
                                                Explore Questions
                                            </span>

                                            {/* Arrow */}
                                            <GoArrowRight className="text-white text-[26px] ml-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Simulados */}
                                <div
                                    className="rounded-[20px] bg-white"
                                    style={{
                                        boxShadow: "0px 0px 4px 0px #00000040",
                                    }}
                                >
                                    <div className="p-4 flex flex-col items-start">

                                        {/* ICON */}
                                        <div className="w-[90px] h-[90px] mb-4">
                                            <Image
                                                src="/images/home/simulados.svg"
                                                alt="Simulados"
                                                width={90}
                                                height={90}
                                            />
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-[26px] font-medium text-[#121212] mb-1">
                                            Create your own simulados
                                        </h3>

                                        {/* Subtitle */}
                                        <p className="text-[21px] text-[#555555] mb-6">
                                            Build A custom mock test your way
                                        </p>

                                        <button
                                            onClick={() => ChooseSubject()}
                                            className="w-full h-[50px] bg-primary rounded-[16px] flex items-center justify-center cursor-pointer"
                                        >
                                            {/* Text */}
                                            <span className="text-white text-[18px] font-semibold">
                                                Create simulados
                                            </span>

                                            {/* Arrow */}
                                            <GoArrowRight className="text-white text-[26px] ml-4" />
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CHOOSE SUBJECT SCREEN */}
            {step === "chooseSubject" && (
                <div className="px-4">
                    <div className="h-[calc(100vh-100px)] mt-1 mb-4 py-4 rounded-xl flex flex-col gap-4"
                        style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                    >
                        {/* Back */}
                        <div className="mx-4 flex relative justify-center">
                            <GoArrowLeft
                                className="text-xl absolute left-0 cursor-pointer"
                                onClick={() => setStep("question")}
                            />
                        </div>
                        <ChooseSubjects />
                    </div>
                </div>
            )}
        </>
    );

};

export default Questions;
