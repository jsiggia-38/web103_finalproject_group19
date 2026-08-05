import {
  createScoutListEntry,
  deleteScoutListEntry,
  findCoachScoutEntryById,
  findCoachTeam,
  findPlayerForScouting,
  findScoutListEntry,
  getCoachScoutList,
  updateScoutListEntry,
} from "../models/scoutListModel.js";

const allowedStatuses = [
  "Interested",
  "Watching",
  "Contacted",
  "Tryout Invited",
  "Added to Team",
];

/**
 * POST /api/scout-list
 *
 * Adds a player to the authenticated coach's
 * team scout list.
 */
const addPlayerToScoutList = async (
  req,
  res,
) => {
  try {
    const coachId = req.user.userId;

    const {
      playerId,
      status = "Interested",
      scoutingNotes = "",
    } = req.body;

    const normalizedPlayerId =
      Number(playerId);

    if (
      !Number.isInteger(
        normalizedPlayerId,
      ) ||
      normalizedPlayerId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A valid player ID is required.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Choose a valid scouting status.",
      });
    }

    if (
      typeof scoutingNotes !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Scouting notes must be text.",
      });
    }

    const player =
      await findPlayerForScouting(
        normalizedPlayerId,
      );

    if (!player) {
      return res.status(404).json({
        success: false,
        message:
          "The selected player profile was not found.",
      });
    }

    const team =
      await findCoachTeam(coachId);

    if (!team) {
      return res.status(409).json({
        success: false,
        message:
          "You must be assigned as the captain of a team before adding players to a scout list.",
      });
    }

    const existingEntry =
      await findScoutListEntry({
        coachId,
        playerId: normalizedPlayerId,
        teamId: team.team_id,
      });

    if (existingEntry) {
      return res.status(409).json({
        success: false,
        message:
          "This player is already on your scout list.",
        data: {
          scoutId:
            existingEntry.scout_id,
          status:
            existingEntry.status,
        },
      });
    }

    const createdEntry =
      await createScoutListEntry({
        coachId,
        playerId: normalizedPlayerId,
        teamId: team.team_id,
        status,
        scoutingNotes:
          scoutingNotes.trim(),
      });

    return res.status(201).json({
      success: true,
      message:
        `${player.first_name} ${player.last_name} was added to your scout list.`,
      data: {
        scoutId:
          createdEntry.scout_id,
        coachId:
          createdEntry.coach_id,
        playerId:
          createdEntry.player_id,
        team: {
          teamId: team.team_id,
          teamName: team.team_name,
          division: team.division,
        },
        status:
          createdEntry.status,
        scoutingNotes:
          createdEntry.scouting_notes,
        dateAdded:
          createdEntry.date_added,
      },
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message:
          "This player is already on your scout list.",
      });
    }

    console.error(
      "Unable to add player to scout list:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while updating the scout list.",
    });
  }
};

/**
 * GET /api/scout-list
 *
 * Retrieves the authenticated Coach's
 * saved players.
 */
const getScoutList = async (req, res) => {
  try {
    const coachId = req.user.userId;

    const entries =
      await getCoachScoutList(coachId);

    return res.status(200).json({
      success: true,
      count: entries.length,
      data: entries.map((entry) => ({
        scoutId: entry.scout_id,
        status: entry.status,
        scoutingNotes:
          entry.scouting_notes || "",
        dateAdded: entry.date_added,
        updatedAt: entry.updated_at,

        player: {
          playerId: entry.player_id,
          firstName: entry.first_name,
          lastName: entry.last_name,
          profileImage:
            entry.profile_image,

          primaryPosition:
            entry.primary_position,
          secondaryPosition:
            entry.secondary_position,
          preferredFoot:
            entry.preferred_foot,
          classYear:
            entry.class_year,
          skillLevel:
            entry.skill_level,
          availability:
            entry.availability,
          isVerified:
            entry.is_verified,

          statistics: {
            goals: Number(entry.goals),
            assists: Number(entry.assists),
            cleanSheets: Number(
              entry.clean_sheets,
            ),
            gamesPlayed: Number(
              entry.games_played,
            ),
          },
        },

        team: {
          teamId: entry.team_id,
          teamName: entry.team_name,
        },
      })),
    });
  } catch (error) {
    console.error(
      "Unable to retrieve scout list:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while retrieving the scout list.",
    });
  }
};

/**
 * PATCH /api/scout-list/:scoutId
 *
 * Updates scouting status and notes.
 */
const updateScoutEntry = async (
  req,
  res,
) => {
  try {
    const coachId = req.user.userId;

    const scoutId = Number(
      req.params.scoutId,
    );

    if (
      !Number.isInteger(scoutId) ||
      scoutId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The scout-list ID must be a valid positive integer.",
      });
    }

    const {
      status,
      scoutingNotes = "",
    } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Choose a valid scouting status.",
      });
    }

    if (
      typeof scoutingNotes !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Scouting notes must be text.",
      });
    }

    const existingEntry =
      await findCoachScoutEntryById({
        scoutId,
        coachId,
      });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message:
          "The scout-list record was not found.",
      });
    }

    const updatedEntry =
      await updateScoutListEntry({
        scoutId,
        coachId,
        status,
        scoutingNotes:
          scoutingNotes.trim(),
      });

    return res.status(200).json({
      success: true,
      message:
        "Scouting information updated successfully.",
      data: {
        scoutId:
          updatedEntry.scout_id,
        playerId:
          updatedEntry.player_id,
        status:
          updatedEntry.status,
        scoutingNotes:
          updatedEntry.scouting_notes || "",
        updatedAt:
          updatedEntry.updated_at,
      },
    });
  } catch (error) {
    console.error(
      "Unable to update scout-list entry:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while updating the scout-list entry.",
    });
  }
};

/**
 * DELETE /api/scout-list/:scoutId
 */
const removeScoutEntry = async (
  req,
  res,
) => {
  try {
    const coachId = req.user.userId;

    const scoutId = Number(
      req.params.scoutId,
    );

    if (
      !Number.isInteger(scoutId) ||
      scoutId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The scout-list ID must be a valid positive integer.",
      });
    }

    const deletedEntry =
      await deleteScoutListEntry({
        scoutId,
        coachId,
      });

    if (!deletedEntry) {
      return res.status(404).json({
        success: false,
        message:
          "The scout-list record was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Player removed from your scout list.",
      data: {
        scoutId:
          deletedEntry.scout_id,
        playerId:
          deletedEntry.player_id,
      },
    });
  } catch (error) {
    console.error(
      "Unable to remove scout-list entry:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while removing the player from the scout list.",
    });
  }
};

export {
  addPlayerToScoutList,
  getScoutList,
  updateScoutEntry,
  removeScoutEntry,
};