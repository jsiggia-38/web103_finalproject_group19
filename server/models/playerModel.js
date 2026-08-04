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

export {
  getPlayerById,
  updatePlayerProfile,
  deletePlayerAccount,
};