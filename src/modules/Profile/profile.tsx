

"use client";

import { useEffect, useRef, useState } from "react";
import { getInitials, getStoredUser } from "@/src/libs/helpers";
import { UserDetail, UserLanguage } from "@/src/libs/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiEdit2 } from "react-icons/fi";
import { IoChevronForward } from "react-icons/io5";
import { Image as AntImage, Spin, Switch, message, Button } from "antd";
import { signOutUser } from "@/src/services/auth/auth.firebase.service";
import { backendDeleteUser } from "@/src/services/api/auth.api";
import ConfirmModal from "./confirmModal";
import SavedLibrary from "./savedLibrary";
import SavedFlashCards from "../flashcards/savedFlashCards";
import SavedNotes from "../notes/savedNotes";
import LanguageSection from "./chooseLanguage";
import { useTranslation } from "@/src/libs/i18n";
import AchievementsSection from "./achievementsSection";
import { updateNotificationPreference } from "@/src/services/api/notification.api";
import { getUserProfile,getEducationLevels } from "@/src/services/api/user.api";
import EditProfileSection from "./editProfileSection";
import { educationLevels, languages } from "@/src/libs/constants/onboarding.constants";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import { TbCards } from "react-icons/tb";
import { PiMagicWandLight, PiExamLight, PiBookOpenTextLight } from "react-icons/pi";
import { BsFilePdf, BsEmojiSmile, BsGraphUp } from "react-icons/bs";
import { getSubscription, createCheckoutSession, cancelSubscription, getSubscriptionPlans } from "@/src/services/api/subscription.api";
import { useSearchParams } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";

// ─── Main Component ───────────────────────────────────────────────────────────

const UserProfile = () => {
    const [isPremium, setIsPremium] = useState(false);
    const [user, setUser] = useState<UserDetail | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [notifications, setNotifications] = useState(false);
    const [notificationLoading, setNotificationLoading] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<UserLanguage | null>(null);
    const { t } = useTranslation();
    const router = useRouter();
    const storedUser = getStoredUser();
    const fetched = useRef(false);
    const searchParams = useSearchParams();
    const [logoutLoading, setLogoutLoading] = useState(false);
   const [deleteLoading, setDeleteLoading] = useState(false);
const [educationLevelName, setEducationLevelName] = useState(
        typeof window !== "undefined" ? localStorage.getItem("educationLevelName") || "" : ""
    );

    const handleSelect = (section: string) => {
        window.history.pushState({ section }, '');
        setSelected(section);
    };

    useEffect(() => {
        const handlePopState = () => setSelected(null);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Handle Stripe redirect back to profile
    useEffect(() => {
        const sub = searchParams.get("subscription");
        const open = searchParams.get("open");

        // ✅ User came back from Stripe via browser Back button
        if (sessionStorage.getItem("stripeRedirect")) {
            sessionStorage.removeItem("stripeRedirect");
            setSelected("subscription");
        }

        if (sub === "success") {
            setSelected("subscription");
            getUserProfile().then((profileRes) => {
                localStorage.setItem("user", JSON.stringify(profileRes));
                setIsPremium(profileRes?.isPremium === true);
            });
        }

        if (sub === "cancel") {
            setSelected("subscription");
            message.info("Payment cancelled.");
        }

        if (open === "subscription") {
            setSelected("subscription");
        }
    }, [searchParams]);
    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;

        const loadProfile = async () => {
            try {
                const res = await getUserProfile();
                localStorage.setItem("user", JSON.stringify(res));
                setUser(res);
                setSelectedLanguage(res.user_language);
                setNotifications(res.notificationsEnabled);

                // if (res.educationLevelId) {
                //     const levels = await getEducationLevels(res.user_language || "ENGLISH");
                //     const level = levels.find((l: any) => l.id === res.educationLevelId);
                //     if (level) setEducationLevelName(level.name);
                // } else if (res.user_EducationLevel) {
                //     setEducationLevelName(getEducationLabel(res.user_EducationLevel));
                // }

                // Check subscription status
                // const sub = await getSubscription();
                setIsPremium((res as any)?.isPremium === true);
            } catch (err) {
                message.error("Failed to load profile");
            }
        };

        loadProfile();
    }, []);

    const getEducationLabel = (value: string) => {
        const map: Record<string, string> = {
            'ELEMENTARY': 'onboarding.elementary',
            'HIGH_SCHOOL': 'onboarding.highSchool',
            'PRE_VESTIBULAR': 'onboarding.preUniversity',
            'UNIVERSITY': 'onboarding.university',
            'COMPETITIVE_EXAMS': 'onboarding.competitiveExams',
        };
        return map[value] ? t(map[value] as any) : value;
    };

    // const educationLabel = educationLevels.find(
    //     (e) => e.value === user?.user_EducationLevel
    // )?.label || "—";
   useEffect(() => {
        if (!user) return;
        if (!user.educationLevelId) {
            if (user.user_EducationLevel) setEducationLevelName(getEducationLabel(user.user_EducationLevel));
            return;
        }
        getEducationLevels(user.user_language || "ENGLISH")
            .then(levels => {
                const level = levels.find((l: any) => l.id === user.educationLevelId);
               if (level) {
                setEducationLevelName(level.name);
                localStorage.setItem("educationLevelName", level.name);
            }
            })
            .catch(() => {});
    }, [user?.user_language, user?.educationLevelId]);

    const educationLabel = getEducationLabel(user?.user_EducationLevel || "");

    const handleLogout = async () => {
        try {
            setLogoutLoading(true);
            await signOutUser();
            message.success(t('auth.logoutSuccess'));
            router.replace("/login");
        } catch {
            message.error(t('auth.logoutFailed'));
        } finally {
            setLogoutLoading(false);
        }
    };


    const handleDeleteAccount = async () => {
        try {
            setDeleteLoading(true);
            await backendDeleteUser();
            await signOutUser();
            message.success("Account deleted successfully.");
            router.replace("/login");
        } catch {
            message.error("Failed to delete account. Please try again.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleNotificationToggle = async (value: boolean) => {
        const notificationToken = localStorage.getItem("notificationToken");
        console.log("FCM Token set:", notificationToken);
        if (notificationLoading) return;
        setNotificationLoading(true);
        try {
            await updateNotificationPreference(value);
            setNotifications(value);
            setUser((prev) =>
                prev ? { ...prev, notificationsEnabled: value } : prev
            );
            message.success(t('profile.notificationUpdated'));
    } catch (err) {
        message.error(t('profile.notificationUpdateFailed'));
        } finally {
            setNotificationLoading(false);
        }
    };

    const displayName = user?.name || user?.email?.split("@")[0] || "";
    const isSplit = selected !== null;

    if (selected === "notes") {
        return <SavedNotes showBack={true} onBack={() => setSelected(null)} />;
    }

    if (selected === "flashcards") {
        return <SavedFlashCards showBack={true} onBack={() => setSelected(null)} />;
    }

    if (selected === "Summaries") {
        return <SavedLibrary showBack={true} onBack={() => setSelected(null)} />;
    }

    return (
        <div className="px-6 py-6 pt-1 h-[calc(100vh-80px)]">
            <div className="flex gap-6 h-full overflow-hidden">

                {/* LEFT PANEL */}
                <div className={`transition-all duration-300 ${isSplit ? "w-1/2" : "w-full"} h-full overflow-hidden`}>
                    <div className="bg-white h-full flex flex-col">
                        <div className="p-2 sm:p-4">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] md:w-[110px] md:h-[110px]">
                                    {user?.image ? (
                                        <AntImage
                                            src={user.image}
                                            alt="profile"
                                            width={100}
                                            height={100}
                                            preview={false}
                                            className="rounded-full object-fill shadow-[0_-3px_8px_rgba(0,0,0,0.15)]"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-[#0F3057] flex items-center justify-center text-white text-[32px] font-semibold">
                                            {getInitials(displayName)}
                                        </div>
                                    )}
                                    <div
                                        onClick={() => handleSelect("editProfile")}
                                        className="absolute bottom-1 right-1 w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center shadow"
                                    >
                                        <FiEdit2 size={16} />
                                    </div>
                                </div>

                                <h2 className="text-[20px] sm:text-[26px] md:text-[32px] font-semibold text-primaryText mt-2 sm:mt-4">
                                    {displayName}
                                </h2>
                                <p className="text-[12px] sm:text-[14px] md:text-[16px] underline text-primaryText mt-1">
                                    {user?.email}
                                </p>
                                <div className="mt-1 sm:mt-2">
                    <span className="text-[12px] sm:text-[14px] md:text-[16px] font-semibold text-primaryText">
                        {t('profile.educationLevel')}
                    </span>{" "}
                    <span className="text-[12px] sm:text-[14px] md:text-[16px] font-medium text-secondary">
                                        {/* {educationLabel} */}
                                        {educationLevelName || ""}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto scrollbar px-3">
                            <div className="mt-2 sm:mt-4 md:mt-6 space-y-1 sm:space-y-2 md:space-y-3">

                                <ProfileItem
                                    title={t('profile.preferredLanguage')}
                                    onClick={() => handleSelect("language")}
                                    rightContent={
                                        <span className="text-[14px] text-secondary">
                                            {languages.find((l: any) => l.value === selectedLanguage)?.label ?? "English (UK)"}
                                        </span>
                                    }
                                />

                                {/* <ProfileItem
                                    title={t('profile.notificationPreference')}
                                    rightContent={
                                        <CustomSwitch
                                            checked={notifications}
                                            loading={notificationLoading}
                                            onChange={handleNotificationToggle}
                                        />
                                    }
                                /> */}
                                <ProfileItem
                                    title={t('profile.notificationPreference')}
                                    rightContent={
                                        // <Switch
                                        //     className="notification-switch"
                                        //     checked={notifications}
                                        //     loading={notificationLoading}
                                        //     onChange={handleNotificationToggle}
                                        //     checkedChildren={<p className="font-semibold text-white"></p>}
                                        //     unCheckedChildren={<p className="font-semibold text-black"></p>}
                                        //     style={notifications ? {
                                        //         backgroundImage: "url('/images/buttonBg.svg')",
                                        //         backgroundSize: '500% 400%',
                                        //         backgroundPosition: 'center',
                                        //         boxShadow: '0px 0px 20px 0px #1953CB40',
                                        //     } : {
                                        //         backgroundColor: '#E5E7EB',
                                        //     }}
                                        // />
                                        <div
                                            onClick={() => !notificationLoading && handleNotificationToggle(!notifications)}
                                            style={{
                                                width: '44px',
                                                height: '26px',
                                                borderRadius: '20px',
                                                position: 'relative',
                                                cursor: notificationLoading ? 'not-allowed' : 'pointer',
                                                backgroundColor: notifications ? 'transparent' : '#E5E7EB',
                                                transition: 'background-color 0.3s',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {/* Background layer */}
                                            {notifications && (
                                                <div
                                                    className="absolute inset-0 reveal-from-center"
                                                    style={{
                                                        borderRadius: '20px',
                                                        background: 'linear-gradient(135deg, #1B3A6B 0%, #1953CB 100%)',
                                                        boxShadow: '0px 0px 20px 0px #1953CB40',
                                                    }}
                                                />
                                            )}

                                            {/* Thumb */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    width: '22px',
                                                    height: '22px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'white',
                                                    top: '2px',
                                                    left: notifications ? '20px' : '2px',
                                                    transition: 'left 0.3s ease',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                    zIndex: 10,
                                                }}
                                            />
                                        </div>
                                    }
                                />

                                {/* <ProfileItem
                                    title={t('profile.savedNotes')}
                                    onClick={() => handleSelect("notes")}
                                />

                                <ProfileItem
                                    title={t('profile.savedFlashcards')}
                                    onClick={() => handleSelect("flashcards")}
                                /> */}

                                {/* <ProfileItem
                                    title={t('profile.savedSummaries')}
                                    onClick={() => handleSelect("Summaries")}
                                /> */}

                                <ProfileItem
                                    title={t('profile.achievements')}
                                    onClick={() => handleSelect("achievements")}
                                />

                                {/* <ProfileItem
                                    title={t('profile.mySubscription')}
                                    onClick={() => handleSelect("subscription")}
                                    rightContent={
                                        <span className="text-[12px] text-secondary">
                                            {isPremium ? "Premium" : ""}
                                        </span>
                                    }
                                /> */}
                                <ProfileItem
                                    title={t('profile.mySubscription')}
                                    onClick={() => handleSelect("subscription")}
                                    rightContent={
                                        <div className="flex items-center gap-1">
                                            {isPremium && (
                                                <span className="text-[12px] text-secondary">Premium</span>
                                            )}
                                            <IoChevronForward size={18} />
                                        </div>
                                    }
                                />
                                <ProfileItem
                                    title={t('profile.termsConditions')}
                                    onClick={() => window.open("https://docs.google.com/document/d/1-OmXZFvKtQd6qt0AjgEz7yBJNn7rG6yYXgOiePxneHc/edit?usp=drivesdk", "_blank")}
                                />

                                <ProfileItem
                                    title={t('profile.privacyPolicy')}
                                    onClick={() => window.open("https://docs.google.com/document/d/1-S91kyZ886iO70L3hdhXZYBb3eNkNjEusniH-vUGLOU/edit?usp=drivesdk", "_blank")}
                                />

                                <ProfileItem
                                    title={t('profile.logout')}
                                    onClick={() => setLogoutOpen(true)}
                                />

                                <ProfileItem
                                    title={t('profile.deleteAccount')}
                                    titleClass="text-red-500"
                                    rightContent={
                                        <IoChevronForward size={18} className="text-red-500" />
                                    }
                                    onClick={() => setDeleteOpen(true)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                {isSplit && (
                    <div
                        className="w-1/2 bg-white m-4 p-4 rounded-[12px] h-[calc(96vh-100px)] col-span-2 flex flex-col gap-4"
                        style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                    >
                        {selected === "editProfile" && (
                            <EditProfileSection
                                user={user}
                                onUpdated={(data) =>
                                    setUser((prev) => prev ? { ...prev, ...data } : prev)
                                }
                                onCancel={() => setSelected(null)}
                            />
                        )}

                        {selected === "language" && (
                            <LanguageSection
                                currentLanguage={selectedLanguage}
                                onClose={(lang) => {
                                    setSelectedLanguage(lang);
                                    setUser((prev) =>
                                        prev ? { ...prev, user_language: lang } : prev
                                    );
                                    setSelected(null);
                                }}
                            />
                        )}

                        {/* {selected === "subscription" && <SubscriptionSection />} */}
                        {selected === "subscription" && <SubscriptionSection onBack={() => setSelected(null)} />}
                        {selected === "terms" && <TermsSection />}
                        {selected === "privacy" && <PrivacySection />}
                        {selected === "achievements" && <AchievementsSection />}
                    </div>
                )}

                {logoutOpen && (
                    <ConfirmModal
                        type="logout"
                        loading={logoutLoading}
                        onClose={() => setLogoutOpen(false)}
                        onConfirm={handleLogout}
                    />
                )}


                {deleteOpen && (
                    <ConfirmModal
                        type="delete"
                        loading={deleteLoading}
                        onClose={() => setDeleteOpen(false)}
                        onConfirm={handleDeleteAccount}
                    />
                )}
            </div>
        </div>
    );
};

// ─── Subscription Section ─────────────────────────────────────────────────────

const FREE_FEATURES = [
    { icon: <TbCards size={18} />, label: "Limited Flashcards" },
    { icon: <PiMagicWandLight size={18} />, label: "20 question per day" },
    { icon: <PiExamLight size={18} />, label: "1 mock exam per day" },
    { icon: <PiBookOpenTextLight size={18} />, label: "basic task" },
];

const PAID_FEATURES = [
    { icon: <PiMagicWandLight size={18} />, label: "Unlimited question" },
    { icon: <PiBookOpenTextLight size={18} />, label: "Fully personalised study plans" },
    { icon: <PiExamLight size={18} />, label: "Unlimited mock exam" },
    { icon: <BsFilePdf size={18} />, label: "PDF materials / summaries" },
    { icon: <BsEmojiSmile size={18} />, label: "Focus Mode" },
    { icon: <BsGraphUp size={18} />, label: "Advance analytics" },
];

const SubscriptionSection = ({ onBack }: { onBack?: () => void }) => {
    // ── All states declared at the top ────────────────────────────────────────
    const [expandedFree, setExpandedFree] = useState(true);
    const [expandedMonthly, setExpandedMonthly] = useState(false);
    const [expandedYearly, setExpandedYearly] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<"free" | "monthly" | "yearly">("free");
    const [upgrading, setUpgrading] = useState(false);
    const [subscription, setSubscription] = useState<any>(null);
    const [loadingSubscription, setLoadingSubscription] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [restoring, setRestoring] = useState(false);
    const [plans, setPlans] = useState<any>(null);
    const { t } = useTranslation();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [immediateCancel, setImmediateCancel] = useState(false);
    const [cancelClickCount, setCancelClickCount] = useState(0);

    const handleRestore = async () => {
        if (restoring) return;
        setRestoring(true);
        try {
            const res = await getSubscription();
            if (res?.subscriptionStatus === "ACTIVE" || res?.subscriptionStatus === "TRIAL") {
                // User has active subscription — show plan details
                setSubscription(res);
                const plan = res.planType?.toLowerCase();
                if (plan === "monthly" || plan === "premium") setSelectedPlan("monthly");
                else if (plan === "yearly") setSelectedPlan("yearly");
            } else {
                // No active subscription — show message
                message.info("No active subscription found. Please upgrade to a premium plan.");
                setSubscription(null);
                setSelectedPlan("free");
                setExpandedFree(true);
            }
        } catch {
            message.error("Failed to check subscription. Please try again.");
        } finally {
            setRestoring(false);
        }
    };

    // useEffect(() => {
    //     getSubscription().then((res) => {
    //         setSubscription(res);
    //         if (res?.subscriptionStatus === "ACTIVE") {
    //             const plan = res.planType?.toLowerCase();
    //             if (plan === "monthly" || plan === "premium") setSelectedPlan("monthly");
    //             else if (plan === "yearly") setSelectedPlan("yearly");
    //         }
    //     }).finally(() => setLoadingSubscription(false));
    // }, []);

    useEffect(() => {
        const load = async () => {
            try {
                // Load plans and subscription in parallel
                const [subRes, plansRes] = await Promise.all([
                    getSubscription(),
                    getSubscriptionPlans(),
                ]);
                if (plansRes?.plans) setPlans(plansRes.plans);
                const res = subRes;
                if (res?.subscriptionStatus === "ACTIVE" || res?.subscriptionStatus === "CANCELLED" || res?.subscriptionStatus === "TRIAL") {
                    setSubscription(res);
                    const plan = res.planType?.toLowerCase();
                    if (plan === "monthly" || plan === "premium") setSelectedPlan("monthly");
                    else if (plan === "yearly") setSelectedPlan("yearly");
                }
            } catch {
                // no subscription
            } finally {
                setLoadingSubscription(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const handlePageShow = (e: PageTransitionEvent) => {
            if (e.persisted) {
                setUpgrading(false);
            }
        };
        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, []);

    const FREE_FEATURES = [
        { icon: <TbCards size={18} />, label: t('limits.dailyFlashcard') },
        { icon: <PiMagicWandLight size={18} />, label: "20 " + t('questions.numberOfQuestions') },
        { icon: <PiExamLight size={18} />, label: "1 mock exam per day" },
        { icon: <PiBookOpenTextLight size={18} />, label: "Basic task" },
    ];

    const PAID_FEATURES = [
        { icon: <PiMagicWandLight size={18} />, label: t('questions.numberOfQuestions') },
        { icon: <PiBookOpenTextLight size={18} />, label: t('profile.subscription.currentlySubscribed') },
        { icon: <PiExamLight size={18} />, label: "Unlimited mock exam" },
        { icon: <BsFilePdf size={18} />, label: "PDF materials / summaries" },
        { icon: <BsEmojiSmile size={18} />, label: t('limits.focusModePremium') },
        { icon: <BsGraphUp size={18} />, label: "Advance analytics" },
    ];
    // After
    const now = new Date();
    const endsAt = subscription?.endsAt ? new Date(subscription.endsAt) : null;
    const isCancelledButActive = subscription?.subscriptionStatus === "CANCELLED" && endsAt !== null && endsAt > now;

    const isActive = subscription?.subscriptionStatus === "ACTIVE" ||
        subscription?.subscriptionStatus === "TRIAL" ||
        isCancelledButActive;

    const isTrial = subscription?.subscriptionStatus === "TRIAL";

    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
    });


    const handleCancel = async (immediate: boolean = false) => {
        if (cancelling) return;
        setCancelling(true);
        try {
            await cancelSubscription(immediate);

            const updated = await getSubscription();
            setSubscription(updated);

            if (immediate) {
                const profileRes = await getUserProfile();
                localStorage.setItem("user", JSON.stringify(profileRes));
                message.success("Subscription cancelled immediately.");
                setTimeout(() => {
                    window.location.replace("/home");
                }, 1000);
            } else {
                message.success(`Subscription cancelled. You will have access until ${formatDate(subscription.endsAt)}.`);
            }
        } catch {
            message.error("Failed to cancel. Please try again.");
        } finally {
            setCancelling(false);
            setShowConfirmModal(false);
        }
    };

    // const handleUpgrade = async () => {
    //     if (upgrading) return;
    //     setUpgrading(true);
    //     try {
    //         const res = await createCheckoutSession({
    //             plan: selectedPlan.toUpperCase() as "MONTHLY" | "YEARLY",
    //             planType: selectedPlan.toUpperCase() as "MONTHLY" | "YEARLY",
    //             countryCode: "BR",
    //             successUrl: `${window.location.origin}/profile?subscription=success`,
    //             cancelUrl: `${window.location.origin}/profile?subscription=cancel`,
    //         });
    //         if (res?.url) {
    //             window.location.href = res.url;
    //         } else {
    //             message.error("Failed to create checkout session.");
    //         }
    //     } catch {
    //         message.error("Failed to start checkout. Please try again.");
    //     } finally {
    //         setUpgrading(false);
    //     }
    // };

    const handleUpgrade = async () => {
        if (upgrading) return;

        // Show friendly message if Free plan is selected
        if (selectedPlan === "free") {
            message.info("You are already on the Free plan. Please select Monthly or Yearly to upgrade to Premium.");
            return;
        }

        setUpgrading(true);
        try {
            const res = await createCheckoutSession({
                plan: selectedPlan.toUpperCase() as "MONTHLY" | "YEARLY",
                planType: selectedPlan.toUpperCase() as "MONTHLY" | "YEARLY",
                countryCode: "BR",
                successUrl: `${window.location.origin}/home`,
                cancelUrl: `${window.location.origin}/subscription/cancel`,
            });
            if (res?.url) {
                sessionStorage.setItem("stripeRedirect", "true");
                window.location.href = res.url;
            } else {
                message.error("Failed to create checkout session. Please try again.");
                setUpgrading(false);
            }
        } catch {
            message.error("Failed to start checkout. Please try again.");
            setUpgrading(false);
        }
    };

    // ── Loading state ─────────────────────────────────────────────────────────
    if (loadingSubscription) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    // ── Active subscription — show plan details ────────────────────────────────
    if (isActive) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                    <GoArrowLeft className="text-xl cursor-pointer" onClick={onBack} />
                </div>
                <div className="flex-1 flex flex-col gap-6 justify-center">
                    <div className="bg-white rounded-[20px] p-6 mx-6 flex flex-col gap-6 border border-gray-200" style={{ minHeight: 300 }}>
                        <p className="text-[14px] text-secondary">{t('subscription.checkPlanOverview')}</p>
                        <h2 className="text-[22px] font-bold text-[#2563EB]">
                            {/* Your {subscription.price >= 100 ? "Yearly" : "Monthly"} Plan */}
                            {t('subscription.your') as any} {subscription.price >= 100 ? t('subscription.yearly') : t('subscription.monthly')} Plan

                            {isTrial && (
                                <span className="ml-2 text-[12px] bg-blue-600 text-white px-2 py-0.5 rounded-full align-middle">
                                    Free Trial
                                </span>
                            )}
                        </h2>
                        <div className="flex flex-col gap-0">
                            <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="w-px h-8 border-l-2 border-dashed border-gray-300 mt-1" />
                                </div>
                                <p className="text-[14px] text-gray-700 mt-0.5">
                                    {/* Active From <span className="font-bold">{formatDate(subscription.purchasedAt)}</span> */}
                                    {isTrial ? "Trial Started" : t('subscription.activeFrom')} <span className="font-bold">{formatDate(subscription.purchasedAt)}</span>
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="text-[14px] text-gray-700 mt-0.5">
                                    {/* Expire on <span className="font-bold">{formatDate(subscription.endsAt)}</span> */}
                                    {isTrial ? "Trial Ends" : t('subscription.expireOn')} <span className="font-bold">{formatDate(subscription.endsAt)}</span>
                                </p>
                            </div>
                        </div>
                        <p className="text-[13px] text-gray-600">
                            <span className="font-semibold underline">{t('subscription.status')}:</span>{" "}
                            {/* You can explore all features and content without limits. */}
                            {isTrial
                                ? t('subscription.trialDescription')
                                : t('subscription.statusDescription')
                            }
                        </p>
                    </div>
                    <div className="mx-14">
                        <button
                            onClick={() => window.location.href = "/home"}
                            // className="w-full h-[52px] bg-gray-900 text-white rounded-[14px] text-[16px] font-semibold hover:opacity-90 transition-opacity"
                            className="w-full h-[52px] text-white rounded-[14px] text-[16px] font-semibold hover:opacity-90 transition-opacity"
                            style={{
                                backgroundImage: "url('/images/buttonBg.svg')",
                                backgroundSize: '350% 700%', backgroundPosition: 'center',
                                boxShadow: '0px 0px 50px 0px #1953CB40',
                                border: '1px solid rgba(255,255,255,0.35)',
                            }}
                        >
                            {t('subscription.backToHome')}
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            const isImmediate = cancelClickCount >= 1;
                            setImmediateCancel(isImmediate);
                            setShowConfirmModal(true);
                            setCancelClickCount((prev) => prev + 1);
                        }}
                        className="w-full text-center text-[14px] text-secondary hover:text-red-500 transition-colors underline"
                    >
                        {t('subscription.cancel')}
                    </button>
                </div>
                {showConfirmModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
                        <div className="bg-white rounded-[20px] p-6 w-full max-w-sm flex flex-col items-center gap-4">
                            {/* <button onClick={() => setShowConfirmModal(false)} className="self-end text-gray-400 hover:text-gray-600">✕</button> */}
                            <button onClick={() => { setShowConfirmModal(false); setCancelClickCount(0); }} className="self-end text-gray-400 hover:text-gray-600">✕</button>
                            <div className="text-red-500">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14H6L5 6" />
                                    <path d="M10 11v6M14 11v6" />
                                    <path d="M9 6V4h6v2" />
                                </svg>
                            </div>
                            <p className="text-[16px] font-bold text-gray-900 text-center">
                                {immediateCancel
                                    ? "Are you sure you want to cancel your subscription immediately?"
                                    : "Are you sure you want to cancel your subscription?"}
                            </p>
                            <div className="flex gap-3 w-full mt-2">
                                <button
                                    onClick={() => { setShowConfirmModal(false); setCancelClickCount(0); }}
                                    className="flex-1 h-[52px] border border-gray-200 rounded-[14px] text-[15px] font-medium text-gray-900"
                                >
                                    Cancel
                                </button>
                                <Button
                                    loading={cancelling}
                                    disabled={cancelling}
                                    onClick={() => handleCancel(immediateCancel)}
                                    style={{
                                        height: '52px',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        borderRadius: '14px',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        border: 'none',
                                        flex: 1,
                                    }}
                                >
                                    OK
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── No subscription — show plans ──────────────────────────────────────────
    return (
        <div className="flex flex-col h-full overflow-y-auto scrollbar">
            <div className="flex items-center justify-between mb-2">
                <GoArrowLeft className="text-xl cursor-pointer" onClick={onBack} />
                <button
                    onClick={handleRestore}
                    disabled={restoring}
                    className="text-[14px] text-primary underline disabled:opacity-50"
                >
                    {restoring ? t('common.loading') : t('subscription.restore')}
                </button>
            </div>

            <div className="text-center mb-6">
                <h3 className="text-[22px] font-bold text-gray-900">
                    Unlock premium learning access
                </h3>
                <p className="text-[14px] text-secondary mt-1">
                    Unlock your full learning potential!
                </p>
            </div>

            <div className="flex flex-col gap-3 flex-1">
                {/* FREE */}
                <div
                    className={`border rounded-[12px] overflow-hidden cursor-pointer transition-all ${selectedPlan === "free" ? "border-[#2563EB] bg-[#EFF6FF]" : "border-gray-200"}`}
                    style={{ backgroundColor: "#F7F7F8" }}
                    // onClick={() => { setSelectedPlan("free"); setExpandedFree((p) => !p); }}
                    onClick={() => { setSelectedPlan("free"); setExpandedFree((p) => !p); setExpandedMonthly(false); setExpandedYearly(false); }}
                >
                    <div className="w-full flex items-center justify-between px-4 py-3">
                        <span className="text-[15px] font-semibold text-gray-900">{t('subscription.free').toUpperCase()}</span>
                        {expandedFree
                            ? <LuChevronUp size={18} className="text-secondary" />
                            : <LuChevronDown size={18} className="text-secondary" />
                        }
                    </div>
                    {expandedFree && (
                        <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
                            {FREE_FEATURES.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 text-[13px] text-secondary">
                                    <span className="text-[#2563EB]">{f.icon}</span>
                                    {f.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* MONTHLY */}
                <div
                    className={`border rounded-[12px] overflow-hidden cursor-pointer transition-all ${selectedPlan === "monthly" ? "border-[#2563EB] bg-[#EFF6FF]" : "border-gray-200"}`}
                    style={{ backgroundColor: "#F7F7F8" }}
                    // onClick={() => { setSelectedPlan("monthly"); setExpandedMonthly((p) => !p); }}
                    onClick={() => { setSelectedPlan("monthly"); setExpandedMonthly((p) => !p); setExpandedFree(false); setExpandedYearly(false); }}
                >
                    <div className="flex items-center justify-between px-4 py-3">
                        <div>
                            <p className="text-[13px] text-secondary font-medium">{t('subscription.monthly').toUpperCase()}</p>
                            <p className="text-[18px] font-bold text-gray-900">
                                {plans?.monthly?.currency === "BRL" ? "R$" : "$"}{plans?.monthly?.amount ?? 29.90}
                                <span className="text-[13px] font-normal text-secondary"> /month</span>
                            </p>
                        </div>
                        {expandedMonthly
                            ? <LuChevronUp size={18} className="text-secondary" />
                            : <LuChevronDown size={18} className="text-secondary" />
                        }
                    </div>
                    {expandedMonthly && (
                        <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
                            {PAID_FEATURES.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 text-[13px] text-secondary">
                                    <span className="text-[#2563EB]">{f.icon}</span>
                                    {f.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* YEARLY */}
                <div
                    // className={`border rounded-[12px] overflow-hidden cursor-pointer transition-all ${selectedPlan === "yearly" ? "border-[#2563EB] bg-[#EFF6FF]" : "border-gray-200"}`}
                    className={`relative border rounded-[12px] cursor-pointer transition-all ${selectedPlan === "yearly" ? "border-[#2563EB] bg-[#EFF6FF]" : "border-gray-200"}`}

                    style={{ backgroundColor: "#F7F7F8" }}
                    // onClick={() => { setSelectedPlan("yearly"); setExpandedYearly((p) => !p); }}
                    onClick={() => { setSelectedPlan("yearly"); setExpandedYearly((p) => !p); setExpandedFree(false); setExpandedMonthly(false); }}
                >
                    <span className="absolute -top-2 right-4 bg-[#2563EB] text-white text-[10px] font-semibold px-3 py-1 rounded-full italic">
                        7-{t('time.days')} free trial
                    </span>
                    <div className="flex items-center justify-between px-4 py-3">

                        <div>
                            <p className="text-[13px] text-secondary font-medium">{t('subscription.yearly').toUpperCase()}</p>
                            <p className="text-[18px] font-bold text-gray-900">
                                {plans?.yearly?.currency === "BRL" ? "R$" : "$"}{plans?.yearly?.amount ?? 239.90}
                                <span className="text-[13px] font-normal text-secondary"> /year</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* <span className="bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded-full"> */}

                            {expandedYearly
                                ? <LuChevronUp size={18} className="text-secondary" />
                                : <LuChevronDown size={18} className="text-secondary" />
                            }
                        </div>
                    </div>
                    {expandedYearly && (
                        <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
                            {PAID_FEATURES.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 text-[13px] text-secondary">
                                    <span className="text-[#2563EB]">{f.icon}</span>
                                    {f.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Button
                loading={upgrading}
                disabled={upgrading}
                onClick={handleUpgrade}
                style={{
                    marginTop: '24px',
                    marginLeft: '16px',
                    marginRight: '16px',
                    width: 'calc(100% - 32px)',
                    height: '48px',
                    minHeight: '48px',
                    flexShrink: 0,
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    backgroundImage: "url('/images/buttonBg.svg')",
                    backgroundSize: '350% 700%',
                    backgroundPosition: 'center',
                    boxShadow: '0px 0px 50px 0px #1953CB40',
                    border: '1px solid rgba(255,255,255,0.35)',
                }}
            >
                {t('subscription.upgradeToPremium')}
            </Button>
        </div>
    );
};

// ─── Terms & Conditions Section ───────────────────────────────────────────────

const TERMS_PARAGRAPHS = [
    `By downloading or using the app, these terms will automatically apply to you – you should make sure therefore that you read them carefully before using the app. You're not allowed to copy or modify the app, any part of the app, or our trademarks in any way. You're not allowed to attempt to extract the source code of the app, and you also shouldn't try to translate the app into other languages or make derivative versions. The app itself, and all the trademarks, copyright, database rights, and other intellectual property rights related to it, still belong to Affiliarts.`,
    `Affiliarts is committed to ensuring that the app is as useful and efficient as possible. For that reason, we reserve the right to make changes to the app or to charge for its services, at any time and for any reason. We will never charge you for the app or its services without making it very clear to you exactly what you're paying for.`,
    `By downloading or using the app, these terms will automatically apply to you – you should make sure therefore that you read them carefully before using the app. You're not allowed to copy or modify the app, any part of the app, or our trademarks in any way. You're not allowed to attempt to extract the source code of the app, and you also shouldn't try to translate the app into other languages or make derivative versions. The app itself, and all the trademarks, copyright, database rights, and other intellectual property rights related to it, still belong to Affiliarts.`,
    `Affiliarts is committed to ensuring that the app is as useful and efficient as possible. For that reason, we reserve the right to make changes to the app or to charge for its services, at any time and for any reason. We will never charge you for the app or its services without making it very clear to you exactly what you're paying for.`,
    `Affiliarts is committed to ensuring that the app is as useful and efficient as possible. For that reason, we reserve the right to make changes to the app or to charge for its services, at any time and for any reason. We will never charge you for the app or its services without making it very clear to you exactly what you're paying for.`,
];

const TermsSection = () => (
    <div className="flex flex-col h-full overflow-y-auto scrollbar">
        <h3 className="text-[22px] font-bold text-gray-900 text-center mb-6">
            Terms &amp; Conditions
        </h3>
        <div className="space-y-4">
            {TERMS_PARAGRAPHS.map((para, i) => (
                <p key={i} className="text-[14px] text-secondary leading-relaxed">
                    {para}
                </p>
            ))}
        </div>
    </div>
);

// ─── Privacy Policy Section ───────────────────────────────────────────────────

const PrivacySection = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col h-full overflow-y-auto scrollbar">
            <h3 className="text-[22px] font-bold text-gray-900 text-center mb-6">
                {t('profile.privacyPolicy')}
            </h3>
            <div className="space-y-4">
                <p className="text-[14px] text-secondary leading-relaxed">
                    Your data is handled securely and in accordance with applicable data protection laws. We collect only the information necessary to provide our services.
                </p>
                <p className="text-[14px] text-secondary leading-relaxed">
                    We do not share personal data with third parties except where required by law or necessary to provide the service. You may request deletion of your data at any time by contacting support.
                </p>
                <p className="text-[14px] text-secondary leading-relaxed">
                    We use industry-standard encryption to protect your data both in transit and at rest. Our security practices are regularly reviewed and updated.
                </p>
            </div>
        </div>
    );
};

// ─── Shared Components ────────────────────────────────────────────────────────

const InputField = ({
    label,
    value,
    disabled,
}: {
    label: string;
    value: string;
    disabled?: boolean;
}) => (
    <div>
        <label className="text-[14px] text-secondary">{label}</label>
        <input
            defaultValue={value}
            disabled={disabled}
            className="w-full h-[45px] mt-1 px-3 bg-[#F7F7F8] rounded-[8px] outline-none"
        />
    </div>
);

const ProfileItem = ({
    title,
    rightContent,
    onClick,
    titleClass,
}: {
    title: string;
    rightContent?: React.ReactNode;
    onClick?: () => void;
    titleClass?: string;
}) => (
    <div
        onClick={onClick}
        className="h-[40px] sm:h-[46px] md:h-[50px] bg-[#F7F7F8] rounded-[8px] px-3 sm:px-4 flex items-center justify-between cursor-pointer"
    >
        <p className={`text-[13px] sm:text-[14px] md:text-[16px] ${titleClass || "text-primaryText"}`}>
            {title}
        </p>
        {rightContent ? rightContent : <IoChevronForward size={18} />}
    </div>
);

const CustomSwitch = ({
    checked,
    onChange,
    loading,
}: {
    checked: boolean;
    loading?: boolean;
    onChange: (val: boolean) => void;
}) => (
    <div className="relative w-[44px] h-[26px] flex items-center">
        <div
            onClick={() => { if (!loading) onChange(!checked); }}
            className={`w-[44px] h-[26px] flex items-center rounded-full cursor-pointer transition-all duration-300 ${checked ? "bg-[#0F3057]" : "bg-gray-300"}`}
        >
            <div
                className={`w-[20px] h-[20px] bg-white rounded-full shadow-md transform transition-all duration-300 ${checked ? "translate-x-[21px]" : "translate-x-[3px]"}`}
            />
        </div>
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-full">
                <Spin size="small" />
            </div>
        )}
    </div>
);

export default UserProfile;