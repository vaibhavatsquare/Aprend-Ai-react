"use client";

import { useEffect, useState } from "react";
import { getStoredUser } from "@/src/libs/helpers";
import { Achievement, UserDetail, UserLanguage } from "@/src/libs/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiEdit2 } from "react-icons/fi";
import { IoChevronForward } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { Switch, message } from "antd";
import { signOutUser } from "@/src/services/auth/auth.firebase.service";
import ConfirmModal from "./confirmModal";
import SavedLibrary from "./savedLibrary";
import SavedFlashCards from "../flashcards/savedFlashCards";
import SavedNotes from "../notes/savedNotes";
import LanguageSection from "./chooseLanguage";
import { initializeAppLanguage } from "@/src/libs/helpers";
import { t } from "@/src/libs/i18n";

const UserProfile = () => {
    const [user, setUser] = useState<UserDetail | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [notifications, setNotifications] = useState(true);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<UserLanguage | null>(null);

    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [achievementOpen, setAchievementOpen] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

    const router = useRouter();

    const dummyAchievements: Achievement[] = [
        {
            id: 1,
            icon: "🔥",
            title: "7-day streak!",
            description: "You’ve maintained your learning streak for 7 days! Keep it going",
            image: "/images/achievements/streak.png",
            buttonText: "Keep it going",
            buttonColor: "#E74C3C"
        },
        {
            id: 2,
            icon: "📘",
            title: "Module Complete",
            description: "Well done! You’ve completed the 'Human Anatomy' module.",
            image: "/images/achievements/module.png",
            buttonText: "Continue learning",
            buttonColor: "#3B5BDB"
        },
        {
            id: 3,
            icon: "🏅",
            title: "You're a Star!",
            description: "Amazing work! You’ve scored the highest in this week’s quiz challenge.",
            image: "/images/achievements/star.png",
            buttonText: "Awesome",
            buttonColor: "#1A936F"
        }
    ];

    useEffect(() => {
        const fetchAchievements = async () => {
            try {

                // Future API
                // const res = await getAchievements()

                // Dummy for now
                const res = dummyAchievements

                setAchievements(res);

            } catch (error) {
                console.error("achievement fetch error", error);
            }
        };

        fetchAchievements();
    }, []);

    useEffect(() => {
        const storedUser = getStoredUser();
        setUser(storedUser);
        setSelectedLanguage(storedUser?.user_language || null);
    }, []);

    const educationLabel = (level?: string) => {
        switch (level) {
            case "HIGH_SCHOOL":
                return "High School";
            case "UNIVERSITY":
                return "University";
            case "COMPETITIVE_EXAMS":
                return "Competitive Exams";
            default:
                return "—";
        }
    };

    const handleLogout = async () => {
        try {
            await signOutUser();
            message.success(t('auth.logoutSuccess'));
            router.replace("/login");
        } catch {
            message.error(t('auth.logoutFailed'));
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
                                <div className="relative w-[100px] h-[100px]">
                                    {user?.image ? (
                                        <Image
                                            src={user.image}
                                            alt="profile"
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <FaUserCircle
                                            size={100}
                                            className="text-gray-300"
                                        />
                                    )}

                                    <div
                                        onClick={() => setSelected("editProfile")}
                                        className="absolute bottom-0 right-0 w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center shadow">
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
                                        {educationLabel(user?.user_EducationLevel)}
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
                                            onChange={setNotifications}
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
                            <EditProfileSection user={user} />
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
                            <div className="flex flex-col h-full">

                                {/* Top Title */}
                                <h3 className="text-[22px] font-semibold text-center mt-4 mb-4">
                                    Achievements
                                </h3>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto px-5 scrollbar">

                                    <div className="grid grid-cols-2 gap-x-6 gap-y-8 mb-4">
                                        {achievements.map((item) => (
                                            <AchievementCard
                                                key={item.id}
                                                icon={item.icon}
                                                title={item.title}
                                                onClick={() => {
                                                    setSelectedAchievement(item);
                                                    setAchievementOpen(true);
                                                }}
                                            />
                                        ))}
                                    </div>

                                </div>
                            </div>
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

                {achievementOpen && selectedAchievement && (
                    <ConfirmModal
                        type="achievement"
                        achievement={selectedAchievement}
                        onClose={() => setAchievementOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

const EditProfileSection = ({ user }: { user: UserDetail | null }) => {
    return (
        <div>
            <h3 className="text-[20px] font-semibold mb-6">
                {t('profile.editProfile')}
            </h3>

            <div className="space-y-4">
                <InputField label={t('profile.name')} value={user?.name || ""} />
                <InputField label={t('profile.emailAddress')} value={user?.email || ""} disabled />
                <InputField label="High School" value="High School" />
            </div>

            <div className="flex justify-end mt-6 gap-3">
                <button className="px-4 py-2 bg-gray-100 rounded-[8px]">
                    {t('common.cancel')}
                </button>
                <button className="px-4 py-2 bg-[#0F3057] text-white rounded-[8px]">
                    {t('common.save')}
                </button>
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

const AchievementCard = ({
    icon,
    title,
    onClick
}: {
    icon: string;
    title: string;
    onClick: () => void;
}) => {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-[16px] p-3 shadow-md text-center cursor-pointer hover:shadow-lg transition"
        >
            <div className="text-[70px]">{icon}</div>

            <p className="text-[18px] font-medium">
                {title}
            </p>
        </div>
    );
};

const CustomSwitch = ({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: (val: boolean) => void;
}) => {
    return (
        <div
            onClick={() => onChange(!checked)}
            className={`w-[44px] h-[26px] flex items-center rounded-full cursor-pointer transition-all duration-300 ${checked ? "bg-[#0F3057]" : "bg-gray-300"
                }`}
        >
            <div
                className={`w-[20px] h-[20px] bg-white rounded-full shadow-md transform transition-all duration-300 ${checked ? "translate-x-[21px]" : "translate-x-[3px]"
                    }`}
            />
        </div>
    );
};

export default UserProfile;
