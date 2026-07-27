export const isNonEmptyString = (value) => {
  return (
    typeof value === 'string' &&
    value.trim().length > 0
  )
}

export const isValidEmail = (email) => {
  if (!isNonEmptyString(email)) {
    return false
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return emailPattern.test(email.trim())
}

export const isValidPassword = (password) => {
  return (
    typeof password === 'string' &&
    password.length >= 8
  )
}

export const isValidDate = (dateValue) => {
  if (!dateValue) {
    return false
  }

  const date = new Date(dateValue)

  return !Number.isNaN(date.getTime())
}

export const isNonNegativeInteger = (value) => {
  return (
    Number.isInteger(Number(value)) &&
    Number(value) >= 0
  )
}

export const normalizeEmail = (email) => {
  return email.trim().toLowerCase()
}

export const normalizeName = (name) => {
  return name.trim().replace(/\s+/g, ' ')
}

export const validateSignupInput = ({
  firstName,
  lastName,
  email,
  password,
  role
}) => {
  const errors = []

  if (!isNonEmptyString(firstName)) {
    errors.push('First name is required.')
  }

  if (!isNonEmptyString(lastName)) {
    errors.push('Last name is required.')
  }

  if (!isValidEmail(email)) {
    errors.push('A valid email address is required.')
  }

  if (!isValidPassword(password)) {
    errors.push(
      'Password must contain at least 8 characters.'
    )
  }

  const allowedRoles = [
    'Player',
    'Coach',
    'Captain',
    'Organizer'
  ]

  if (!allowedRoles.includes(role)) {
    errors.push('A valid account role is required.')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateVerificationInput = ({
  firstName,
  lastName,
  dateOfBirth
}) => {
  const errors = []

  if (!isNonEmptyString(firstName)) {
    errors.push('First name is required.')
  }

  if (!isNonEmptyString(lastName)) {
    errors.push('Last name is required.')
  }

  if (!isValidDate(dateOfBirth)) {
    errors.push('A valid date of birth is required.')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}