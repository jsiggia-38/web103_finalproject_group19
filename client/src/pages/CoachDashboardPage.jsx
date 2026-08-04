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

function CoachDashboardPage() {
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
            <strong>0</strong>
            <small>
              Players saved for review
            </small>
          </article>

          <article className="role-dashboard-stat-card">
            <span>Pending Invitations</span>
            <strong>0</strong>
            <small>
              Awaiting player response
            </small>
          </article>

          <article className="role-dashboard-stat-card">
            <span>Team Players</span>
            <strong>0</strong>
            <small>
              Current registered roster
            </small>
          </article>

          <article className="role-dashboard-stat-card">
            <span>Available Players</span>
            <strong>1</strong>
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

            <div className="role-dashboard-empty-state">
              You are not assigned to a team yet.
              A team can be created or assigned by
              a club organizer.
            </div>
          </section>

          <section className="role-dashboard-panel full-width">
            <div className="role-dashboard-panel-heading">
              <div>
                <p>Scouting Activity</p>
                <h2>Recently Scouted Players</h2>
              </div>

              <Link to="/scout-list">
                View Scout List →
              </Link>
            </div>

            <div className="role-dashboard-empty-state">
              No players have been added to your
              scout list yet. Browse verified
              players to begin recruiting.
            </div>
          </section>

          <section className="role-dashboard-panel full-width">
            <div className="role-dashboard-panel-heading">
              <div>
                <p>Recruitment</p>
                <h2>Recent Tryout Invitations</h2>
              </div>

              <Link to="/invitations">
                View All →
              </Link>
            </div>

            <div className="role-dashboard-empty-state">
              No tryout invitations have been sent
              yet.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default CoachDashboardPage;