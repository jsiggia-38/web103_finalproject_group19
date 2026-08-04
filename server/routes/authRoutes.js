import express from 'express'

import {
  signupVerifiedPlayer
} from '../controllers/authController.js'

const router = express.Router()

/**
 * POST /api/auth/signup/player
 *
 * Creates a verified player account.
 */
router.post(
  '/signup/player',
  signupVerifiedPlayer
)

export default router