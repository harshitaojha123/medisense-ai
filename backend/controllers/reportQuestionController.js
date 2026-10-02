import pool from "../config/db.js";

export const getReportQuestionContext = async (req, res) => {
  try {
    const { reportId } = req.params;

    // Verify report ownership and retrieve report information
    const reportResult = await pool.query(
      `
      SELECT
        id,
        report_name,
        report_type,
        report_date,
        status,
        summary
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

    const report = reportResult.rows[0];

    // Retrieve all extracted parameters
    const parametersResult = await pool.query(
      `
      SELECT
        id,
        parameter_name,
        value,
        unit,
        reference_min,
        reference_max,
        flag,
        category,
        extracted_text
      FROM report_parameters
      WHERE report_id = $1
      ORDER BY category, parameter_name
      `,
      [reportId]
    );

    return res.status(200).json({
      success: true,

      context: {
        report: {
          id: report.id,
          name: report.report_name,
          type: report.report_type,
          date: report.report_date,
          status: report.status,
          summary: report.summary,
        },

        parameters: parametersResult.rows,

        parameterCount:
          parametersResult.rows.length,
      },
    });
  } catch (error) {
    console.error(
      "Get report question context error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to prepare report context",
    });
  }
};