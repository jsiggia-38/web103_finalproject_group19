import { apiRequest } from "./api.js";

export const getScoutList = async () => {
  return apiRequest("/api/scout-list");
};

export const addPlayerToScoutList = async ({
  playerId,
  status = "Interested",
  scoutingNotes = "",
}) => {
  return apiRequest("/api/scout-list", {
    method: "POST",
    body: JSON.stringify({
      playerId,
      status,
      scoutingNotes,
    }),
  });
};

export const updateScoutListEntry = async (
  scoutId,
  {
    status,
    scoutingNotes,
  },
) => {
  return apiRequest(
    `/api/scout-list/${scoutId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status,
        scoutingNotes,
      }),
    },
  );
};

export const removeScoutListEntry = async (
  scoutId,
) => {
  return apiRequest(
    `/api/scout-list/${scoutId}`,
    {
      method: "DELETE",
    },
  );
};