"use client";
import Image from "next/image";
import { languages } from "@/src/libs/constants/onboarding.constants";
import { useState } from "react";
import { Button, message } from "antd";
import { useRedirect } from "@/src/hooks/router.hooks";
import { useLanguageStore } from "@/src/store/language.store";
import { saveLanguage } from "@/src/services/api/user.api";
import { UserLanguage } from "@/src/libs/types";

const ChooseLanguage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<UserLanguage | null>(null);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  const handleContinue = async () => {
    if (!selectedLanguage) return;
    setLanguage(selectedLanguage);
    try {
      await saveLanguage({
        user_language: selectedLanguage
      });
      useRedirect("/onboarding/choose-education-level");
    } catch {
      message.error("Failed to save language");
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="text-xl font-semibold">Choose your language</h1>

        <div className="flex flex-col gap-3">
          {languages.map((language: any) => (
            <div
              key={language.value}
              className={`w-[280px] h-10 border rounded-xl flex justify-center items-center gap-3 cursor-pointer transition-all ${selectedLanguage === language.value
                  ? "border-[#2563EB] bg-[#2563EB]"
                  : "border-[#DADADA] hover:border-gray-400"
                }`}
              onClick={() => setSelectedLanguage(language.value)}
            >
              <Image src={language.flag} alt="" width={24} height={24} />
              {/* <p className="text-sm font-medium">{language.label}</p> */}
              <p className={`text-sm font-medium ${selectedLanguage === language.value ? "text-white" : ""}`}>{language.label}</p>
            </div>
          ))}
        </div>

        {selectedLanguage && (
          <Button
            onClick={handleContinue}
            // className="w-[280px] h-10! rounded-xl! text-white! bg-primary! mt-4"
            className="w-[280px] h-10! rounded-xl! text-white! mt-4"
            style={{
              backgroundImage: "url('/images/buttonBg.svg')",
              backgroundSize: '350% 700%', backgroundPosition: 'center',
              boxShadow: '0px 0px 50px 0px #1953CB40',
              border: '1px solid rgba(255,255,255,0.35)',
            }}
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChooseLanguage;
