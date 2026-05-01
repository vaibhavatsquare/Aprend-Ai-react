import { fetch } from "@/src/libs/helpers";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WeakSpotSummary {
  totalWeakAreas: number;
  improvementTrendPercent: number;
  estimatedAverageStudyMinutes: number;
  totalAssignedTasks: number;
  attemptedTasks: number;
  completedTasks: number;
  remainingTasks: number;
}

export interface TrendEntry {
  label: string;
  totalAssigned: number;
  attempted: number;
  completed: number;
  remaining: number;
}

export interface WeakSpotItem {
  subject: string;
  topic: string;
  subtopics: string[];
  accuracyPercent: number;
  retentionPercent: number;
  difficulty: string;
  attemptsCount: number;
  lastPracticeAt: string;
  commonMistakes: string[];
  recommendedLessons: string[];
  aiTip: string;
  action: {
    label: string;
    userTaskId: string;
    scheduledDate: string;
  };
}

export interface Recommendation {
  type: string;
  topic: string;
  title: string;
  message: string;
  ctaLabel: string;
  userTaskId: string;
  noteId: string;
}

export interface WeakSpotTrackerResponse {
  summary: WeakSpotSummary;
  trend: {
    weekly: TrendEntry[];
    monthly: TrendEntry[];
  };
  weakSpots: WeakSpotItem[];
  recommendations: Recommendation[];
  generatedAt: string;
}

// ─── API Call ─────────────────────────────────────────────────────────────────

export const getWeakSpotTracker = async (
  trendType: "all" | "weekly" | "monthly" = "all"
): Promise<WeakSpotTrackerResponse> => {
  return fetch<WeakSpotTrackerResponse>({
    url: "/tasks/weak-spot-tracker",
    method: "GET",
    params: { trendType },
  });
};