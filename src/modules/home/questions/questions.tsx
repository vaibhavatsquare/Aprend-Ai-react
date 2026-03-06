"use client";

import { useState } from "react";
import Image from "next/image";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { useBack, useRedirect } from "@/src/hooks/router.hooks";
import ChooseSubjects from "./chooseSubjects";
import { t } from "@/src/libs/i18n";
import { Question } from "@/src/libs/types/dashboard.types";
import QuestionsBank from "./questionsBank";
import { QuestionSource } from "@/src/libs/constants/helper";

const Questions = () => {

    const [step, setStep] = useState<
        "question" | "chooseSubject" | "questionsBank"
    >("question");

    const [activeTask, setActiveTask] = useState<{
        id: string;
        questions: Question[];
    } | null>(null);
     const [source, setSource] = useState<QuestionSource>(QuestionSource.EXPLORE_QUESTION);

    const ChooseSubject = async () => {
        setStep("chooseSubject")
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
                            {t('questions.chooseHowToPractice')} ✍️
                        </h1>

                        {/* Subtitle */}
                        <p className="text-[22px] text-[#121212] text-center">
                            {t('questions.selectModeToContinue')}
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
                                            {t('questions.questionBank')}
                                        </h3>

                                        {/* Subtitle */}
                                        <p className="text-[21px] text-[#555555] mb-6">
                                            {t('questions.practiceTopicWise')}
                                        </p>

                                        {/* Button */}
                                        <button
                                            onClick={() => {
                                                ChooseSubject();
                                                setSource(QuestionSource.EXPLORE_QUESTION);
                                            }}
                                            className="w-full h-[50px] bg-primary rounded-[16px] flex items-center justify-center cursor-pointer"
                                        >
                                            {/* Text */}
                                            <span className="text-white text-[18px] font-semibold">
                                                {t('questions.exploreQuestions')}
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
                                            {t('questions.createSimulados')}
                                        </h3>

                                        {/* Subtitle */}
                                        <p className="text-[21px] text-[#555555] mb-6">
                                            {t('questions.buildCustomMockTest')}
                                        </p>

                                        <button
                                            onClick={() => {
                                                ChooseSubject();
                                                setSource(QuestionSource.SIMULADO);
                                            }}
                                            className="w-full h-[50px] bg-primary rounded-[16px] flex items-center justify-center cursor-pointer"
                                        >
                                            {/* Text */}
                                            <span className="text-white text-[18px] font-semibold">
                                                {t('home.simulados.createSimulados')}
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
                        <ChooseSubjects
                            source={source}
                            onBack={() => setStep("question")}
                            onStartQuestions={(task) => {
                                setActiveTask(task);
                                setStep("questionsBank");
                            }}
                        />
                    </div>
                </div>
            )}

            {step === "questionsBank" && (
                <QuestionsBank
                    taskId={activeTask?.id ?? ""}
                    initialQuestions={activeTask?.questions ?? []}
                    source={source}
                    onClose={() => useRedirect("/home", true)}
                />
            )}
        </>
    );

};

export default Questions;
