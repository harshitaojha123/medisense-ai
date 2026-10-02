import express from "express";

import {
  predictDiabetes,
} from "../controllers/aiController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post(
  "/diabetes",
  protect,
  predictDiabetes
);


export default router;