import { useEffect, useState } from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  addPlayerToScoutList,
} from "../services/scoutListService.js";

import {
  deletePlayerProfile,
  getPlayerById,
} from "../services/playerService.js";

import "../styles/playerDetails.css";

const DEFAULT_PLAYER_IMAGE =
  "/images/default-player-avatar.png";

const getAuthenticatedUser = () => {
  try {
    const storedUser =
      sessionStorage.getItem(
        "authenticatedUser"
      );

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    return null;
  }
};

function PlayerDetailsPage() {
  const { playerId } = useParams();
  const navigate = useNavigate();

  const authenticatedUser =
  getAuthenticatedUser();

  const isProfileOwner =
  authenticatedUser?.role === "Player" &&
  Number(authenticatedUser.playerId) ===
    Number(playerId);

  const [addingToScoutList, setAddingToScoutList] =
  useState(false);

const [scoutListSuccess, setScoutListSuccess] =
  useState("");

const [scoutListError, setScoutListError] =
  useState("");

const [isAddedToScoutList, setIsAddedToScoutList] =
  useState(false);

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  const [showDeleteModal, setShowDeleteModal] =
  useState(false);

const [deleting, setDeleting] =
  useState(false);

const [deleteError, setDeleteError] =
  useState("");

const handleLogout = () => {
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("authenticatedUser");
  sessionStorage.removeItem("createdPlayerAccount");

  navigate("/login", {
    replace: true,
  });
};

const handleAddToScoutList = async () => {
  try {
    setAddingToScoutList(true);
    setScoutListSuccess("");
    setScoutListError("");

    const result =
      await addPlayerToScoutList({
        playerId: Number(playerId),
        status: "Interested",
        scoutingNotes: "",
      });

    setScoutListSuccess(result.message);
    setIsAddedToScoutList(true);
  } catch (requestError) {
    const message =
      requestError.message ||
      "Unable to add this player to your scout list.";

    setScoutListError(message);

    if (
      message
        .toLowerCase()
        .includes("already on your scout list")
    ) {
      setIsAddedToScoutList(true);
    }
  } finally {
    setAddingToScoutList(false);
  }
};

const handleDeleteProfile = async () => {
  try {
    setDeleting(true);
    setDeleteError("");

    const result =
      await deletePlayerProfile(playerId);

    sessionStorage.removeItem(
      "createdPlayerAccount",
    );

    setShowDeleteModal(false);

    alert(result.message);

    navigate("/");
  } catch (requestError) {
    setDeleteError(
      requestError.message ||
        "Unable to delete the player profile.",
    );
  } finally {
    setDeleting(false);
  }
};

  useEffect(() => {
    const loadPlayer = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getPlayerById(playerId);

        setPlayer(result.data);
      } catch (requestError) {
        setError(
          requestError.message ||
            "Unable to load the player profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPlayer();
  }, [playerId]);

  if (loading) {
    return (
      <main className="player-details-state-page">
        <section className="player-details-state-card">
          <div className="player-loading-spinner" />

          <h1>Loading Player Profile</h1>

          <p>
            Retrieving verified player information.
          </p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="player-details-state-page">
        <section className="player-details-state-card">
          <h1>Unable to Load Player</h1>

          <p className="player-details-error">
            {error}
          </p>

          <Link
            to="/players"
            className="player-state-link"
          >
            Browse Players
          </Link>
        </section>
      </main>
    );
  }

  if (!player) {
    return (
      <main className="player-details-state-page">
        <section className="player-details-state-card">
          <h1>Player Not Found</h1>

          <p>
            The requested player profile does not
            exist.
          </p>

          <Link
            to="/players"
            className="player-state-link"
          >
            Browse Players
          </Link>
        </section>
      </main>
    );
  }

  const playerImage =
    !imageError && player.profileImage
      ? player.profileImage
      : DEFAULT_PLAYER_IMAGE;

  return (
    <main className="player-details-page">
      <div className="player-details-container">
        <header className="player-dashboard-topbar">
  <Link
    to="/"
    className="player-dashboard-brand"
  >
    <span className="player-dashboard-brand-icon">
      ⚽
    </span>

    <span>
      <strong>College Soccer</strong>
      <small>Scout Helper</small>
    </span>
  </Link>

 <div className="player-dashboard-user-actions">
  {authenticatedUser ? (
    <>
      <span className="player-dashboard-user-name">
        {authenticatedUser.firstName}{" "}
        {authenticatedUser.lastName}
      </span>

      {authenticatedUser.role === "Coach" && (
        <Link
          to="/dashboard/coach"
          className="player-dashboard-home-link"
        >
          Dashboard
        </Link>
      )}

      {authenticatedUser.role === "Organizer" && (
        <Link
          to="/dashboard/organizer"
          className="player-dashboard-home-link"
        >
          Dashboard
        </Link>
      )}

      {authenticatedUser.role === "Player" &&
        authenticatedUser.playerId && (
          <Link
            to={`/players/${authenticatedUser.playerId}`}
            className="player-dashboard-home-link"
          >
            Dashboard
          </Link>
        )}

      <Link
        to="/"
        className="player-dashboard-home-link"
      >
        Home
      </Link>

      <button
        type="button"
        className="player-dashboard-logout-button"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </>
  ) : (
    <>
      <Link
        to="/players"
        className="player-dashboard-home-link"
      >
        Continue Browsing Players
      </Link>

      <Link
        to="/"
        className="player-dashboard-home-link"
      >
        Back Home
      </Link>
    </>
  )}
</div>
</header>

        <section className="player-profile-hero">
          <div className="player-profile-image-wrapper">
            <img
              src={playerImage}
              alt={`${player.firstName} ${player.lastName}`}
              className="player-profile-image"
              onError={() => setImageError(true)}
            />

            {player.isVerified && (
              <span className="player-image-verified-badge">
                ✓ Verified
              </span>
            )}
          </div>

          <div className="player-profile-introduction">
            <p className="player-profile-eyebrow">
              Student Player Dashboard
            </p>

            <div className="player-name-row">
              <h1>
                {player.firstName}{" "}
                <span>{player.lastName}</span>
              </h1>

              {player.isVerified && (
                <span className="player-verified-label">
                  ✓ Verified Profile
                </span>
              )}
            </div>

            <p className="player-profile-summary">
              {player.primaryPosition}
              {" • "}
              {player.classYear}
              {" • "}
              {player.skillLevel}
            </p>

            <div className="player-profile-tags">
              <span>
                ⚽ {player.primaryPosition}
              </span>

              <span>
                Preferred Foot:{" "}
                {player.preferredFoot}
              </span>

              <span
                className={`availability-tag availability-${player.availability
                  ?.toLowerCase()
                  .replaceAll(" ", "-")}`}
              >
                {player.availability}
              </span>
            </div>

            {isProfileOwner && (
  <div className="player-profile-actions">
    <Link
      to={`/players/${player.playerId}/edit`}
      className="player-edit-action"
    >
      Edit Profile
    </Link>

    <button
      type="button"
      className="player-delete-action"
      onClick={() => {
        setDeleteError("");
        setShowDeleteModal(true);
      }}
    >
      Delete Profile
    </button>
  </div>
)}
{authenticatedUser?.role === "Coach" && (
  <div className="player-profile-actions">
    <button
      type="button"
      className="player-scout-action"
      disabled={
        addingToScoutList ||
        isAddedToScoutList
      }
      onClick={handleAddToScoutList}
    >
      {addingToScoutList
        ? "Adding to Scout List..."
        : isAddedToScoutList
          ? "Added to Scout List"
          : "Add to Scout List"}
    </button>
  </div>
)}

{scoutListSuccess && (
  <p
    className="player-scout-success"
    role="status"
  >
    {scoutListSuccess}
  </p>
)}

{scoutListError && (
  <p
    className="player-scout-error"
    role="alert"
  >
    {scoutListError}
  </p>
)}
          </div>
        </section>

        <section className="player-statistics-section">
          <div className="player-section-heading">
            <div>
              <p>Performance</p>
              <h2>Career Statistics</h2>
            </div>

            <span>
              Verified registry statistics
            </span>
          </div>

          <div className="player-statistics-grid">
            <article>
              <strong>
                {player.statistics.goals}
              </strong>
              <span>Goals</span>
            </article>

            <article>
              <strong>
                {player.statistics.assists}
              </strong>
              <span>Assists</span>
            </article>

            <article>
              <strong>
                {player.statistics.cleanSheets}
              </strong>
              <span>Clean Sheets</span>
            </article>

            <article>
              <strong>
                {player.statistics.gamesPlayed}
              </strong>
              <span>Games Played</span>
            </article>
          </div>
        </section>

        <div className="player-details-content-grid">
          <section className="player-details-panel">
            <div className="player-section-heading compact">
              <div>
                <p>About</p>
                <h2>Player Biography</h2>
              </div>
            </div>

            <p className="player-biography">
              {player.biography ||
                "This player has not added a biography yet."}
            </p>
          </section>

          <section className="player-details-panel">
            <div className="player-section-heading compact">
              <div>
                <p>Registry</p>
                <h2>
                  Verified Soccer Information
                </h2>
              </div>

              <span className="locked-information-label">
                🔒 Locked
              </span>
            </div>

            <div className="player-information-list">
              <div>
                <span>Primary Position</span>
                <strong>
                  {player.primaryPosition}
                </strong>
              </div>

              <div>
                <span>Secondary Position</span>
                <strong>
                  {player.secondaryPosition ||
                    "None"}
                </strong>
              </div>

              <div>
                <span>Preferred Foot</span>
                <strong>
                  {player.preferredFoot}
                </strong>
              </div>

              <div>
                <span>Skill Level</span>
                <strong>
                  {player.skillLevel}
                </strong>
              </div>

              <div>
                <span>Class Year</span>
                <strong>
                  {player.classYear}
                </strong>
              </div>

              <div>
                <span>Verification</span>
                <strong>
                  {player.isVerified
                    ? "Verified"
                    : "Not Verified"}
                </strong>
              </div>
            </div>
          </section>

          <section className="player-details-panel">
            <div className="player-section-heading compact">
              <div>
                <p>Recruitment</p>
                <h2>Scouting Status</h2>
              </div>
            </div>

            <div className="scouting-empty-state">
              <span>☆</span>

              <div>
                <h3>
                  No Scouting Activity Yet
                </h3>

                <p>
                  Team interest, scouting status,
                  and recruitment progress will
                  appear here.
                </p>
              </div>
            </div>
          </section>

          <section className="player-details-panel">
            <div className="player-section-heading compact">
              <div>
                <p>Team Details</p>
                <h2>
                  Current Team and Availability
                </h2>
              </div>
            </div>

            <div className="player-team-information">
              <div>
                <span>Current Team</span>

                <strong>
                  {player.team
                    ? player.team.teamName
                    : "Unassigned"}
                </strong>
              </div>

              <div>
                <span>Division</span>

                <strong>
                  {player.team?.division ||
                    "Not assigned"}
                </strong>
              </div>

              <div>
                <span>Availability</span>

                <strong>
                  {player.availability}
                </strong>
              </div>
            </div>
          </section>
        </div>

        <section className="player-invitations-section">
          <div className="player-section-heading">
            <div>
              <p>Recruitment</p>
              <h2>
                Recent Tryout Invitations
              </h2>
            </div>
          </div>

          <div className="player-invitations-empty">
            <span>📅</span>

            <div>
              <h3>No Invitations Yet</h3>

              <p>
                Tryout invitations sent by teams
                will appear in this section.
              </p>
            </div>
          </div>
        </section>
      </div>
      {showDeleteModal && (
  <div
    className="delete-profile-modal-overlay"
    role="presentation"
    onMouseDown={(event) => {
      if (
        event.target === event.currentTarget &&
        !deleting
      ) {
        setShowDeleteModal(false);
      }
    }}
  >
    <section
      className="delete-profile-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-profile-title"
    >
      <div className="delete-profile-warning-icon">
        !
      </div>

      <h2 id="delete-profile-title">
        Delete Player Profile?
      </h2>

      <p>
        This will permanently delete your player
        account, profile information, statistics,
        scouting records, and tryout invitations.
      </p>

      <p className="delete-profile-warning-text">
        This action cannot be undone.
      </p>

      {deleteError && (
        <p
          className="delete-profile-modal-error"
          role="alert"
        >
          {deleteError}
        </p>
      )}

      <div className="delete-profile-modal-actions">
        <button
          type="button"
          className="delete-profile-cancel-button"
          disabled={deleting}
          onClick={() => {
            setShowDeleteModal(false);
          }}
        >
          Cancel
        </button>

        <button
          type="button"
          className="delete-profile-confirm-button"
          disabled={deleting}
          onClick={handleDeleteProfile}
        >
          {deleting
            ? "Deleting Profile..."
            : "Yes, Delete Profile"}
        </button>
      </div>
    </section>
  </div>
)}
    </main>
  );
}

export default PlayerDetailsPage;