"use client";

import { useEffect, useState } from "react";
import { languages } from "@/src/libs/constants/onboarding.constants";
import Image from "next/image";
import { message, Button } from "antd";
import { useLanguageStore } from "@/src/store/language.store";
import { saveLanguage, getEducationLevels } from "@/src/services/api/user.api";
import { useTranslation, translations } from "@/src/libs/i18n";
import { UserLanguage } from "@/src/libs/types";

const LanguageSection = ({
    currentLanguage,
    onClose,
}: {
    currentLanguage: UserLanguage | null;
    onClose: (lang: UserLanguage) => void;
}) => {

    const [selectedLang, setSelectedLang] = useState<UserLanguage | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const setLanguage = useLanguageStore((s) => s.setLanguage);

    // Preselect existing language
    useEffect(() => {
        setSelectedLang(currentLanguage);
    }, [currentLanguage]);

  const handleSave = async () => {
    if (!selectedLang) return;
    setLoading(true);
    try {
        await saveLanguage({ user_language: selectedLang });

        // Get success message in the NEW language before switching
        const successMsg = (translations as any)[selectedLang]?.['profile.languageUpdated'] || 'Language updated';

        setLanguage(selectedLang);

        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

        // Fetch education levels for new language → cache educationLevelId
        try {
            const allLevels = await getEducationLevels(selectedLang);
            const storedName = localStorage.getItem("educationLevelName") || "";
            const match = allLevels.find((l: any) =>
                l.code === storedUser?.user_EducationLevel ||
                (storedName && l.name === storedName) ||
                (storedName && l.name?.toUpperCase() === storedName?.toUpperCase())
            );
            if (match) {
                localStorage.setItem("educationLevelName", match.name);
                localStorage.setItem('user', JSON.stringify({
                    ...storedUser,
                    user_language: selectedLang,
                    educationLevelId: match.id,
                }));
            } else {
                localStorage.setItem('user', JSON.stringify({
                    ...storedUser,
                    user_language: selectedLang,
                }));
            }
        } catch {
            localStorage.setItem('user', JSON.stringify({
                ...storedUser,
                user_language: selectedLang,
            }));
        }

        message.success(successMsg);
        onClose(selectedLang);
    } catch {
        message.error(t('profile.languageUpdateFailed'));
    } finally {
        setLoading(false);
    }
};
    return (
        <div className="w-full h-full flex flex-col justify-between">

            {/* TOP */}
            <div className="flex flex-col gap-6 items-center mt-6 w-full">

                <h1 className="text-xl font-semibold">
                    {t('onboarding.chooseLanguage')}
                </h1>

                <div className="flex flex-col gap-[14px] mt-4 px-4 w-full">
                    {languages.map((language: any) => (
                        <div
                            key={language.value}
                            //             className={`w-full h-10 border rounded-xl flex justify-center items-center gap-3 cursor-pointer transition-all
                            // ${selectedLang === language.value
                            //                     ? "border-primary"
                            //                     : "border-[#DADADA] hover:border-gray-400"
                            //                 }`}
                            className={`w-full h-10 border rounded-xl flex justify-center items-center gap-3 cursor-pointer transition-all
                ${selectedLang === language.value
                                    ? "border-[#2563EB] bg-[#2563EB]"
                                    : "border-[#DADADA] hover:border-gray-400"
                                }`}
                            onClick={() => setSelectedLang(language.value)}
                        >
                            <Image src={language.flag} alt="" width={24} height={24} />
                            {/* <p className="text-sm font-medium">{language.label}</p> */}
                            <p className={`text-sm font-medium ${selectedLang === language.value ? "text-white" : "text-[#121212]"}`}>{language.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* BOTTOM */}
            <div className="flex justify-center mb-6">
                 <Button
                    onClick={handleSave}
                    loading={loading}
                    disabled={!selectedLang || loading}
                    className="w-[280px] h-10! rounded-xl! text-white!"
                    style={{
                        backgroundImage: "url('/images/buttonBg.svg')",
                        backgroundSize: '350% 700%', backgroundPosition: 'center',
                        boxShadow: '0px 0px 50px 0px #1953CB40',
                        border: '1px solid rgba(255,255,255,0.35)',
                    }}
                >
                    {t('profile.saveToProfile')}
                </Button>
            </div>
        </div>
    );
};

export default LanguageSection;
