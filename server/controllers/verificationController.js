import {
  findVerificationRecord,
  getVerificationRecordById,
  createDemoVerificationRecord
} from '../models/verificationModel.js'

import {
  generateVerificationToken,
  verifyPlayerSignupToken
} from '../utils/generateVerificationToken.js'

const validateVerificationInput = ({
  firstName,
  lastName,
  dateOfBirth
}) => {
  const errors = []

  if (
    typeof firstName !== 'string' ||
    firstName.trim() === ''
  ) {
    errors.push('First name is required.')
  }

  if (
    typeof lastName !== 'string' ||
    lastName.trim() === ''
  ) {
    errors.push('Last name is required.')
  }

  if (!dateOfBirth) {
    errors.push('Date of birth is required.')
  } else {
    const parsedDate = new Date(dateOfBirth)

    if (Number.isNaN(parsedDate.getTime())) {
      errors.push('Date of birth must be valid.')
    }
  }

  return errors
}

/**
 * POST /api/verifications/player
 *
 * Checks whether a player exists in the demo registry.
 * If found, returns a signed short-lived verification token.
 */
const verifyPlayer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth
    } = req.body

    const validationErrors =
      validateVerificationInput({
        firstName,
        lastName,
        dateOfBirth
      })

    if (validationErrors.length > 0) {
      return res.status(400).json({
        verified: false,
        message:
          'Verification information is incomplete.',
        errors: validationErrors
      })
    }

    const record =
      await findVerificationRecord({
        firstName,
        lastName,
        dateOfBirth
      })

    if (!record) {
      return res.status(404).json({
        verified: false,
        message:
          'No matching player was found in the demo registry.',
        canGenerateDemo: true
      })
    }

    const verificationToken =
      generateVerificationToken(record)

    return res.status(200).json({
      verified: true,
      verificationToken,
      expiresIn: '15 minutes',

      // Display-only preview.
      // The backend will retrieve the real values again
      // during final account creation.
      preview: {
        firstName: record.first_name,
        lastName: record.last_name,
        primaryPosition:
          record.primary_position,
        secondaryPosition:
          record.secondary_position,
        preferredFoot:
          record.preferred_foot,
        skillLevel:
          record.skill_level,
        classYear:
          record.class_year,
        goals:
          record.goals,
        assists:
          record.assists,
        cleanSheets:
          record.clean_sheets,
        gamesPlayed:
          record.games_played
      },

      disclaimer:
        'This verification uses simulated demonstration data and is not connected to an official sports organization.'
    })
  } catch (error) {
    console.error(
      'Unable to verify player:',
      error.message
    )

    return res.status(500).json({
      verified: false,
      message:
        'An error occurred while verifying the player.',
      error: error.message
    })
  }
}

/**
 * POST /api/verifications/player/generate-demo
 *
 * Creates a demo registry record when one does not exist.
 */
const generateDemoVerification = async (
  req,
  res
) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth
    } = req.body

    const validationErrors =
      validateVerificationInput({
        firstName,
        lastName,
        dateOfBirth
      })

    if (validationErrors.length > 0) {
      return res.status(400).json({
        verified: false,
        message:
          'Verification information is incomplete.',
        errors: validationErrors
      })
    }

    let record =
      await findVerificationRecord({
        firstName,
        lastName,
        dateOfBirth
      })

    let generatedForDemo = false

    if (!record) {
      record =
        await createDemoVerificationRecord({
          firstName,
          lastName,
          dateOfBirth
        })

      generatedForDemo = true
    }

    const verificationToken =
      generateVerificationToken(record)

    return res
      .status(generatedForDemo ? 201 : 200)
      .json({
        verified: true,
        generatedForDemo,
        verificationToken,
        expiresIn: '15 minutes',

        preview: {
          firstName: record.first_name,
          lastName: record.last_name,
          primaryPosition:
            record.primary_position,
          secondaryPosition:
            record.secondary_position,
          preferredFoot:
            record.preferred_foot,
          skillLevel:
            record.skill_level,
          classYear:
            record.class_year,
          goals:
            record.goals,
          assists:
            record.assists,
          cleanSheets:
            record.clean_sheets,
          gamesPlayed:
            record.games_played
        },

        disclaimer:
          'This profile uses simulated demonstration data and is not connected to an official sports organization.'
      })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        verified: false,
        message:
          'A verification record already exists for this player.'
      })
    }

    console.error(
      'Unable to generate demo verification:',
      error.message
    )

    return res.status(500).json({
      verified: false,
      message:
        'An error occurred while generating the demo verification.',
      error: error.message
    })
  }
}

/**
 * POST /api/verifications/validate-token
 *
 * Confirms that a verification token is:
 * - authentic;
 * - unexpired;
 * - intended for player signup;
 * - connected to a valid verification record.
 */
const validateVerificationToken = async (
  req,
  res
) => {
  try {
    const { verificationToken } = req.body

    if (
      typeof verificationToken !== 'string' ||
      verificationToken.trim() === ''
    ) {
      return res.status(400).json({
        valid: false,
        message:
          'Verification token is required.'
      })
    }

    const decoded =
      verifyPlayerSignupToken(
        verificationToken
      )

    const record =
      await getVerificationRecordById(
        decoded.verificationId
      )

    if (
      !record ||
      record.verification_status !== 'Verified'
    ) {
      return res.status(401).json({
        valid: false,
        message:
          'The verification record is no longer valid.'
      })
    }

    return res.status(200).json({
      valid: true,
      verificationId:
        decoded.verificationId,
      message:
        'Verification token is valid.'
    })
  } catch (error) {
    const isExpired =
      error.name === 'TokenExpiredError'

    return res.status(401).json({
      valid: false,
      message: isExpired
        ? 'The verification token has expired. Please verify again.'
        : 'The verification token is invalid.'
    })
  }
}

/**
 * GET /api/verifications/:verificationId
 */
const getVerificationRecord = async (
  req,
  res
) => {
  try {
    const verificationId = Number(
      req.params.verificationId
    )

    if (
      !Number.isInteger(verificationId) ||
      verificationId <= 0
    ) {
      return res.status(400).json({
        message:
          'The verification ID must be a valid positive integer.'
      })
    }

    const record =
      await getVerificationRecordById(
        verificationId
      )

    if (!record) {
      return res.status(404).json({
        message:
          'Verification record not found.'
      })
    }

    return res.status(200).json(record)
  } catch (error) {
    console.error(
      'Unable to retrieve verification record:',
      error.message
    )

    return res.status(500).json({
      message:
        'An error occurred while retrieving the verification record.',
      error: error.message
    })
  }
}

export default {
  verifyPlayer,
  generateDemoVerification,
  validateVerificationToken,
  getVerificationRecord
}