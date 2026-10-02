import pool from "../config/db.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [
      userResult,
      reportStatsResult,
      recentReportsResult,
      metricsResult,
      goalsResult,
      symptomsResult,
    ] = await Promise.all([
      pool.query(
        `
        SELECT
          id,
          name,
          email,
          date_of_birth,
          blood_group,
          profile_image
        FROM users
        WHERE id = $1
        `,
        [userId]
      ),

      pool.query(
        `
        SELECT
          COUNT(*)::int AS total_reports,
          COUNT(*) FILTER (
            WHERE status = 'analyzed'
          )::int AS analyzed_reports,
          COUNT(*) FILTER (
            WHERE status = 'processing'
          )::int AS processing_reports,
          COUNT(*) FILTER (
            WHERE status = 'analyzing'
          )::int AS analyzing_reports,
          COUNT(*) FILTER (
            WHERE status = 'failed'
          )::int AS failed_reports
        FROM reports
        WHERE user_id = $1
        `,
        [userId]
      ),

      pool.query(
        `
        SELECT
          id,
          report_name,
          report_type,
          report_date,
          upload_date,
          status,
          summary
        FROM reports
        WHERE user_id = $1
        ORDER BY upload_date DESC
        LIMIT 5
        `,
        [userId]
      ),

      pool.query(
        `
        SELECT
          hm.id,
          hm.metric_name,
          hm.value,
          hm.unit,
          hm.measured_at,
          hm.source_report_id,
          r.report_name
        FROM health_metrics hm
        LEFT JOIN reports r
          ON hm.source_report_id = r.id
        WHERE hm.user_id = $1
        ORDER BY hm.measured_at DESC
        LIMIT 10
        `,
        [userId]
      ),

      pool.query(
        `
        SELECT
          id,
          title,
          description,
          category,
          target_value,
          current_value,
          unit,
          progress,
          status,
          target_date
        FROM health_goals
        WHERE user_id = $1
          AND status = 'active'
        ORDER BY created_at DESC
        LIMIT 5
        `,
        [userId]
      ),

      pool.query(
        `
        SELECT
          id,
          symptom_name,
          description,
          severity,
          started_at,
          ended_at,
          created_at
        FROM symptoms
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 5
        `,
        [userId]
      ),
    ]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,

      user: userResult.rows[0],

      reportStats: reportStatsResult.rows[0],

      recentReports: recentReportsResult.rows,

      latestMetrics: metricsResult.rows,

      activeGoals: goalsResult.rows,

      recentSymptoms: symptomsResult.rows,
    });
  } catch (error) {
    console.error("Dashboard data error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch dashboard data",
    });
  }
};