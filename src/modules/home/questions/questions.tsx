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
                <div className="px-[1.2vw]">
                    <div
                        className="h-[calc(100vh-6vw)] mt-[0.2vw] mb-[0.8vw] py-[1vw] rounded-[2vw] col-span-2 flex flex-col gap-[0.8vw] overflow-y-auto"
                        style={{
                            boxShadow: "0px 0px 4px 0px #00000040",backgroundColor: '#F7F9FC'
                        }}
                    >
                        {/* Back Arrow */}
                        <div className="mx-[0.8vw] flex relative justify-center">
                            <GoArrowLeft
                                className="text-[1.1rem] absolute left-0 cursor-pointer"
                                onClick={() => useBack()}
                            />
                        </div>

                        {/* Title */}
                        <h1 className="text-[1.6rem] font-semibold text-[#121212] text-center mt-[3.5vw]">
                            {t('questions.chooseHowToPractice')} ✍️
                        </h1>

                        {/* Subtitle */}
                        <p className="text-[1.1rem] text-[#121212] text-center">
                            {t('questions.selectModeToContinue')}
                        </p>

                        <div className="w-full flex justify-center mt-[2.5vw]">
                            <div className="grid grid-cols-2 gap-[0.8vw] w-[49vw] items-stretch">

                                {/* Question Bank */}
                                <div
                                    className="rounded-[1.2vw] bg-white"
                                    style={{
                                        boxShadow: "0px 0px 4px 0px #00000040",
                                    }}
                                >
                                    <div className="p-[1vw] flex flex-col items-start h-full">

                                        <div className="w-[5vw] h-[5vw] mb-[0.8vw]">
                                            <Image
                                                src="/images/home/questionBank.svg"
                                                alt="Question Bank"
                                                width={72}
                                                height={72}
                                            />
                                        </div>

                                        <h3 className="text-[1.5rem] font-medium text-[#121212] mb-[0.2vw]">
                                            {t('questions.questionBank')}
                                        </h3>

                                        <p className="text-[1.2rem] text-[#555555] mb-[1vw]">
                                            {t('questions.practiceTopicWise')}
                                        </p>

                                        <div className="flex-1" />

                                        <div style={{ borderRadius: '0.6vw', boxShadow: '0px 0px 50px 0px #1953CB40', width: '100%' }}>
                                            <div style={{
                                                position: 'relative', width: '100%', height: '2.8vw',
                                                borderRadius: '0.6vw', overflow: 'hidden',
                                                backgroundImage: "url('/images/buttonBg.svg')",
                                                backgroundSize: '800% 700%', backgroundPosition: 'center',
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
                                                        fontWeight: '600', fontSize: '1.2rem', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8vw'
                                                    }}
                                                >
                                                    {t('questions.exploreQuestions')}
                                                    <GoArrowRight style={{ fontSize: '1.3rem' }} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Simulados */}
                                <div
                                    className="rounded-[1.2vw] bg-white"
                                    style={{
                                        boxShadow: "0px 0px 4px 0px #00000040",
                                    }}
                                >
                                    <div className="p-[1vw] flex flex-col items-start h-full">

                                        <div className="w-[5vw] h-[5vw] mb-[0.8vw]">
                                            <Image
                                                src="/images/home/simulados.svg"
                                                alt="Simulados"
                                                width={72}
                                                height={72}
                                            />
                                        </div>

                                        <h3 className="text-[1.5rem] font-medium text-[#121212] mb-[0.2vw]">
                                            {t('questions.createSimulados')}
                                        </h3>

                                        <p className="text-[1.2rem] text-[#555555] mb-[1vw]">
                                            {t('questions.buildCustomMockTest')}
                                        </p>

                                        <div className="flex-1" />

                                        <div style={{ borderRadius: '0.6vw', boxShadow: '0px 0px 50px 0px #1953CB40', width: '100%' }}>
                                            <div style={{
                                                position: 'relative', width: '100%', height: '2.8vw',
                                                borderRadius: '0.6vw', overflow: 'hidden',
                                                backgroundImage: "url('/images/buttonBg.svg')",
                                                backgroundSize: '800% 700%', backgroundPosition: 'center',
                                            }}>
                                                <button
                                                    onClick={() => {
                                                        const { user, isPremium } = getUserData();
                                                        const canCreateMockExam = user?.freePlan?.canCreateMockExam;
                                                        const remainingQuestions = user?.freePlan?.remainingQuestionsToday ?? 0;
                                                        const remainingMockExams = user?.freePlan?.remainingMockExamsToday ?? 0;
                                                        if (!isPremium) {
                                                            if (!canCreateMockExam || remainingQuestions <= 0 || remainingMockExams <= 0) {
                                                                setModalMessage(t('limits.dailyQuestion'));
                                                                setShowUpgradeModal(true);
                                                                return;
                                                            }
                                                        }
                                                        ChooseSubject();
                                                        setSource(QuestionSource.SIMULADO);
                                                    }}
                                                    style={{
                                                        width: '100%', height: '100%', background: 'transparent',
                                                        border: '1px solid rgba(255,255,255,0.35)', color: 'white',
                                                        fontWeight: '600', fontSize: '1rem', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8vw'
                                                    }}
                                                >
                                                    {t('home.simulados.createSimulados')}
                                                    <GoArrowRight style={{ fontSize: '1.3rem' }} />
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
                <div className="px-[1.2vw]">
                    <div className="h-[calc(100vh-6vw)] mt-[0.2vw] mb-[0.8vw] py-[1vw] rounded-[2vw] flex flex-col gap-[0.8vw]"
                        style={{ boxShadow: "0px 0px 4px 0px #00000040",backgroundColor: '#F7F9FC' }}
                    >
                        <div className="mx-[0.8vw] flex relative justify-center">
                            <GoArrowLeft
                                className="text-[1.1rem] absolute left-0 cursor-pointer"
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
                                return isPremium ? 30 : (user?.freePlan?.remainingQuestionsToday ?? 20);
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
                <div className="flex flex-col items-center gap-[0.8vw] py-[0.8vw]">
                    <div className="w-[3.2vw] h-[3.2vw] flex items-center justify-center">
                        <svg width="81" height="63" viewBox="0 0 81 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.93797 44.4392L0.0332797 12.56C-0.329533 10.2058 2.35259 8.59866 4.25803 10.0284L19.5392 21.4879C19.9364 21.7855 20.39 21.9989 20.8725 22.1153C21.355 22.2317 21.8561 22.2485 22.3452 22.1648C22.8344 22.081 23.3014 21.8984 23.7177 21.6282C24.1339 21.358 24.4908 21.0057 24.7663 20.593L37.489 1.51172C38.8327 -0.503906 41.7943 -0.503906 43.1381 1.51172L55.8607 20.593C56.1363 21.0057 56.4931 21.358 56.9094 21.6282C57.3257 21.8984 57.7926 22.081 58.2818 22.1648C58.771 22.2485 59.2721 22.2317 59.7546 22.1153C60.237 21.9989 60.6907 21.7855 61.0879 21.4879L76.369 10.0284C78.2772 8.59866 80.9566 10.2058 80.5938 12.56L75.6891 44.4392H4.93797ZM71.9992 62.1283H8.6279C8.14334 62.1283 7.66351 62.0328 7.21583 61.8474C6.76814 61.662 6.36137 61.3902 6.01872 61.0475C5.32673 60.3555 4.93797 59.417 4.93797 58.4383V50.3355H75.6891V58.4383C75.6891 60.4755 74.0363 62.1283 71.9992 62.1283Z" fill="#1B2A4A" />
                        </svg>
                    </div>
                    <h3 className="text-[1.1rem] font-bold text-gray-900 text-center">
                        {/* Premium Feature */}
                        {t('profile.mySubscription')}
                    </h3>
                    {/* ✅ Dynamic message based on what triggered the modal */}
                    <p className="text-[0.875rem] text-secondary text-center">
                        {modalMessage}
                    </p>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '2.8vw',
                        borderRadius: '0.6vw',
                        overflow: 'hidden',
                        backgroundImage: "url('/images/buttonBg.svg')",
                        backgroundSize: '180% 600%',
                        backgroundPosition: 'center',
                        boxShadow: '0px 0px 50px 0px #1953CB40',
                    }}>
                        <button
                            onClick={() => {
                                setShowUpgradeModal(false);
                                window.location.replace("/profile?open=subscription");
                            }}
                            style={{
                                position: 'relative',
                                zIndex: 10,
                                width: '100%',
                                height: '100%',
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.35)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                            }}
                        >
                            {t('subscription.upgradeToPremium')}
                        </button>
                    </div>
                    <button
                        onClick={() => setShowUpgradeModal(false)}
                        className="text-[0.875rem] text-secondary hover:text-gray-700 transition-colors"
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