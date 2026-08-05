import {
  createTeam as createTeamInDatabase,
  findCoachById,
  findTeamByCaptainId,
  getAllTeams as getAllTeamsFromDatabase,
  getAvailableCoaches as getAvailableCoachesFromDatabase,
  getTeamById as getTeamByIdFromDatabase,
} from "../models/teamModel.js";

const getAvailableCoaches = async (
  req,
  res,
) => {
  try {
    const coaches =
      await getAvailableCoachesFromDatabase();

    return res.status(200).json({
      success: true,
      count: coaches.length,
      data: coaches.map((coach) => ({
        userId: coach.user_id,
        firstName: coach.first_name,
        lastName: coach.last_name,
        email: coach.email,
      })),
    });
  } catch (error) {
    console.error(
      "Unable to retrieve coaches:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while retrieving coaches.",
    });
  }
};

const createTeam = async (req, res) => {
  try {
    const organizerId = req.user.userId;

    const {
      captainId,
      teamName,
      division,
      description,
      logoUrl,
      practiceLocation,
      practiceSchedule,
      maximumRosterSize,
    } = req.body;

    const errors = [];

    const normalizedCaptainId =
      Number(captainId);

    const normalizedMaximumRosterSize =
      Number(maximumRosterSize);

    if (
      !Number.isInteger(
        normalizedCaptainId,
      ) ||
      normalizedCaptainId <= 0
    ) {
      errors.push(
        "Choose a valid team captain.",
      );
    }

    if (
      typeof teamName !== "string" ||
      teamName.trim() === ""
    ) {
      errors.push("Team name is required.");
    }

    if (
      !Number.isInteger(
        normalizedMaximumRosterSize,
      ) ||
      normalizedMaximumRosterSize <= 0
    ) {
      errors.push(
        "Maximum roster size must be a positive integer.",
      );
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Some team information is invalid.",
        errors,
      });
    }

    const coach = await findCoachById(
      normalizedCaptainId,
    );

    if (!coach) {
      return res.status(404).json({
        success: false,
        message:
          "The selected coach account was not found.",
      });
    }

    const existingTeam =
      await findTeamByCaptainId(
        normalizedCaptainId,
      );

    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message:
          "The selected coach is already assigned as captain of another team.",
      });
    }

    const createdTeam =
      await createTeamInDatabase({
        organizerId,
        captainId:
          normalizedCaptainId,
        teamName: teamName.trim(),
        division:
          typeof division === "string"
            ? division.trim()
            : "",
        description:
          typeof description === "string"
            ? description.trim()
            : "",
        logoUrl:
          typeof logoUrl === "string"
            ? logoUrl.trim()
            : "",
        practiceLocation:
          typeof practiceLocation ===
          "string"
            ? practiceLocation.trim()
            : "",
        practiceSchedule:
          typeof practiceSchedule ===
          "string"
            ? practiceSchedule.trim()
            : "",
        maximumRosterSize:
          normalizedMaximumRosterSize,
      });

    return res.status(201).json({
      success: true,
      message:
        "Team created successfully.",
      data: {
        teamId: createdTeam.team_id,
        organizerId:
          createdTeam.organizer_id,
        captain: {
          userId: coach.user_id,
          firstName: coach.first_name,
          lastName: coach.last_name,
          email: coach.email,
        },
        teamName:
          createdTeam.team_name,
        division:
          createdTeam.division,
        description:
          createdTeam.description,
        logoUrl:
          createdTeam.logo_url,
        practiceLocation:
          createdTeam.practice_location,
        practiceSchedule:
          createdTeam.practice_schedule,
        maximumRosterSize:
          createdTeam.maximum_roster_size,
        createdAt:
          createdTeam.created_at,
      },
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message:
          "A conflicting team record already exists.",
      });
    }

    console.error(
      "Unable to create team:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while creating the team.",
    });
  }
};

const getAllTeams = async (req, res) => {
  try {
    const teams =
      await getAllTeamsFromDatabase();

    return res.status(200).json({
      success: true,
      count: teams.length,
      data: teams.map((team) => ({
        teamId: team.team_id,
        teamName: team.team_name,
        division: team.division,
        description: team.description,
        logoUrl: team.logo_url,
        practiceLocation:
          team.practice_location,
        practiceSchedule:
          team.practice_schedule,
        maximumRosterSize:
          team.maximum_roster_size,
        rosterCount: team.roster_count,

        captain: team.captain_id
          ? {
              userId: team.captain_id,
              firstName:
                team.captain_first_name,
              lastName:
                team.captain_last_name,
              email: team.captain_email,
            }
          : null,

        organizer: team.organizer_id
          ? {
              userId: team.organizer_id,
              firstName:
                team.organizer_first_name,
              lastName:
                team.organizer_last_name,
            }
          : null,

        createdAt: team.created_at,
      })),
    });
  } catch (error) {
    console.error(
      "Unable to retrieve teams:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while retrieving teams.",
    });
  }
};

const getTeamById = async (req, res) => {
  try {
    const teamId = Number(
      req.params.teamId,
    );

    if (
      !Number.isInteger(teamId) ||
      teamId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The team ID must be a valid positive integer.",
      });
    }

    const result =
      await getTeamByIdFromDatabase(
        teamId,
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Team not found.",
      });
    }

    const { team, players } = result;

    return res.status(200).json({
      success: true,

      data: {
        teamId: team.team_id,
        teamName: team.team_name,
        division: team.division,
        description: team.description,
        logoUrl: team.logo_url,

        practiceLocation:
          team.practice_location,

        practiceSchedule:
          team.practice_schedule,

        maximumRosterSize:
          team.maximum_roster_size,

        rosterCount:
          team.roster_count,

        captain: team.captain_id
          ? {
              userId: team.captain_id,

              firstName:
                team.captain_first_name,

              lastName:
                team.captain_last_name,

              email:
                team.captain_email,
            }
          : null,

        organizer: team.organizer_id
          ? {
              userId:
                team.organizer_id,

              firstName:
                team.organizer_first_name,

              lastName:
                team.organizer_last_name,
            }
          : null,

        players: players.map(
          (player) => ({
            playerId:
              player.player_id,

            firstName:
              player.first_name,

            lastName:
              player.last_name,

            profileImage:
              player.profile_image,

            primaryPosition:
              player.primary_position,

            secondaryPosition:
              player.secondary_position,

            preferredFoot:
              player.preferred_foot,

            classYear:
              player.class_year,

            skillLevel:
              player.skill_level,

            availability:
              player.availability,

            isVerified:
              player.is_verified,

            statistics: {
              goals: player.goals,
              assists: player.assists,

              cleanSheets:
                player.clean_sheets,

              gamesPlayed:
                player.games_played,
            },
          }),
        ),

        createdAt: team.created_at,
      },
    });
  } catch (error) {
    console.error(
      "Unable to retrieve team:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while retrieving the team.",
    });
  }
};

export {
  createTeam,
  getAvailableCoaches,
  getAllTeams,
  getTeamById,
};