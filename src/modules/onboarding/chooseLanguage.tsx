"use client";
import Image from "next/image";
import { languages } from "@/src/libs/constants/onboarding.constants";
import { useState } from "react";
import { Button, message } from "antd";
import { useRedirect } from "@/src/hooks/router.hooks";
import { useLanguageStore } from "@/src/store/language.store";
import { saveOnboardingProfile } from "@/src/services/api/user.api";

const ChooseLanguage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  const handleContinue = () => {
    if (!selectedLanguage) return;
    setLanguage(selectedLanguage); 
    useRedirect("/onboarding/choose-education-level");
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="text-xl font-semibold">Choose your language</h1>

        <div className="flex flex-col gap-3">
          {languages.map((language: any) => (
            <div
              key={language.value}
              className={`w-[280px] h-10 border rounded-xl flex justify-center items-center gap-3 cursor-pointer transition-all ${
                selectedLanguage === language.value
                  ? "border-primary"
                  : "border-[#DADADA] hover:border-gray-400"
              }`}
              onClick={() => setSelectedLanguage(language.value)}
            >
              <Image src={language.flag} alt="" width={24} height={24} />
              <p className="text-sm font-medium">{language.label}</p>
            </div>
          ))}
        </div>

        {selectedLanguage && (
          <Button
            onClick={handleContinue}
            className="w-[280px] h-10! rounded-xl! text-white! bg-primary! mt-4"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChooseLanguage;
