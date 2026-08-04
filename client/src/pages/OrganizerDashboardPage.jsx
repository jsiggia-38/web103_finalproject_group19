import {
  Link,
  useNavigate,
} from "react-router-dom";

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

function OrganizerDashboardPage() {
  const navigate = useNavigate();
  const user = getAuthenticatedUser();

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem(
      "authenticatedUser",
    );

    navigate("/login", {
      replace: true,
    });
  };

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
            <strong>0</strong>
            <small>
              Registered soccer teams
            </small>
          </article>

          <article className="role-dashboard-stat-card">
            <span>Verified Players</span>
            <strong>1</strong>
            <small>
              Registered verified players
            </small>
          </article>

          <article className="role-dashboard-stat-card">
            <span>Coaches</span>
            <strong>1</strong>
            <small>
              Registered coach accounts
            </small>
          </article>

          <article className="role-dashboard-stat-card">
            <span>Open Invitations</span>
            <strong>0</strong>
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
                <h2>Management Overview</h2>
              </div>
            </div>

            <div className="role-dashboard-list">
              <div className="role-dashboard-list-item">
                <div>
                  <strong>
                    Team registration
                  </strong>

                  <span>
                    No teams have been created yet.
                  </span>
                </div>

                <span className="role-dashboard-status">
                  Pending
                </span>
              </div>

              <div className="role-dashboard-list-item">
                <div>
                  <strong>
                    Verified player records
                  </strong>

                  <span>
                    Daniel Smith is registered.
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
                    One coach account is active.
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
                <h2>Recently Created Teams</h2>
              </div>

              <Link to="/teams">
                View Teams →
              </Link>
            </div>

            <div className="role-dashboard-empty-state">
              No teams have been created yet. Use
              Create Team to register the first
              soccer team.
            </div>
          </section>

          <section className="role-dashboard-panel full-width">
            <div className="role-dashboard-panel-heading">
              <div>
                <p>Registrations</p>
                <h2>Recently Registered Players</h2>
              </div>

              <Link to="/players">
                View Players →
              </Link>
            </div>

            <div className="role-dashboard-list">
              <div className="role-dashboard-list-item">
                <div>
                  <strong>
                    Daniel Smith
                  </strong>

                  <span>
                    Midfielder • Senior • Advanced
                  </span>
                </div>

                <span className="role-dashboard-status">
                  Verified
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default OrganizerDashboardPage;