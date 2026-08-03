import { Link } from 'react-router-dom'

function CompletePlayerProfilePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '48px',
        background: '#08100b',
        color: '#ffffff'
      }}
    >
      <Link
        to="/signup/player-verification"
        style={{
          color: '#78dc77'
        }}
      >
        ← Back to Verification
      </Link>

      <h1>Complete Player Profile</h1>

      <p>
        Your verification was successful. Complete
        the remaining profile information here.
      </p>
    </main>
  )
}

export default CompletePlayerProfilePage