import { fetch } from "@/src/libs/helpers";

import {
  Flashcard,
  FlashcardListResponse,
} from "@/src/libs/types/flashcards.types";

// CREATE FLASHCARDS
export const generateFlashcards = async (
  conversationId: string
): Promise<Flashcard> => {
  return fetch<Flashcard>({
    url: "/ai-tutor/flashcards",
    method: "POST",
    data: { conversationId },
  });
};

// GET FLASHCARDS (PAGINATION)
export const getFlashcards = async (params?: {
  skip?: number;
  take?: number;
  include?: string;
  search?: string;
  orderBy?: string;
}): Promise<FlashcardListResponse> => {
  return fetch<FlashcardListResponse>({
    url: "/ai-tutor/flashcards",
    method: "GET",
    params,
  });
};

// RENAME
export const renameFlashcard = async (
  id: string,
  title: string
): Promise<Flashcard> => {
  return fetch<Flashcard>({
    url: `/ai-tutor/flashcards/${id}`,
    method: "PATCH",
    data: { title },
  });
};

// DELETE
export const deleteFlashcard = async (id: string): Promise<void> => {
  return fetch<void>({
    url: `/ai-tutor/flashcards/${id}`,
    method: "DELETE",
  });
};

// VALIDATE FLASHCARD ANSWER
export const validateFlashcardAnswer = async (payload: {
  questionId: string;
  selectedOptionId: string;
}): Promise<{
  isCorrect: boolean;
  correctOptionId: string;
  explanation: string;
}> => {
  return fetch({
    url: "/ai-tutor/flashcards/validate",
    method: "POST",
    data: payload,
  });
};

export const generateVideoFlashcards = async (
  videoSummaryId: string
): Promise<Flashcard> => {
  return fetch<Flashcard>({
    url: "/ai-tutor/flashcards/video",
    method: "POST",
    data: { videoSummaryId },
  });
};