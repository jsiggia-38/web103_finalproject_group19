import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  loginUser,
} from "../services/authService.js";

import "../styles/login.css";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
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

    if (!formData.password) {
      return "Password is required.";
    }

    return "";
  };

  const redirectAfterLogin = (user) => {
    if (
      user.role === "Player" &&
      user.playerId
    ) {
      navigate(
        `/players/${user.playerId}`,
        {
          replace: true,
        },
      );

      return;
    }

    if (user.role === "Coach") {
      navigate(
        "/dashboard/coach",
        {
          replace: true,
        },
      );

      return;
    }

    if (user.role === "Organizer") {
      navigate(
        "/dashboard/organizer",
        {
          replace: true,
        },
      );

      return;
    }

    navigate("/", {
      replace: true,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const result = await loginUser({
        email:
          formData.email
            .trim()
            .toLowerCase(),
        password: formData.password,
      });

      /*
       * Save the normal account-authentication
       * token. This is different from the
       * short-lived player verification token.
       */
      sessionStorage.setItem(
        "authToken",
        result.authToken,
      );

      sessionStorage.setItem(
        "authenticatedUser",
        JSON.stringify(result.data),
      );

      redirectAfterLogin(result.data);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to log in.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <Link
        to="/"
        className="login-back-link"
      >
        <span>←</span>
        Back to Home
      </Link>

      <section className="login-card">
        <header className="login-header">
          <div className="login-logo">
            ⚽
          </div>

          <p className="login-eyebrow">
            College Soccer Scout Helper
          </p>

          <h1>
            Welcome <span>Back</span>
          </h1>

          <p className="login-introduction">
            Log in to manage your profile,
            recruitment activities, teams, and
            invitations.
          </p>
        </header>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="login-form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              autoComplete="email"
              required
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p
              className="login-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-submit-button"
            disabled={submitting}
          >
            {submitting
              ? "Logging In..."
              : "Log In"}
          </button>
        </form>

        <div className="login-account-options">
          <p>
            Do not have an account?
          </p>

          <div>
            <Link
              to="/signup"
              className="login-staff-signup-link"
            >
              Coach or Organizer Sign Up
            </Link>

            <Link
              to="/signup/player-verification"
              className="login-player-signup-link"
            >
              Student Player Registration
            </Link>
          </div>
        </div>

        <p className="login-security-note">
          Your account credentials are securely
          validated by the server.
        </p>
      </section>
    </main>
  );
}

export default LoginPage;