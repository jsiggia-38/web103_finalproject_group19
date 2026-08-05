import { apiRequest } from "./api.js";

export const getAllTeams = async () => {
  return apiRequest("/api/teams");
};

export const getAvailableCoaches = async () => {
  return apiRequest(
    "/api/teams/available-coaches",
  );
};


export const createTeam = async ({
  captainId,
  teamName,
  division,
  description,
  logoUrl,
  practiceLocation,
  practiceSchedule,
  maximumRosterSize,
}) => {
  return apiRequest("/api/teams", {
    method: "POST",
    body: JSON.stringify({
      captainId,
      teamName,
      division,
      description,
      logoUrl,
      practiceLocation,
      practiceSchedule,
      maximumRosterSize,
    }),
  });
};

export const getTeamById = async (
  teamId,
) => {
  return apiRequest(
    `/api/teams/${teamId}`,
  );
};