import {
  getPlayerById as getPlayerByIdFromDatabase,
} from "../models/playerModel.js";

/**
 * GET /api/players/:playerId
 *
 * Retrieves one complete player profile.
 */
const getPlayerById = async (req, res) => {
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

    const player =
      await getPlayerByIdFromDatabase(
        playerId,
      );

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        playerId: player.player_id,
        userId: player.user_id,

        firstName: player.first_name,
        lastName: player.last_name,
        email: player.email,

        profileImage: player.profile_image,
        biography: player.biography,

        primaryPosition:
          player.primary_position,
        secondaryPosition:
          player.secondary_position,
        preferredFoot:
          player.preferred_foot,
        classYear: player.class_year,
        skillLevel: player.skill_level,
        availability: player.availability,

        isVerified: player.is_verified,
        verifiedAt: player.verified_at,

        team: player.team_id
          ? {
              teamId: player.team_id,
              teamName: player.team_name,
              division: player.division,
            }
          : null,

        statistics: {
          goals: player.goals ?? 0,
          assists: player.assists ?? 0,
          cleanSheets:
            player.clean_sheets ?? 0,
          gamesPlayed:
            player.games_played ?? 0,
        },

        createdAt: player.created_at,
        updatedAt: player.updated_at,
      },
    });
  } catch (error) {
    console.error(
      "Unable to retrieve player profile:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while retrieving the player profile.",
    });
  }
};

export {
  getPlayerById,
};