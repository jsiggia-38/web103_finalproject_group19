import { apiRequest } from "./api.js";

export const getCoachDashboard = async () => {
  return apiRequest(
    "/api/dashboard/coach",
  );
};

export const getOrganizerDashboard =
  async () => {
    return apiRequest(
      "/api/dashboard/organizer",
    );
  };