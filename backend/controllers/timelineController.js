import pool from "../config/db.js";

export const getHealthTimeline = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [
      reportsResult,
      metricsResult,
      symptomsResult,
      goalsResult,
      insightsResult,
    ] = await Promise.all([
      pool.query(
        `
        SELECT
          id,
          report_name,
          report_type,
          report_date,
          upload_date,
          status,
          summary,
          created_at
        FROM reports
        WHERE user_id = $1
        `,
        [userId]
      ),

      pool.query(
        `
        SELECT
          id,
          metric_name,
          value,
          unit,
          measured_at,
          source_report_id,
          created_at
        FROM health_metrics
        WHERE user_id = $1
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
          target_date,
          created_at,
          updated_at
        FROM health_goals
        WHERE user_id = $1
        `,
        [userId]
      ),

      pool.query(
        `
        SELECT
          id,
          report_id,
          insight_type,
          title,
          description,
          severity,
          confidence,
          recommendation,
          status,
          created_at
        FROM health_insights
        WHERE user_id = $1
        `,
        [userId]
      ),
    ]);

    const timeline = [];

    // Reports
    for (const report of reportsResult.rows) {
      timeline.push({
        id: report.id,
        type: "report",
        title: report.report_name,
        description:
          report.summary ||
          "Medical report uploaded",
        date:
          report.report_date ||
          report.upload_date,
        status: report.status,
        data: {
          reportType: report.report_type,
          reportId: report.id,
        },
      });
    }

    // Health metrics
    for (const metric of metricsResult.rows) {
      timeline.push({
        id: metric.id,
        type: "metric",
        title: metric.metric_name,
        description: `${metric.value} ${
          metric.unit || ""
        }`.trim(),
        date: metric.measured_at,
        status: "recorded",
        data: {
          metricName: metric.metric_name,
          value: Number(metric.value),
          unit: metric.unit,
          sourceReportId:
            metric.source_report_id,
        },
      });
    }

    // Symptoms
    for (const symptom of symptomsResult.rows) {
      timeline.push({
        id: symptom.id,
        type: "symptom",
        title: symptom.symptom_name,
        description:
          symptom.description ||
          "Symptom recorded",
        date:
          symptom.started_at ||
          symptom.created_at,
        status: symptom.ended_at
          ? "resolved"
          : "active",
        data: {
          severity: symptom.severity,
          startedAt: symptom.started_at,
          endedAt: symptom.ended_at,
        },
      });
    }

    // Goals
    for (const goal of goalsResult.rows) {
      timeline.push({
        id: goal.id,
        type: "goal",
        title: goal.title,
        description:
          goal.description ||
          "Health goal created",
        date: goal.created_at,
        status: goal.status,
        data: {
          category: goal.category,
          targetValue: goal.target_value,
          currentValue: goal.current_value,
          unit: goal.unit,
          progress: Number(
            goal.progress || 0
          ),
          targetDate: goal.target_date,
        },
      });
    }

    // AI insights
    for (const insight of insightsResult.rows) {
      timeline.push({
        id: insight.id,
        type: "insight",
        title: insight.title,
        description: insight.description,
        date: insight.created_at,
        status: insight.status,
        data: {
          insightType: insight.insight_type,
          severity: insight.severity,
          confidence: insight.confidence,
          recommendation:
            insight.recommendation,
          reportId: insight.report_id,
        },
      });
    }

    // Newest events first
    timeline.sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

    return res.status(200).json({
      success: true,
      count: timeline.length,
      timeline,
    });
  } catch (error) {
    console.error(
      "Health timeline error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch health timeline",
    });
  }
};