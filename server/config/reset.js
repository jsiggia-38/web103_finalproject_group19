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
      user_id INTEGER REFERENCES users(user_id),
      team_id INTEGER REFERENCES teams(team_id),
      profile_image VARCHAR(255),
      biography TEXT,
      primary_position VARCHAR(50),
      secondary_position VARCHAR(50),
      preferred_foot VARCHAR(20),
      class_year VARCHAR(25),
      skill_level VARCHAR(25),
      availability VARCHAR(100),
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
      coach_id INTEGER REFERENCES users(user_id),
      player_id INTEGER REFERENCES players(player_id),
      team_id INTEGER REFERENCES teams(team_id),
      status VARCHAR(50),
      scouting_notes TEXT,
      date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  await pool.query(query)
  console.log('✅ Scout List table created')
}

const createTryoutInvitationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS tryout_invitations (
      invitation_id SERIAL PRIMARY KEY,
      coach_id INTEGER REFERENCES users(user_id),
      player_id INTEGER REFERENCES players(player_id),
      team_id INTEGER REFERENCES teams(team_id),
      tryout_date DATE,
      tryout_time TIME,
      location VARCHAR(255),
      message TEXT,
      invitation_status VARCHAR(25),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  await pool.query(query)
  console.log('✅ Tryout Invitations table created')
}

const resetDatabase = async () => {
  try {
    await dropAllTables()

    await createUsersTable()
    await createTeamsTable()
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