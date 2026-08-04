import { apiRequest } from "./api.js";

export const getPlayerById = async (playerId) => {
  return apiRequest(`/api/players/${playerId}`);
};

export const updatePlayerProfile = async (
  playerId,
  {
    profileImage,
    biography,
    availability,
  },
) => {
  return apiRequest(`/api/players/${playerId}`, {
    method: "PATCH",
    body: JSON.stringify({
      profileImage,
      biography,
      availability,
    }),
  });
};

export const deletePlayerProfile = async (playerId) => {
  return apiRequest(`/api/players/${playerId}`, {
    method: "DELETE",
  });
};