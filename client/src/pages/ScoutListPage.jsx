import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getScoutList,
  removeScoutListEntry,
  updateScoutListEntry,
} from "../services/scoutListService.js";

import "../styles/scoutList.css";

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

function ScoutListPage() {
  const navigate = useNavigate();
  const user = getAuthenticatedUser();

  const [entries, setEntries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [savingId, setSavingId] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  const loadScoutList = async () => {
    try {
      setLoading(true);
      setError("");

      const result =
        await getScoutList();

      setEntries(result.data || []);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to load the scout list.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScoutList();
  }, []);

  const handleFieldChange = (
    scoutId,
    field,
    value,
  ) => {
    setEntries((currentEntries) =>
      currentEntries.map((entry) =>
        entry.scoutId === scoutId
          ? {
              ...entry,
              [field]: value,
            }
          : entry,
      ),
    );
  };

  const handleSave = async (entry) => {
    try {
      setSavingId(entry.scoutId);
      setError("");
      setSuccessMessage("");

      const result =
        await updateScoutListEntry(
          entry.scoutId,
          {
            status: entry.status,
            scoutingNotes:
              entry.scoutingNotes,
          },
        );

      setSuccessMessage(result.message);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to update scouting information.",
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleRemove = async (entry) => {
    const confirmed = window.confirm(
      `Remove ${entry.player.firstName} ${entry.player.lastName} from your scout list?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(entry.scoutId);
      setError("");
      setSuccessMessage("");

      const result =
        await removeScoutListEntry(
          entry.scoutId,
        );

      setEntries((currentEntries) =>
        currentEntries.filter(
          (currentEntry) =>
            currentEntry.scoutId !==
            entry.scoutId,
        ),
      );

      setSuccessMessage(result.message);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to remove the player.",
      );
    } finally {
      setDeletingId(null);
    }
  };

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
    <main className="scout-list-page">
      <div className="scout-list-container">
        <header className="scout-list-topbar">
          <Link
            to="/"
            className="scout-list-brand"
          >
            <span className="scout-list-brand-icon">
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

          <div className="scout-list-user-actions">
            <span>
              {user?.firstName}{" "}
              {user?.lastName}
            </span>

            <Link to="/dashboard/coach">
              Dashboard
            </Link>

            <Link to="/players">
              Browse Players
            </Link>

            <button
              type="button"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </header>

        <section className="scout-list-hero">
          <div>
            <p>Coach Recruitment Workspace</p>

            <h1>
              Your <span>Scout List</span>
            </h1>

            <p>
              Review saved players, update
              scouting progress, and record
              evaluation notes.
            </p>
          </div>

          <span className="scout-list-count">
            {entries.length}{" "}
            {entries.length === 1
              ? "Player"
              : "Players"}
          </span>
        </section>

        {successMessage && (
          <p className="scout-list-success">
            {successMessage}
          </p>
        )}

        {error && (
          <p className="scout-list-error">
            {error}
          </p>
        )}

        {loading ? (
          <section className="scout-list-state">
            <div className="scout-list-spinner" />

            <h2>Loading Scout List</h2>
          </section>
        ) : entries.length === 0 ? (
          <section className="scout-list-state">
            <span>⭐</span>

            <h2>
              Your Scout List Is Empty
            </h2>

            <p>
              Browse verified players and save
              promising recruits for later review.
            </p>

            <Link to="/players">
              Browse Players
            </Link>
          </section>
        ) : (
          <section className="scout-list-grid">
            {entries.map((entry) => (
              <article
                key={entry.scoutId}
                className="scout-list-card"
              >
                <div className="scout-list-player-summary">
                  <img
                    src={
                      entry.player.profileImage ||
                      DEFAULT_PLAYER_IMAGE
                    }
                    alt={`${entry.player.firstName} ${entry.player.lastName}`}
                    onError={(event) => {
                      event.currentTarget.src =
                        DEFAULT_PLAYER_IMAGE;
                    }}
                  />

                  <div>
                    <span className="scout-list-verified">
                      ✓ Verified
                    </span>

                    <h2>
                      {entry.player.firstName}{" "}
                      <span>
                        {entry.player.lastName}
                      </span>
                    </h2>

                    <p>
                      {
                        entry.player
                          .primaryPosition
                      }
                      {" • "}
                      {entry.player.classYear}
                      {" • "}
                      {entry.player.skillLevel}
                    </p>

                    <div className="scout-list-player-stats">
                      <span>
                        <strong>
                          {
                            entry.player
                              .statistics.goals
                          }
                        </strong>
                        Goals
                      </span>

                      <span>
                        <strong>
                          {
                            entry.player
                              .statistics.assists
                          }
                        </strong>
                        Assists
                      </span>

                      <span>
                        <strong>
                          {
                            entry.player
                              .statistics
                              .gamesPlayed
                          }
                        </strong>
                        Games
                      </span>
                    </div>
                  </div>
                </div>

                <div className="scout-list-form">
                  <div>
                    <label
                      htmlFor={`status-${entry.scoutId}`}
                    >
                      Scouting Status
                    </label>

                    <select
                      id={`status-${entry.scoutId}`}
                      value={entry.status}
                      onChange={(event) => {
                        handleFieldChange(
                          entry.scoutId,
                          "status",
                          event.target.value,
                        );
                      }}
                    >
                      <option value="Interested">
                        Interested
                      </option>

                      <option value="Watching">
                        Watching
                      </option>

                      <option value="Contacted">
                        Contacted
                      </option>

                      <option value="Tryout Invited">
                        Tryout Invited
                      </option>

                      <option value="Added to Team">
                        Added to Team
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor={`notes-${entry.scoutId}`}
                    >
                      Scouting Notes
                    </label>

                    <textarea
                      id={`notes-${entry.scoutId}`}
                      rows="5"
                      value={
                        entry.scoutingNotes
                      }
                      onChange={(event) => {
                        handleFieldChange(
                          entry.scoutId,
                          "scoutingNotes",
                          event.target.value,
                        );
                      }}
                      placeholder="Record strengths, weaknesses, observations, and follow-up actions."
                    />
                  </div>
                </div>

                <div className="scout-list-card-actions">
                  <Link
                    to={`/players/${entry.player.playerId}`}
                  >
                    View Profile
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      handleSave(entry)
                    }
                    disabled={
                      savingId === entry.scoutId
                    }
                  >
                    {savingId === entry.scoutId
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    className="scout-list-remove-button"
                    onClick={() =>
                      handleRemove(entry)
                    }
                    disabled={
                      deletingId ===
                      entry.scoutId
                    }
                  >
                    {deletingId ===
                    entry.scoutId
                      ? "Removing..."
                      : "Remove"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default ScoutListPage;