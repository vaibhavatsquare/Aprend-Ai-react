"use client";

import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";

const ChooseSubjects = ({ onBack }: { onBack?: () => void }) => {
  const [value, setValue] = useState(12);

  // ✅ SUBJECT STATE (multi select)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // ✅ DIFFICULTY STATE (single select)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const subjects = ["All Subjects", "English", "Mathematics", "Science", "History", "Geography"];
  const difficulties = ["Easy", "Medium", "Hard", "Mix"];

  // ✅ TOGGLE SUBJECT
  const handleSubject = (item: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  // ✅ SELECT DIFFICULTY
  const handleDifficulty = (item: string) => {
    setSelectedDifficulty(item);
  };

  return (
    <div className="px-6">

      {/* TITLE */}
      <h1 className="text-[30px] font-medium text-[#121212] mb-3 mt-12">
        Choose Subject
      </h1>

      {/* SUBJECT BUTTONS */}
      <div className="flex gap-3 flex-wrap">
        {subjects.map((item) => {
          const isSelected = selectedSubjects.includes(item);

          return (
            <div
              key={item}
              onClick={() => handleSubject(item)}
              className="h-[36px] px-4 flex items-center rounded-[4px] border text-[18px] cursor-pointer transition-all"
              style={{
                borderColor: isSelected ? "#0F3057" : "#DADADA",
                color: isSelected ? "#0F3057" : "#121212",
                background: isSelected ? "#F5F9FF" : "white",
              }}
            >
              {item}
            </div>
          );
        })}
      </div>

      {/* SPACING */}
      <div className="h-[34px]" />

      {/* NUMBER */}
      <h1 className="text-[30px] font-medium text-[#121212] mb-4">
        Number of Question
      </h1>

      {/* SLIDER */}
      <div className="flex justify-start">
        <div className="relative w-[60%]">

          <input
            type="range"
            min={1}
            max={40}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full accent-[#0F3057]"
          />

          {/* VALUE UNDER THUMB */}
          <div
            className="absolute top-6 text-[16px] text-[#121212] -translate-x-1/2"
            style={{
              left: `${(value / 40) * 100}%`,
            }}
          >
            {value}
          </div>
        </div>
      </div>

      {/* SPACING */}
      <div className="h-[52px]" />

      {/* DIFFICULTY */}
      <h1 className="text-[30px] font-medium text-[#121212] mb-6">
        Select difficulty
      </h1>

      <div className="w-full flex justify-left">
        <div className="grid grid-cols-5 gap-4 w-full max-w-[900px]">
          {difficulties.map((item) => {
            const isSelected = selectedDifficulty === item;

            return (
              <div
                key={item}
                onClick={() => handleDifficulty(item)}
                className="w-full h-[70px] border rounded-[12px] px-4 flex items-center justify-between cursor-pointer transition-all"
                style={{
                  borderColor: isSelected ? "#0F3057" : "#DADADA",
                  background: isSelected ? "#F5F9FF" : "white",
                }}
              >
                <span
                  className="text-[18px]"
                  style={{
                    color: isSelected ? "#0F3057" : "#121212",
                  }}
                >
                  {item}
                </span>

                {/* RADIO */}
                <div
                  className="w-4 h-4 rounded-full border flex items-center justify-center"
                  style={{
                    borderColor: isSelected ? "#0F3057" : "#DADADA",
                  }}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[#0F3057]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-center gap-6 mt-20">

        {/* BACK */}
        <button
          onClick={onBack}
          className="w-40 h-[50px] px-10 border border-[#DADADA] rounded-[12px] flex items-center justify-center cursor-pointer"
        >
          <GoArrowLeft className="text-[#121212] text-[20px]" />
          {/* Text */}
          <span className="text-[#121212] text-[16px] ml-2">
            Back
          </span>

        </button>

        {/* CONTINUE */}
        <button
          onClick={() => {
            console.log("Subjects:", selectedSubjects);
            console.log("Difficulty:", selectedDifficulty);
            console.log("Questions:", value);
          }}
          className="w-80 h-[50px] px-16 bg-[#0F3057] text-white rounded-[12px]"
        >
          Continue
        </button>

      </div>
    </div>
  );
};

export default ChooseSubjects;