import { fetch } from "@/src/libs/helpers";
import { UserLanguage, Achievement, UserDetail } from "@/src/libs/types";

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
  list: any[];
  total: number;
  count: number;
  hasMany: boolean;
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

export const getUserProfile = async (): Promise<UserDetail> => {
  return fetch<UserDetail>({
    url: "/auth/userprofile",
    method: "GET",
  });
};

export const updateUserProfile = async (data: {
  name?: string;
  user_EducationLevel?: string;
  image?: string | null;
}) => {
  return fetch({
    url: "/profile/edit",
    method: "PATCH",
    data,
  });
};