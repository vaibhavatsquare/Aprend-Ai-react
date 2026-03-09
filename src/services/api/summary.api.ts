import { fetch } from "@/src/libs/helpers";

export type Summary = {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
};

export type SummaryListResponse = {
  total: number;
  list: Summary[];
  hasMany: boolean;
  count: number;
};

// GET SUMMARY
export const getSummaries = async (params?: {
  skip?: number;
  take?: number;
  orderBy?: string;
  search?: string;
}): Promise<SummaryListResponse> => {
  return fetch<SummaryListResponse>({
    url: "/ai-tutor/summary",
    method: "GET",
    params,
  });
};

// REMOVE SUMMARY
export const removeSummary = async (id: string) => {
  return fetch({
    url: `/ai-tutor/removeSummary/${id}`,
    method: "POST",
  });
};