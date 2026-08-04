import { pool } from '../config/database.js'

const findUserByEmail = async (email) => {
  const query = `
    SELECT
      user_id,
      first_name,
      last_name,
      email,
      role
    FROM users
    WHERE LOWER(email) = LOWER($1);
  `

  const result = await pool.query(query, [email])

  return result.rows[0] || null
}

const createVerifiedPlayerAccount = async ({
  verificationRecord,
  email,
  hashedPassword,
  profileImage,
  biography,
  availability
}) => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const userQuery = `
      INSERT INTO users (
        first_name,
        last_name,
        email,
        password,
        role
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        user_id,
        first_name,
        last_name,
        email,
        role,
        created_at;
    `

    const userResult = await client.query(
      userQuery,
      [
        verificationRecord.first_name,
        verificationRecord.last_name,
        email.trim().toLowerCase(),
        hashedPassword,
        'Player'
      ]
    )

    const newUser = userResult.rows[0]

    const playerQuery = `
      INSERT INTO players (
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
        verified_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, TRUE,
        CURRENT_TIMESTAMP
      )
      RETURNING *;
    `

    const playerResult = await client.query(
      playerQuery,
      [
        newUser.user_id,
        verificationRecord.verification_id,
        profileImage || null,
        biography,
        verificationRecord.primary_position,
        verificationRecord.secondary_position,
        verificationRecord.preferred_foot,
        verificationRecord.class_year,
        verificationRecord.skill_level,
        availability
      ]
    )

    const newPlayer = playerResult.rows[0]

    const statisticsQuery = `
      INSERT INTO player_statistics (
        player_id,
        goals,
        assists,
        clean_sheets,
        games_played
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `

    const statisticsResult = await client.query(
      statisticsQuery,
      [
        newPlayer.player_id,
        verificationRecord.goals,
        verificationRecord.assists,
        verificationRecord.clean_sheets,
        verificationRecord.games_played
      ]
    )

    await client.query('COMMIT')

    return {
      user: newUser,
      player: newPlayer,
      statistics: statisticsResult.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export {
  findUserByEmail,
  createVerifiedPlayerAccount
}