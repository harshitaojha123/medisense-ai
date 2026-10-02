import express from "express";

import {
  createInsight,
  getInsights,
  getInsightById,
  updateInsight,
  deleteInsight,
} from "../controllers/insightController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createInsight);

router.get("/", protect, getInsights);

router.get("/:id", protect, getInsightById);

router.put("/:id", protect, updateInsight);

router.delete("/:id", protect, deleteInsight);

export default router;