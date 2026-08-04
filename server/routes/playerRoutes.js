import express from "express";

import {
  getPlayerById,
  updatePlayerProfile,
  deletePlayerProfile,
} from "../controllers/playerController.js";

import {
  authenticateUser,
} from "../middleware/authMiddleware.js";

import {
  authorizePlayerOwner,
} from "../middleware/playerOwnershipMiddleware.js";

const router = express.Router();

/**
 * Public profile request.
 *
 * Coaches, organizers, players, and homepage
 * visitors can view a player profile.
 */
router.get(
  "/:playerId",
  getPlayerById,
);

/**
 * Only the authenticated profile owner can edit.
 */
router.patch(
  "/:playerId",
  authenticateUser,
  authorizePlayerOwner,
  updatePlayerProfile,
);

/**
 * Only the authenticated profile owner can delete.
 */
router.delete(
  "/:playerId",
  authenticateUser,
  authorizePlayerOwner,
  deletePlayerProfile,
);

export default router;