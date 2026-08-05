import express from "express";

import {
  getCoachDashboard,
  getOrganizerDashboard,
} from "../controllers/dashboardController.js";

import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/coach",
  authenticateUser,
  authorizeRoles("Coach"),
  getCoachDashboard,
);

router.get(
  "/organizer",
  authenticateUser,
  authorizeRoles("Organizer"),
  getOrganizerDashboard,
);

export default router;