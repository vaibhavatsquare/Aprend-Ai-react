"use client";

import Image from "next/image";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { useBack, useRedirect } from "@/src/hooks/router.hooks";
import ChooseSubjects from "./chooseSubjects";
import { useTranslation } from "@/src/libs/i18n";
import { Modal } from "antd";
import { useState } from "react";
import { Question } from "@/src/libs/types/dashboard.types";
import QuestionsBank from "./questionsBank";
import { QuestionSource } from "@/src/libs/helpers";
import { getUserProfile } from "@/src/services/api/user.api";

const Questions = () => {
    const { t } = useTranslation();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [modalMessage, setModalMessage] = useState(""); // ✅ dynamic modal message
    const [step, setStep] = useState<
        "question" | "chooseSubject" | "questionsBank"
    >("question");

    const [activeTask, setActiveTask] = useState<{
        id: string;
        questions: Question[];
    } | null>(null);
    const [source, setSource] = useState<QuestionSource>(QuestionSource.EXPLORE_QUESTION);

    const ChooseSubject = async () => {
        setStep("chooseSubject");
    };

    // ✅ Helper to get user and premium status from localStorage
    const getUserData = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const isPremium = user?.isPremium === true ||
            user?.subscriptions?.some((s: any) => s.subscriptionStatus === "ACTIVE");
        return { user, isPremium };
    };

    return (
        <>
            {step === "question" && (
                <div className="px-4">
                    <div
                        className="h-[calc(100vh-100px)] mt-1 mb-4 py-4 rounded-[32px] col-span-2 flex flex-col gap-4"
                        style={{
                            boxShadow: "0px 0px 4px 0px #00000040",backgroundColor: '#F7F9FC'
                        }}
                    >
                        {/* Back Arrow */}
                        <div className="mx-4 flex relative justify-center">
                            <GoArrowLeft
                                className="text-xl absolute left-0 cursor-pointer"
                                onClick={() => useBack()}
                            />
                        </div>

                        {/* Title */}
                        <h1 className="text-[32px] font-semibold text-[#121212] text-center mt-16">
                            {t('questions.chooseHowToPractice')} ✍️
                        </h1>

                        {/* Subtitle */}
                        <p className="text-[22px] text-[#121212] text-center">
                            {t('questions.selectModeToContinue')}
                        </p>

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

                                        <div className="w-[90px] h-[90px] mb-4">
                                            <Image
                                                src="/images/home/questionBank.svg"
                                                alt="Question Bank"
                                                width={90}
                                                height={90}
                                            />
                                        </div>

                                        <h3 className="text-[26px] font-medium text-[#121212] mb-1">
                                            {t('questions.questionBank')}
                                        </h3>

                                        <p className="text-[21px] text-[#555555] mb-6">
                                            {t('questions.practiceTopicWise')}
                                        </p>

                                        <div style={{ borderRadius: '10px', boxShadow: '0px 0px 50px 0px #1953CB40' }}>
                                            <div style={{
                                                position: 'relative', width: '380px', height: '48px',
                                                borderRadius: '12px', overflow: 'hidden',
                                                backgroundImage: "url('/images/buttonBg.svg')",
                                                backgroundSize: '350% 700%', backgroundPosition: 'center',
                                            }}>
                                                <button
                                                    onClick={() => {
                                                        const { user, isPremium } = getUserData();
                                                        const canAskQuestion = user?.freePlan?.canAskQuestion;
                                                        if (!isPremium && !canAskQuestion) {
                                                            // setModalMessage("You've used all 20 daily questions. Upgrade to Premium for unlimited questions.");
                                                            setModalMessage(t('limits.dailyQuestion'));
                                                            setShowUpgradeModal(true);
                                                            return;
                                                        }
                                                        ChooseSubject();
                                                        setSource(QuestionSource.EXPLORE_QUESTION);
                                                    }}
                                                    style={{
                                                        width: '100%', height: '100%', background: 'transparent',
                                                        border: '1px solid rgba(255,255,255,0.35)', color: 'white',
                                                        fontWeight: '600', fontSize: '18px', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px'
                                                    }}
                                                >
                                                    {t('questions.exploreQuestions')}
                                                    <GoArrowRight style={{ fontSize: '26px' }} />
                                                </button>
                                            </div>
                                        </div>
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

                                        <div className="w-[90px] h-[90px] mb-4">
                                            <Image
                                                src="/images/home/simulados.svg"
                                                alt="Simulados"
                                                width={90}
                                                height={90}
                                            />
                                        </div>

                                        <h3 className="text-[26px] font-medium text-[#121212] mb-1">
                                            {t('questions.createSimulados')}
                                        </h3>

                                        <p className="text-[21px] text-[#555555] mb-6">
                                            {t('questions.buildCustomMockTest')}
                                        </p>

                                        <div style={{ borderRadius: '10px', boxShadow: '0px 0px 50px 0px #1953CB40' }}>
                                            <div style={{
                                                position: 'relative', width: '380px', height: '48px',
                                                borderRadius: '12px', overflow: 'hidden',
                                                backgroundImage: "url('/images/buttonBg.svg')",
                                                backgroundSize: '350% 700%', backgroundPosition: 'center',
                                            }}>
                                                <button
                                                    onClick={() => {
                                                        const { user, isPremium } = getUserData();
                                                        const canCreate = user?.freePlan?.canCreateMockExam;
                                                        if (!isPremium && !canCreate) {
                                                            // setModalMessage("Simulados (Mock Exam) is a premium feature. Upgrade your plan to create custom mock tests.");
                                                            setModalMessage(t('limits.focusModePremium'));
                                                            setShowUpgradeModal(true);
                                                            return;
                                                        }
                                                        ChooseSubject();
                                                        setSource(QuestionSource.SIMULADO);
                                                    }}
                                                    style={{
                                                        width: '100%', height: '100%', background: 'transparent',
                                                        border: '1px solid rgba(255,255,255,0.35)', color: 'white',
                                                        fontWeight: '600', fontSize: '18px', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px'
                                                    }}
                                                >
                                                    {t('home.simulados.createSimulados')}
                                                    <GoArrowRight style={{ fontSize: '26px' }} />
                                                </button>
                                            </div>
                                        </div>

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
                    <div className="h-[calc(100vh-100px)] mt-1 mb-4 py-4 rounded-[32px] flex flex-col gap-4"
                        style={{ boxShadow: "0px 0px 4px 0px #00000040",backgroundColor: '#F7F9FC' }}
                    >
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
                            // ✅ Pass remainingQuestions — premium gets 40, free gets their remaining count
                            remainingQuestions={(() => {
                                const { user, isPremium } = getUserData();
                                return isPremium ? 40 : (user?.freePlan?.remainingQuestionsToday ?? 20);
                            })()}
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

            {/* ✅ Upgrade Modal — message changes based on what triggered it */}
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
                        {/* Premium Feature */}
                        {t('profile.mySubscription')} 
                    </h3>
                    {/* ✅ Dynamic message based on what triggered the modal */}
                    <p className="text-[14px] text-secondary text-center">
                        {modalMessage}
                    </p>
                    <button
                        onClick={() => {
                            setShowUpgradeModal(false);
                            useRedirect("/profile?open=subscription");
                        }}
                        className="w-full h-[48px] bg-primary text-white rounded-[12px] text-[15px] font-semibold hover:opacity-90 transition-opacity"
                    >
                        {/* Upgrade To Premium */}
                        {t('subscription.upgradeToPremium')}
                    </button>
                    <button
                        onClick={() => setShowUpgradeModal(false)}
                        className="text-[14px] text-secondary hover:text-gray-700 transition-colors"
                    >
                        {/* Maybe later */}
                        {t('common.cancel')}
                    </button>
                </div>
            </Modal>
        </>
    );

};

export default Questions;