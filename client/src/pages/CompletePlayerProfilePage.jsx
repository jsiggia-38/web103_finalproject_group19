import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signupVerifiedPlayer } from "../services/authService.js";

import "../styles/completePlayerProfile.css";

const getStoredVerifiedPlayer = () => {
  try {
    const storedPreview = sessionStorage.getItem(
      "playerVerificationPreview",
    );

    return storedPreview ? JSON.parse(storedPreview) : null;
  } catch (error) {
    console.error(
      "Unable to read the stored player verification preview:",
      error,
    );

    sessionStorage.removeItem("playerVerificationPreview");

    return null;
  }
};

function CompletePlayerProfilePage() {
  const navigate = useNavigate();

  const verifiedPlayer = getStoredVerifiedPlayer();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
    biography: "",
    availability: "Available",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      return "Email is required.";
    }

    if (!formData.email.includes("@")) {
      return "Enter a valid email address.";
    }

    if (formData.password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!formData.biography.trim()) {
      return "Biography is required.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setSuccessMessage("");
      return;
    }

    const verificationToken = sessionStorage.getItem(
      "playerVerificationToken",
    );

    if (!verificationToken) {
      setSuccessMessage("");
      setError(
        "Your verification session is missing. Please verify your identity again.",
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");

      const result = await signupVerifiedPlayer({
        verificationToken,
        email: formData.email,
        password: formData.password,
        profileImage: formData.profileImage,
        biography: formData.biography,
        availability: formData.availability,
      });

      setSuccessMessage(result.message);

      sessionStorage.setItem(
        "createdPlayerAccount",
        JSON.stringify(result.data),
      );

      sessionStorage.removeItem("playerVerificationToken");
      sessionStorage.removeItem("playerVerificationPreview");

      setTimeout(() => {
        navigate(`/players/${result.data.player.playerId}`);
      }, 1500);
    } catch (submissionError) {
      setSuccessMessage("");

      setError(
        submissionError.message ||
          "Unable to create the player profile.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!verifiedPlayer) {
    return (
      <main className="profile-access-page">
        <section className="profile-access-card">
          <h1>Verification Required</h1>

          <p>
            You must verify your player identity before completing a player
            profile.
          </p>

          <Link
            to="/signup/player-verification"
            className="profile-primary-link"
          >
            Verify Player Identity
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="complete-profile-page">
      <Link
        to="/signup/player-verification"
        className="profile-back-link"
      >
        <span>←</span>
        Back to Verification
      </Link>

      <section className="complete-profile-card">
        <header className="profile-page-header">
          <div className="profile-header-icon">⚽</div>

          <div>
            <p className="profile-eyebrow">
              Verified Player Registration
            </p>

            <h1>
              Complete Your <span>Player Profile</span>
            </h1>

            <p>
              Your verified soccer information is locked. Complete the
              remaining account and profile details below.
            </p>
          </div>
        </header>

        <section className="verified-summary">
          <div className="verified-summary-heading">
            <div>
              <span className="verified-badge">
                ✓ Verified
              </span>

              <h2>
                {verifiedPlayer.firstName} {verifiedPlayer.lastName}
              </h2>
            </div>

            <p>Demo College Soccer Registry</p>
          </div>

          <div className="verified-information-grid">
            <div>
              <span>Primary Position</span>
              <strong>
                {verifiedPlayer.primaryPosition}
              </strong>
            </div>

            <div>
              <span>Secondary Position</span>
              <strong>
                {verifiedPlayer.secondaryPosition || "None"}
              </strong>
            </div>

            <div>
              <span>Preferred Foot</span>
              <strong>
                {verifiedPlayer.preferredFoot}
              </strong>
            </div>

            <div>
              <span>Skill Level</span>
              <strong>
                {verifiedPlayer.skillLevel}
              </strong>
            </div>

            <div>
              <span>Class Year</span>
              <strong>
                {verifiedPlayer.classYear}
              </strong>
            </div>

            <div>
              <span>Games Played</span>
              <strong>
                {verifiedPlayer.gamesPlayed}
              </strong>
            </div>
          </div>

          <div className="verified-statistics-grid">
            <div>
              <strong>{verifiedPlayer.goals}</strong>
              <span>Goals</span>
            </div>

            <div>
              <strong>{verifiedPlayer.assists}</strong>
              <span>Assists</span>
            </div>

            <div>
              <strong>{verifiedPlayer.cleanSheets}</strong>
              <span>Clean Sheets</span>
            </div>

            <div>
              <strong>{verifiedPlayer.gamesPlayed}</strong>
              <span>Games Played</span>
            </div>
          </div>
        </section>

        <form
          className="complete-profile-form"
          onSubmit={handleSubmit}
        >
          <div className="profile-form-section">
            <div className="form-section-heading">
              <span>01</span>

              <div>
                <h2>Account Information</h2>

                <p>
                  Create the credentials you will use to access your account.
                </p>
              </div>
            </div>

            <div className="profile-form-grid">
              <div className="profile-form-group full-width">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="player@example.com"
                  required
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Enter password again"
                  required
                />
              </div>
            </div>
          </div>

          <div className="profile-form-section">
            <div className="form-section-heading">
              <span>02</span>

              <div>
                <h2>Profile Information</h2>

                <p>
                  Add information that helps coaches understand who you are.
                </p>
              </div>
            </div>

            <div className="profile-form-grid">
              <div className="profile-form-group full-width">
                <label htmlFor="profileImage">
                  Profile Image URL
                </label>

                <input
                  id="profileImage"
                  name="profileImage"
                  type="url"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="https://example.com/player-photo.jpg"
                />
              </div>

              <div className="profile-form-group full-width">
                <label htmlFor="biography">
                  Player Biography
                </label>

                <textarea
                  id="biography"
                  name="biography"
                  rows="5"
                  value={formData.biography}
                  onChange={handleChange}
                  placeholder="Describe your soccer experience, strengths, playing style, and goals."
                  required
                />
              </div>

              <div className="profile-form-group full-width">
                <label htmlFor="availability">
                  Availability
                </label>

                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
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
            </div>
          </div>

          {successMessage && (
            <p
              className="profile-form-success"
              role="status"
            >
              {successMessage}
            </p>
          )}

          {error && (
            <p
              className="profile-form-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="profile-submit-area">
            <p>
              By creating your profile, you confirm that the information you
              entered is accurate.
            </p>

            <button
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Creating Profile..."
                : "Create Player Profile"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default CompletePlayerProfilePage;