import { apiRequest } from './api.js'

export const signupVerifiedPlayer = async ({
  verificationToken,
  email,
  password,
  profileImage,
  biography,
  availability
}) => {
  try {
    return await apiRequest(
      '/api/auth/signup/player',
      {
        method: 'POST',
        body: JSON.stringify({
          verificationToken,
          email,
          password,
          profileImage,
          biography,
          availability
        })
      }
    )
  } catch (error) {
    throw error
  }
}