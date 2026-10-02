import pool from "../config/db.js";

export const createGoal = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      targetValue,
      currentValue,
      unit,
      progress,
      status,
      targetDate,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Goal title is required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO health_goals
      (
        user_id,
        title,
        description,
        category,
        target_value,
        current_value,
        unit,
        progress,
        status,
        target_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING
        id,
        user_id,
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
      `,
      [
        req.user.userId,
        title.trim(),
        description || null,
        category || null,
        targetValue ?? null,
        currentValue ?? null,
        unit || null,
        progress ?? 0,
        status || "active",
        targetDate || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Health goal created successfully",
      goal: result.rows[0],
    });
  } catch (error) {
    console.error("Create goal error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create health goal",
    });
  }
};

export const getGoals = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
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
      ORDER BY created_at DESC
      `,
      [req.user.userId]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      goals: result.rows,
    });
  } catch (error) {
    console.error("Get goals error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch health goals",
    });
  }
};

export const getGoalById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
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
      WHERE id = $1
        AND user_id = $2
      `,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Health goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      goal: result.rows[0],
    });
  } catch (error) {
    console.error("Get goal error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch health goal",
    });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      category,
      targetValue,
      currentValue,
      unit,
      progress,
      status,
      targetDate,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE health_goals
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        category = COALESCE($3, category),
        target_value = COALESCE($4, target_value),
        current_value = COALESCE($5, current_value),
        unit = COALESCE($6, unit),
        progress = COALESCE($7, progress),
        status = COALESCE($8, status),
        target_date = COALESCE($9, target_date),
        updated_at = NOW()
      WHERE id = $10
        AND user_id = $11
      RETURNING
        id,
        user_id,
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
      `,
      [
        title || null,
        description || null,
        category || null,
        targetValue ?? null,
        currentValue ?? null,
        unit || null,
        progress ?? null,
        status || null,
        targetDate || null,
        id,
        req.user.userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Health goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Health goal updated successfully",
      goal: result.rows[0],
    });
  } catch (error) {
    console.error("Update goal error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update health goal",
    });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM health_goals
      WHERE id = $1
        AND user_id = $2
      RETURNING id
      `,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Health goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Health goal deleted successfully",
    });
  } catch (error) {
    console.error("Delete goal error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete health goal",
    });
  }
};