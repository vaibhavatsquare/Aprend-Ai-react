import { fetch } from "@/src/libs/helpers";

export const saveLanguage = async (data: {
  user_language: string;
}) => {
  return await fetch({
    url: "/onboarding/Language",
    method: "POST",
    data,
  });
};

export const saveEducationlevel = async (data: {
  user_EducationLevel: string;
}) => {
  return await fetch({
    url: "/onboarding/educationlevel",
    method: "POST",
    data,
  });
};

export const savePlacementQuiz = async (data: {
  learningGoal: string;
  studyTimePerDay: string;
  preferredTime: string;
  subjects: string[];
  learningStyles: string[];
}) => {
  return await fetch({
    url: "/onboarding/placement-quiz",
    method: "POST",
    data,
  });
};