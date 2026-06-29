"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button, message, Spin } from "antd";
import { useRedirect } from "@/src/hooks/router.hooks";
import { useTranslation } from "@/src/libs/i18n";
import { saveEducationlevel, getEducationLevels, getSubjectsByLevel } from "@/src/services/api/user.api";
// import FullScreenLoader from "@/src/components/loaders/fullScreenLoader";
import { useRouter } from "next/navigation";

const ChooseEducationLevel = () => {
  const { t } = useTranslation();

  const [selectedEducationLevel, setSelectedEducationLevel] =
    useState<string | null>(null);
  const [educationLevels, setEducationLevels] = useState<any[]>([]);
  const [loadingLevels, setLoadingLevels] = useState(true);
    const [saving, setSaving] = useState(false);

  const router = useRouter();



useEffect(() => {
  const cached = localStorage.getItem("educationLevels");
  if (cached) {
    setEducationLevels(JSON.parse(cached));
    setLoadingLevels(false);
    return;
  }
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const language = user?.user_language || "ENGLISH";
  getEducationLevels(language)
    .then((data) => {
      setEducationLevels(data);
      localStorage.setItem("educationLevels", JSON.stringify(data));
    })
    .catch(() => {})
    .finally(() => setLoadingLevels(false));
}, []);

const levelIcons: Record<string, string> = {
  "ENEM_2026": "🎯",
  "HIGH_SCHOOL": "📚",
  "PRE_UNIVERSITY_PREP": "🏆",
  "PUBLIC_EXAMS": "📋",
  "COLLEGE_UNIVERSITY": "🎓",
  "ELEMENTARY_SCHOOL": "✏️",
};

  const getEducationLabel = (value: string) => {
    const map: Record<string, string> = {
      'ELEMENTARY': t('onboarding.elementary' as any),
      'HIGH_SCHOOL': t('onboarding.highSchool' as any),
      'PRE_VESTIBULAR': t('onboarding.preUniversity' as any),
      'UNIVERSITY': t('onboarding.university' as any),
      'COMPETITIVE_EXAMS': t('onboarding.competitiveExams' as any),

    };
    return map[value] || value;
  };

  const handleContinue = async () => {
  if (!selectedEducationLevel) return;
  setSaving(true);
  try {
    await saveEducationlevel({
      educationLevelId: selectedEducationLevel
    });
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    user.educationLevelId = selectedEducationLevel;
    localStorage.setItem("user", JSON.stringify(user));
    const language = user?.user_language || "ENGLISH";
    const subjects = await getSubjectsByLevel(selectedEducationLevel, language);
    localStorage.setItem("subjectsByLevel", JSON.stringify(subjects));
    router.push("/onboarding/placement-quize");
  } catch {
    message.error("Failed to save profile");
  } finally {
    setSaving(false);
  }
};

  // if (loadingLevels) return <FullScreenLoader />;




  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="text-xl font-semibold">
          {t('onboarding.chooseEducationLevel')}
        </h1>

        <div className="flex flex-col gap-3">
          {loadingLevels ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="w-[380px] max-w-[90vw] h-[64px] rounded-xl bg-gray-100 animate-pulse" />
            ))
          ) : educationLevels.map((level: any) => (
            // <div
            //   key={level.value}
            //   className={`w-[280px] h-11 px-3 border rounded-xl flex justify-between items-center gap-3 cursor-pointer transition-all ${
            //     selectedEducationLevel === level.value
            //       ? "border-[#2563EB] bg-[#2563EB]"
            //       : "border-[#DADADA] hover:border-[#2563EB]"
            //   }`}
            //   onClick={() => setSelectedEducationLevel(level.value)}
            //   style={selectedEducationLevel === level.value ? { boxShadow: '0px 4px 16px 0px #2563EB40' } : undefined}
            // >
            //   {/* <p className="text-sm">{level.label}</p> */}
            //   <p className={`text-sm ${selectedEducationLevel === level.value ? "text-white" : ""}`}>{getEducationLabel(level.value)}</p>
            //   <div
            //     className={`w-4 h-4 flex justify-center items-center border-2 rounded-full ${
            //       selectedEducationLevel === level.value
            //         ? "border-white"
            //         : "border-[#DADADA]"
            //     }`}
            //   >
            //     {selectedEducationLevel === level.value && (
            //       <div className="w-2 h-2 bg-white rounded-full" />
            //     )}
            //   </div>
            // </div>
            <div
              key={level.id}
              onClick={() => setSelectedEducationLevel(level.id)}
              className={`w-[380px] max-w-[90vw] h-[64px] px-3 py-3 border rounded-xl
    flex items-center gap-3 cursor-pointer transition-all ${selectedEducationLevel === level.id
                  ? "border-[#2563EB] bg-[#2563EB]"
                  : "border-[#DADADA] hover:border-[#2563EB]"
                }`}
              style={selectedEducationLevel === level.id ? { boxShadow: '0px 4px 16px 0px #2563EB40' } : undefined}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-lg overflow-hidden">
                {levelIcons[level.code] || "📚"}
              </div>

              {/* Title + subtitle */}
              <div className="flex flex-col flex-1 min-w-0">
                <p className={`text-sm font-semibold ${selectedEducationLevel === level.id ? "text-white" : "text-[#121212]"}`}>
                  {level.name}
                </p>
                <p className={`text-xs mt-0.5 ${selectedEducationLevel === level.id ? "text-white/80" : "text-[#555555]"}`}>
                  {level.description}
                </p>
              </div>

              {/* Radio */}
              <div className={`w-4 h-4 flex justify-center items-center border-2 rounded-full flex-shrink-0 ${selectedEducationLevel === level.id ? "border-white" : "border-[#DADADA]"
                }`}>
                {selectedEducationLevel === level.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedEducationLevel && !loadingLevels && (
          <Button
            onClick={handleContinue}
            loading={saving}
            disabled={saving}
            className="w-[280px] h-10! rounded-xl! text-white! mt-4"
            style={{
              backgroundImage: "url('/images/buttonBg.svg')",
              backgroundSize: '350% 700%', backgroundPosition: 'center',
              boxShadow: '0px 0px 50px 0px #1953CB40',
              border: '1px solid rgba(255,255,255,0.35)',
            }}
          >
            {t('common.continue')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChooseEducationLevel;