import express from 'express'

import VerificationController from '../controllers/verificationController.js'

const router = express.Router()

router.post(
  '/player',
  VerificationController.verifyPlayer
)

router.post(
  '/player/generate-demo',
  VerificationController.generateDemoVerification
)

router.post(
  '/validate-token',
  VerificationController.validateVerificationToken
)

router.get(
  '/:verificationId',
  VerificationController.getVerificationRecord
)

export default router