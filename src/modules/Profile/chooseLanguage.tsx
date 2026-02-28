"use client";

import { useEffect, useState } from "react";
import { languages } from "@/src/libs/constants/onboarding.constants";
import Image from "next/image";
import { message } from "antd";
import { useLanguageStore } from "@/src/store/language.store";
import { saveLanguage } from "@/src/services/api/user.api";

const LanguageSection = ({
    currentLanguage,
    onClose,
}: {
    currentLanguage: string | null;
    onClose: (lang: string) => void;
}) => {

    const [selectedLang, setSelectedLang] = useState<string | null>(null);
    const setLanguage = useLanguageStore((s) => s.setLanguage);

    // Preselect existing language
    useEffect(() => {
        setSelectedLang(currentLanguage);
    }, [currentLanguage]);

    const handleSave = async () => {
        if (!selectedLang) return;

        try {
            await saveLanguage({
                user_language: selectedLang,
            });

            setLanguage(selectedLang);
            message.success("Language updated");

            onClose(selectedLang); // parent update + close split
        } catch {
            message.error("Failed to update language");
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-between">

            {/* TOP */}
            <div className="flex flex-col gap-6 items-center mt-6 w-full">

                <h1 className="text-xl font-semibold">
                    Choose your language
                </h1>

                <div className="flex flex-col gap-[14px] mt-4 px-4 w-full">
                    {languages.map((language: any) => (
                        <div
                            key={language.value}
                            className={`w-full h-10 border rounded-xl flex justify-center items-center gap-3 cursor-pointer transition-all
                ${selectedLang === language.value
                                    ? "border-primary"
                                    : "border-[#DADADA] hover:border-gray-400"
                                }`}
                            onClick={() => setSelectedLang(language.value)}
                        >
                            <Image src={language.flag} alt="" width={24} height={24} />
                            <p className="text-sm font-medium">{language.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* BOTTOM */}
            <div className="flex justify-center mb-6">
                <button
                    onClick={handleSave}
                    disabled={!selectedLang}
                    className="w-[280px] h-10 rounded-xl text-white bg-primary disabled:opacity-50"
                >
                    Save to Profile
                </button>
            </div>
        </div>
    );
};

export default LanguageSection;
