import { pool } from "../config/database.js";

/**
 * Retrieves registered player profiles for browsing.
 *
 * Supports:
 * - name search;
 * - position filtering;
 * - class-year filtering;
 * - skill-level filtering;
 * - availability filtering;
 * - sorting.
 */
const getPlayers = async ({
  search = "",
  position = "",
  classYear = "",
  skillLevel = "",
  availability = "",
  sortBy = "newest",
  sortOrder = "desc",
}) => {
  const conditions = [];
  const values = [];

  const addCondition = (condition, value) => {
  values.push(value);

  const parameterNumber = `$${values.length}`;

  conditions.push(
    condition.replaceAll(
      "$VALUE",
      parameterNumber,
    ),
  );
};

  if (search) {
    addCondition(
      `
        (
          LOWER(u.first_name) LIKE LOWER($VALUE)
          OR LOWER(u.last_name) LIKE LOWER($VALUE)
          OR LOWER(
            CONCAT(
              u.first_name,
              ' ',
              u.last_name
            )
          ) LIKE LOWER($VALUE)
        )
      `,
      `%${search}%`,
    );
  }

  if (position) {
    addCondition(
      `
        (
          LOWER(p.primary_position) =
            LOWER($VALUE)
          OR LOWER(p.secondary_position) =
            LOWER($VALUE)
        )
      `,
      position,
    );
  }

  if (classYear) {
    addCondition(
      `
        LOWER(p.class_year) =
          LOWER($VALUE)
      `,
      classYear,
    );
  }

  if (skillLevel) {
    addCondition(
      `
        LOWER(p.skill_level) =
          LOWER($VALUE)
      `,
      skillLevel,
    );
  }

  if (availability) {
    addCondition(
      `
        LOWER(p.availability) =
          LOWER($VALUE)
      `,
      availability,
    );
  }

  const allowedSortColumns = {
    newest: "p.created_at",
    name: "u.first_name",
    goals: "COALESCE(ps.goals, 0)",
    assists: "COALESCE(ps.assists, 0)",
    gamesPlayed:
      "COALESCE(ps.games_played, 0)",
    skillLevel: `
      CASE
        WHEN p.skill_level = 'Advanced'
          THEN 3
        WHEN p.skill_level = 'Intermediate'
          THEN 2
        WHEN p.skill_level = 'Beginner'
          THEN 1
        ELSE 0
      END
    `,
  };

  const sortColumn =
    allowedSortColumns[sortBy] ||
    allowedSortColumns.newest;

  const normalizedSortOrder =
    sortOrder.toLowerCase() === "asc"
      ? "ASC"
      : "DESC";

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  const query = `
    SELECT
      p.player_id,
      p.profile_image,
      p.primary_position,
      p.secondary_position,
      p.preferred_foot,
      p.class_year,
      p.skill_level,
      p.availability,
      p.is_verified,
      p.created_at,

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

    FROM players AS p

    INNER JOIN users AS u
      ON p.user_id = u.user_id

    LEFT JOIN teams AS t
      ON p.team_id = t.team_id

    LEFT JOIN player_statistics AS ps
      ON p.player_id = ps.player_id

    ${whereClause}

    ORDER BY
      ${sortColumn}
      ${normalizedSortOrder},
      p.player_id DESC;
  `;

  const result = await pool.query(
    query,
    values,
  );

  return result.rows;
};

/**
 * Retrieves one complete player profile.
 *
 * Combines information from:
 * - users
 * - players
 * - teams
 * - player_statistics
 */
const getPlayerById = async (playerId) => {
  const query = `
    SELECT
      p.player_id,
      p.user_id,
      p.team_id,
      p.verification_id,
      p.profile_image,
      p.biography,
      p.primary_position,
      p.secondary_position,
      p.preferred_foot,
      p.class_year,
      p.skill_level,
      p.availability,
      p.is_verified,
      p.verified_at,
      p.created_at,
      p.updated_at,

      u.first_name,
      u.last_name,
      u.email,

      t.team_name,
      t.division,

      ps.goals,
      ps.assists,
      ps.clean_sheets,
      ps.games_played

    FROM players p

    INNER JOIN users u
      ON p.user_id = u.user_id

    LEFT JOIN teams t
      ON p.team_id = t.team_id

    LEFT JOIN player_statistics ps
      ON p.player_id = ps.player_id

    WHERE p.player_id = $1;
  `;

  const result = await pool.query(query, [
    playerId,
  ]);

  return result.rows[0] || null;
};

const updatePlayerProfile = async ({
  playerId,
  profileImage,
  biography,
  availability,
}) => {
  const query = `
    UPDATE players
    SET
      profile_image = $1,
      biography = $2,
      availability = $3,
      updated_at = CURRENT_TIMESTAMP
    WHERE player_id = $4
    RETURNING
      player_id,
      user_id,
      verification_id,
      profile_image,
      biography,
      primary_position,
      secondary_position,
      preferred_foot,
      class_year,
      skill_level,
      availability,
      is_verified,
      verified_at,
      created_at,
      updated_at;
  `;

  const result = await pool.query(query, [
    profileImage || null,
    biography,
    availability,
    playerId,
  ]);

  return result.rows[0] || null;
};

const deletePlayerAccount = async (playerId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const playerResult = await client.query(
      `
        SELECT
          player_id,
          user_id
        FROM players
        WHERE player_id = $1;
      `,
      [playerId],
    );

    const player = playerResult.rows[0];

    if (!player) {
      await client.query("ROLLBACK");
      return null;
    }

    /*
     * Remove dependent records first so foreign-key
     * relationships do not prevent profile deletion.
     */
    await client.query(
      `
        DELETE FROM player_statistics
        WHERE player_id = $1;
      `,
      [playerId],
    );

    await client.query(
      `
        DELETE FROM scout_list
        WHERE player_id = $1;
      `,
      [playerId],
    );

    await client.query(
      `
        DELETE FROM tryout_invitations
        WHERE player_id = $1;
      `,
      [playerId],
    );

    await client.query(
      `
        DELETE FROM players
        WHERE player_id = $1;
      `,
      [playerId],
    );

    await client.query(
      `
        DELETE FROM users
        WHERE user_id = $1;
      `,
      [player.user_id],
    );

    await client.query("COMMIT");

    return {
      playerId: player.player_id,
      userId: player.user_id,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Retrieves scouting activity visible to the
 * authenticated player.
 *
 * Coach scouting notes are intentionally excluded.
 */
const getPlayerScoutingActivity = async (
  playerId,
) => {
  const query = `
    SELECT
      s.scout_id,
      s.status,
      s.date_added,
      s.updated_at,

      t.team_id,
      t.team_name,
      t.division,
      t.logo_url

    FROM scout_list AS s

    INNER JOIN teams AS t
      ON t.team_id = s.team_id

    WHERE s.player_id = $1

    ORDER BY s.updated_at DESC;
  `;

  const result = await pool.query(query, [
    playerId,
  ]);

  return result.rows;
};

export {
  getPlayers,
  getPlayerById,
  updatePlayerProfile,
  deletePlayerAccount,
  getPlayerScoutingActivity,
};