import pool from "../config/db.js";

export const createMetric = async (req, res) => {
  try {
    const {
      metricName,
      value,
      unit,
      measuredAt,
      sourceReportId,
    } = req.body;

    if (!metricName || metricName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Metric name is required",
      });
    }

    if (value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        message: "Metric value is required",
      });
    }

    if (!measuredAt) {
      return res.status(400).json({
        success: false,
        message: "Measurement date is required",
      });
    }

    // If a source report is provided,
    // verify that it belongs to the logged-in user.
    if (sourceReportId) {
      const reportCheck = await pool.query(
        `
        SELECT id
        FROM reports
        WHERE id = $1
          AND user_id = $2
        `,
        [sourceReportId, req.user.userId]
      );

      if (reportCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Source report not found",
        });
      }
    }

    const result = await pool.query(
      `
      INSERT INTO health_metrics
      (
        user_id,
        metric_name,
        value,
        unit,
        measured_at,
        source_report_id
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        user_id,
        metric_name,
        value,
        unit,
        measured_at,
        source_report_id,
        created_at
      `,
      [
        req.user.userId,
        metricName.trim(),
        value,
        unit || null,
        measuredAt,
        sourceReportId || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Health metric created successfully",
      metric: result.rows[0],
    });
  } catch (error) {
    console.error("Create metric error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create health metric",
    });
  }
};

export const getMetrics = async (req, res) => {
  try {
    const { metricName, startDate, endDate } = req.query;

    const values = [req.user.userId];

    let query = `
      SELECT
        hm.id,
        hm.user_id,
        hm.metric_name,
        hm.value,
        hm.unit,
        hm.measured_at,
        hm.source_report_id,
        hm.created_at,
        r.report_name
      FROM health_metrics hm
      LEFT JOIN reports r
        ON hm.source_report_id = r.id
      WHERE hm.user_id = $1
    `;

    if (metricName) {
      values.push(metricName);
      query += ` AND LOWER(hm.metric_name) = LOWER($${values.length})`;
    }

    if (startDate) {
      values.push(startDate);
      query += ` AND hm.measured_at >= $${values.length}`;
    }

    if (endDate) {
      values.push(endDate);
      query += ` AND hm.measured_at <= $${values.length}`;
    }

    query += ` ORDER BY hm.measured_at ASC`;

    const result = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      metrics: result.rows,
    });
  } catch (error) {
    console.error("Get metrics error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch health metrics",
    });
  }
};

export const getMetricById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        hm.id,
        hm.user_id,
        hm.metric_name,
        hm.value,
        hm.unit,
        hm.measured_at,
        hm.source_report_id,
        hm.created_at,
        r.report_name
      FROM health_metrics hm
      LEFT JOIN reports r
        ON hm.source_report_id = r.id
      WHERE hm.id = $1
        AND hm.user_id = $2
      `,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Health metric not found",
      });
    }

    return res.status(200).json({
      success: true,
      metric: result.rows[0],
    });
  } catch (error) {
    console.error("Get metric error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch health metric",
    });
  }
};

export const updateMetric = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      metricName,
      value,
      unit,
      measuredAt,
      sourceReportId,
    } = req.body;

    if (sourceReportId) {
      const reportCheck = await pool.query(
        `
        SELECT id
        FROM reports
        WHERE id = $1
          AND user_id = $2
        `,
        [sourceReportId, req.user.userId]
      );

      if (reportCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Source report not found",
        });
      }
    }

    const result = await pool.query(
      `
      UPDATE health_metrics
      SET
        metric_name = COALESCE($1, metric_name),
        value = COALESCE($2, value),
        unit = COALESCE($3, unit),
        measured_at = COALESCE($4, measured_at),
        source_report_id = COALESCE($5, source_report_id)
      WHERE id = $6
        AND user_id = $7
      RETURNING
        id,
        user_id,
        metric_name,
        value,
        unit,
        measured_at,
        source_report_id,
        created_at
      `,
      [
        metricName || null,
        value ?? null,
        unit || null,
        measuredAt || null,
        sourceReportId || null,
        id,
        req.user.userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Health metric not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Health metric updated successfully",
      metric: result.rows[0],
    });
  } catch (error) {
    console.error("Update metric error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update health metric",
    });
  }
};

export const deleteMetric = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM health_metrics
      WHERE id = $1
        AND user_id = $2
      RETURNING id
      `,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Health metric not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Health metric deleted successfully",
    });
  } catch (error) {
    console.error("Delete metric error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete health metric",
    });
  }
};