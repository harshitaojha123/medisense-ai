import express from "express";

import {
  getDoctorVisitPrep,
} from "../controllers/visitPrepController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getDoctorVisitPrep
);

export default router;