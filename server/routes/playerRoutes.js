import express from "express";

import {
  getPlayerById,
  updatePlayerProfile,
  deletePlayerProfile,
} from "../controllers/playerController.js";

const router = express.Router();

/**
 * GET /api/players/:playerId
 */
router.get(
  "/:playerId",
  getPlayerById,
);

/**
 * PATCH /api/players/:playerId
 */
router.patch(
  "/:playerId",
  updatePlayerProfile,
);

/**
 * DELETE /api/players/:playerId
 */
router.delete(
  "/:playerId",
  deletePlayerProfile,
);


export default router;