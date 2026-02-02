import { fetch } from "@/src/libs/helpers";

export const saveOnboardingProfile = async (data: {
  user_language: string;
  user_EducationLevel: string;
}) => {
  return await fetch({
    url: "/onboarding/profile",
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