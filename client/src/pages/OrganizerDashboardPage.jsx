import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getOrganizerDashboard,
} from "../services/dashboardService.js";

import "../styles/roleDashboard.css";

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

const initialDashboardData = {
  summary: {
    totalTeams: 0,
    verifiedPlayers: 0,
    coaches: 0,
    openInvitations: 0,
  },
  recentTeams: [],
  recentPlayers: [],
};

function OrganizerDashboardPage() {
  const navigate = useNavigate();
  const user = getAuthenticatedUser();

  const [dashboard, setDashboard] =
    useState(initialDashboardData);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await getOrganizerDashboard();

        setDashboard(
          result.data ||
            initialDashboardData,
        );
      } catch (requestError) {
        setError(
          requestError.message ||
            "Unable to load the Organizer dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
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

  if (loading) {
    return (
      <main className="role-dashboard-page">
        <div className="role-dashboard-container">
          <section className="role-dashboard-loading-state">
            <div className="role-dashboard-spinner" />

            <h1>
              Loading Organizer Dashboard
            </h1>

            <p>
              Retrieving teams, coaches, and player
              registration information.
            </p>
          </section>
        </div>
      </main>
    );
  }

  const teamStatus =
    dashboard.summary.totalTeams > 0
      ? "Active"
      : "Pending";

  return (
    <main className="role-dashboard-page">
      <div className="role-dashboard-container">
        <header className="role-dashboard-topbar">
          <Link
            to="/"
            className="role-dashboard-brand"
          >
            <span className="role-dashboard-brand-icon">
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

          <div className="role-dashboard-user-actions">
            <span className="role-dashboard-user-name">
              {user?.firstName}{" "}
              {user?.lastName}
            </span>

            <Link
              to="/"
              className="role-dashboard-home-link"
            >
              Home
            </Link>

            <button
              type="button"
              className="role-dashboard-logout-button"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </header>

        {error && (
          <p
            className="role-dashboard-error"
            role="alert"
          >
            {error}
          </p>
        )}

        <section className="role-dashboard-hero">
          <div>
            <p className="role-dashboard-eyebrow">
              Club Organizer Dashboard
            </p>

            <h1>
              Welcome,{" "}
              <span>
                {user?.firstName ||
                  "Organizer"}
              </span>
            </h1>

            <p className="role-dashboard-hero-description">
              Manage college soccer teams, review
              verified player registrations, and
              oversee recruitment activity across
              the club.
            </p>
          </div>

          <span className="role-dashboard-role-badge">
            Organizer Account
          </span>
        </section>

        <section className="role-dashboard-stats-grid">
          <article className="role-dashboard-stat-card">
            <span>Total Teams</span>

            <strong>
              {dashboard.summary.totalTeams}
            </strong>

            <small>
              Registered soccer teams
            </small>
          </article>

          <article className="role-dashboard-stat-card">
            <span>Verified Players</span>

            <strong>
              {dashboard.summary
                .verifiedPlayers}
            </strong>

            <small>
              Registered verified players
            </small>
          </article>

          <article className="role-dashboard-stat-card">
            <span>Coaches</span>

            <strong>
              {dashboard.summary.coaches}
            </strong>

            <small>
              Registered coach accounts
            </small>
          </article>

          <article className="role-dashboard-stat-card">
            <span>Open Invitations</span>

            <strong>
              {dashboard.summary
                .openInvitations}
            </strong>

            <small>
              Pending recruitment activity
            </small>
          </article>
        </section>

        <div className="role-dashboard-main-grid">
          <section className="role-dashboard-panel">
            <div className="role-dashboard-panel-heading">
              <div>
                <p>Administration</p>
                <h2>Quick Actions</h2>
              </div>
            </div>

            <div className="role-dashboard-quick-actions">
              <Link
                to="/teams/create"
                className="role-dashboard-action-card"
              >
                <span className="role-dashboard-action-icon">
                  ➕
                </span>

                <span>
                  <strong>Create Team</strong>

                  <small>
                    Register a new college or
                    intramural team.
                  </small>
                </span>
              </Link>

              <Link
                to="/teams"
                className="role-dashboard-action-card"
              >
                <span className="role-dashboard-action-icon">
                  🛡️
                </span>

                <span>
                  <strong>Manage Teams</strong>

                  <small>
                    Edit team information and
                    review rosters.
                  </small>
                </span>
              </Link>

              <Link
                to="/players"
                className="role-dashboard-action-card"
              >
                <span className="role-dashboard-action-icon">
                  👥
                </span>

                <span>
                  <strong>
                    Verified Players
                  </strong>

                  <small>
                    Review all registered and
                    verified players.
                  </small>
                </span>
              </Link>

              <Link
                to="/dashboard/recruitment"
                className="role-dashboard-action-card"
              >
                <span className="role-dashboard-action-icon">
                  📊
                </span>

                <span>
                  <strong>
                    Recruitment Activity
                  </strong>

                  <small>
                    Monitor scouting and tryout
                    invitation activity.
                  </small>
                </span>
              </Link>
            </div>
          </section>

          <section className="role-dashboard-panel">
            <div className="role-dashboard-panel-heading">
              <div>
                <p>Club Status</p>

                <h2>
                  Management Overview
                </h2>
              </div>
            </div>

            <div className="role-dashboard-list">
              <div className="role-dashboard-list-item">
                <div>
                  <strong>
                    Team registration
                  </strong>

                  <span>
                    {dashboard.summary.totalTeams >
                    0
                      ? `${dashboard.summary.totalTeams} team account${
                          dashboard.summary
                            .totalTeams === 1
                            ? ""
                            : "s"
                        } registered.`
                      : "No teams have been created yet."}
                  </span>
                </div>

                <span className="role-dashboard-status">
                  {teamStatus}
                </span>
              </div>

              <div className="role-dashboard-list-item">
                <div>
                  <strong>
                    Verified player records
                  </strong>

                  <span>
                    {
                      dashboard.summary
                        .verifiedPlayers
                    }{" "}
                    verified player
                    {dashboard.summary
                      .verifiedPlayers === 1
                      ? ""
                      : "s"}{" "}
                    registered.
                  </span>
                </div>

                <span className="role-dashboard-status">
                  Active
                </span>
              </div>

              <div className="role-dashboard-list-item">
                <div>
                  <strong>
                    Coach accounts
                  </strong>

                  <span>
                    {dashboard.summary.coaches}{" "}
                    coach account
                    {dashboard.summary.coaches ===
                    1
                      ? ""
                      : "s"}{" "}
                    active.
                  </span>
                </div>

                <span className="role-dashboard-status">
                  Active
                </span>
              </div>
            </div>
          </section>

          <section className="role-dashboard-panel full-width">
            <div className="role-dashboard-panel-heading">
              <div>
                <p>Teams</p>

                <h2>
                  Recently Created Teams
                </h2>
              </div>

              <Link to="/teams">
                View Teams →
              </Link>
            </div>

            {dashboard.recentTeams.length >
            0 ? (
              <div className="role-dashboard-list">
                {dashboard.recentTeams.map(
                  (team) => (
                    <div
                      key={team.teamId}
                      className="role-dashboard-list-item"
                    >
                      <div>
                        <strong>
                          {team.teamName}
                        </strong>

                        <span>
                          {team.division ||
                            "Division not assigned"}
                          {" • "}
                          Captain:{" "}
                          {team.captain
                            ? `${team.captain.firstName} ${team.captain.lastName}`
                            : "Not assigned"}
                          {" • "}
                          {team.rosterCount} player
                          {team.rosterCount === 1
                            ? ""
                            : "s"}
                        </span>
                      </div>

                      <span className="role-dashboard-status">
                        Active
                      </span>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="role-dashboard-empty-state">
                No teams have been created yet.
                Use Create Team to register the
                first soccer team.
              </div>
            )}
          </section>

          <section className="role-dashboard-panel full-width">
            <div className="role-dashboard-panel-heading">
              <div>
                <p>Registrations</p>

                <h2>
                  Recently Registered Players
                </h2>
              </div>

              <Link to="/players">
                View Players →
              </Link>
            </div>

            {dashboard.recentPlayers.length >
            0 ? (
              <div className="role-dashboard-list">
                {dashboard.recentPlayers.map(
                  (player) => (
                    <Link
                      key={player.playerId}
                      to={`/players/${player.playerId}`}
                      className="role-dashboard-list-item"
                    >
                      <div>
                        <strong>
                          {player.firstName}{" "}
                          {player.lastName}
                        </strong>

                        <span>
                          {player.primaryPosition}
                          {" • "}
                          {player.classYear}
                          {" • "}
                          {player.skillLevel}
                        </span>
                      </div>

                      <span className="role-dashboard-status">
                        {player.isVerified
                          ? "Verified"
                          : "Pending"}
                      </span>
                    </Link>
                  ),
                )}
              </div>
            ) : (
              <div className="role-dashboard-empty-state">
                No registered player profiles are
                currently available.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default OrganizerDashboardPage;