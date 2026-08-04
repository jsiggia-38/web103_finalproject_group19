import express from 'express'

import {
  signupVerifiedPlayer,
  signupStaffUser,
  loginUser
} from '../controllers/authController.js'

const router = express.Router()

/**
 * Verified player registration
 */
router.post(
  '/signup/player',
  signupVerifiedPlayer
)

/**
 * Coach or Organizer registration
 */
router.post(
  '/signup/staff',
  signupStaffUser
)

/**
 * Shared login for all account roles
 */
router.post(
  '/login',
  loginUser
)

export default router