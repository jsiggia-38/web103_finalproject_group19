import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getCoachDashboard,
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
    scoutedPlayers: 0,
    pendingInvitations: 0,
    teamPlayers: 0,
    availablePlayers: 0,
  },
  currentTeam: null,
  recentlyScouted: [],
  recentInvitations: [],
};

function CoachDashboardPage() {
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
          await getCoachDashboard();

        setDashboard(
          result.data ||
            initialDashboardData,
        );
      } catch (requestError) {
        setError(
          requestError.message ||
            "Unable to load the Coach dashboard.",
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

            <h1>Loading Coach Dashboard</h1>

            <p>
              Retrieving your team and recruitment
              information.
            </p>
          </section>
        </div>
      </main>
    );
  }

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
              Team Captain / Coach Dashboard
            </p>

            <h1>
              Welcome,{" "}
              <span>
                {user?.firstName || "Coach"}
              </span>
            </h1>

            <p className="role-dashboard-hero-description">
              Discover verified players, organize
              your scout list, manage your team,
              and coordinate tryout invitations
              from one central workspace.
            </p>
          </div>

          <span className="role-dashboard-role-badge">
            Coach Account
          </span>
        </section>

        <section className="role-dashboard-stats-grid">
          <article className="role-dashboard-stat-card">
            <span>Scouted Players</span>

            <strong>
              {dashboard.summary
                .scoutedPlayers}
            </strong>

            <small>
              Players saved for review
            </small>
          </article>

          <article className="role-dashboard-stat-card">
            <span>
              Pending Invitations
            </span>

            <strong>
              {dashboard.summary
                .pendingInvitations}
            </strong>

            <small>
              Awaiting player response
            </small>
          </article>

          <article className="role-dashboard-stat-card">
            <span>Team Players</span>

            <strong>
              {dashboard.summary.teamPlayers}
            </strong>

            <small>
              Current registered roster
            </small>
          </article>

          <article className="role-dashboard-stat-card">
            <span>
              Available Players
            </span>

            <strong>
              {dashboard.summary
                .availablePlayers}
            </strong>

            <small>
              Verified players available now
            </small>
          </article>
        </section>

        <div className="role-dashboard-main-grid">
          <section className="role-dashboard-panel">
            <div className="role-dashboard-panel-heading">
              <div>
                <p>Recruitment Tools</p>
                <h2>Quick Actions</h2>
              </div>
            </div>

            <div className="role-dashboard-quick-actions">
              <Link
                to="/players"
                className="role-dashboard-action-card"
              >
                <span className="role-dashboard-action-icon">
                  🔎
                </span>

                <span>
                  <strong>
                    Browse Players
                  </strong>

                  <small>
                    Search and evaluate verified
                    student players.
                  </small>
                </span>
              </Link>

              <Link
                to="/scout-list"
                className="role-dashboard-action-card"
              >
                <span className="role-dashboard-action-icon">
                  ⭐
                </span>

                <span>
                  <strong>
                    Scout List
                  </strong>

                  <small>
                    Review saved players and
                    scouting notes.
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
                  <strong>
                    Manage Team
                  </strong>

                  <small>
                    Review team details and current
                    roster.
                  </small>
                </span>
              </Link>

              <Link
                to="/invitations"
                className="role-dashboard-action-card"
              >
                <span className="role-dashboard-action-icon">
                  📅
                </span>

                <span>
                  <strong>
                    Tryout Invitations
                  </strong>

                  <small>
                    Track invitations and player
                    responses.
                  </small>
                </span>
              </Link>
            </div>
          </section>

          <section className="role-dashboard-panel">
            <div className="role-dashboard-panel-heading">
              <div>
                <p>Team Overview</p>
                <h2>Current Team</h2>
              </div>
            </div>

            {dashboard.currentTeam ? (
              <div className="role-dashboard-list">
                <div className="role-dashboard-list-item">
                  <div>
                    <strong>
                      {
                        dashboard.currentTeam
                          .teamName
                      }
                    </strong>

                    <span>
                      {dashboard.currentTeam
                        .division ||
                        "Division not assigned"}
                    </span>
                  </div>

                  <span className="role-dashboard-status">
                    Active
                  </span>
                </div>

                <div className="role-dashboard-list-item">
                  <div>
                    <strong>
                      Practice Location
                    </strong>

                    <span>
                      {dashboard.currentTeam
                        .practiceLocation ||
                        "Not provided"}
                    </span>
                  </div>
                </div>

                <div className="role-dashboard-list-item">
                  <div>
                    <strong>
                      Practice Schedule
                    </strong>

                    <span>
                      {dashboard.currentTeam
                        .practiceSchedule ||
                        "Not provided"}
                    </span>
                  </div>
                </div>

                <div className="role-dashboard-list-item">
                  <div>
                    <strong>
                      Current Roster
                    </strong>

                    <span>
                      {
                        dashboard.currentTeam
                          .rosterCount
                      }{" "}
                      of{" "}
                      {dashboard.currentTeam
                        .maximumRosterSize ||
                        "No limit"}{" "}
                      players
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="role-dashboard-empty-state">
                You are not assigned to a team yet.
                A team can be created or assigned
                by a club organizer.
              </div>
            )}
          </section>

          <section className="role-dashboard-panel full-width">
            <div className="role-dashboard-panel-heading">
              <div>
                <p>Scouting Activity</p>

                <h2>
                  Recently Scouted Players
                </h2>
              </div>

              <Link to="/scout-list">
                View Scout List →
              </Link>
            </div>

            {dashboard.recentlyScouted.length >
            0 ? (
              <div className="role-dashboard-list">
                {dashboard.recentlyScouted.map(
                  (entry) => (
                    <Link
                      key={entry.scoutId}
                      to={`/players/${entry.playerId}`}
                      className="role-dashboard-list-item"
                    >
                      <div>
                        <strong>
                          {entry.firstName}{" "}
                          {entry.lastName}
                        </strong>

                        <span>
                          {entry.primaryPosition}
                          {" • "}
                          {entry.classYear}
                          {" • "}
                          {entry.skillLevel}
                        </span>
                      </div>

                      <span className="role-dashboard-status">
                        {entry.status}
                      </span>
                    </Link>
                  ),
                )}
              </div>
            ) : (
              <div className="role-dashboard-empty-state">
                No players have been added to your
                scout list yet. Browse verified
                players to begin recruiting.
              </div>
            )}
          </section>

          <section className="role-dashboard-panel full-width">
            <div className="role-dashboard-panel-heading">
              <div>
                <p>Recruitment</p>

                <h2>
                  Recent Tryout Invitations
                </h2>
              </div>

              <Link to="/invitations">
                View All →
              </Link>
            </div>

            {dashboard.recentInvitations.length >
            0 ? (
              <div className="role-dashboard-list">
                {dashboard.recentInvitations.map(
                  (invitation) => (
                    <div
                      key={
                        invitation.invitationId
                      }
                      className="role-dashboard-list-item"
                    >
                      <div>
                        <strong>
                          {invitation.firstName}{" "}
                          {invitation.lastName}
                        </strong>

                        <span>
                          {invitation.tryoutDate ||
                            "Date pending"}
                          {" • "}
                          {invitation.location ||
                            "Location pending"}
                        </span>
                      </div>

                      <span className="role-dashboard-status">
                        {invitation.status}
                      </span>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="role-dashboard-empty-state">
                No tryout invitations have been
                sent yet.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default CoachDashboardPage;