import pool from "../config/db.js";

export const getDoctorVisitPrep = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [
      userResult,
      reportsResult,
      metricsResult,
      symptomsResult,
      goalsResult,
      insightsResult,
    ] = await Promise.all([
      pool.query(
        `
        SELECT
          name,
          date_of_birth,
          blood_group
        FROM users
        WHERE id = $1
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
          status,
          summary
        FROM reports
        WHERE user_id = $1
        ORDER BY report_date DESC NULLS LAST
        LIMIT 10
        `,
        [userId]
      ),

      pool.query(
        `
        SELECT
          metric_name,
          value,
          unit,
          measured_at
        FROM health_metrics
        WHERE user_id = $1
        ORDER BY measured_at DESC
        LIMIT 15
        `,
        [userId]
      ),

      pool.query(
        `
        SELECT
          symptom_name,
          description,
          severity,
          started_at,
          ended_at
        FROM symptoms
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 10
        `,
        [userId]
      ),

      pool.query(
        `
        SELECT
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
        ORDER BY created_at DESC
        LIMIT 10
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
          created_at
        FROM health_insights
        WHERE user_id = $1
          AND status = 'active'
        ORDER BY created_at DESC
        LIMIT 10
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

    const user = userResult.rows[0];

    const discussionTopics = [];

    for (const insight of insightsResult.rows) {
      discussionTopics.push({
        type: "health_insight",
        title: insight.title,
        description: insight.description,
        severity: insight.severity,
        recommendation: insight.recommendation,
      });
    }

    for (const symptom of symptomsResult.rows) {
      discussionTopics.push({
        type: "symptom",
        title: symptom.symptom_name,
        description:
          symptom.description ||
          "Symptom recorded",
        severity: symptom.severity,
        startedAt: symptom.started_at,
        endedAt: symptom.ended_at,
      });
    }

    const suggestedQuestions = [
      "Which results should I discuss during this visit?",
      "Are there any trends in my recent health data that I should understand?",
      "Which measurements should I continue monitoring?",
      "Are any of my current symptoms relevant to these results?",
      "Are there any follow-up tests or evaluations I should discuss?",
    ];

    return res.status(200).json({
      success: true,

      visitPrep: {
        patient: {
          name: user.name,
          dateOfBirth: user.date_of_birth,
          bloodGroup: user.blood_group,
        },

        recentReports: reportsResult.rows,

        recentMetrics: metricsResult.rows,

        recentSymptoms: symptomsResult.rows,

        healthGoals: goalsResult.rows,

        activeInsights: insightsResult.rows,

        discussionTopics,

        suggestedQuestions,

        disclaimer:
          "This summary is for preparing for a healthcare discussion. It is not a diagnosis or a substitute for professional medical advice.",
      },
    });
  } catch (error) {
    console.error(
      "Doctor visit prep error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to prepare doctor visit summary",
    });
  }
};