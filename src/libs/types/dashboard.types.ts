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
};

export type TaskDetail = {
  id: string;
  subject: string;
  topic: string;
  subtopic: string;
  taskType: "FLASHCARD" | "PRACTICE_QUESTION" | "CONCEPT_EXPLANATION";
  difficulty: string;
  questions: Question[];
};

export type UserTask = {
  id: string;
  status: "PENDING" | "COMPLETED";
  scheduledDate: string;
  completedAt: string | null;
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

