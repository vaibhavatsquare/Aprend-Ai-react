export interface response {
  data?: any;
  message?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  notificationToken: string;
  status: "ENABLED" | "DISABLED";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "USER" | "ADMIN";

export type UserStatus = "ENABLED" | "DISABLED";

export type UserLanguage = "ENGLISH" | "SPANISH" | "PORTUGUESE";

export type UserEducationLevel =
  | "ELEMENTARY"
  | "HIGH_SCHOOL"
  | "PRE_UNIVERSITY"
  | "UNIVERSITY"
  | "COMPETITIVE_EXAMS";

export interface UserDetail {
  id: string;
  email: string;
  name: string | null;
  timezone: string | null;
  firebaseUId: string;
  image: string | null;
  role: UserRole;
  status: UserStatus;
  user_language: UserLanguage;
  user_EducationLevel: UserEducationLevel;
  notificationsEnabled: boolean
  isDeleted: boolean;
  isEmailVerified: boolean;
  isPasswordReset: boolean;
  isPlacementQuizDone: boolean;
  createdAt: string;
  updatedAt: string;
  isPremium?: boolean;
}

export interface Achievement {
  id: string;
  image: string;
  title: string;
  description: string;
  buttonName: string;
  code: string;
};
