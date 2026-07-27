import { Navigate } from 'react-router-dom'

function SignupFlowGuard({ requiredStep, children }) {
  const pendingSignup = sessionStorage.getItem('pendingSignup')
  const playerVerification = sessionStorage.getItem(
    'playerVerification'
  )

  if (requiredStep === 'signup' && !pendingSignup) {
    return <Navigate to="/signup" replace />
  }

  if (
    requiredStep === 'verification' &&
    (!pendingSignup || !playerVerification)
  ) {
    return (
      <Navigate
        to="/signup/player-verification"
        replace
      />
    )
  }

  return children
}

export default SignupFlowGuard