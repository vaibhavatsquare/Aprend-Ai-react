"use client";

import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { Summary } from "@/src/services/api/summary.api";
import { generateVideoFlashcards } from "@/src/services/api/flashcards.api";
import { useTranslation } from "@/src/libs/i18n";
import { mapFlashcardQuestions } from "@/src/libs/types/flashcards.types";
import { Question } from "@/src/libs/types/dashboard.types";

type Props = {
  summary: Summary;
  onFlashcardReady: (
    flashcardId: string,
    questions: Question[]
  ) => void;
  onBack: () => void;
};

const SummaryDetail = ({ summary, onFlashcardReady, onBack }: Props) => {

  const [loading, setLoading] = useState(false);
const { t } = useTranslation();
  const handleGenerate = async () => {

  try {

    setLoading(true);

    const res = await generateVideoFlashcards(summary.id);

    const mappedQuestions = mapFlashcardQuestions(res.questions || []);

    onFlashcardReady(res.id, mappedQuestions);

  } catch (err) {

    console.error(err);

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="px-4">

      <div
        className="h-[calc(100vh-100px)] mt-1 mb-4 rounded-[32px] flex flex-col overflow-hidden"
        style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
      >

        {/* HEADER */}
        <div className="py-3 px-6 flex items-center relative">

          <GoArrowLeft
            className="text-xl absolute left-8 cursor-pointer"
            onClick={onBack}
          />

          <h1 className="text-[28px] font-semibold text-primaryText w-full text-center">
            Summary
          </h1>

        </div>


        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-10 scrollbar">

          <h2 className="text-[20px] font-semibold text-center mb-6">
            {summary.title}
          </h2>

          <p className="text-[18px] text-secondary leading-7 whitespace-pre-wrap text-center max-w-[800px] mx-auto">
            {summary.summary}
          </p>

        </div>


        {/* GENERATE BUTTON */}
        <div className="flex justify-center pb-8">

          <div
            onClick={!loading ? handleGenerate : undefined}
            className="flex items-center gap-2 px-6 h-[44px] rounded-[18px] bg-white hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer"
            style={{
              boxShadow: "0px 0px 10px rgba(0,0,0,0.10)",
            }}
          >
            {loading ? "Generating..." : "Generate flashcard"}
          </div>

        </div>

      </div>

    </div>
  );
};

export default SummaryDetail;