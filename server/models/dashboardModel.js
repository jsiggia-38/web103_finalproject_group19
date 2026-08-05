import { pool } from "../config/database.js";

const getOrganizerDashboardData = async (
  organizerId,
) => {
  const summaryResult = await pool.query(
    `
      SELECT
        (
          SELECT COUNT(*)
          FROM teams
          WHERE organizer_id = $1
        )::INTEGER AS total_teams,

        (
          SELECT COUNT(*)
          FROM players
          WHERE is_verified = TRUE
        )::INTEGER AS verified_players,

        (
          SELECT COUNT(*)
          FROM users
          WHERE role = 'Coach'
        )::INTEGER AS coaches,

        (
          SELECT COUNT(*)
          FROM tryout_invitations
          WHERE invitation_status = 'Pending'
        )::INTEGER AS open_invitations;
    `,
    [organizerId],
  );

  const recentTeamsResult = await pool.query(
    `
      SELECT
        t.team_id,
        t.team_name,
        t.division,
        t.description,
        t.logo_url,
        t.practice_location,
        t.practice_schedule,
        t.maximum_roster_size,
        t.created_at,

        u.user_id AS captain_id,
        u.first_name AS captain_first_name,
        u.last_name AS captain_last_name,

        (
          SELECT COUNT(*)
          FROM players AS p
          WHERE p.team_id = t.team_id
        )::INTEGER AS roster_count

      FROM teams AS t

      LEFT JOIN users AS u
        ON u.user_id = t.captain_id

      WHERE t.organizer_id = $1

      ORDER BY t.created_at DESC
      LIMIT 5;
    `,
    [organizerId],
  );

  const recentPlayersResult = await pool.query(
    `
      SELECT
        p.player_id,
        p.primary_position,
        p.class_year,
        p.skill_level,
        p.is_verified,
        p.created_at,

        u.first_name,
        u.last_name

      FROM players AS p

      INNER JOIN users AS u
        ON u.user_id = p.user_id

      ORDER BY p.created_at DESC
      LIMIT 5;
    `,
  );

  return {
    summary: summaryResult.rows[0],
    recentTeams: recentTeamsResult.rows,
    recentPlayers: recentPlayersResult.rows,
  };
};

const getCoachDashboardData = async (
  coachId,
) => {
  const teamResult = await pool.query(
    `
      SELECT
        t.team_id,
        t.team_name,
        t.division,
        t.description,
        t.logo_url,
        t.practice_location,
        t.practice_schedule,
        t.maximum_roster_size,
        t.created_at,

        (
          SELECT COUNT(*)
          FROM players AS p
          WHERE p.team_id = t.team_id
        )::INTEGER AS roster_count

      FROM teams AS t

      WHERE t.captain_id = $1

      ORDER BY t.created_at ASC
      LIMIT 1;
    `,
    [coachId],
  );

  const currentTeam =
    teamResult.rows[0] || null;

  const summaryResult = await pool.query(
    `
      SELECT
        (
          SELECT COUNT(*)
          FROM scout_list
          WHERE coach_id = $1
        )::INTEGER AS scouted_players,

        (
          SELECT COUNT(*)
          FROM tryout_invitations
          WHERE coach_id = $1
            AND invitation_status = 'Pending'
        )::INTEGER AS pending_invitations,

        (
          SELECT COUNT(*)
          FROM players
          WHERE team_id = $2
        )::INTEGER AS team_players,

        (
          SELECT COUNT(*)
          FROM players
          WHERE is_verified = TRUE
            AND availability = 'Available'
        )::INTEGER AS available_players;
    `,
    [
      coachId,
      currentTeam?.team_id || null,
    ],
  );

  const recentlyScoutedResult =
    await pool.query(
      `
        SELECT
          s.scout_id,
          s.status,
          s.scouting_notes,
          s.date_added,

          p.player_id,
          p.primary_position,
          p.class_year,
          p.skill_level,
          p.profile_image,

          u.first_name,
          u.last_name

        FROM scout_list AS s

        INNER JOIN players AS p
          ON p.player_id = s.player_id

        INNER JOIN users AS u
          ON u.user_id = p.user_id

        WHERE s.coach_id = $1

        ORDER BY s.date_added DESC
        LIMIT 5;
      `,
      [coachId],
    );

  const recentInvitationsResult =
    await pool.query(
      `
        SELECT
          i.invitation_id,
          i.tryout_date,
          i.tryout_time,
          i.location,
          i.message,
          i.invitation_status,
          i.created_at,

          p.player_id,

          u.first_name,
          u.last_name,

          t.team_id,
          t.team_name

        FROM tryout_invitations AS i

        INNER JOIN players AS p
          ON p.player_id = i.player_id

        INNER JOIN users AS u
          ON u.user_id = p.user_id

        LEFT JOIN teams AS t
          ON t.team_id = i.team_id

        WHERE i.coach_id = $1

        ORDER BY i.created_at DESC
        LIMIT 5;
      `,
      [coachId],
    );

  return {
    summary: summaryResult.rows[0],
    currentTeam,
    recentlyScouted:
      recentlyScoutedResult.rows,
    recentInvitations:
      recentInvitationsResult.rows,
  };
};

export {
  getCoachDashboardData,
  getOrganizerDashboardData,
};