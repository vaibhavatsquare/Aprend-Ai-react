import { DashboardResponse } from "@/src/libs/types/dashboard.types";
import { fetch } from "@/src/libs/helpers";

export const getDashboard = async (): Promise<DashboardResponse> => {
  return await fetch({ 
    url: "/tasks/dashboard",
    method: "GET",
  });
};