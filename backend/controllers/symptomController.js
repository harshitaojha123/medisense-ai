import pool from "../config/db.js";

export const createSymptom = async (req, res) => {
  try {
    const {
      symptomName,
      description,
      severity,
      startedAt,
      endedAt,
    } = req.body;

    if (!symptomName || !symptomName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Symptom name is required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO symptoms
      (
        user_id,
        symptom_name,
        description,
        severity,
        started_at,
        ended_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        user_id,
        symptom_name,
        description,
        severity,
        started_at,
        ended_at,
        created_at
      `,
      [
        req.user.userId,
        symptomName.trim(),
        description || null,
        severity || null,
        startedAt || null,
        endedAt || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Symptom created successfully",
      symptom: result.rows[0],
    });
  } catch (error) {
    console.error("Create symptom error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create symptom",
    });
  }
};

export const getSymptoms = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        symptom_name,
        description,
        severity,
        started_at,
        ended_at,
        created_at
      FROM symptoms
      WHERE user_id = $1
      ORDER BY started_at DESC NULLS LAST, created_at DESC
      `,
      [req.user.userId]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      symptoms: result.rows,
    });
  } catch (error) {
    console.error("Get symptoms error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch symptoms",
    });
  }
};

export const getSymptomById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        symptom_name,
        description,
        severity,
        started_at,
        ended_at,
        created_at
      FROM symptoms
      WHERE id = $1
        AND user_id = $2
      `,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Symptom not found",
      });
    }

    return res.status(200).json({
      success: true,
      symptom: result.rows[0],
    });
  } catch (error) {
    console.error("Get symptom error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch symptom",
    });
  }
};

export const updateSymptom = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      symptomName,
      description,
      severity,
      startedAt,
      endedAt,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE symptoms
      SET
        symptom_name = COALESCE($1, symptom_name),
        description = COALESCE($2, description),
        severity = COALESCE($3, severity),
        started_at = COALESCE($4, started_at),
        ended_at = COALESCE($5, ended_at)
      WHERE id = $6
        AND user_id = $7
      RETURNING
        id,
        user_id,
        symptom_name,
        description,
        severity,
        started_at,
        ended_at,
        created_at
      `,
      [
        symptomName || null,
        description || null,
        severity || null,
        startedAt || null,
        endedAt || null,
        id,
        req.user.userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Symptom not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Symptom updated successfully",
      symptom: result.rows[0],
    });
  } catch (error) {
    console.error("Update symptom error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update symptom",
    });
  }
};

export const deleteSymptom = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM symptoms
      WHERE id = $1
        AND user_id = $2
      RETURNING id
      `,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Symptom not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Symptom deleted successfully",
    });
  } catch (error) {
    console.error("Delete symptom error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete symptom",
    });
  }
};