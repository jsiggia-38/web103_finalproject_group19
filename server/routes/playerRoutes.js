import express from "express";

import {
  getPlayers,
  getPlayerById,
  updatePlayerProfile,
  deletePlayerProfile,
  getPlayerRecruitmentActivity,
} from "../controllers/playerController.js";

import {
  authenticateUser,
} from "../middleware/authMiddleware.js";

import {
  authorizePlayerOwner,
} from "../middleware/playerOwnershipMiddleware.js";

const router = express.Router();

/**
 * Only the authenticated player owner can view
 * private recruitment activity.
 */
router.get(
  "/:playerId/recruitment",
  authenticateUser,
  authorizePlayerOwner,
  getPlayerRecruitmentActivity,
);

/**
 * Browse all registered players.
 */
router.get(
  "/",
  getPlayers,
);

/**
 * View one public player profile.
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