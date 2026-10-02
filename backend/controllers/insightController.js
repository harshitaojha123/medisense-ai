import pool from "../config/db.js";

export const createInsight = async (req, res) => {
  try {
    const {
      reportId,
      insightType,
      title,
      description,
      severity,
      confidence,
      supportingData,
      recommendation,
      status,
    } = req.body;

    if (
      !insightType ||
      !title ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Insight type, title and description are required",
      });
    }

    // If a report is supplied, verify ownership.
    if (reportId) {
      const reportResult = await pool.query(
        `
        SELECT id
        FROM reports
        WHERE id = $1
          AND user_id = $2
        `,
        [reportId, req.user.userId]
      );

      if (reportResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Report not found",
        });
      }
    }

    const result = await pool.query(
      `
      INSERT INTO health_insights
      (
        user_id,
        report_id,
        insight_type,
        title,
        description,
        severity,
        confidence,
        supporting_data,
        recommendation,
        status
      )
      VALUES
      (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10
      )
      RETURNING
        id,
        user_id,
        report_id,
        insight_type,
        title,
        description,
        severity,
        confidence,
        supporting_data,
        recommendation,
        status,
        created_at,
        updated_at
      `,
      [
        req.user.userId,
        reportId || null,
        insightType,
        title.trim(),
        description.trim(),
        severity || null,
        confidence ?? null,
        supportingData
          ? JSON.stringify(supportingData)
          : null,
        recommendation || null,
        status || "active",
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Health insight created successfully",
      insight: result.rows[0],
    });
  } catch (error) {
    console.error("Create insight error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create health insight",
    });
  }
};

export const getInsights = async (req, res) => {
  try {
    const {
      reportId,
      insightType,
      status,
    } = req.query;

    const values = [req.user.userId];

    let query = `
      SELECT
        id,
        user_id,
        report_id,
        insight_type,
        title,
        description,
        severity,
        confidence,
        supporting_data,
        recommendation,
        status,
        created_at,
        updated_at
      FROM health_insights
      WHERE user_id = $1
    `;

    if (reportId) {
      values.push(reportId);
      query += ` AND report_id = $${values.length}`;
    }

    if (insightType) {
      values.push(insightType);
      query += ` AND insight_type = $${values.length}`;
    }

    if (status) {
      values.push(status);
      query += ` AND status = $${values.length}`;
    }

    query += `
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      insights: result.rows,
    });
  } catch (error) {
    console.error("Get insights error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch health insights",
    });
  }
};

export const getInsightById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        report_id,
        insight_type,
        title,
        description,
        severity,
        confidence,
        supporting_data,
        recommendation,
        status,
        created_at,
        updated_at
      FROM health_insights
      WHERE id = $1
        AND user_id = $2
      `,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Health insight not found",
      });
    }

    return res.status(200).json({
      success: true,
      insight: result.rows[0],
    });
  } catch (error) {
    console.error("Get insight error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch health insight",
    });
  }
};

export const updateInsight = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      severity,
      confidence,
      supportingData,
      recommendation,
      status,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE health_insights
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        severity = COALESCE($3, severity),
        confidence = COALESCE($4, confidence),
        supporting_data =
          COALESCE($5, supporting_data),
        recommendation =
          COALESCE($6, recommendation),
        status = COALESCE($7, status),
        updated_at = NOW()
      WHERE id = $8
        AND user_id = $9
      RETURNING
        id,
        user_id,
        report_id,
        insight_type,
        title,
        description,
        severity,
        confidence,
        supporting_data,
        recommendation,
        status,
        created_at,
        updated_at
      `,
      [
        title || null,
        description || null,
        severity || null,
        confidence ?? null,
        supportingData
          ? JSON.stringify(supportingData)
          : null,
        recommendation || null,
        status || null,
        id,
        req.user.userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Health insight not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Health insight updated successfully",
      insight: result.rows[0],
    });
  } catch (error) {
    console.error("Update insight error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update health insight",
    });
  }
};

export const deleteInsight = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM health_insights
      WHERE id = $1
        AND user_id = $2
      RETURNING id
      `,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Health insight not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Health insight deleted successfully",
    });
  } catch (error) {
    console.error("Delete insight error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete health insight",
    });
  }
};