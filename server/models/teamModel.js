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

export {
  createTeam,
  findCoachById,
  findTeamByCaptainId,
  getAvailableCoaches,
};