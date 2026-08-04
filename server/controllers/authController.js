import bcrypt from 'bcrypt'

import {
  createVerifiedPlayerAccount,
  findUserByEmail
} from '../models/authModel.js'

import {
  getVerificationRecordById
} from '../models/verificationModel.js'

import {
  verifyPlayerSignupToken
} from '../utils/generateVerificationToken.js'

const SALT_ROUNDS = 12

const validatePlayerSignupInput = ({
  verificationToken,
  email,
  password,
  biography,
  availability
}) => {
  const errors = []

  if (
    typeof verificationToken !== 'string' ||
    verificationToken.trim() === ''
  ) {
    errors.push(
      'A valid player verification token is required.'
    )
  }

  if (
    typeof email !== 'string' ||
    email.trim() === ''
  ) {
    errors.push('Email address is required.')
  } else {
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(email.trim())) {
      errors.push(
        'Enter a valid email address.'
      )
    }
  }

  if (
    typeof password !== 'string' ||
    password.length < 8
  ) {
    errors.push(
      'Password must contain at least 8 characters.'
    )
  }

  if (
    typeof biography !== 'string' ||
    biography.trim() === ''
  ) {
    errors.push(
      'Player biography is required.'
    )
  }

  const allowedAvailabilityValues = [
    'Available',
    'Limited Availability',
    'Unavailable'
  ]

  if (
    !allowedAvailabilityValues.includes(
      availability
    )
  ) {
    errors.push(
      'Choose a valid availability option.'
    )
  }

  return errors
}

/**
 * POST /api/auth/signup/player
 *
 * Creates a verified player account.
 *
 * The endpoint:
 * 1. validates the submitted fields;
 * 2. verifies the signed short-lived token;
 * 3. retrieves trusted registry information;
 * 4. hashes the password;
 * 5. creates users, players, and
 *    player_statistics records.
 */
const signupVerifiedPlayer = async (
  req,
  res
) => {
  try {
    const {
      verificationToken,
      email,
      password,
      profileImage,
      biography,
      availability
    } = req.body

    const validationErrors =
      validatePlayerSignupInput({
        verificationToken,
        email,
        password,
        biography,
        availability
      })

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          'Some player registration information is invalid.',
        errors: validationErrors
      })
    }

    /*
     * This verifies that:
     * - the token was signed by this server;
     * - it has not expired;
     * - its purpose is player signup.
     */
    const decodedToken =
      verifyPlayerSignupToken(
        verificationToken
      )

    /*
     * Never trust the player statistics or
     * position submitted by the frontend.
     *
     * Retrieve the authoritative values again
     * from the server-side verification table.
     */
    const verificationRecord =
      await getVerificationRecordById(
        decodedToken.verificationId
      )

    if (!verificationRecord) {
      return res.status(401).json({
        success: false,
        message:
          'The player verification record could not be found. Please verify again.'
      })
    }

    if (
      verificationRecord.verification_status !==
      'Verified'
    ) {
      return res.status(401).json({
        success: false,
        message:
          'The player verification record is no longer valid.'
      })
    }

    const normalizedEmail =
      email.trim().toLowerCase()

    const existingUser =
      await findUserByEmail(normalizedEmail)

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          'An account already exists with this email address.'
      })
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        SALT_ROUNDS
      )

    const createdAccount =
      await createVerifiedPlayerAccount({
        verificationRecord,
        email: normalizedEmail,
        hashedPassword,
        profileImage:
          typeof profileImage === 'string'
            ? profileImage.trim()
            : '',
        biography: biography.trim(),
        availability
      })

    return res.status(201).json({
      success: true,
      message:
        'Your verified player profile was created successfully.',
      data: {
        user: {
          userId:
            createdAccount.user.user_id,
          firstName:
            createdAccount.user.first_name,
          lastName:
            createdAccount.user.last_name,
          email:
            createdAccount.user.email,
          role:
            createdAccount.user.role
        },

        player: {
          playerId:
            createdAccount.player.player_id,
          verificationId:
            createdAccount.player
              .verification_id,
          profileImage:
            createdAccount.player
              .profile_image,
          biography:
            createdAccount.player.biography,
          primaryPosition:
            createdAccount.player
              .primary_position,
          secondaryPosition:
            createdAccount.player
              .secondary_position,
          preferredFoot:
            createdAccount.player
              .preferred_foot,
          classYear:
            createdAccount.player.class_year,
          skillLevel:
            createdAccount.player.skill_level,
          availability:
            createdAccount.player.availability,
          isVerified:
            createdAccount.player.is_verified
        },

        statistics: {
          goals:
            createdAccount.statistics.goals,
          assists:
            createdAccount.statistics.assists,
          cleanSheets:
            createdAccount.statistics
              .clean_sheets,
          gamesPlayed:
            createdAccount.statistics
              .games_played
        }
      }
    })
  } catch (error) {
    if (
      error.name ===
      'TokenExpiredError'
    ) {
      return res.status(401).json({
        success: false,
        message:
          'Your verification has expired. Please verify your identity again.'
      })
    }

    if (
      error.name ===
      'JsonWebTokenError'
    ) {
      return res.status(401).json({
        success: false,
        message:
          'The verification token is invalid. Please verify your identity again.'
      })
    }

    /*
     * PostgreSQL unique-constraint violation.
     * This could happen if the email,
     * user_id, or verification_id is already used.
     */
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message:
          'An account has already been created using this email address or verification record.'
      })
    }

    console.error(
      'Unable to create verified player account:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'An unexpected error occurred while creating the player profile.'
    })
  }
}

export {
  signupVerifiedPlayer
}