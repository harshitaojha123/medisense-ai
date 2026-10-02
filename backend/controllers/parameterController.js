import pool from "../config/db.js";

export const addParameter = async (req, res) => {
  try {
    const { reportId } = req.params;

    const {
      parameterName,
      value,
      unit,
      referenceMin,
      referenceMax,
      flag,
      category,
      extractedText,
    } = req.body;

    if (!parameterName || !parameterName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Parameter name is required",
      });
    }

    // Make sure this report belongs to the logged-in user
    const reportCheck = await pool.query(
      `
      SELECT id
      FROM reports
      WHERE id = $1
        AND user_id = $2
      `,
      [reportId, req.user.userId]
    );

    if (reportCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO report_parameters
      (
        report_id,
        parameter_name,
        value,
        unit,
        reference_min,
        reference_max,
        flag,
        category,
        extracted_text
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING
        id,
        report_id,
        parameter_name,
        value,
        unit,
        reference_min,
        reference_max,
        flag,
        category,
        extracted_text,
        created_at
      `,
      [
        reportId,
        parameterName.trim(),
        value ?? null,
        unit || null,
        referenceMin ?? null,
        referenceMax ?? null,
        flag || null,
        category || null,
        extractedText || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Parameter added successfully",
      parameter: result.rows[0],
    });
  } catch (error) {
    console.error("Add parameter error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add parameter",
    });
  }
};

export const getParameters = async (req, res) => {
  try {
    const { reportId } = req.params;

    // Verify report ownership
    const reportCheck = await pool.query(
      `
      SELECT id
      FROM reports
      WHERE id = $1
        AND user_id = $2
      `,
      [reportId, req.user.userId]
    );

    if (reportCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        report_id,
        parameter_name,
        value,
        unit,
        reference_min,
        reference_max,
        flag,
        category,
        extracted_text,
        created_at
      FROM report_parameters
      WHERE report_id = $1
      ORDER BY parameter_name ASC
      `,
      [reportId]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      parameters: result.rows,
    });
  } catch (error) {
    console.error("Get parameters error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch parameters",
    });
  }
};

export const updateParameter = async (req, res) => {
  try {
    const { reportId, parameterId } = req.params;

    const {
      parameterName,
      value,
      unit,
      referenceMin,
      referenceMax,
      flag,
      category,
      extractedText,
    } = req.body;

    // Verify report ownership
    const reportCheck = await pool.query(
      `
      SELECT id
      FROM reports
      WHERE id = $1
        AND user_id = $2
      `,
      [reportId, req.user.userId]
    );

    if (reportCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const result = await pool.query(
      `
      UPDATE report_parameters
      SET
        parameter_name = COALESCE($1, parameter_name),
        value = COALESCE($2, value),
        unit = COALESCE($3, unit),
        reference_min = COALESCE($4, reference_min),
        reference_max = COALESCE($5, reference_max),
        flag = COALESCE($6, flag),
        category = COALESCE($7, category),
        extracted_text = COALESCE($8, extracted_text)
      WHERE id = $9
        AND report_id = $10
      RETURNING
        id,
        report_id,
        parameter_name,
        value,
        unit,
        reference_min,
        reference_max,
        flag,
        category,
        extracted_text,
        created_at
      `,
      [
        parameterName || null,
        value ?? null,
        unit || null,
        referenceMin ?? null,
        referenceMax ?? null,
        flag || null,
        category || null,
        extractedText || null,
        parameterId,
        reportId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Parameter not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Parameter updated successfully",
      parameter: result.rows[0],
    });
  } catch (error) {
    console.error("Update parameter error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update parameter",
    });
  }
};

export const deleteParameter = async (req, res) => {
  try {
    const { reportId, parameterId } = req.params;

    // Verify report ownership
    const reportCheck = await pool.query(
      `
      SELECT id
      FROM reports
      WHERE id = $1
        AND user_id = $2
      `,
      [reportId, req.user.userId]
    );

    if (reportCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM report_parameters
      WHERE id = $1
        AND report_id = $2
      RETURNING id
      `,
      [parameterId, reportId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Parameter not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Parameter deleted successfully",
    });
  } catch (error) {
    console.error("Delete parameter error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete parameter",
    });
  }
};
export const getReportWithParameters = async (req, res) => {
  try {
    const { reportId } = req.params;

    // First verify that the report belongs to the logged-in user
    const reportResult = await pool.query(
      `
      SELECT
        id,
        user_id,
        report_name,
        report_type,
        file_url,
        file_name,
        file_type,
        report_date,
        upload_date,
        status,
        summary,
        created_at,
        updated_at
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

    const parametersResult = await pool.query(
      `
      SELECT
        id,
        report_id,
        parameter_name,
        value,
        unit,
        reference_min,
        reference_max,
        flag,
        category,
        extracted_text,
        created_at
      FROM report_parameters
      WHERE report_id = $1
      ORDER BY category, parameter_name
      `,
      [reportId]
    );

    return res.status(200).json({
      success: true,
      report: reportResult.rows[0],
      parameters: parametersResult.rows,
      parameterCount: parametersResult.rows.length,
    });
  } catch (error) {
    console.error(
      "Get report with parameters error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch report analysis data",
    });
  }
};