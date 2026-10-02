import express from "express";

import {
  compareReports,
} from "../controllers/comparisonController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/reports",
  protect,
  compareReports
);

export default router;