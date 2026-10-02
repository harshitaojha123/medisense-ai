import express from "express";

import {
  getReportQuestionContext,
} from "../controllers/reportQuestionController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/:reportId/context",
  protect,
  getReportQuestionContext
);

export default router;