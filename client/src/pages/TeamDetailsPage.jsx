import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getTeamById,
} from "../services/teamService.js";

import "../styles/teamDetails.css";

const DEFAULT_TEAM_LOGO =
  "/images/default-team-logo.png";

const DEFAULT_PLAYER_IMAGE =
  "/images/default-player-avatar.png";

const getAuthenticatedUser = () => {
  try {
    const storedUser =
      sessionStorage.getItem(
        "authenticatedUser",
      );

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    return null;
  }
};

function TeamDetailsPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const authenticatedUser =
    getAuthenticatedUser();

  const [team, setTeam] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [logoError, setLogoError] =
    useState(false);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await getTeamById(teamId);

        setTeam(result.data);
      } catch (requestError) {
        setError(
          requestError.message ||
            "Unable to load the team.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, [teamId]);

  const handleLogout = () => {
    sessionStorage.removeItem(
      "authToken",
    );

    sessionStorage.removeItem(
      "authenticatedUser",
    );

    sessionStorage.removeItem(
      "createdPlayerAccount",
    );

    navigate("/login", {
      replace: true,
    });
  };

  const getDashboardLink = () => {
    if (
      authenticatedUser?.role ===
      "Coach"
    ) {
      return "/dashboard/coach";
    }

    if (
      authenticatedUser?.role ===
      "Organizer"
    ) {
      return "/dashboard/organizer";
    }

    if (
      authenticatedUser?.role ===
        "Player" &&
      authenticatedUser.playerId
    ) {
      return `/players/${authenticatedUser.playerId}`;
    }

    return "/";
  };

  if (loading) {
    return (
      <main className="team-details-state-page">
        <section className="team-details-state-card">
          <div className="team-details-spinner" />

          <h1>Loading Team</h1>

          <p>
            Retrieving team and roster
            information.
          </p>
        </section>
      </main>
    );
  }

  if (error || !team) {
    return (
      <main className="team-details-state-page">
        <section className="team-details-state-card">
          <h1>
            Unable to Load Team
          </h1>

          <p className="team-details-error">
            {error ||
              "The requested team does not exist."}
          </p>

          <Link to="/teams">
            Back to Teams
          </Link>
        </section>
      </main>
    );
  }

  const teamLogo =
    !logoError && team.logoUrl
      ? team.logoUrl
      : DEFAULT_TEAM_LOGO;

  const isOrganizer =
    authenticatedUser?.role ===
    "Organizer";

  const isTeamCaptain =
    authenticatedUser?.role ===
      "Coach" &&
    Number(authenticatedUser.userId) ===
      Number(team.captain?.userId);

  return (
    <main className="team-details-page">
      <div className="team-details-container">
        <header className="team-details-topbar">
          <Link
            to="/"
            className="team-details-brand"
          >
            <span className="team-details-brand-icon">
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

          <div className="team-details-user-actions">
            {authenticatedUser ? (
              <>
                <span>
                  {
                    authenticatedUser.firstName
                  }{" "}
                  {
                    authenticatedUser.lastName
                  }
                </span>

                <Link
                  to={getDashboardLink()}
                >
                  Dashboard
                </Link>

                <Link to="/teams">
                  All Teams
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/teams">
                  Continue Browsing Teams
                </Link>

                <Link to="/">
                  Back Home
                </Link>

                <Link to="/login">
                  Log In
                </Link>
              </>
            )}
          </div>
        </header>

        <section className="team-details-hero">
          <div className="team-details-logo-wrapper">
            <img
              src={teamLogo}
              alt={`${team.teamName} logo`}
              onError={() =>
                setLogoError(true)
              }
            />
          </div>

          <div className="team-details-introduction">
            <p className="team-details-eyebrow">
              Registered Soccer Team
            </p>

            <h1>
              {team.teamName}
            </h1>

            <p className="team-details-division">
              {team.division ||
                "College Soccer Division"}
            </p>

            <div className="team-details-tags">
              <span>
                🛡️{" "}
                {team.rosterCount} Players
              </span>

              <span>
                Capacity:{" "}
                {team.maximumRosterSize ||
                  "No limit"}
              </span>

              <span>
                Active Team
              </span>
            </div>

            <div className="team-details-actions">
              <Link to="/teams">
                Back to Teams
              </Link>

              {isOrganizer && (
                <Link
                  to={`/teams/${team.teamId}/edit`}
                  className="team-details-edit-link"
                >
                  Edit Team
                </Link>
              )}

              {isTeamCaptain && (
                <Link
                  to="/dashboard/coach"
                  className="team-details-captain-link"
                >
                  Manage Team
                </Link>
              )}
            </div>
          </div>
        </section>

        <div className="team-details-main-grid">
          <section className="team-details-panel">
            <div className="team-details-panel-heading">
              <p>About</p>

              <h2>
                Team Description
              </h2>
            </div>

            <p className="team-details-description">
              {team.description ||
                "This team has not added a description yet."}
            </p>
          </section>

          <section className="team-details-panel">
            <div className="team-details-panel-heading">
              <p>Leadership</p>

              <h2>
                Team Administration
              </h2>
            </div>

            <div className="team-details-information-list">
              <div>
                <span>
                  Team Captain / Coach
                </span>

                <strong>
                  {team.captain
                    ? `${team.captain.firstName} ${team.captain.lastName}`
                    : "Not assigned"}
                </strong>
              </div>

              <div>
                <span>
                  Club Organizer
                </span>

                <strong>
                  {team.organizer
                    ? `${team.organizer.firstName} ${team.organizer.lastName}`
                    : "Not assigned"}
                </strong>
              </div>

              <div>
                <span>Division</span>

                <strong>
                  {team.division ||
                    "Not assigned"}
                </strong>
              </div>
            </div>
          </section>

          <section className="team-details-panel">
            <div className="team-details-panel-heading">
              <p>Training</p>

              <h2>
                Practice Information
              </h2>
            </div>

            <div className="team-details-information-list">
              <div>
                <span>
                  Practice Location
                </span>

                <strong>
                  {team.practiceLocation ||
                    "Not provided"}
                </strong>
              </div>

              <div>
                <span>
                  Practice Schedule
                </span>

                <strong>
                  {team.practiceSchedule ||
                    "Not provided"}
                </strong>
              </div>
            </div>
          </section>

          <section className="team-details-panel">
            <div className="team-details-panel-heading">
              <p>Roster</p>

              <h2>
                Team Capacity
              </h2>
            </div>

            <div className="team-roster-capacity">
              <strong>
                {team.rosterCount}
              </strong>

              <span>
                of{" "}
                {team.maximumRosterSize ||
                  "unlimited"}{" "}
                roster positions filled
              </span>
            </div>
          </section>
        </div>

        <section className="team-roster-section">
          <div className="team-details-section-heading">
            <div>
              <p>Registered Athletes</p>

              <h2>
                Current Team Roster
              </h2>
            </div>

            <span>
              {team.players.length}{" "}
              {team.players.length === 1
                ? "Player"
                : "Players"}
            </span>
          </div>

          {team.players.length === 0 ? (
            <div className="team-roster-empty">
              <span>👥</span>

              <h3>
                No Players Assigned Yet
              </h3>

              <p>
                Players added to this team will
                appear in the roster section.
              </p>

              {isTeamCaptain && (
                <Link to="/players">
                  Browse Players
                </Link>
              )}
            </div>
          ) : (
            <div className="team-roster-grid">
              {team.players.map(
                (player) => (
                  <article
                    key={player.playerId}
                    className="team-roster-card"
                  >
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

                    <div className="team-roster-card-content">
                      {player.isVerified && (
                        <span className="team-player-verified">
                          ✓ Verified
                        </span>
                      )}

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
                        {" • "}
                        {player.skillLevel}
                      </p>

                      <div className="team-player-statistics">
                        <span>
                          <strong>
                            {
                              player.statistics
                                .goals
                            }
                          </strong>
                          Goals
                        </span>

                        <span>
                          <strong>
                            {
                              player.statistics
                                .assists
                            }
                          </strong>
                          Assists
                        </span>

                        <span>
                          <strong>
                            {
                              player.statistics
                                .gamesPlayed
                            }
                          </strong>
                          Games
                        </span>
                      </div>

                      <Link
                        to={`/players/${player.playerId}`}
                      >
                        View Player Profile
                      </Link>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default TeamDetailsPage;