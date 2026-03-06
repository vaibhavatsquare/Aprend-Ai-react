import { Question } from "./dashboard.types";

export interface FlashcardOption {
  id: string;
  text: string;
}

export interface FlashcardQuestion {
  id: string;
  flashCardId: string;
  question: string;
  explanation: string;
  options: FlashcardOption[];
  correctOptionId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  userId: string;
  conversationId: string;
  videoSummaryId: string | null;
  title: string;
  status: "ENABLED" | "DISABLED";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  questions?: FlashcardQuestion[];
}

// GET response
export interface FlashcardListResponse {
  total: number;
  list: Flashcard[];
  hasMany: boolean;
  count: number;
}

export const mapFlashcardQuestions = (
  questions: FlashcardQuestion[]
): Question[] => {
  return questions.map((q) => ({
    id: q.id,
    taskId: q.flashCardId,
    questionText: q.question,
    options: q.options,
    correctOptionId: q.correctOptionId,
    stepByStepExplanation: q.explanation,
    source: "AI_generated",
    reinforcement: false,
    createdAt: q.createdAt,
  }));
};

export type FlashcardUI = Omit<Flashcard, "questions"> & {
  questions?: Question[];
};