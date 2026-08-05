import express from "express";

import {
  createTeam,
  getAllTeams,
  getAvailableCoaches,
  getTeamById,
} from "../controllers/teamController.js";

import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Public teams directory.
 */
router.get(
  "/",
  getAllTeams,
);

router.get(
  "/available-coaches",
  authenticateUser,
  authorizeRoles("Organizer"),
  getAvailableCoaches,
);

router.get(
  "/:teamId",
  getTeamById,
);

router.post(
  "/",
  authenticateUser,
  authorizeRoles("Organizer"),
  createTeam,
);

export default router;