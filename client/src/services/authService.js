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

export const signupStaffUser = async ({
  firstName,
  lastName,
  email,
  password,
  role,
}) => {
  return apiRequest("/api/auth/signup/staff", {
    method: "POST",
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
      role,
    }),
  });
};


export const loginUser = async ({
  email,
  password,
}) => {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};
