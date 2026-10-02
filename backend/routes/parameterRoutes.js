import express from "express";

import {
  addParameter,
  getParameters,
  updateParameter,
  deleteParameter,
   getReportWithParameters,
} from "../controllers/parameterController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/:reportId/parameters",
  protect,
  addParameter
);

router.get(
  "/:reportId/parameters",
  protect,
  getParameters
);

router.put(
  "/:reportId/parameters/:parameterId",
  protect,
  updateParameter
);

router.delete(
  "/:reportId/parameters/:parameterId",
  protect,
  deleteParameter
);
router.get(
  "/:reportId/analysis",
  protect,
  getReportWithParameters
);
export default router;