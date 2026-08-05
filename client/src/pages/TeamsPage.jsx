import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getAllTeams,
} from "../services/teamService.js";

import "../styles/teams.css";

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

function TeamsPage() {
  const navigate = useNavigate();
  const authenticatedUser =
    getAuthenticatedUser();

  const [teams, setTeams] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await getAllTeams();

        setTeams(result.data || []);
      } catch (requestError) {
        setError(
          requestError.message ||
            "Unable to load soccer teams.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

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

  return (
    <main className="teams-page">
      <div className="teams-container">
        <header className="teams-topbar">
          <Link
            to="/"
            className="teams-brand"
          >
            <span className="teams-brand-icon">
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

          <div className="teams-user-actions">
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

                <Link to="/">
                  Home
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
                  Browse Teams
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

        <section className="teams-hero">
          <div>
            <p>
              College Soccer Directory
            </p>

            <h1>
              Browse <span>Teams</span>
            </h1>

            <p>
              Explore registered college and
              intramural soccer teams, team
              captains, practice schedules, and
              current roster availability.
            </p>
          </div>

          <span className="teams-count">
            {teams.length}{" "}
            {teams.length === 1
              ? "Team"
              : "Teams"}
          </span>
        </section>

        {authenticatedUser?.role ===
          "Organizer" && (
          <div className="teams-organizer-actions">
            <Link to="/teams/create">
              Create New Team
            </Link>
          </div>
        )}

        {error && (
          <p
            className="teams-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {loading ? (
          <section className="teams-state">
            <div className="teams-spinner" />

            <h2>Loading Teams</h2>

            <p>
              Retrieving registered soccer teams.
            </p>
          </section>
        ) : teams.length === 0 ? (
          <section className="teams-state">
            <span>🛡️</span>

            <h2>
              No Teams Registered Yet
            </h2>

            <p>
              Teams created by club organizers
              will appear here.
            </p>

            {authenticatedUser?.role ===
              "Organizer" && (
              <Link to="/teams/create">
                Create First Team
              </Link>
            )}
          </section>
        ) : (
          <section className="teams-grid">
            {teams.map((team) => (
              <article
                key={team.teamId}
                className="team-directory-card"
              >
                <div className="team-directory-logo">
                  {team.logoUrl ? (
                    <img
                      src={team.logoUrl}
                      alt={`${team.teamName} logo`}
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <span>⚽</span>
                  )}
                </div>

                <div className="team-directory-content">
                  <span className="team-directory-division">
                    {team.division ||
                      "College Soccer Team"}
                  </span>

                  <h2>
                    {team.teamName}
                  </h2>

                  <p className="team-directory-description">
                    {team.description ||
                      "No team description has been provided."}
                  </p>

                  <div className="team-directory-details">
                    <div>
                      <span>Captain</span>

                      <strong>
                        {team.captain
                          ? `${team.captain.firstName} ${team.captain.lastName}`
                          : "Not assigned"}
                      </strong>
                    </div>

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

                    <div>
                      <span>Roster</span>

                      <strong>
                        {team.rosterCount} of{" "}
                        {team.maximumRosterSize ||
                          "No limit"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="team-directory-actions">
                  <Link
                    to={`/teams/${team.teamId}`}
                  >
                    View Team
                  </Link>

                  {authenticatedUser?.role ===
                    "Organizer" && (
                    <Link
                      to={`/teams/${team.teamId}/edit`}
                      className="team-directory-edit-link"
                    >
                      Edit Team
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default TeamsPage;