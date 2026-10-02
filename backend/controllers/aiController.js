import axios from "axios";
import pool from "../config/db.js";


const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL ||
  "http://127.0.0.1:8000";


export const predictDiabetes = async (req, res) => {
  try {

    // Send health data to Python AI service
    const aiResponse = await axios.post(
      `${AI_SERVICE_URL}/predict/diabetes`,
      req.body,
      {
        timeout: 30000,
      }
    );

    const aiData = aiResponse.data;

    const prediction =
      aiData.prediction;

    const explainability =
      aiData.explainability;


    // Save AI result as a health insight
    const insightQuery = `
      INSERT INTO health_insights (
        user_id,
        insight_type,
        title,
        description,
        severity,
        confidence,
        supporting_data,
        recommendation,
        status
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9
      )
      RETURNING *
    `;


    const description =
      `MediSense generated a diabetes `
      + `risk screening signal of `
      + `${prediction.risk_probability}%.`;


    const recommendation =
      `Consider discussing your diabetes `
      + `risk factors and appropriate `
      + `screening with a healthcare `
      + `professional. This result is `
      + `not a medical diagnosis.`;


    const insightResult =
      await pool.query(
        insightQuery,
        [
          req.user.userId,

          "diabetes_risk",

          "Diabetes Risk Screening",

          description,

          prediction.risk_band,

          prediction.risk_probability,

          JSON.stringify({
            model: aiData.model,
            prediction: prediction,
            explainability: explainability,
            input: req.body,
          }),

          recommendation,

          "active",
        ]
      );


    return res.json({
      success: true,

      data: aiData,

      insight: insightResult.rows[0],
    });


  } catch (error) {

    console.error(
      "Diabetes AI service error:",
      error.response?.data ||
      error.message
    );


    return res.status(502).json({
      success: false,
      message:
        "Diabetes AI service is currently unavailable.",
    });
  }
};