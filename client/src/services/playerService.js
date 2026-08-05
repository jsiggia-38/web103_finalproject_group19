import { apiRequest } from "./api.js";

export const getPlayers = async ({
  search = "",
  position = "",
  classYear = "",
  skillLevel = "",
  availability = "",
  sortBy = "newest",
  sortOrder = "desc",
} = {}) => {
  const queryParameters = new URLSearchParams();

  if (search) {
    queryParameters.set("search", search);
  }

  if (position) {
    queryParameters.set("position", position);
  }

  if (classYear) {
    queryParameters.set("classYear", classYear);
  }

  if (skillLevel) {
    queryParameters.set("skillLevel", skillLevel);
  }

  if (availability) {
    queryParameters.set(
      "availability",
      availability,
    );
  }

  queryParameters.set("sortBy", sortBy);
  queryParameters.set(
    "sortOrder",
    sortOrder,
  );

  return apiRequest(
    `/api/players?${queryParameters.toString()}`,
  );
};

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

export const deletePlayerProfile = async (
  playerId,
) => {
  return apiRequest(`/api/players/${playerId}`, {
    method: "DELETE",
  });
};

export const getPlayerRecruitmentActivity =
  async (playerId) => {
    return apiRequest(
      `/api/players/${playerId}/recruitment`,
    );
  };