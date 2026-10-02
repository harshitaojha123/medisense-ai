import express from "express";

import {
  getHealthTimeline,
} from "../controllers/timelineController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getHealthTimeline
);

export default router;