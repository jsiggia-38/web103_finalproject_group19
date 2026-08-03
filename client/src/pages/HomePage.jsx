import { Link } from 'react-router-dom'
import '../styles/home.css'

const featuredPlayers = [
  {
    id: 1,
    name: 'Daniel Smith',
    position: 'Midfielder',
    classYear: 'Senior',
    skillLevel: 'Advanced',
    goals: 8,
    assists: 10,
    gamesPlayed: 15
  },
  {
    id: 2,
    name: 'Kevin Brown',
    position: 'Forward',
    classYear: 'Junior',
    skillLevel: 'Intermediate',
    goals: 12,
    assists: 4,
    gamesPlayed: 13
  },
  {
    id: 3,
    name: 'Michael Johnson',
    position: 'Goalkeeper',
    classYear: 'Senior',
    skillLevel: 'Advanced',
    goals: 0,
    assists: 0,
    gamesPlayed: 14
  }
]

const featuredTeams = [
  {
    id: 1,
    name: 'Campus United',
    division: 'Division A',
    captain: 'Alex Turner'
  },
  {
    id: 2,
    name: 'Northside FC',
    division: 'Division B',
    captain: 'Jason Miller'
  },
  {
    id: 3,
    name: 'Warriors SC',
    division: 'Division A',
    captain: 'Chris Lee'
  }
]

function HomePage() {
  return (
    <div className="home-page">
      <header className="home-header">
        <nav className="home-navbar">
          <Link
            to="/"
            className="home-brand"
          >
            <span className="brand-icon">
              ⚽
            </span>

            <span>
              <strong>College Soccer</strong>
              <small>Scout Helper</small>
            </span>
          </Link>

          <div className="home-nav-links">
            <Link
              to="/"
              className="active"
            >
              Home
            </Link>

            <Link to="/players">
              Players
            </Link>

            <Link to="/teams">
              Teams
            </Link>

            <Link to="/scout-list">
              Scout List
            </Link>

            <Link to="/ai-assistant">
              AI Assistant
            </Link>
          </div>

          <div className="home-auth-actions">
            <Link
              to="/login"
              className="home-login-btn"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="signup-link"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="home-hero">
          <div className="home-hero-overlay" />

          <div className="home-hero-content">
           

            <h1>
              College Soccer
              <span> Scout Helper</span>
            </h1>

            <h2>
              Connecting talented student players
              with college teams.
            </h2>

            <p className="hero-description">
              Showcase your soccer abilities, get
              discovered by coaches and captains,
              and receive invitations to team
              tryouts. All in one place!
            </p>

            <div className="hero-actions">
              <Link
                to="/players"
                className="hero-primary-button"
              >
                Browse Players
              </Link>

              <Link
                to="/teams"
                className="hero-secondary-button"
              >
                View Teams
              </Link>

              <Link
                to="/signup/player-verification"
                className="hero-profile-button"
              >
                Create Player Profile
              </Link>
            </div>
          </div>
        </section>

        <section className="how-it-works-section">
          <div className="home-section-container">
            <div className="section-heading">
              <span>Our Process</span>

              <h2>How It Works</h2>

              <p>
                Build your profile, get discovered,
                and connect with the right team.
              </p>
            </div>

            <div className="process-grid">
              <article className="process-card">
                <div className="process-icon">
                  👤
                </div>

                <span className="process-number">
                  01
                </span>

                <h3>Create Your Profile</h3>

                <p>
                  Verify your identity and build a
                  profile with trusted soccer
                  information and performance
                  statistics.
                </p>
              </article>

              <article className="process-card">
                <div className="process-icon">
                  🔍
                </div>

                <span className="process-number">
                  02
                </span>

                <h3>Get Discovered</h3>

                <p>
                  Coaches and captains search,
                  filter, and evaluate players who
                  match their team’s needs.
                </p>
              </article>

              <article className="process-card">
                <div className="process-icon">
                  🤝
                </div>

                <span className="process-number">
                  03
                </span>

                <h3>Join a Team</h3>

                <p>
                  Receive tryout invitations and
                  connect with college clubs and
                  intramural soccer teams.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="featured-players-section">
          <div className="home-section-container">
            <div className="section-title-row">
              <div>
                <span className="section-label">
                  Featured Talent
                </span>

                <h2>Featured Players</h2>
              </div>

              <Link
                to="/players"
                className="view-all-link"
              >
                View All Players →
              </Link>
            </div>

            <div className="player-card-grid">
              {featuredPlayers.map((player) => (
                <article
                  className="home-player-card"
                  key={player.id}
                >
                  <div className="player-avatar">
                    <span>⚽</span>
                  </div>

                  <div className="player-card-content">
                    <div className="player-card-heading">
                      <div>
                        <h3>{player.name}</h3>

                        <p>
                          {player.position} •{' '}
                          {player.classYear}
                        </p>
                      </div>

                      <span className="skill-badge">
                        {player.skillLevel}
                      </span>
                    </div>

                    <div className="player-stats-row">
                      <div>
                        <strong>
                          {player.goals}
                        </strong>
                        <span>Goals</span>
                      </div>

                      <div>
                        <strong>
                          {player.assists}
                        </strong>
                        <span>Assists</span>
                      </div>

                      <div>
                        <strong>
                          {player.gamesPlayed}
                        </strong>
                        <span>Games</span>
                      </div>
                    </div>

                    <Link
                      to={`/players/${player.id}`}
                      className="card-action-button"
                    >
                      View Profile
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="featured-teams-section">
          <div className="home-section-container">
            <div className="section-heading">
              <span>Recruiting Teams</span>

              <h2>Featured Soccer Teams</h2>

              <p>
                Discover college clubs and
                intramural teams looking for new
                talent.
              </p>
            </div>

            <div className="team-card-grid">
              {featuredTeams.map((team) => (
                <article
                  className="home-team-card"
                  key={team.id}
                >
                  <div className="team-logo">
                    ⚽
                  </div>

                  <h3>{team.name}</h3>

                  <p className="team-division">
                    {team.division}
                  </p>

                  <p className="team-captain">
                    Captain: {team.captain}
                  </p>

                  <Link
                    to={`/teams/${team.id}`}
                    className="team-action-button"
                  >
                    View Team
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-footer-content">
          <div className="footer-about">
            <h3>Scout Helper</h3>

            <p>
              Connecting talented student soccer
              players with college teams through a
              trusted and centralized scouting
              platform.
            </p>
          </div>

          <div className="footer-links">
            <h4>Resources</h4>

            <Link to="/players">
              Browse Players
            </Link>

            <Link to="/teams">
              View Teams
            </Link>

            <Link to="/scout-list">
              Scout List
            </Link>
          </div>

          <div className="footer-signup">
            <h4>Ready to Get Started?</h4>

            <p>
              Create your profile and begin your
              soccer recruitment journey.
            </p>

            <Link
              to="/signup/player-verification"
              className="footer-cta"
            >
              Create Player Profile
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 College Soccer Scout Helper.
          All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default HomePage