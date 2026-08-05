import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getPlayers,
} from "../services/playerService.js";

import {
  getAllTeams,
} from "../services/teamService.js";

import "../styles/home.css";

const DEFAULT_PLAYER_IMAGE =
  "/images/default-player-avatar.png";

const DEFAULT_TEAM_LOGO =
  "/images/default-team-logo.png";

function HomePage() {
  const [featuredPlayers, setFeaturedPlayers] =
    useState([]);

  const [featuredTeams, setFeaturedTeams] =
    useState([]);

  const [loadingFeaturedContent, setLoadingFeaturedContent] =
    useState(true);

  const [featuredContentError, setFeaturedContentError] =
    useState("");

  useEffect(() => {
    const loadFeaturedContent = async () => {
      try {
        setLoadingFeaturedContent(true);
        setFeaturedContentError("");

        const [
          playersResult,
          teamsResult,
        ] = await Promise.all([
          getPlayers({
            sortBy: "newest",
            sortOrder: "desc",
          }),
          getAllTeams(),
        ]);

        const registeredPlayers =
          Array.isArray(playersResult.data)
            ? playersResult.data
            : [];

        const registeredTeams =
          Array.isArray(teamsResult.data)
            ? teamsResult.data
            : [];

        setFeaturedPlayers(
          registeredPlayers.slice(0, 3),
        );

        setFeaturedTeams(
          registeredTeams.slice(0, 3),
        );
      } catch (requestError) {
        setFeaturedContentError(
          requestError.message ||
            "Unable to load featured players and teams.",
        );
      } finally {
        setLoadingFeaturedContent(false);
      }
    };

    loadFeaturedContent();
  }, []);

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
              <strong>
                College Soccer
              </strong>

              <small>
                Scout Helper
              </small>
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
              <span>
                Scout Helper
              </span>
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

        {featuredContentError && (
          <div
            className="home-featured-error"
            role="alert"
          >
            {featuredContentError}
          </div>
        )}

        <section className="featured-players-section">
          <div className="home-section-container">
            <div className="section-title-row">
              <div>
                <span className="section-label">
                  Featured Talent
                </span>

                <h2>
                  Featured Players
                </h2>
              </div>

              <Link
                to="/players"
                className="view-all-link"
              >
                View All Players →
              </Link>
            </div>

            {loadingFeaturedContent ? (
              <div className="home-featured-state">
                <div className="home-featured-spinner" />

                <h3>
                  Loading Featured Players
                </h3>
              </div>
            ) : featuredPlayers.length === 0 ? (
              <div className="home-featured-state">
                <span>⚽</span>

                <h3>
                  No Registered Players Yet
                </h3>

                <p>
                  Verified player profiles will
                  appear here after registration.
                </p>

                <Link to="/signup/player-verification">
                  Create Player Profile
                </Link>
              </div>
            ) : (
              <div className="player-card-grid">
                {featuredPlayers.map(
                  (player) => (
                    <article
                      className="home-player-card"
                      key={player.playerId}
                    >
                      <div className="player-avatar">
                        <img
                          src={
                            player.profileImage ||
                            DEFAULT_PLAYER_IMAGE
                          }
                          alt={`${player.firstName} ${player.lastName}`}
                          onError={(event) => {
                            event.currentTarget.src =
                              DEFAULT_PLAYER_IMAGE;
                          }}
                        />

                        {player.isVerified && (
                          <span className="home-player-verified-badge">
                            ✓ Verified
                          </span>
                        )}
                      </div>

                      <div className="player-card-content">
                        <div className="player-card-heading">
                          <div>
                            <h3>
                              {player.firstName}{" "}
                              <span>
                                {player.lastName}
                              </span>
                            </h3>

                            <p>
                              {
                                player.primaryPosition
                              }
                              {" • "}
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
                              {player.statistics
                                ?.goals ?? 0}
                            </strong>

                            <span>Goals</span>
                          </div>

                          <div>
                            <strong>
                              {player.statistics
                                ?.assists ?? 0}
                            </strong>

                            <span>Assists</span>
                          </div>

                          <div>
                            <strong>
                              {player.statistics
                                ?.gamesPlayed ?? 0}
                            </strong>

                            <span>Games</span>
                          </div>
                        </div>

                        <Link
                          to={`/players/${player.playerId}`}
                          className="card-action-button"
                        >
                          View Profile
                        </Link>
                      </div>
                    </article>
                  ),
                )}
              </div>
            )}
          </div>
        </section>

        <section className="featured-teams-section">
          <div className="home-section-container">
            <div className="section-title-row home-team-title-row">
              <div>
                <span className="section-label">
                  Recruiting Teams
                </span>

                <h2>
                  Featured Soccer Teams
                </h2>

                <p>
                  Discover college clubs and
                  intramural teams looking for new
                  talent.
                </p>
              </div>

              <Link
                to="/teams"
                className="view-all-link"
              >
                View All Teams →
              </Link>
            </div>

            {loadingFeaturedContent ? (
              <div className="home-featured-state dark">
                <div className="home-featured-spinner" />

                <h3>
                  Loading Featured Teams
                </h3>
              </div>
            ) : featuredTeams.length === 0 ? (
              <div className="home-featured-state dark">
                <span>🛡️</span>

                <h3>
                  No Registered Teams Yet
                </h3>

                <p>
                  Teams created by club organizers
                  will appear here.
                </p>

                <Link to="/teams">
                  Browse Teams
                </Link>
              </div>
            ) : (
              <div className="team-card-grid">
                {featuredTeams.map(
                  (team) => (
                    <article
                      className="home-team-card"
                      key={team.teamId}
                    >
                      <div className="team-logo">
                        {team.logoUrl ? (
                          <img
                            src={team.logoUrl}
                            alt={`${team.teamName} logo`}
                            onError={(event) => {
                              event.currentTarget.src =
                                DEFAULT_TEAM_LOGO;
                            }}
                          />
                        ) : (
                          <img
                            src={DEFAULT_TEAM_LOGO}
                            alt=""
                          />
                        )}
                      </div>

                      <h3>
                        {team.teamName}
                      </h3>

                      <p className="team-division">
                        {team.division ||
                          "College Soccer Team"}
                      </p>

                      <p className="team-captain">
                        Captain:{" "}
                        {team.captain
                          ? `${team.captain.firstName} ${team.captain.lastName}`
                          : "Not assigned"}
                      </p>

                      <Link
                        to={`/teams/${team.teamId}`}
                        className="team-action-button"
                      >
                        View Team
                      </Link>
                    </article>
                  ),
                )}
              </div>
            )}
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
            <h4>
              Ready to Get Started?
            </h4>

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
  );
}

export default HomePage;