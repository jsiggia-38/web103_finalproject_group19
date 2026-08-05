import { pool } from "../config/database.js";

/**
 * Finds a team captained by the authenticated coach.
 */
const findCoachTeam = async (coachId) => {
  const query = `
    SELECT
      team_id,
      team_name,
      division
    FROM teams
    WHERE captain_id = $1
    ORDER BY created_at ASC
    LIMIT 1;
  `;

  const result = await pool.query(query, [
    coachId,
  ]);

  return result.rows[0] || null;
};

/**
 * Confirms that a player profile exists.
 */
const findPlayerForScouting = async (playerId) => {
  const query = `
    SELECT
      p.player_id,
      u.first_name,
      u.last_name
    FROM players AS p
    INNER JOIN users AS u
      ON u.user_id = p.user_id
    WHERE p.player_id = $1;
  `;

  const result = await pool.query(query, [
    playerId,
  ]);

  return result.rows[0] || null;
};

/**
 * Finds an existing scout-list record.
 */
const findScoutListEntry = async ({
  coachId,
  playerId,
  teamId,
}) => {
  const query = `
    SELECT
      scout_id,
      coach_id,
      player_id,
      team_id,
      status,
      scouting_notes,
      date_added,
      updated_at
    FROM scout_list
    WHERE coach_id = $1
      AND player_id = $2
      AND team_id = $3;
  `;

  const result = await pool.query(query, [
    coachId,
    playerId,
    teamId,
  ]);

  return result.rows[0] || null;
};

/**
 * Adds a player to a coach's scout list.
 */
const createScoutListEntry = async ({
  coachId,
  playerId,
  teamId,
  status,
  scoutingNotes,
}) => {
  const query = `
    INSERT INTO scout_list (
      coach_id,
      player_id,
      team_id,
      status,
      scouting_notes
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      scout_id,
      coach_id,
      player_id,
      team_id,
      status,
      scouting_notes,
      date_added,
      updated_at;
  `;


  const result = await pool.query(query, [
    coachId,
    playerId,
    teamId,
    status,
    scoutingNotes || null,
  ]);

  return result.rows[0];
};

const getCoachScoutList = async (coachId) => {
  const query = `
    SELECT
      s.scout_id,
      s.status,
      s.scouting_notes,
      s.date_added,
      s.updated_at,

      p.player_id,
      p.profile_image,
      p.primary_position,
      p.secondary_position,
      p.preferred_foot,
      p.class_year,
      p.skill_level,
      p.availability,
      p.is_verified,

      u.first_name,
      u.last_name,

      t.team_id,
      t.team_name,

      COALESCE(ps.goals, 0) AS goals,
      COALESCE(ps.assists, 0) AS assists,
      COALESCE(
        ps.clean_sheets,
        0
      ) AS clean_sheets,
      COALESCE(
        ps.games_played,
        0
      ) AS games_played

    FROM scout_list AS s

    INNER JOIN players AS p
      ON p.player_id = s.player_id

    INNER JOIN users AS u
      ON u.user_id = p.user_id

    INNER JOIN teams AS t
      ON t.team_id = s.team_id

    LEFT JOIN player_statistics AS ps
      ON ps.player_id = p.player_id

    WHERE s.coach_id = $1

    ORDER BY s.date_added DESC;
  `;

  const result = await pool.query(query, [
    coachId,
  ]);

  return result.rows;
};

const findCoachScoutEntryById = async ({
  scoutId,
  coachId,
}) => {
  const query = `
    SELECT
      scout_id,
      coach_id,
      player_id,
      team_id,
      status,
      scouting_notes,
      date_added,
      updated_at
    FROM scout_list
    WHERE scout_id = $1
      AND coach_id = $2;
  `;

  const result = await pool.query(query, [
    scoutId,
    coachId,
  ]);

  return result.rows[0] || null;
};

const updateScoutListEntry = async ({
  scoutId,
  coachId,
  status,
  scoutingNotes,
}) => {
  const query = `
    UPDATE scout_list
    SET
      status = $1,
      scouting_notes = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE scout_id = $3
      AND coach_id = $4
    RETURNING
      scout_id,
      coach_id,
      player_id,
      team_id,
      status,
      scouting_notes,
      date_added,
      updated_at;
  `;

  const result = await pool.query(query, [
    status,
    scoutingNotes || null,
    scoutId,
    coachId,
  ]);

  return result.rows[0] || null;
};

const deleteScoutListEntry = async ({
  scoutId,
  coachId,
}) => {
  const query = `
    DELETE FROM scout_list
    WHERE scout_id = $1
      AND coach_id = $2
    RETURNING
      scout_id,
      player_id,
      team_id;
  `;

  const result = await pool.query(query, [
    scoutId,
    coachId,
  ]);

  return result.rows[0] || null;
};

export {
  findCoachTeam,
  findPlayerForScouting,
  findScoutListEntry,
  createScoutListEntry,
  getCoachScoutList,
  findCoachScoutEntryById,
  updateScoutListEntry,
  deleteScoutListEntry,
};
