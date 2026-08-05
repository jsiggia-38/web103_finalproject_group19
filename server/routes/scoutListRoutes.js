import express from "express";

import {
  addPlayerToScoutList,
  getScoutList,
  removeScoutEntry,
  updateScoutEntry,
} from "../controllers/scoutListController.js";

import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(
  authenticateUser,
  authorizeRoles("Coach"),
);

router.get(
  "/",
  getScoutList,
);

router.post(
  "/",
  addPlayerToScoutList,
);

router.patch(
  "/:scoutId",
  updateScoutEntry,
);

router.delete(
  "/:scoutId",
  removeScoutEntry,
);

export default router;