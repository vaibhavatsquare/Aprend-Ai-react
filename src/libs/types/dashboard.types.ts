export type Question = {
  id: string;
  taskId: string;
  questionText: string;
  options: Option[];
  correctOptionId: string;
  stepByStepExplanation: string;
  source: string;
  reinforcement: boolean;
  createdAt: string;
  userQuestionAttempts?: UserQuestionAttempt[];
};

export type TaskDetail = {
  id: string;
  subject: string;
  topic: string;
  subtopic: string;
  taskType: "FLASHCARD" | "PRACTICE_QUESTION" | "CONCEPT_EXPLANATION";
  difficulty: string;
  createdAt?: string;
  questions: Question[];
};

export type UserTask = {
  id: string;
  userId?: string;
  taskId?: string;

  status: "PENDING" | "COMPLETED";

  scheduledDate: string;
  completedAt: string | null;

  createdAt?: string;
  updatedAt?: string;

  task: TaskDetail;
};

export type DashboardResponse = {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  count: number;
  tasks: UserTask[];
};

export type Option = {
  id: string;
  text: string;
};

export type UserQuestionAttempt = {
  id: string;
  userId: string;
  userTaskId: string;
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  createdAt: string;
};