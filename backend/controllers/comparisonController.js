import pool from "../config/db.js";

export const compareReports = async (req, res) => {
  try {
    const { currentReportId, previousReportId } = req.query;

    if (!currentReportId || !previousReportId) {
      return res.status(400).json({
        success: false,
        message:
          "currentReportId and previousReportId are required",
      });
    }

    if (currentReportId === previousReportId) {
      return res.status(400).json({
        success: false,
        message:
          "Current and previous report cannot be the same",
      });
    }

    // Verify both reports belong to the logged-in user
    const reportsResult = await pool.query(
      `
      SELECT
        id,
        report_name,
        report_type,
        report_date,
        status
      FROM reports
      WHERE id IN ($1, $2)
        AND user_id = $3
      `,
      [
        currentReportId,
        previousReportId,
        req.user.userId,
      ]
    );

    if (reportsResult.rows.length !== 2) {
      return res.status(404).json({
        success: false,
        message: "One or both reports were not found",
      });
    }

    const currentReport = reportsResult.rows.find(
      (report) => report.id === currentReportId
    );

    const previousReport = reportsResult.rows.find(
      (report) => report.id === previousReportId
    );

    // Get parameters from both reports
    const parametersResult = await pool.query(
      `
      SELECT
        report_id,
        parameter_name,
        value,
        unit,
        reference_min,
        reference_max,
        flag,
        category
      FROM report_parameters
      WHERE report_id IN ($1, $2)
      ORDER BY parameter_name
      `,
      [
        currentReportId,
        previousReportId,
      ]
    );

    const currentParameters = new Map();
    const previousParameters = new Map();

    for (const parameter of parametersResult.rows) {
      const normalizedName =
        parameter.parameter_name.trim().toLowerCase();

      if (parameter.report_id === currentReportId) {
        currentParameters.set(
          normalizedName,
          parameter
        );
      }

      if (parameter.report_id === previousReportId) {
        previousParameters.set(
          normalizedName,
          parameter
        );
      }
    }

    const comparisons = [];

    // Parameters present in the current report
    for (const [name, current] of currentParameters) {
      const previous = previousParameters.get(name);

      if (!previous) {
        comparisons.push({
          parameterName: current.parameter_name,
          category: current.category,
          unit: current.unit,
          currentValue: current.value,
          previousValue: null,
          change: null,
          changePercent: null,
          direction: "new",
          currentFlag: current.flag,
          previousFlag: null,
        });

        continue;
      }

      const currentValue =
        current.value !== null
          ? Number(current.value)
          : null;

      const previousValue =
        previous.value !== null
          ? Number(previous.value)
          : null;

      let change = null;
      let changePercent = null;
      let direction = "stable";

      if (
        currentValue !== null &&
        previousValue !== null
      ) {
        change = currentValue - previousValue;

        if (previousValue !== 0) {
          changePercent =
            (change / Math.abs(previousValue)) * 100;
        }

        // Small numerical differences are treated as stable.
        if (Math.abs(change) < 0.01) {
          direction = "stable";
        } else if (change > 0) {
          direction = "increased";
        } else {
          direction = "decreased";
        }
      }

      comparisons.push({
        parameterName: current.parameter_name,
        category: current.category,
        unit: current.unit,
        currentValue,
        previousValue,
        change,
        changePercent,
        direction,
        currentFlag: current.flag,
        previousFlag: previous.flag,
        referenceMin: current.reference_min,
        referenceMax: current.reference_max,
      });
    }

    // Parameters that existed previously but are absent now
    for (const [name, previous] of previousParameters) {
      if (!currentParameters.has(name)) {
        comparisons.push({
          parameterName: previous.parameter_name,
          category: previous.category,
          unit: previous.unit,
          currentValue: null,
          previousValue:
            previous.value !== null
              ? Number(previous.value)
              : null,
          change: null,
          changePercent: null,
          direction: "removed",
          currentFlag: null,
          previousFlag: previous.flag,
        });
      }
    }

    const summary = {
      totalCompared: comparisons.length,

      increased: comparisons.filter(
        (item) => item.direction === "increased"
      ).length,

      decreased: comparisons.filter(
        (item) => item.direction === "decreased"
      ).length,

      stable: comparisons.filter(
        (item) => item.direction === "stable"
      ).length,

      newParameters: comparisons.filter(
        (item) => item.direction === "new"
      ).length,

      removedParameters: comparisons.filter(
        (item) => item.direction === "removed"
      ).length,
    };

    return res.status(200).json({
      success: true,

      currentReport,
      previousReport,

      summary,

      comparisons,
    });
  } catch (error) {
    console.error(
      "Compare reports error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to compare reports",
    });
  }
};