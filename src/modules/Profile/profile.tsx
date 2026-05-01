"use client";

import { useEffect, useRef, useState } from "react";
import { getInitials, getStoredUser } from "@/src/libs/helpers";
import { UserDetail, UserLanguage } from "@/src/libs/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiEdit2 } from "react-icons/fi";
import { IoChevronForward } from "react-icons/io5";
import { Image as AntImage, Spin, Switch, message } from "antd";
import { signOutUser } from "@/src/services/auth/auth.firebase.service";
import ConfirmModal from "./confirmModal";
import SavedLibrary from "./savedLibrary";
import SavedFlashCards from "../flashcards/savedFlashCards";
import SavedNotes from "../notes/savedNotes";
import LanguageSection from "./chooseLanguage";
import { initializeAppLanguage } from "@/src/libs/helpers";
import { t, useTranslation } from "@/src/libs/i18n";
import AchievementsSection from "./achievementsSection";
import { updateNotificationPreference } from "@/src/services/api/notification.api";
import { getUserProfile } from "@/src/services/api/user.api";
import EditProfileSection from "./editProfileSection";
import { educationLevels, languages } from "@/src/libs/constants/onboarding.constants";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import { TbCards } from "react-icons/tb";
import { PiMagicWandLight, PiExamLight, PiBookOpenTextLight } from "react-icons/pi";

const UserProfile = () => {
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
            } catch (err) {
                message.error("Failed to load profile");
            }
        };

        loadProfile();
    }, []);

    const educationLabel = educationLevels.find(
        (e) => e.value === user?.user_EducationLevel
    )?.label || "—";

    const handleLogout = async () => {
        try {
            await signOutUser();
            message.success(t('auth.logoutSuccess'));
            router.replace("/login");
        } catch {
            message.error(t('auth.logoutFailed'));
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
            message.success("Notification preference updated");
        } catch (err) {
            message.error("Failed to update notification preference");
        } finally {
            setNotificationLoading(false);
        }
    };

    const displayName =
        user?.name || user?.email?.split("@")[0] || "";

    const isSplit = selected !== null;

    if (selected === "notes") {
        return (
            <SavedNotes
                showBack={true}
                onBack={() => setSelected(null)}
            />
        );
    }

    if (selected === "flashcards") {
        return (
            <SavedFlashCards
                showBack={true}
                onBack={() => setSelected(null)}
            />
        );
    }

    if (selected === "Summaries") {
        return (
            <SavedLibrary
                showBack={true}
                onBack={() => setSelected(null)}
            />
        );
    }

    return (
        <div className="px-6 py-6 pt-1 h-[calc(100vh-80px)]">
            <div className="flex gap-6 h-full overflow-hidden">

                {/* LEFT PANEL */}
                <div
                    className={`transition-all duration-300 ${isSplit ? "w-1/2" : "w-full"
                        } h-full overflow-hidden`}
                >
                    <div className="bg-white h-full flex flex-col">

                        <div className="p-4">
                            {/* PROFILE HEADER */}
                            <div className="flex flex-col items-center text-center">
                                <div className="relative w-[110px] h-[110px]">
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
                                        onClick={() => setSelected("editProfile")}
                                        className="absolute bottom-1 right-1 w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center shadow">
                                        <FiEdit2 size={16} />
                                    </div>
                                </div>

                                <h2 className="text-[32px] font-semibold text-primaryText mt-4">
                                    {displayName}
                                </h2>

                                <p className="text-[16px] underline text-primaryText mt-1">
                                    {user?.email}
                                </p>

                                <div className="mt-2">
                                    <span className="text-[16px] font-semibold text-primaryText">
                                        {t('profile.educationLevel')}
                                    </span>{" "}
                                    <span className="text-[16px] font-medium text-secondary">
                                        {educationLabel}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto scrollbar px-3">
                            {/* MENU ITEMS */}
                            <div className="mt-6 space-y-3">

                                <ProfileItem
                                    title={t('profile.preferredLanguage')}
                                    onClick={() => setSelected("language")}
                                    rightContent={
                                        <span className="text-[14px] text-secondary">
                                            {languages.find((l: any) => l.value === selectedLanguage)?.label ?? "English (UK)"}
                                        </span>
                                    }
                                />

                                <ProfileItem
                                    title={t('profile.notificationPreference')}
                                    rightContent={
                                        <CustomSwitch
                                            checked={notifications}
                                            loading={notificationLoading}
                                            onChange={handleNotificationToggle}
                                        />
                                    }
                                />

                                <ProfileItem
                                    title={t('profile.savedNotes')}
                                    onClick={() => setSelected("notes")}
                                />

                                <ProfileItem
                                    title={t('profile.savedFlashcards')}
                                    onClick={() => setSelected("flashcards")}
                                />

                                <ProfileItem
                                    title={t('profile.savedSummaries')}
                                    onClick={() => setSelected("Summaries")}
                                />

                                <ProfileItem
                                    title={t('profile.achievements')}
                                    onClick={() => setSelected("achievements")}
                                />

                                <ProfileItem
                                    title={t('profile.mySubscription')}
                                    onClick={() => setSelected("subscription")}
                                    rightContent={
                                        <span className="text-[12px] text-secondary">Premium</span>
                                    }
                                />

                                <ProfileItem
                                    title={t('profile.termsConditions')}
                                    onClick={() => setSelected("terms")}
                                />

                                <ProfileItem
                                    title={t('profile.privacyPolicy')}
                                    onClick={() => setSelected("privacy")}
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
                                    // initializeAppLanguage();
                                    setSelected(null);
                                }}
                            />
                        )}

                        {selected === "subscription" && <SubscriptionSection />}
                        {selected === "terms" && <TermsSection />}
                        {selected === "privacy" && <PrivacySection />}
                        {selected === "achievements" && <AchievementsSection />}
                    </div>
                )}

                {logoutOpen && (
                    <ConfirmModal
                        type="logout"
                        onClose={() => setLogoutOpen(false)}
                        onConfirm={handleLogout}
                    />
                )}

                {deleteOpen && (
                    <ConfirmModal
                        type="delete"
                        onClose={() => setDeleteOpen(false)}
                        onConfirm={() => console.log("delete api call")}
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

const SubscriptionSection = () => {
    const [expandedFree, setExpandedFree] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<"free" | "monthly" | "yearly">("yearly");
    const [upgrading, setUpgrading] = useState(false);

    const handleUpgrade = async () => {
        if (upgrading) return;
        setUpgrading(true);
        try {
            // TODO: Replace with your real subscription API call e.g:
            // await fetch({ url: "/subscription/upgrade", method: "POST", data: { plan: selectedPlan } });
            await new Promise((resolve) => setTimeout(resolve, 800)); // simulated delay
            const planLabel =
                selectedPlan === "free" ? "Free" :
                selectedPlan === "monthly" ? "Monthly ($39.90/year)" :
                "Yearly ($159.90/year)";
            message.success(`Successfully switched to ${planLabel} plan!`);
        } catch (err) {
            message.error("Failed to update subscription. Please try again.");
        } finally {
            setUpgrading(false);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto scrollbar">
            <div className="flex justify-end mb-2">
                <button className="text-[14px] text-primary underline">
                    Restore.
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
                {/* FREE - selectable with blue border + expand/collapse */}
                <div
                    className={`border rounded-[12px] overflow-hidden cursor-pointer transition-all ${selectedPlan === "free" ? "border-primary" : "border-gray-200"}`}
                    onClick={() => { setSelectedPlan("free"); setExpandedFree((p) => !p); }}
                >
                    <div className="w-full flex items-center justify-between px-4 py-3">
                        <span className="text-[15px] font-semibold text-gray-900">FREE</span>
                        {expandedFree
                            ? <LuChevronUp size={18} className="text-secondary" />
                            : <LuChevronDown size={18} className="text-secondary" />
                        }
                    </div>
                    {expandedFree && (
                        <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
                            {FREE_FEATURES.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 text-[13px] text-secondary">
                                    <span className="text-gray-500">{f.icon}</span>
                                    {f.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* MONTHLY */}
                <div
                    className={`border rounded-[12px] overflow-hidden cursor-pointer transition-all ${selectedPlan === "monthly" ? "border-primary" : "border-gray-200"}`}
                    onClick={() => setSelectedPlan("monthly")}
                >
                    <div className="flex items-center justify-between px-4 py-3">
                        <div>
                            <p className="text-[13px] text-secondary font-medium">MONTHLY</p>
                            <p className="text-[18px] font-bold text-gray-900">
                                $39.90 <span className="text-[13px] font-normal text-secondary">/year</span>
                            </p>
                        </div>
                        <LuChevronDown size={18} className="text-secondary" />
                    </div>
                </div>

                {/* YEARLY */}
                <div
                    className={`border rounded-[12px] overflow-hidden cursor-pointer transition-all ${selectedPlan === "yearly" ? "border-primary" : "border-gray-200"}`}
                    onClick={() => setSelectedPlan("yearly")}
                >
                    <div className="flex items-center justify-between px-4 py-3">
                        <div>
                            <p className="text-[13px] text-secondary font-medium">YEARLY</p>
                            <p className="text-[18px] font-bold text-gray-900">
                                $159.90 <span className="text-[13px] font-normal text-secondary">/year</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                7-Days free trial
                            </span>
                            <LuChevronDown size={18} className="text-secondary" />
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="mt-6 w-full h-[52px] bg-primary text-white rounded-[12px] text-[16px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {upgrading && <Spin size="small" />}
                {upgrading ? "Processing..." : "Upgrade To Premium"}
            </button>
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

const PrivacySection = () => (
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
        className="h-[50px] bg-[#F7F7F8] rounded-[8px] px-4 flex items-center justify-between cursor-pointer"
    >
        <p className={`text-[16px] ${titleClass || "text-primaryText"}`}>
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