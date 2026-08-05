import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  createTeam,
  getAvailableCoaches,
} from "../services/teamService.js";

import "../styles/createTeam.css";

function CreateTeamPage() {
  const navigate = useNavigate();

  const [coaches, setCoaches] =
    useState([]);

  const [formData, setFormData] =
    useState({
      captainId: "",
      teamName: "",
      division: "",
      description: "",
      logoUrl: "",
      practiceLocation: "",
      practiceSchedule: "",
      maximumRosterSize: "22",
    });

  const [loadingCoaches, setLoadingCoaches] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    const loadCoaches = async () => {
      try {
        setLoadingCoaches(true);
        setError("");

        const result =
          await getAvailableCoaches();

        setCoaches(result.data || []);

        if (result.data?.length === 1) {
          setFormData((currentData) => ({
            ...currentData,
            captainId: String(
              result.data[0].userId,
            ),
          }));
        }
      } catch (requestError) {
        setError(
          requestError.message ||
            "Unable to load available coaches.",
        );
      } finally {
        setLoadingCoaches(false);
      }
    };

    loadCoaches();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.teamName.trim()) {
      return "Team name is required.";
    }

    if (!formData.captainId) {
      return "Choose a team captain.";
    }

    const rosterSize = Number(
      formData.maximumRosterSize,
    );

    if (
      !Number.isInteger(rosterSize) ||
      rosterSize <= 0
    ) {
      return "Maximum roster size must be a positive integer.";
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

      const result = await createTeam({
        captainId: Number(
          formData.captainId,
        ),
        teamName:
          formData.teamName.trim(),
        division:
          formData.division.trim(),
        description:
          formData.description.trim(),
        logoUrl:
          formData.logoUrl.trim(),
        practiceLocation:
          formData.practiceLocation.trim(),
        practiceSchedule:
          formData.practiceSchedule.trim(),
        maximumRosterSize: Number(
          formData.maximumRosterSize,
        ),
      });

      setSuccessMessage(result.message);

      sessionStorage.setItem(
        "recentlyCreatedTeam",
        JSON.stringify(result.data),
      );

      setTimeout(() => {
        navigate(
          "/dashboard/organizer",
          {
            replace: true,
          },
        );
      }, 1400);
    } catch (submissionError) {
      setSuccessMessage("");

      setError(
        submissionError.message ||
          "Unable to create the team.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="create-team-page">
      <div className="create-team-container">
        <header className="create-team-topbar">
          <Link
            to="/dashboard/organizer"
            className="create-team-brand"
          >
            <span className="create-team-brand-icon">
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

          <Link
            to="/dashboard/organizer"
            className="create-team-dashboard-link"
          >
            Back to Organizer Dashboard
          </Link>
        </header>

        <section className="create-team-card">
          <header className="create-team-header">
            <div className="create-team-header-icon">
              🛡️
            </div>

            <div>
              <p className="create-team-eyebrow">
                Club Administration
              </p>

              <h1>
                Create a{" "}
                <span>Soccer Team</span>
              </h1>

              <p>
                Register a team, assign an
                available coach as captain, and
                provide the team’s practice and
                roster information.
              </p>
            </div>
          </header>

          <form
            className="create-team-form"
            onSubmit={handleSubmit}
          >
            <section className="create-team-form-section">
              <div className="create-team-section-heading">
                <span>01</span>

                <div>
                  <h2>
                    Team Identity
                  </h2>

                  <p>
                    Enter the team’s basic
                    information and select its
                    captain.
                  </p>
                </div>
              </div>

              <div className="create-team-form-grid">
                <div className="create-team-form-group full-width">
                  <label htmlFor="teamName">
                    Team Name
                  </label>

                  <input
                    id="teamName"
                    name="teamName"
                    type="text"
                    value={formData.teamName}
                    onChange={handleChange}
                    placeholder="Campus United FC"
                    required
                  />
                </div>

                <div className="create-team-form-group">
                  <label htmlFor="division">
                    Division
                  </label>

                  <input
                    id="division"
                    name="division"
                    type="text"
                    value={formData.division}
                    onChange={handleChange}
                    placeholder="College Intramural Division A"
                  />
                </div>

                <div className="create-team-form-group">
                  <label htmlFor="captainId">
                    Team Captain / Coach
                  </label>

                  <select
                    id="captainId"
                    name="captainId"
                    value={formData.captainId}
                    onChange={handleChange}
                    disabled={
                      loadingCoaches ||
                      coaches.length === 0
                    }
                    required
                  >
                    <option value="">
                      {loadingCoaches
                        ? "Loading coaches..."
                        : "Select a coach"}
                    </option>

                    {coaches.map((coach) => (
                      <option
                        key={coach.userId}
                        value={coach.userId}
                      >
                        {coach.firstName}{" "}
                        {coach.lastName} —{" "}
                        {coach.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="create-team-form-group full-width">
                  <label htmlFor="description">
                    Team Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the team, its goals, competitive level, and campus activities."
                  />
                </div>

                <div className="create-team-form-group full-width">
                  <label htmlFor="logoUrl">
                    Team Logo URL
                  </label>

                  <input
                    id="logoUrl"
                    name="logoUrl"
                    type="url"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/team-logo.png"
                  />
                </div>
              </div>
            </section>

            <section className="create-team-form-section">
              <div className="create-team-section-heading">
                <span>02</span>

                <div>
                  <h2>
                    Practice and Roster
                  </h2>

                  <p>
                    Add practice information and
                    set the maximum team roster.
                  </p>
                </div>
              </div>

              <div className="create-team-form-grid">
                <div className="create-team-form-group">
                  <label htmlFor="practiceLocation">
                    Practice Location
                  </label>

                  <input
                    id="practiceLocation"
                    name="practiceLocation"
                    type="text"
                    value={
                      formData.practiceLocation
                    }
                    onChange={handleChange}
                    placeholder="University Main Soccer Field"
                  />
                </div>

                <div className="create-team-form-group">
                  <label htmlFor="practiceSchedule">
                    Practice Schedule
                  </label>

                  <input
                    id="practiceSchedule"
                    name="practiceSchedule"
                    type="text"
                    value={
                      formData.practiceSchedule
                    }
                    onChange={handleChange}
                    placeholder="Tuesdays and Thursdays at 6:00 PM"
                  />
                </div>

                <div className="create-team-form-group full-width">
                  <label htmlFor="maximumRosterSize">
                    Maximum Roster Size
                  </label>

                  <input
                    id="maximumRosterSize"
                    name="maximumRosterSize"
                    type="number"
                    min="1"
                    value={
                      formData.maximumRosterSize
                    }
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </section>

            {coaches.length === 0 &&
              !loadingCoaches && (
                <p className="create-team-warning">
                  No available Coach accounts were
                  found. Each coach can currently
                  captain only one team.
                </p>
              )}

            {successMessage && (
              <p
                className="create-team-success"
                role="status"
              >
                {successMessage}
              </p>
            )}

            {error && (
              <p
                className="create-team-error"
                role="alert"
              >
                {error}
              </p>
            )}

            <div className="create-team-submit-area">
              <Link
                to="/dashboard/organizer"
                className="create-team-cancel-button"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="create-team-submit-button"
                disabled={
                  submitting ||
                  loadingCoaches ||
                  coaches.length === 0
                }
              >
                {submitting
                  ? "Creating Team..."
                  : "Create Team"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default CreateTeamPage;