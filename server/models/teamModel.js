import { pool } from "../config/database.js";

const getAvailableCoaches = async () => {
  const query = `
    SELECT
      u.user_id,
      u.first_name,
      u.last_name,
      u.email
    FROM users AS u
    LEFT JOIN teams AS t
      ON t.captain_id = u.user_id
    WHERE u.role = 'Coach'
      AND t.team_id IS NULL
    ORDER BY
      u.first_name ASC,
      u.last_name ASC;
  `;

  const result = await pool.query(query);

  return result.rows;
};

const createTeam = async ({
  organizerId,
  captainId,
  teamName,
  division,
  description,
  logoUrl,
  practiceLocation,
  practiceSchedule,
  maximumRosterSize,
}) => {
  const query = `
    INSERT INTO teams (
      organizer_id,
      captain_id,
      team_name,
      division,
      description,
      logo_url,
      practice_location,
      practice_schedule,
      maximum_roster_size
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9
    )
    RETURNING
      team_id,
      organizer_id,
      captain_id,
      team_name,
      division,
      description,
      logo_url,
      practice_location,
      practice_schedule,
      maximum_roster_size,
      created_at;
  `;

  const result = await pool.query(query, [
    organizerId,
    captainId,
    teamName,
    division || null,
    description || null,
    logoUrl || null,
    practiceLocation || null,
    practiceSchedule || null,
    maximumRosterSize,
  ]);

  return result.rows[0];
};

const findCoachById = async (coachId) => {
  const query = `
    SELECT
      user_id,
      first_name,
      last_name,
      email,
      role
    FROM users
    WHERE user_id = $1
      AND role = 'Coach';
  `;

  const result = await pool.query(query, [
    coachId,
  ]);

  return result.rows[0] || null;
};

const findTeamByCaptainId = async (
  captainId,
) => {
  const query = `
    SELECT
      team_id,
      team_name
    FROM teams
    WHERE captain_id = $1;
  `;

  const result = await pool.query(query, [
    captainId,
  ]);

  return result.rows[0] || null;
};

const getAllTeams = async () => {
  const query = `
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

      captain.user_id AS captain_id,
      captain.first_name AS captain_first_name,
      captain.last_name AS captain_last_name,
      captain.email AS captain_email,

      organizer.user_id AS organizer_id,
      organizer.first_name AS organizer_first_name,
      organizer.last_name AS organizer_last_name,

      (
        SELECT COUNT(*)
        FROM players AS p
        WHERE p.team_id = t.team_id
      )::INTEGER AS roster_count

    FROM teams AS t

    LEFT JOIN users AS captain
      ON captain.user_id = t.captain_id

    LEFT JOIN users AS organizer
      ON organizer.user_id = t.organizer_id

    ORDER BY
      t.created_at DESC,
      t.team_name ASC;
  `;

  const result = await pool.query(query);

  return result.rows;
};

export {
  createTeam,
  findCoachById,
  findTeamByCaptainId,
  getAvailableCoaches,
  getAllTeams,
};