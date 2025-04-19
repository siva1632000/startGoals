// controller/goalController.js
import Goal from "../model/goal.js";

export const bulkUploadGoals = async (req, res) => {
  try {
    const goals = req.body;

    if (!Array.isArray(goals) || goals.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Request body must be a non-empty array of goals",
      });
    }

    // Validate each goal
    for (const goal of goals) {
      if (!goal.goalName || typeof goal.goalName !== "string") {
        return res.status(400).json({
          status: false,
          message: "Each goal must have a valid goalName",
        });
      }
    }

    const createdGoals = await Goal.bulkCreate(goals, {
      ignoreDuplicates: true, // Optional: skip duplicate goalName
    });

    return res.status(201).json({
      status: true,
      message: "Goals uploaded successfully",
      data: createdGoals,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to upload goals",
      error: error.message,
    });
  }
};

export const getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.findAll({
      attributes: ["goalId", "goalName"],
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({
      status: true,
      message: "Goals fetched successfully",
      data: goals,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch goals",
      error: error.message,
    });
  }
};
