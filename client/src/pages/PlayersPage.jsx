import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getPlayers,
} from "../services/playerService.js";

import "../styles/players.css";

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

function PlayersPage() {
  const navigate = useNavigate();

  const authenticatedUser =
    getAuthenticatedUser();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    position: "",
    classYear: "",
    skillLevel: "",
    availability: "",
    sortBy: "newest",
    sortOrder: "desc",
  });

  const [appliedFilters, setAppliedFilters] =
    useState(filters);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getPlayers(
          appliedFilters,
        );

        setPlayers(result.data);
      } catch (requestError) {
        setError(
          requestError.message ||
            "Unable to load players.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, [appliedFilters]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setAppliedFilters({
      ...filters,
      search: filters.search.trim(),
    });
  };

  const handleReset = () => {
    const emptyFilters = {
      search: "",
      position: "",
      classYear: "",
      skillLevel: "",
      availability: "",
      sortBy: "newest",
      sortOrder: "desc",
    };

    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

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

  const getDashboardLink = () => {
    if (
      authenticatedUser?.role === "Player" &&
      authenticatedUser.playerId
    ) {
      return `/players/${authenticatedUser.playerId}`;
    }

    if (
      authenticatedUser?.role === "Coach"
    ) {
      return "/dashboard/coach";
    }

    if (
      authenticatedUser?.role === "Organizer"
    ) {
      return "/dashboard/organizer";
    }

    return "/";
  };

  return (
    <main className="players-page">
      <div className="players-container">
        <header className="players-topbar">
          <Link
            to="/"
            className="players-brand"
          >
            <span className="players-brand-icon">
              ⚽
            </span>

            <span>
              <strong>
                College Soccer
              </strong>
              <small>Scout Helper</small>
            </span>
          </Link>

         <div className="players-topbar-actions">
  {authenticatedUser ? (
    <>
      <span className="players-user-name">
        {authenticatedUser.firstName}{" "}
        {authenticatedUser.lastName}
      </span>

      <Link
        to={getDashboardLink()}
        className="players-dashboard-link"
      >
        Dashboard
      </Link>

      <Link
        to="/"
        className="players-home-link"
      >
        Home
      </Link>

      <button
        type="button"
        className="players-logout-button"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </>
  ) : (
    <>
      <span className="players-visitor-label">
        Guest Visitor
      </span>

      <Link
        to="/players"
        className="players-dashboard-link"
      >
        Continue Browsing Players
      </Link>

      <Link
        to="/"
        className="players-home-link"
      >
        Back Home
      </Link>

      <Link
        to="/login"
        className="players-login-link"
      >
        Log In
      </Link>
    </>
  )}
</div>
        </header>

        <section className="players-hero">
          <div>
            <p className="players-eyebrow">
              Verified Student Athletes
            </p>

            <h1>
              Browse <span>Players</span>
            </h1>

            <p>
              Search and evaluate verified college
              soccer players using position, class
              year, skill level, availability, and
              performance statistics.
            </p>
          </div>

          <span className="players-count-badge">
            {loading
              ? "Loading..."
              : `${players.length} ${
                  players.length === 1
                    ? "Player"
                    : "Players"
                }`}
          </span>
        </section>

        <form
          className="players-filter-panel"
          onSubmit={handleSubmit}
        >
          <div className="players-search-group">
            <label htmlFor="search">
              Search Player
            </label>

            <input
              id="search"
              name="search"
              type="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search by first or last name"
            />
          </div>

          <div className="players-filter-grid">
            <div>
              <label htmlFor="position">
                Position
              </label>

              <select
                id="position"
                name="position"
                value={filters.position}
                onChange={handleChange}
              >
                <option value="">
                  All Positions
                </option>
                <option value="Goalkeeper">
                  Goalkeeper
                </option>
                <option value="Defender">
                  Defender
                </option>
                <option value="Center Back">
                  Center Back
                </option>
                <option value="Outside Back">
                  Outside Back
                </option>
                <option value="Midfielder">
                  Midfielder
                </option>
                <option value="Defensive Midfielder">
                  Defensive Midfielder
                </option>
                <option value="Attacking Midfielder">
                  Attacking Midfielder
                </option>
                <option value="Forward">
                  Forward
                </option>
                <option value="Winger">
                  Winger
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="classYear">
                Class Year
              </label>

              <select
                id="classYear"
                name="classYear"
                value={filters.classYear}
                onChange={handleChange}
              >
                <option value="">
                  All Class Years
                </option>
                <option value="Freshman">
                  Freshman
                </option>
                <option value="Sophomore">
                  Sophomore
                </option>
                <option value="Junior">
                  Junior
                </option>
                <option value="Senior">
                  Senior
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="skillLevel">
                Skill Level
              </label>

              <select
                id="skillLevel"
                name="skillLevel"
                value={filters.skillLevel}
                onChange={handleChange}
              >
                <option value="">
                  All Skill Levels
                </option>
                <option value="Beginner">
                  Beginner
                </option>
                <option value="Intermediate">
                  Intermediate
                </option>
                <option value="Advanced">
                  Advanced
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="availability">
                Availability
              </label>

              <select
                id="availability"
                name="availability"
                value={filters.availability}
                onChange={handleChange}
              >
                <option value="">
                  All Availability
                </option>
                <option value="Available">
                  Available
                </option>
                <option value="Limited Availability">
                  Limited Availability
                </option>
                <option value="Unavailable">
                  Unavailable
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="sortBy">
                Sort By
              </label>

              <select
                id="sortBy"
                name="sortBy"
                value={filters.sortBy}
                onChange={handleChange}
              >
                <option value="newest">
                  Newest
                </option>
                <option value="name">
                  Player Name
                </option>
                <option value="goals">
                  Goals
                </option>
                <option value="assists">
                  Assists
                </option>
                <option value="gamesPlayed">
                  Games Played
                </option>
                <option value="skillLevel">
                  Skill Level
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="sortOrder">
                Order
              </label>

              <select
                id="sortOrder"
                name="sortOrder"
                value={filters.sortOrder}
                onChange={handleChange}
              >
                <option value="desc">
                  Highest / Newest
                </option>
                <option value="asc">
                  Lowest / Oldest
                </option>
              </select>
            </div>
          </div>

          <div className="players-filter-actions">
            <button
              type="button"
              className="players-reset-button"
              onClick={handleReset}
            >
              Reset Filters
            </button>

            <button
              type="submit"
              className="players-apply-button"
            >
              Apply Filters
            </button>
          </div>
        </form>

        {error && (
          <p
            className="players-error-message"
            role="alert"
          >
            {error}
          </p>
        )}

        {loading ? (
          <section className="players-loading-state">
            <div className="players-spinner" />
            <h2>Loading Players</h2>
            <p>
              Retrieving verified player profiles.
            </p>
          </section>
        ) : players.length === 0 ? (
          <section className="players-empty-state">
            <span>🔎</span>
            <h2>No Players Found</h2>
            <p>
              No registered players match the
              selected search and filter options.
            </p>

            <button
              type="button"
              onClick={handleReset}
            >
              Clear Filters
            </button>
          </section>
        ) : (
          <section className="players-results-section">
            <div className="players-results-heading">
              <div>
                <p>Recruitment Directory</p>
                <h2>Registered Players</h2>
              </div>

              <span>
                Showing {players.length} result
                {players.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="players-card-grid">
              {players.map((player) => (
                <article
                  key={player.playerId}
                  className="players-card"
                >
                  <div className="players-card-image-wrapper">
                    <img
                      src={
                        player.profileImage ||
                        DEFAULT_PLAYER_IMAGE
                      }
                      alt={`${player.firstName} ${player.lastName}`}
                      className="players-card-image"
                      onError={(event) => {
                        event.currentTarget.src =
                          DEFAULT_PLAYER_IMAGE;
                      }}
                    />

                    {player.isVerified && (
                      <span className="players-verified-badge">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <div className="players-card-content">
                    <div className="players-card-header">
                      <div>
                        <h3>
                          {player.firstName}{" "}
                          <span>
                            {player.lastName}
                          </span>
                        </h3>

                        <p>
                          {player.primaryPosition}
                          {" • "}
                          {player.classYear}
                        </p>
                      </div>

                      <span className="players-skill-badge">
                        {player.skillLevel}
                      </span>
                    </div>

                    <div className="players-card-tags">
                      <span>
                        {player.preferredFoot} Foot
                      </span>

                      <span
                        className={`players-availability players-availability-${player.availability
                          ?.toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {player.availability}
                      </span>
                    </div>

                    <div className="players-card-stats">
                      <div>
                        <strong>
                          {player.statistics.goals}
                        </strong>
                        <span>Goals</span>
                      </div>

                      <div>
                        <strong>
                          {player.statistics.assists}
                        </strong>
                        <span>Assists</span>
                      </div>

                      <div>
                        <strong>
                          {
                            player.statistics
                              .gamesPlayed
                          }
                        </strong>
                        <span>Games</span>
                      </div>
                    </div>

                    <Link
                      to={`/players/${player.playerId}`}
                      className="players-view-profile-button"
                    >
                      View Player Profile
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default PlayersPage;