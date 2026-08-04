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
  getPlayerById,
  updatePlayerProfile,
} from "../services/playerService.js";

import "../styles/editPlayer.css";

function EditPlayerPage() {
  const { playerId } = useParams();
  const navigate = useNavigate();

  const [player, setPlayer] = useState(null);

  const [formData, setFormData] = useState({
    profileImage: "",
    biography: "",
    availability: "Available",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    const loadPlayer = async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await getPlayerById(playerId);

        setPlayer(result.data);

        setFormData({
          profileImage:
            result.data.profileImage || "",
          biography:
            result.data.biography || "",
          availability:
            result.data.availability ||
            "Available",
        });
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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.biography.trim()) {
      return "Player biography is required.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      setSuccessMessage("");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");

      const result =
        await updatePlayerProfile(
          playerId,
          {
            profileImage:
              formData.profileImage,
            biography:
              formData.biography,
            availability:
              formData.availability,
          },
        );

      setSuccessMessage(result.message);

      setTimeout(() => {
        navigate(`/players/${playerId}`);
      }, 1200);
    } catch (submissionError) {
      setSuccessMessage("");

      setError(
        submissionError.message ||
          "Unable to update the player profile.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="edit-player-state-page">
        <section className="edit-player-state-card">
          <div className="edit-player-spinner" />

          <h1>Loading Profile</h1>

          <p>
            Retrieving the player information.
          </p>
        </section>
      </main>
    );
  }

  if (error && !player) {
    return (
      <main className="edit-player-state-page">
        <section className="edit-player-state-card">
          <h1>Unable to Load Profile</h1>

          <p className="edit-player-error">
            {error}
          </p>

          <Link
            to={`/players/${playerId}`}
            className="edit-player-state-link"
          >
            Back to Player Profile
          </Link>
        </section>
      </main>
    );
  }

  if (!player) {
    return (
      <main className="edit-player-state-page">
        <section className="edit-player-state-card">
          <h1>Player Not Found</h1>

          <Link
            to="/players"
            className="edit-player-state-link"
          >
            Browse Players
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="edit-player-page">
      <div className="edit-player-container">
        <Link
          to={`/players/${playerId}`}
          className="edit-player-back-link"
        >
          <span>←</span>
          Back to Player Profile
        </Link>

        <section className="edit-player-card">
          <header className="edit-player-header">
            <div className="edit-player-header-icon">
              ⚽
            </div>

            <div>
              <p className="edit-player-eyebrow">
                Player Profile Management
              </p>

              <h1>
                Edit Your{" "}
                <span>Player Profile</span>
              </h1>

              <p>
                Update your profile image,
                biography, and availability.
                Verified soccer information
                remains locked.
              </p>
            </div>
          </header>

          <section className="edit-player-summary">
            <div className="edit-player-image-wrapper">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt={`${player.firstName} ${player.lastName}`}
                  className="edit-player-image"
                />
              ) : (
                <div className="edit-player-image-placeholder">
                  ⚽
                </div>
              )}
            </div>

            <div className="edit-player-summary-content">
              <span className="edit-player-verified-badge">
                ✓ Verified Profile
              </span>

              <h2>
                {player.firstName}{" "}
                {player.lastName}
              </h2>

              <p>
                {player.primaryPosition}
                {" • "}
                {player.classYear}
                {" • "}
                {player.skillLevel}
              </p>

              <div className="edit-player-locked-grid">
                <div>
                  <span>
                    Primary Position
                  </span>

                  <strong>
                    {player.primaryPosition}
                  </strong>
                </div>

                <div>
                  <span>
                    Preferred Foot
                  </span>

                  <strong>
                    {player.preferredFoot}
                  </strong>
                </div>

                <div>
                  <span>
                    Skill Level
                  </span>

                  <strong>
                    {player.skillLevel}
                  </strong>
                </div>

                <div>
                  <span>
                    Statistics
                  </span>

                  <strong>
                    Verified and locked
                  </strong>
                </div>
              </div>
            </div>
          </section>

          <form
            className="edit-player-form"
            onSubmit={handleSubmit}
          >
            <section className="edit-player-form-section">
              <div className="edit-player-section-heading">
                <span>01</span>

                <div>
                  <h2>Editable Information</h2>

                  <p>
                    These fields can be changed
                    whenever your profile needs
                    updating.
                  </p>
                </div>
              </div>

              <div className="edit-player-form-group">
                <label htmlFor="profileImage">
                  Profile Image URL
                </label>

                <input
                  id="profileImage"
                  name="profileImage"
                  type="url"
                  value={
                    formData.profileImage
                  }
                  onChange={handleChange}
                  placeholder="https://example.com/player-photo.jpg"
                />
              </div>

              <div className="edit-player-form-group">
                <label htmlFor="biography">
                  Player Biography
                </label>

                <textarea
                  id="biography"
                  name="biography"
                  rows="6"
                  value={formData.biography}
                  onChange={handleChange}
                  placeholder="Describe your soccer experience, strengths, playing style, and goals."
                  required
                />
              </div>

              <div className="edit-player-form-group">
                <label htmlFor="availability">
                  Availability
                </label>

                <select
                  id="availability"
                  name="availability"
                  value={
                    formData.availability
                  }
                  onChange={handleChange}
                >
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
            </section>

            {successMessage && (
              <p
                className="edit-player-success"
                role="status"
              >
                {successMessage}
              </p>
            )}

            {error && (
              <p
                className="edit-player-error-message"
                role="alert"
              >
                {error}
              </p>
            )}

            <div className="edit-player-submit-area">
              <Link
                to={`/players/${playerId}`}
                className="edit-player-cancel-button"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="edit-player-save-button"
              >
                {submitting
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default EditPlayerPage;