import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { signupStaffUser } from "../services/authService.js";

import "../styles/signup.css";

function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Coach",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");
  const [submitting, setSubmitting] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      return "First name is required.";
    }

    if (!formData.lastName.trim()) {
      return "Last name is required.";
    }

    if (!formData.email.trim()) {
      return "Email address is required.";
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        formData.email.trim(),
      )
    ) {
      return "Enter a valid email address.";
    }

    if (formData.password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      return "Passwords do not match.";
    }

    if (
      !["Coach", "Organizer"].includes(
        formData.role,
      )
    ) {
      return "Choose a valid account role.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {
      setSuccessMessage("");
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");

      const result =
        await signupStaffUser({
          firstName:
            formData.firstName.trim(),
          lastName:
            formData.lastName.trim(),
          email:
            formData.email
              .trim()
              .toLowerCase(),
          password:
            formData.password,
          role: formData.role,
        });

      setSuccessMessage(result.message);

      sessionStorage.setItem(
        "newlyCreatedStaffAccount",
        JSON.stringify(result.data),
      );

      setTimeout(() => {
        navigate("/login");
      }, 1400);
    } catch (submissionError) {
      setSuccessMessage("");

      setError(
        submissionError.message ||
          "Unable to create the account.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="staff-signup-page">
      <Link
        to="/"
        className="staff-signup-back-link"
      >
        <span>←</span>
        Back to Home
      </Link>

      <section className="staff-signup-card">
        <header className="staff-signup-header">
          <div className="staff-signup-icon">
            ⚽
          </div>

          <div>
            <p className="staff-signup-eyebrow">
              College Soccer Recruitment
            </p>

            <h1>
              Create Your{" "}
              <span>Staff Account</span>
            </h1>

            <p>
              Register as a team captain,
              coach, or club organizer to
              recruit players and manage
              college soccer activities.
            </p>
          </div>
        </header>

        <section className="staff-role-selection">
          <h2>Choose Your Role</h2>

          <p>
            Select the account type that
            best describes your responsibilities.
          </p>

          <div className="staff-role-grid">
            <label
              className={`staff-role-card ${
                formData.role === "Coach"
                  ? "selected"
                  : ""
              }`}
            >
              <input
                type="radio"
                name="role"
                value="Coach"
                checked={
                  formData.role === "Coach"
                }
                onChange={handleChange}
              />

              <span className="staff-role-icon">
                📋
              </span>

              <strong>
                Team Captain / Coach
              </strong>

              <small>
                Browse players, maintain a
                scout list, add scouting
                notes, and send tryout
                invitations.
              </small>
            </label>

            <label
              className={`staff-role-card ${
                formData.role ===
                "Organizer"
                  ? "selected"
                  : ""
              }`}
            >
              <input
                type="radio"
                name="role"
                value="Organizer"
                checked={
                  formData.role ===
                  "Organizer"
                }
                onChange={handleChange}
              />

              <span className="staff-role-icon">
                🏟️
              </span>

              <strong>
                Club Organizer
              </strong>

              <small>
                Manage teams, review verified
                registrations, and oversee
                recruitment activities.
              </small>
            </label>
          </div>
        </section>

        <form
          className="staff-signup-form"
          onSubmit={handleSubmit}
        >
          <div className="staff-form-section-heading">
            <span>01</span>

            <div>
              <h2>Account Information</h2>

              <p>
                Enter the details you will use
                to access your account.
              </p>
            </div>
          </div>

          <div className="staff-form-grid">
            <div className="staff-form-group">
              <label htmlFor="firstName">
                First Name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Alex"
                autoComplete="given-name"
                required
              />
            </div>

            <div className="staff-form-group">
              <label htmlFor="lastName">
                Last Name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Turner"
                autoComplete="family-name"
                required
              />
            </div>

            <div className="staff-form-group full-width">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="staff-form-group">
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
                autoComplete="new-password"
                required
              />
            </div>

            <div className="staff-form-group">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                placeholder="Enter password again"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          {successMessage && (
            <p
              className="staff-signup-success"
              role="status"
            >
              {successMessage}
            </p>
          )}

          {error && (
            <p
              className="staff-signup-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="staff-signup-submit-area">
            <p>
              Already have an account?{" "}
              <Link to="/login">
                Log in
              </Link>
            </p>

            <button
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Creating Account..."
                : `Create ${
                    formData.role === "Coach"
                      ? "Coach"
                      : "Organizer"
                  } Account`}
            </button>
          </div>
        </form>

        <div className="player-signup-option">
          <div>
            <strong>
              Are you a student player?
            </strong>

            <p>
              Student players must verify their
              identity before creating an
              account.
            </p>
          </div>

          <Link to="/signup/player-verification">
            Verify Player Identity
          </Link>
        </div>
      </section>
    </main>
  );
}

export default SignupPage;