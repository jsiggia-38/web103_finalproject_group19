import { pool } from "../config/database.js";

/**
 * Confirms that:
 * 1. the authenticated user has the Player role;
 * 2. the requested player profile belongs to that user.
 */
const authorizePlayerOwner = async (
  req,
  res,
  next,
) => {
  try {
    const playerId = Number(
      req.params.playerId,
    );

    if (
      !Number.isInteger(playerId) ||
      playerId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The player ID must be a valid positive integer.",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "You must log in before managing this profile.",
      });
    }

    if (req.user.role !== "Player") {
      return res.status(403).json({
        success: false,
        message:
          "Only a student player can manage a player profile.",
      });
    }

    const result = await pool.query(
      `
        SELECT
          player_id,
          user_id
        FROM players
        WHERE player_id = $1
          AND user_id = $2;
      `,
      [
        playerId,
        req.user.userId,
      ],
    );

    if (!result.rows[0]) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to manage this player profile.",
      });
    }

    req.player = result.rows[0];

    next();
  } catch (error) {
    console.error(
      "Unable to verify player ownership:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while checking profile ownership.",
    });
  }
};

export {
  authorizePlayerOwner,
};