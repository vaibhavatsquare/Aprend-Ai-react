import { fetch } from "@/src/libs/helpers";
import { Question } from "@/src/libs/types/dashboard.types";

type GenerateSimuladoRequest = {
  subjectIds: string[];
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
    data: {
      subjectIds: payload.subjectIds,
      numberOfQuestions: payload.numberOfQuestions,
      difficulty: payload.difficulty,
    },
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
      subjectIds: payload.subjectIds,
      difficulty: payload.difficulty,
      skip: 0,
      take: payload.numberOfQuestions,
    },
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams();
      if (Array.isArray(params.subjectIds)) {
        params.subjectIds.forEach((s: string) => searchParams.append('subjectIds', s));
      } else {
        searchParams.append('subjectIds', params.subjectIds);
      }
      searchParams.append('difficulty', params.difficulty);
      searchParams.append('skip', String(params.skip));
      searchParams.append('take', String(params.take));
      return searchParams.toString();
    },
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