import express from "express";

import {
  createMetric,
  getMetrics,
  getMetricById,
  updateMetric,
  deleteMetric,
} from "../controllers/metricController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createMetric);

router.get("/", protect, getMetrics);

router.get("/:id", protect, getMetricById);

router.put("/:id", protect, updateMetric);

router.delete("/:id", protect, deleteMetric);

export default router;