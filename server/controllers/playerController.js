import {
  getPlayerById as getPlayerByIdFromDatabase,
  updatePlayerProfile as updatePlayerProfileInDatabase,
  deletePlayerAccount as deletePlayerAccountFromDatabase,
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


const updatePlayerProfile = async (req, res) => {
  try {
    const playerId = Number(req.params.playerId);

    if (!Number.isInteger(playerId) || playerId <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "The player ID must be a valid positive integer.",
      });
    }

    const {
      profileImage,
      biography,
      availability,
    } = req.body;

    const errors = [];

    if (
      typeof biography !== "string" ||
      biography.trim() === ""
    ) {
      errors.push("Player biography is required.");
    }

    const allowedAvailabilityValues = [
      "Available",
      "Limited Availability",
      "Unavailable",
    ];

    if (
      !allowedAvailabilityValues.includes(
        availability,
      )
    ) {
      errors.push(
        "Choose a valid availability option.",
      );
    }

    if (
      profileImage !== undefined &&
      profileImage !== null &&
      typeof profileImage !== "string"
    ) {
      errors.push(
        "Profile image must be a valid URL string.",
      );
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Some profile information is invalid.",
        errors,
      });
    }

    const existingPlayer =
      await getPlayerByIdFromDatabase(playerId);

    if (!existingPlayer) {
      return res.status(404).json({
        success: false,
        message: "Player profile not found.",
      });
    }

    const updatedPlayer =
      await updatePlayerProfileInDatabase({
        playerId,
        profileImage:
          typeof profileImage === "string"
            ? profileImage.trim()
            : "",
        biography: biography.trim(),
        availability,
      });

    return res.status(200).json({
      success: true,
      message:
        "Player profile updated successfully.",
      data: {
        playerId: updatedPlayer.player_id,
        profileImage:
          updatedPlayer.profile_image,
        biography: updatedPlayer.biography,
        availability:
          updatedPlayer.availability,
        updatedAt: updatedPlayer.updated_at,
      },
    });
  } catch (error) {
    console.error(
      "Unable to update player profile:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while updating the player profile.",
    });
  }
};

/**
 * DELETE /api/players/:playerId
 *
 * Deletes the player profile, related recruitment
 * records, statistics, and associated user account.
 */
const deletePlayerProfile = async (req, res) => {
  try {
    const playerId = Number(req.params.playerId);

    if (!Number.isInteger(playerId) || playerId <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "The player ID must be a valid positive integer.",
      });
    }

    const deletedAccount =
      await deletePlayerAccountFromDatabase(playerId);

    if (!deletedAccount) {
      return res.status(404).json({
        success: false,
        message: "Player profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Player profile and account deleted successfully.",
      data: deletedAccount,
    });
  } catch (error) {
    console.error(
      "Unable to delete player profile:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while deleting the player profile.",
    });
  }
};

export {
  getPlayerById,
  updatePlayerProfile,
  deletePlayerProfile,
};