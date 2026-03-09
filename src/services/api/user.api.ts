import { fetch } from "@/src/libs/helpers";
import { UserLanguage, Achievement } from "@/src/libs/types";

export const saveLanguage = async (data: {
  user_language: UserLanguage;
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

export type AchievementListResponse = {
  data: Achievement[];
  total: number;
};

export const getUserAchievements = async (params?: {
  skip?: number;
  take?: number;
  include?: string;
  search?: string;
  orderBy?: string;
}): Promise<AchievementListResponse> => {
  return fetch<AchievementListResponse>({
    url: "/reward/user-achievements",
    method: "GET",
    params,
  });
};