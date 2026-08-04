import { pool } from "../config/database.js";

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

export {
  getPlayerById,
};