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
import { t } from "@/src/libs/i18n";
import AchievementsSection from "./achievementsSection";
import { updateNotificationPreference } from "@/src/services/api/notification.api";
import { getUserProfile } from "@/src/services/api/user.api";
import EditProfileSection from "./editProfileSection";
import { educationLevels } from "@/src/libs/constants/onboarding.constants";

const UserProfile = () => {
    const [user, setUser] = useState<UserDetail | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [notifications, setNotifications] = useState(false);
    const [notificationLoading, setNotificationLoading] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<UserLanguage | null>(null);

    const router = useRouter();

    // useEffect(() => {
    const storedUser = getStoredUser();
    //     setUser(storedUser);
    //     setSelectedLanguage(storedUser?.user_language || null);

    //     if (storedUser) {
    //         setNotifications(storedUser.notificationsEnabled);
    //     }
    // }, []);

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

                                {/* Preferred Language */}
                                <ProfileItem
                                    title={t('profile.preferredLanguage')}
                                    onClick={() => setSelected("language")}
                                    rightContent={
                                        <span className="text-[14px] text-secondary">
                                            English (UK)
                                        </span>
                                    }
                                />

                                {/* Notification Preference */}
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
                    <div className="w-1/2 bg-white m-4 p-4 rounded-[12px] h-[calc(96vh-100px)] col-span-2 flex flex-col gap-4"
                        style={{
                            boxShadow: "0px 0px 4px 0px #00000040",
                        }}>

                        {/* EDIT PROFILE */}
                        {selected === "editProfile" && (
                            <EditProfileSection
                                user={user}
                                onUpdated={(data) =>
                                    setUser((prev) => prev ? { ...prev, ...data } : prev)
                                }
                                onCancel={() => setSelected(null)}
                            />
                        )}

                        {/* LANGUAGE */}
                        {selected === "language" && (
                            <LanguageSection
                                currentLanguage={selectedLanguage}
                                onClose={(lang) => {
                                    setSelectedLanguage(lang);

                                    setUser((prev) =>
                                        prev ? { ...prev, user_language: lang } : prev

                                    );
                                    initializeAppLanguage();
                                    setSelected(null); // close split
                                }}
                            />
                        )}

                        {/* SUBSCRIPTION */}
                        {selected === "subscription" && (
                            <SubscriptionSection />
                        )}

                        {/* TERMS */}
                        {selected === "terms" && (
                            <TermsSection />
                        )}

                        {/* PRIVACY */}
                        {selected === "privacy" && (
                            <PrivacySection />
                        )}

                        {/* ACHIEVEMENTS */}
                        {selected === "achievements" && (
                            <AchievementsSection />
                        )}
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

const SubscriptionSection = () => (
    <div>
        <h3 className="text-[20px] font-semibold mb-6">
            {t('profile.mySubscription')}
        </h3>

        <div className="bg-[#F7F7F8] rounded-[12px] p-4">
            <p className="text-[16px] font-medium">{t('profile.subscription.premiumPlan')}</p>
            <p className="text-[14px] text-secondary mt-1">
                {t('profile.subscription.currentlySubscribed')}
            </p>
        </div>
    </div>
);

const TermsSection = () => (
    <div>
        <h3 className="text-[20px] font-semibold mb-4">
            {t('profile.termsConditions')}
        </h3>

        <div className="text-[14px] text-secondary space-y-3">
            <p>By downloading or using the app...</p>
            <p>The app and all other intellectual property...</p>
        </div>
    </div>
);

const PrivacySection = () => (
    <div>
        <h3 className="text-[20px] font-semibold mb-4">
            {t('profile.privacyPolicy')}
        </h3>

        <div className="text-[14px] text-secondary space-y-3">
            <p>Your data is handled securely...</p>
            <p>We do not share personal data...</p>
        </div>
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
}) => {
    return (
        <div
            onClick={onClick}
            className="h-[50px] bg-[#F7F7F8] rounded-[8px] px-4 flex items-center justify-between cursor-pointer"
        >
            <p className={`text-[16px] ${titleClass || "text-primaryText"}`}>
                {title}
            </p>

            {rightContent ? (
                rightContent
            ) : (
                <IoChevronForward size={18} />
            )}
        </div>
    );
};

const CustomSwitch = ({
    checked,
    onChange,
    loading,
}: {
    checked: boolean;
    loading?: boolean;
    onChange: (val: boolean) => void;
}) => {

    return (
        <div className="relative w-[44px] h-[26px] flex items-center">

            {/* SWITCH */}
            <div
                onClick={() => {
                    if (!loading) onChange(!checked);
                }}
                className={`w-[44px] h-[26px] flex items-center rounded-full cursor-pointer transition-all duration-300 ${checked ? "bg-[#0F3057]" : "bg-gray-300"
                    }`}
            >

                <div
                    className={`w-[20px] h-[20px] bg-white rounded-full shadow-md transform transition-all duration-300 ${checked ? "translate-x-[21px]" : "translate-x-[3px]"
                        }`}
                />

            </div>

            {/* LOADER */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-full">
                    <Spin size="small" />
                </div>
            )}

        </div>
    );
};

export default UserProfile;
