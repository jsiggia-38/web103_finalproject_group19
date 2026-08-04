import { pool } from './database.js'
import './dotenv.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const currentPath = fileURLToPath(import.meta.url)

const playersFile = fs.readFileSync(
  path.join(dirname(currentPath), '../config/data/data.json')
)

const playerData = JSON.parse(playersFile)

const dropAllTables = async () => {
  const dropTablesQuery = `
    DROP TABLE IF EXISTS tryout_invitations;
    DROP TABLE IF EXISTS scout_list;
    DROP TABLE IF EXISTS player_statistics;
    DROP TABLE IF EXISTS players;
    DROP TABLE IF EXISTS player_verification_records;
    DROP TABLE IF EXISTS teams;
    DROP TABLE IF EXISTS users;
  `

  try {
    await pool.query(dropTablesQuery)
    console.log('🧹 All tables dropped successfully.')
  } catch (err) {
    console.error('⚠️ Error dropping tables:', err)
  }
}

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(25) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  await pool.query(query)
  console.log('✅ Users table created')
}

const createTeamsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS teams (
      team_id SERIAL PRIMARY KEY,
      organizer_id INTEGER REFERENCES users(user_id),
      captain_id INTEGER REFERENCES users(user_id),
      team_name VARCHAR(100) NOT NULL,
      division VARCHAR(50),
      description TEXT,
      logo_url VARCHAR(255),
      practice_location VARCHAR(255),
      practice_schedule VARCHAR(100),
      maximum_roster_size INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  await pool.query(query)
  console.log('✅ Teams table created')
}

const createPlayersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS players (
      player_id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
      team_id INTEGER REFERENCES teams(team_id),
      verification_id INTEGER UNIQUE
        REFERENCES player_verification_records(verification_id),
      profile_image VARCHAR(255),
      biography TEXT,
      primary_position VARCHAR(50),
      secondary_position VARCHAR(50),
      preferred_foot VARCHAR(20),
      class_year VARCHAR(25),
      skill_level VARCHAR(25),
      availability VARCHAR(100),
      is_verified BOOLEAN DEFAULT FALSE,
      verified_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  await pool.query(query)
  console.log('✅ Players table created')
}

const createPlayerStatisticsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS player_statistics (
      statistics_id SERIAL PRIMARY KEY,
      player_id INTEGER UNIQUE REFERENCES players(player_id) ON DELETE CASCADE,
      goals INTEGER DEFAULT 0,
      assists INTEGER DEFAULT 0,
      clean_sheets INTEGER DEFAULT 0,
      games_played INTEGER DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  await pool.query(query)
  console.log('✅ Player Statistics table created')
}

const createScoutListTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS scout_list (
      scout_id SERIAL PRIMARY KEY,

      coach_id INTEGER NOT NULL
        REFERENCES users(user_id)
        ON DELETE CASCADE,

      player_id INTEGER NOT NULL
        REFERENCES players(player_id)
        ON DELETE CASCADE,

      team_id INTEGER NOT NULL
        REFERENCES teams(team_id)
        ON DELETE CASCADE,

      status VARCHAR(50)
        NOT NULL
        DEFAULT 'Interested',

      scouting_notes TEXT,

      date_added TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      UNIQUE(coach_id, player_id, team_id)
    );
  `

  await pool.query(query)

  console.log('✅ Scout List table created')
}

const createTryoutInvitationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS tryout_invitations (
      invitation_id SERIAL PRIMARY KEY,

      coach_id INTEGER NOT NULL
        REFERENCES users(user_id)
        ON DELETE CASCADE,

      player_id INTEGER NOT NULL
        REFERENCES players(player_id)
        ON DELETE CASCADE,

      team_id INTEGER NOT NULL
        REFERENCES teams(team_id)
        ON DELETE CASCADE,

      tryout_date DATE NOT NULL,
      tryout_time TIME NOT NULL,
      location VARCHAR(255) NOT NULL,
      message TEXT,

      invitation_status VARCHAR(25)
        NOT NULL
        DEFAULT 'Pending',

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
    );
  `

  await pool.query(query)

  console.log(
    '✅ Tryout Invitations table created'
  )
}

const createPlayerVerificationRecordsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS player_verification_records (
      verification_id SERIAL PRIMARY KEY,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      date_of_birth DATE NOT NULL,
      primary_position VARCHAR(50) NOT NULL,
      secondary_position VARCHAR(50),
      preferred_foot VARCHAR(20),
      skill_level VARCHAR(25),
      class_year VARCHAR(25),
      goals INTEGER DEFAULT 0,
      assists INTEGER DEFAULT 0,
      clean_sheets INTEGER DEFAULT 0,
      games_played INTEGER DEFAULT 0,
      verification_source VARCHAR(100) DEFAULT 'Demo College Sports Registry',
      verification_status VARCHAR(25) DEFAULT 'Verified',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      UNIQUE(first_name, last_name, date_of_birth)
    );
  `

  await pool.query(query)
  console.log('✅ Player Verification Records table created')
}

const seedPlayerVerificationRecords = async () => {
  const query = `
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
      games_played
    )
    VALUES
      (
        'Daniel',
        'Smith',
        '2003-04-15',
        'Midfielder',
        'Defensive Midfielder',
        'Right',
        'Advanced',
        'Senior',
        8,
        10,
        2,
        15
      ),
      (
        'Kevin',
        'Brown',
        '2004-09-21',
        'Forward',
        'Winger',
        'Left',
        'Intermediate',
        'Junior',
        12,
        4,
        0,
        13
      ),
      (
        'Michael',
        'Johnson',
        '2002-11-08',
        'Goalkeeper',
        NULL,
        'Right',
        'Advanced',
        'Senior',
        0,
        0,
        9,
        14
      );
  `

  await pool.query(query)
  console.log('✅ Demo player verification records seeded')
}

const resetDatabase = async () => {
  try {
    await dropAllTables()

    await createUsersTable()
    await createTeamsTable()
    await createPlayerVerificationRecordsTable()
    await seedPlayerVerificationRecords()
    await createPlayersTable()
    await createPlayerStatisticsTable()
    await createScoutListTable()
    await createTryoutInvitationsTable()

    console.log('🎉 Database reset complete!')
  } catch (err) {
    console.error('❌ Error resetting database:', err)
  }
}

resetDatabase()