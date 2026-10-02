import fs from "fs";
import path from "path";
import pool from "../config/db.js";

export const createReport = async (req, res) => {
  try {
    const {
      reportName,
      reportType,
      fileUrl,
      fileName,
      fileType,
      reportDate,
      summary,
    } = req.body;

    if (!reportName || !reportName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Report name is required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO reports
      (
        user_id,
        report_name,
        report_type,
        file_url,
        file_name,
        file_type,
        report_date,
        status,
        summary
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING
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
      `,
      [
        req.user.userId,
        reportName.trim(),
        reportType || null,
        fileUrl || null,
        fileName || null,
        fileType || null,
        reportDate || null,
        "processing",
        summary || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Report created successfully",
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Create report error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create report",
    });
  }
};

export const getReports = async (req, res) => {
  try {
    const result = await pool.query(
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
      WHERE user_id = $1
      ORDER BY upload_date DESC
      `,
      [req.user.userId]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      reports: result.rows,
    });
  } catch (error) {
    console.error("Get reports error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch reports",
    });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
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
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Get report error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch report",
    });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      reportName,
      reportType,
      reportDate,
      status,
      summary,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE reports
      SET
        report_name = COALESCE($1, report_name),
        report_type = COALESCE($2, report_type),
        report_date = COALESCE($3, report_date),
        status = COALESCE($4, status),
        summary = COALESCE($5, summary),
        updated_at = NOW()
      WHERE id = $6
        AND user_id = $7
      RETURNING
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
      `,
      [
        reportName || null,
        reportType || null,
        reportDate || null,
        status || null,
        summary || null,
        id,
        req.user.userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report updated successfully",
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Update report error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update report",
    });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM reports
      WHERE id = $1
        AND user_id = $2
      RETURNING id
      `,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Delete report error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete report",
    });
  }
};
export const uploadReportFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Report file is required",
      });
    }

    const {
      reportName,
      reportType,
      reportDate,
      summary,
    } = req.body;

    if (!reportName || !reportName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Report name is required",
      });
    }

    const fileUrl = `/uploads/reports/${req.file.filename}`;

    const result = await pool.query(
      `
      INSERT INTO reports
      (
        user_id,
        report_name,
        report_type,
        file_url,
        file_name,
        file_type,
        report_date,
        status,
        summary
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING
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
      `,
      [
        req.user.userId,
        reportName.trim(),
        reportType || null,
        fileUrl,
        req.file.originalname,
        req.file.mimetype,
        reportDate || null,
        "processing",
        summary || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Report uploaded successfully",
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Upload report error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload report",
    });
  }
};
export const downloadReportFile = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        file_url,
        file_name,
        file_type
      FROM reports
      WHERE id = $1
        AND user_id = $2
      `,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const report = result.rows[0];

    if (!report.file_url) {
      return res.status(404).json({
        success: false,
        message: "No file is associated with this report",
      });
    }

    const filePath = path.join(
      process.cwd(),
      report.file_url.replace(/^\/+/, "")
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Report file not found on server",
      });
    }

    res.setHeader(
      "Content-Type",
      report.file_type || "application/octet-stream"
    );

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${report.file_name}"`
    );

    return res.sendFile(filePath);
  } catch (error) {
    console.error("Download report file error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve report file",
    });
  }
};
export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, summary } = req.body;

    const allowedStatuses = [
      "processing",
      "analyzing",
      "analyzed",
      "failed",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report status",
      });
    }

    const result = await pool.query(
      `
      UPDATE reports
      SET
        status = $1,
        summary = COALESCE($2, summary),
        updated_at = NOW()
      WHERE id = $3
        AND user_id = $4
      RETURNING
        id,
        report_name,
        report_type,
        file_name,
        file_type,
        report_date,
        status,
        summary,
        updated_at
      `,
      [
        status,
        summary || null,
        id,
        req.user.userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report status updated successfully",
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Update report status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update report status",
    });
  }
};