import {
  getCoachDashboardData,
  getOrganizerDashboardData,
} from "../models/dashboardModel.js";

const getCoachDashboard = async (
  req,
  res,
) => {
  try {
    const dashboard =
      await getCoachDashboardData(
        req.user.userId,
      );

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          scoutedPlayers:
            dashboard.summary
              .scouted_players,
          pendingInvitations:
            dashboard.summary
              .pending_invitations,
          teamPlayers:
            dashboard.summary.team_players,
          availablePlayers:
            dashboard.summary
              .available_players,
        },

        currentTeam:
          dashboard.currentTeam
            ? {
                teamId:
                  dashboard.currentTeam
                    .team_id,
                teamName:
                  dashboard.currentTeam
                    .team_name,
                division:
                  dashboard.currentTeam
                    .division,
                description:
                  dashboard.currentTeam
                    .description,
                logoUrl:
                  dashboard.currentTeam
                    .logo_url,
                practiceLocation:
                  dashboard.currentTeam
                    .practice_location,
                practiceSchedule:
                  dashboard.currentTeam
                    .practice_schedule,
                maximumRosterSize:
                  dashboard.currentTeam
                    .maximum_roster_size,
                rosterCount:
                  dashboard.currentTeam
                    .roster_count,
              }
            : null,

        recentlyScouted:
          dashboard.recentlyScouted.map(
            (entry) => ({
              scoutId: entry.scout_id,
              playerId: entry.player_id,
              firstName: entry.first_name,
              lastName: entry.last_name,
              profileImage:
                entry.profile_image,
              primaryPosition:
                entry.primary_position,
              classYear:
                entry.class_year,
              skillLevel:
                entry.skill_level,
              status: entry.status,
              scoutingNotes:
                entry.scouting_notes,
              dateAdded:
                entry.date_added,
            }),
          ),

        recentInvitations:
          dashboard.recentInvitations.map(
            (invitation) => ({
              invitationId:
                invitation.invitation_id,
              playerId:
                invitation.player_id,
              firstName:
                invitation.first_name,
              lastName:
                invitation.last_name,
              team: invitation.team_id
                ? {
                    teamId:
                      invitation.team_id,
                    teamName:
                      invitation.team_name,
                  }
                : null,
              tryoutDate:
                invitation.tryout_date,
              tryoutTime:
                invitation.tryout_time,
              location:
                invitation.location,
              message:
                invitation.message,
              status:
                invitation
                  .invitation_status,
              createdAt:
                invitation.created_at,
            }),
          ),
      },
    });
  } catch (error) {
    console.error(
      "Unable to retrieve Coach dashboard:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while retrieving the Coach dashboard.",
    });
  }
};

const getOrganizerDashboard = async (
  req,
  res,
) => {
  try {
    const dashboard =
      await getOrganizerDashboardData(
        req.user.userId,
      );

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalTeams:
            dashboard.summary.total_teams,
          verifiedPlayers:
            dashboard.summary
              .verified_players,
          coaches:
            dashboard.summary.coaches,
          openInvitations:
            dashboard.summary
              .open_invitations,
        },

        recentTeams:
          dashboard.recentTeams.map(
            (team) => ({
              teamId: team.team_id,
              teamName: team.team_name,
              division: team.division,
              description:
                team.description,
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
                    userId:
                      team.captain_id,
                    firstName:
                      team
                        .captain_first_name,
                    lastName:
                      team
                        .captain_last_name,
                  }
                : null,
              createdAt:
                team.created_at,
            }),
          ),

        recentPlayers:
          dashboard.recentPlayers.map(
            (player) => ({
              playerId:
                player.player_id,
              firstName:
                player.first_name,
              lastName:
                player.last_name,
              primaryPosition:
                player.primary_position,
              classYear:
                player.class_year,
              skillLevel:
                player.skill_level,
              isVerified:
                player.is_verified,
              createdAt:
                player.created_at,
            }),
          ),
      },
    });
  } catch (error) {
    console.error(
      "Unable to retrieve Organizer dashboard:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while retrieving the Organizer dashboard.",
    });
  }
};

export {
  getCoachDashboard,
  getOrganizerDashboard,
};