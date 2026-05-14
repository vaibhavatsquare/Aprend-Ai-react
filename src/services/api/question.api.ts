import { fetch } from "@/src/libs/helpers";
import { Question } from "@/src/libs/types/dashboard.types";

type GenerateSimuladoRequest = {
  subject: string[];
  numberOfQuestions: number;
  difficulty: string;
};

type SimuladoResponse = {
  id: string;
  title: string;
  subject: string[];
  difficulty: string;
  questions: {
    id: string;
    question: string;
    explanation: string;
    correctOptionId: string;
    options: {
      id: string;
      text: string;
    }[];
  }[];
};

export const generateSimuladoQuestions = async (
  payload: GenerateSimuladoRequest
): Promise<{ id: string; questions: Question[] }> => {

  const res = await fetch<SimuladoResponse>({
    url: "/question-simulados/generate",
    method: "POST",
    data: payload,
  });

  return {
    id: res.id,
    questions: res.questions.map((q) => ({
      id: q.id,
      taskId: q.id,
      questionText: q.question,
      correctOptionId: q.correctOptionId,
      stepByStepExplanation: q.explanation,
      options: q.options,
      source: "",
      reinforcement: false,
      createdAt: "",
    })),
  };
};

type ValidateSimuladoRequest = {
  questionId: string;
  selectedOptionId: string;
};

type ValidateSimuladoResponse = {
  questionId: string;
  isCorrect: boolean;
  correctOptionId: string;
  explanation: string;
};

export const validateSimuladoAnswer = async (
  payload: ValidateSimuladoRequest
): Promise<ValidateSimuladoResponse> => {
  return fetch<ValidateSimuladoResponse>({
    url: "/question-simulados/validate",
    method: "POST",
    data: payload,
  });
};

type SubmitTaskAnswerRequest = {
  userTaskId: string;
  questionId: string;
  selectedOptionId: string;
};

type SubmitTaskAnswerResponse = {
  questionId: string;
  isCorrect: boolean;
  correctOptionId: string;
  explanation?: string;
};

export const submitTaskAnswer = async (
  payload: SubmitTaskAnswerRequest
): Promise<SubmitTaskAnswerResponse> => {

  const { userTaskId, ...data } = payload;

  return fetch<SubmitTaskAnswerResponse>({
    url: `/tasks/submit-answer/${userTaskId}`,
    method: "PATCH",
    data,
  });
};

export const questionBankSimuladoQuestions = async (
  payload: GenerateSimuladoRequest
): Promise<{ id: string; questions: Question[] }> => {

  const res = await fetch<SimuladoResponse>({
    url: "/question-simulados/question-bank",
    method: "GET",
    params: {
      subject: payload.subject.join(","),
      difficulty: payload.difficulty,
      skip: 0,
      take: payload.numberOfQuestions, // ✅ fixed: was hardcoded 50, now uses selected value
    }
  });

  return {
    id: res.id,
    questions: res.questions.map((q) => ({
      id: q.id,
      taskId: q.id,
      questionText: q.question,
      correctOptionId: q.correctOptionId,
      stepByStepExplanation: q.explanation,
      options: q.options,
      source: "",
      reinforcement: false,
      createdAt: "",
    })),
  };
};