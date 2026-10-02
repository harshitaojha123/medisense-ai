import express from "express";

import {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  uploadReportFile,
  downloadReportFile,
  updateReportStatus,
} from "../controllers/reportController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, createReport);

router.post(
  "/upload",
  protect,
  upload.single("report"),
  uploadReportFile
);

router.get("/", protect, getReports);

router.get(
  "/:id/file",
  protect,
  downloadReportFile
);

router.patch(
  "/:id/status",
  protect,
  updateReportStatus
);

router.get(
  "/:id",
  protect,
  getReportById
);

router.put(
  "/:id",
  protect,
  updateReport
);

router.delete(
  "/:id",
  protect,
  deleteReport
);

export default router;