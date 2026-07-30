import jwt from 'jsonwebtoken'

const getVerificationSecret = () => {
  const secret = process.env.VERIFICATION_TOKEN_SECRET

  if (!secret) {
    throw new Error(
      'VERIFICATION_TOKEN_SECRET is not configured.'
    )
  }

  return secret
}

export const generateVerificationToken = (
  verificationRecord
) => {
  if (!verificationRecord?.verification_id) {
    throw new Error(
      'A valid verification record is required.'
    )
  }

  return jwt.sign(
    {
      verificationId:
        verificationRecord.verification_id,
      purpose: 'player-signup'
    },
    getVerificationSecret(),
    {
      expiresIn: '15m'
    }
  )
}

export const verifyPlayerSignupToken = (token) => {
  if (!token || typeof token !== 'string') {
    throw new Error(
      'A verification token is required.'
    )
  }

  const decoded = jwt.verify(
    token,
    getVerificationSecret()
  )

  if (decoded.purpose !== 'player-signup') {
    throw new Error(
      'This token cannot be used for player signup.'
    )
  }

  return decoded
}