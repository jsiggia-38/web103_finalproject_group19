import { apiRequest } from './api.js'

export const verifyPlayer = async (verificationData) => {
  try {
    return await apiRequest(
      '/api/verifications/player',
      {
        method: 'POST',
        body: JSON.stringify(verificationData)
      }
    )
  } catch (error) {
    throw error
  }
}

export const generateDemoVerification = async (
  verificationData
) => {
  try {
    return await apiRequest(
      '/api/verifications/player/generate-demo',
      {
        method: 'POST',
        body: JSON.stringify(verificationData)
      }
    )
  } catch (error) {
    throw error
  }
}

export const validateVerificationToken = async (
  verificationToken
) => {
  try {
    return await apiRequest(
      '/api/verifications/validate-token',
      {
        method: 'POST',
        body: JSON.stringify({
          verificationToken
        })
      }
    )
  } catch (error) {
    throw error
  }
}