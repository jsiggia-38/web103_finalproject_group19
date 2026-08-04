import { apiRequest } from "./api.js";

export const getPlayerById = async (playerId) => {
  try {
    return await apiRequest(`/api/players/${playerId}`);
  } catch (error) {
    throw error;
  }
};