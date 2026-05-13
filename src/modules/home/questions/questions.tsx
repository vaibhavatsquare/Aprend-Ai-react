"use client";

import Image from "next/image";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { useBack, useRedirect } from "@/src/hooks/router.hooks";
import ChooseSubjects from "./chooseSubjects";
import { useTranslation } from "@/src/libs/i18n";
import { Modal } from "antd";
// import { getSubscription } from "@/src/services/api/subscription.api";
import { useState } from "react";
import { Question } from "@/src/libs/types/dashboard.types";
import QuestionsBank from "./questionsBank";
import { QuestionSource } from "@/src/libs/helpers";
import { getUserProfile } from "@/src/services/api/user.api";

const Questions = () => {
    const { t } = useTranslation();
    // const [isPremium, setIsPremium] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
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
                                                const user = JSON.parse(localStorage.getItem("user") || "{}");
                                                const isPremium = user?.isPremium === true ||
                                                    user?.subscriptions?.some((s: any) => s.subscriptionStatus === "ACTIVE");
                                                const canCreate = user?.freePlan?.canCreateMockExam;

                                                if (!isPremium && !canCreate) {
                                                    setShowUpgradeModal(true);
                                                    return;
                                                }

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
                    onClose={async () => {
                        // Refresh user profile so freePlan counts are updated
                        try {
                            const res = await getUserProfile();
                            localStorage.setItem("user", JSON.stringify(res));
                        } catch { }
                        useRedirect("/home", true);
                    }}
                />
            )}
            <Modal
                open={showUpgradeModal}
                onCancel={() => setShowUpgradeModal(false)}
                footer={null}
                centered
                width={400}
            >
                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="w-16 h-16 flex items-center justify-center">
                        <svg width="81" height="63" viewBox="0 0 81 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.93797 44.4392L0.0332797 12.56C-0.329533 10.2058 2.35259 8.59866 4.25803 10.0284L19.5392 21.4879C19.9364 21.7855 20.39 21.9989 20.8725 22.1153C21.355 22.2317 21.8561 22.2485 22.3452 22.1648C22.8344 22.081 23.3014 21.8984 23.7177 21.6282C24.1339 21.358 24.4908 21.0057 24.7663 20.593L37.489 1.51172C38.8327 -0.503906 41.7943 -0.503906 43.1381 1.51172L55.8607 20.593C56.1363 21.0057 56.4931 21.358 56.9094 21.6282C57.3257 21.8984 57.7926 22.081 58.2818 22.1648C58.771 22.2485 59.2721 22.2317 59.7546 22.1153C60.237 21.9989 60.6907 21.7855 61.0879 21.4879L76.369 10.0284C78.2772 8.59866 80.9566 10.2058 80.5938 12.56L75.6891 44.4392H4.93797ZM71.9992 62.1283H8.6279C8.14334 62.1283 7.66351 62.0328 7.21583 61.8474C6.76814 61.662 6.36137 61.3902 6.01872 61.0475C5.32673 60.3555 4.93797 59.417 4.93797 58.4383V50.3355H75.6891V58.4383C75.6891 60.4755 74.0363 62.1283 71.9992 62.1283Z" fill="#1B2A4A" />
                        </svg>
                    </div>
                    <h3 className="text-[20px] font-bold text-gray-900 text-center">
                        Premium Feature
                    </h3>
                    <p className="text-[14px] text-secondary text-center">
                        Simulados (Mock Exam) is a premium feature. Upgrade your plan to create custom mock tests.
                    </p>
                    <button
                        onClick={() => {
                            setShowUpgradeModal(false);
                            useRedirect("/profile?open=subscription");
                        }}
                        className="w-full h-[48px] bg-primary text-white rounded-[12px] text-[15px] font-semibold hover:opacity-90 transition-opacity"
                    >
                        Upgrade To Premium
                    </button>
                    <button
                        onClick={() => setShowUpgradeModal(false)}
                        className="text-[14px] text-secondary hover:text-gray-700 transition-colors"
                    >
                        Maybe later
                    </button>
                </div>
            </Modal>
        </>
    );

};

export default Questions;
