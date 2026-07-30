import { pool } from '../config/database.js'

const normalizeName = (name) => {
  return name.trim().toLowerCase()
}

const getRandomItem = (items) => {
  const randomIndex = Math.floor(
    Math.random() * items.length
  )

  return items[randomIndex]
}

/**
 * Finds a verified player record using:
 * first name + last name + date of birth
 */
export const findVerificationRecord = async ({
  firstName,
  lastName,
  dateOfBirth
}) => {
  const results = await pool.query(
    `
      SELECT *
      FROM player_verification_records
      WHERE LOWER(first_name) = $1
        AND LOWER(last_name) = $2
        AND date_of_birth = $3
        AND verification_status = 'Verified'
    `,
    [
      normalizeName(firstName),
      normalizeName(lastName),
      dateOfBirth
    ]
  )

  return results.rows[0] || null
}

/**
 * Retrieves a verification record using its ID.
 */
export const getVerificationRecordById = async (
  verificationId
) => {
  const results = await pool.query(
    `
      SELECT *
      FROM player_verification_records
      WHERE verification_id = $1
    `,
    [verificationId]
  )

  return results.rows[0] || null
}

/**
 * Creates and saves a simulated verification record
 * for a player who is not already in the demo registry.
 */
export const createDemoVerificationRecord = async ({
  firstName,
  lastName,
  dateOfBirth
}) => {
  const positionOptions = [
    {
      primaryPosition: 'Goalkeeper',
      secondaryPosition: null
    },
    {
      primaryPosition: 'Defender',
      secondaryPosition: 'Center Back'
    },
    {
      primaryPosition: 'Defender',
      secondaryPosition: 'Outside Back'
    },
    {
      primaryPosition: 'Midfielder',
      secondaryPosition: 'Defensive Midfielder'
    },
    {
      primaryPosition: 'Midfielder',
      secondaryPosition: 'Attacking Midfielder'
    },
    {
      primaryPosition: 'Forward',
      secondaryPosition: 'Winger'
    }
  ]

  const selectedPosition =
    getRandomItem(positionOptions)

  const preferredFoot =
    getRandomItem(['Left', 'Right'])

  const skillLevel =
    getRandomItem([
      'Beginner',
      'Intermediate',
      'Advanced'
    ])

  const classYear =
    getRandomItem([
      'Freshman',
      'Sophomore',
      'Junior',
      'Senior'
    ])

  const gamesPlayed =
    Math.floor(Math.random() * 13) + 10

  let goals = 0
  let assists = 0
  let cleanSheets = 0

  if (
    selectedPosition.primaryPosition ===
    'Forward'
  ) {
    goals =
      Math.floor(Math.random() * 16) + 5

    assists =
      Math.floor(Math.random() * 10)
  } else if (
    selectedPosition.primaryPosition ===
    'Midfielder'
  ) {
    goals =
      Math.floor(Math.random() * 10)

    assists =
      Math.floor(Math.random() * 13) + 3
  } else if (
    selectedPosition.primaryPosition ===
    'Defender'
  ) {
    goals =
      Math.floor(Math.random() * 5)

    assists =
      Math.floor(Math.random() * 7)

    cleanSheets =
      Math.floor(Math.random() * 9) + 2
  } else {
    cleanSheets =
      Math.floor(Math.random() * 11) + 3
  }

  const results = await pool.query(
    `
      INSERT INTO player_verification_records (
        first_name,
        last_name,
        date_of_birth,
        primary_position,
        secondary_position,
        preferred_foot,
        skill_level,
        class_year,
        goals,
        assists,
        clean_sheets,
        games_played,
        verification_source,
        verification_status
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
        $9,
        $10,
        $11,
        $12,
        'Generated Demo Registry',
        'Verified'
      )
      RETURNING *;
    `,
    [
      firstName.trim(),
      lastName.trim(),
      dateOfBirth,
      selectedPosition.primaryPosition,
      selectedPosition.secondaryPosition,
      preferredFoot,
      skillLevel,
      classYear,
      goals,
      assists,
      cleanSheets,
      gamesPlayed
    ]
  )

  return results.rows[0]
}