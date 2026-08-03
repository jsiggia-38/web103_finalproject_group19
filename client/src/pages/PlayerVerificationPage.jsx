import '../styles/verification.css'
import { FiArrowLeft } from "react-icons/fi";
import { useState } from 'react'

import {
  Link,
  useNavigate
} from 'react-router-dom'


import {
  generateDemoVerification,
  verifyPlayer
} from '../services/verificationService.js'

function PlayerVerificationPage() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: ''
  })

  const [playerPreview, setPlayerPreview] =
    useState(null)

  const [playerNotFound, setPlayerNotFound] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }))
  }

  const saveVerificationResult = (result) => {
    sessionStorage.setItem(
      'playerVerificationToken',
      result.verificationToken
    )

    sessionStorage.setItem(
      'playerVerificationPreview',
      JSON.stringify(result.preview)
    )

    setPlayerPreview(result.preview)
    setPlayerNotFound(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')
      setPlayerNotFound(false)
      setPlayerPreview(null)

      const result = await verifyPlayer(formData)

      saveVerificationResult(result)
    } catch (error) {
      if (
        error.message.includes(
          'No matching player'
        )
      ) {
        setPlayerNotFound(true)
      } else {
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateDemo = async () => {
    try {
      setLoading(true)
      setError('')

      const result =
        await generateDemoVerification(
          formData
        )

      saveVerificationResult(result)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }
return (
  <main className="verification-page">
   <Link to="/" className="back-home-link">
    <FiArrowLeft className="back-arrow" />
    <span>Back to Home</span>
</Link>
    <section className="verification-card">
      <h1>
      Verify <span>Player Identity</span>
    </h1>

      <p className="verification-intro">
        Enter your first name, last name, and date of birth
        to check the demo college soccer registry. Verified
        football information will be added automatically to
        your profile.
      </p>

      <form
        className="verification-form"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label htmlFor="firstName">
            First Name
          </label>

          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">
            Last Name
          </label>

          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateOfBirth">
            Date of Birth
          </label>

          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        <button
          className="primary-button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Checking...'
            : 'Verify Player'}
        </button>
      </form>

      {error && (
        <p
          className="error-message"
          role="alert"
        >
          {error}
        </p>
      )}

      {playerNotFound && (
        <section className="not-found-panel">
          <h2>Player Not Found</h2>

          <p>
            No matching record was found in the demo
            registry. You can generate a simulated record
            for this project demonstration.
          </p>

          <button
            className="secondary-button"
            type="button"
            onClick={handleGenerateDemo}
            disabled={loading}
          >
            {loading
              ? 'Generating...'
              : 'Generate Demo Record'}
          </button>
        </section>
      )}

      {playerPreview && (
        <section className="verification-result">
          <h2>Player Verified ✓</h2>

          <div className="verified-details">
            <p>
              <strong>Name:</strong>{' '}
              {playerPreview.firstName}{' '}
              {playerPreview.lastName}
            </p>

            <p>
              <strong>Primary Position:</strong>{' '}
              {playerPreview.primaryPosition}
            </p>

            <p>
              <strong>Secondary Position:</strong>{' '}
              {playerPreview.secondaryPosition || 'None'}
            </p>

            <p>
              <strong>Preferred Foot:</strong>{' '}
              {playerPreview.preferredFoot}
            </p>

            <p>
              <strong>Skill Level:</strong>{' '}
              {playerPreview.skillLevel}
            </p>

            <p>
              <strong>Class Year:</strong>{' '}
              {playerPreview.classYear}
            </p>
          </div>

          <div className="verification-stats">
            <div className="stat-card">
              <strong>{playerPreview.goals}</strong>
              <span>Goals</span>
            </div>

            <div className="stat-card">
              <strong>{playerPreview.assists}</strong>
              <span>Assists</span>
            </div>

            <div className="stat-card">
              <strong>
                {playerPreview.cleanSheets}
              </strong>
              <span>Clean Sheets</span>
            </div>

            <div className="stat-card">
              <strong>
                {playerPreview.gamesPlayed}
              </strong>
              <span>Games Played</span>
            </div>
          </div>

          <div className="verification-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => {
                navigate('/signup/player-profile')
              }}
            >
              Continue to Complete Profile
            </button>
          </div>
        </section>
      )}

      <small className="verification-disclaimer">
        This application uses simulated verification
        records and is not connected to an official soccer
        governing body.
      </small>
    </section>
  </main>
)
}

export default PlayerVerificationPage