import { fetch } from "@/src/libs/helpers";

export const getProfile = async (userId?: string) => {
  return await fetch<{
    user: { id: string };
    userSessions: { id: string };
  }>({
    url: "/auth/user/${userId}/profile",
    method: "GET",
  });
};

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