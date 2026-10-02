import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import parameterRoutes from "./routes/parameterRoutes.js";
import metricRoutes from "./routes/metricRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import symptomRoutes from "./routes/symptomRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import insightRoutes from "./routes/insightRoutes.js";
import comparisonRoutes from "./routes/comparisonRoutes.js";
import timelineRoutes from "./routes/timelineRoutes.js";
import reportQuestionRoutes from "./routes/reportQuestionRoutes.js";
import visitPrepRoutes from "./routes/visitPrepRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/reports", parameterRoutes);
app.use("/api/health-metrics", metricRoutes);
app.use("/api/health-goals", goalRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/insights", insightRoutes);
app.use(
  "/api/report-questions",
  reportQuestionRoutes
);
app.use(
  "/api/comparison",
  comparisonRoutes
);
app.use(
  "/api/timeline",
  timelineRoutes
);
app.use(
  "/api/visit-prep",
  visitPrepRoutes
);
app.use("/api/ai", aiRoutes);




app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MediSense API is running",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "Database connection is working",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database test failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("\n🚀 MediSense Backend Started");
  console.log(`🔗 Backend: http://localhost:${PORT}`);
  console.log(`🌐 Frontend: http://localhost:5173`);
});