import VerificationModel from '../models/verificationModel.js'
import {
  generateVerificationToken
} from '../utils/generateVerificationToken.js'

const verifyPlayer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth
    } = req.body

    const record =
      await VerificationModel.findVerificationRecord({
        firstName,
        lastName,
        dateOfBirth
      })

    if (!record) {
      return res.status(404).json({
        verified: false,
        message:
          'No matching player was found in the demo registry.'
      })
    }

    const verificationToken =
      generateVerificationToken(record)

    return res.status(200).json({
      verified: true,
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
        skillLevel: record.skill_level,
        classYear: record.class_year,
        goals: record.goals,
        assists: record.assists,
        cleanSheets: record.clean_sheets,
        gamesPlayed: record.games_played
      },
      disclaimer:
        'This verification uses simulated demonstration data.'
    })
  } catch (error) {
    return res.status(500).json({
      verified: false,
      message:
        'An error occurred during verification.',
      error: error.message
    })
  }
}

export default {
  verifyPlayer
}