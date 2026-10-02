import express from "express";

import {
  createSymptom,
  getSymptoms,
  getSymptomById,
  updateSymptom,
  deleteSymptom,
  
} from "../controllers/symptomController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createSymptom);

router.get("/", protect, getSymptoms);

router.get("/:id", protect, getSymptomById);

router.put("/:id", protect, updateSymptom);

router.delete("/:id", protect, deleteSymptom);

export default router;