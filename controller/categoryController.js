import Category from "../model/courseCategory.js";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { categoryName, categoryCode } = req.body;

    if (!categoryName || !categoryCode) {
      return res.status(400).json({
        message: "categoryName and categoryCode are required.",
        status: false,
      });
    }

    const existing = await Category.findOne({
      where: { categoryCode: categoryCode.toUpperCase() },
    });

    if (existing) {
      return res.status(409).json({
        message: "Category with this code already exists.",
        status: false,
      });
    }

    const newCategory = await Category.create({
      categoryName,
      categoryCode: categoryCode.toUpperCase(),
    });

    return res.status(201).json({
      message: "Category created successfully.",
      status: true,
      data: newCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error.",
      status: false,
      error: error.message,
    });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    return res.status(200).json({
      message: "Categories fetched successfully.",
      status: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch categories.",
      status: false,
      error: error.message,
    });
  }
};

// Bulk upload categories
export const bulkCreateCategories = async (req, res) => {
  try {
    const categories = req.body; // Expecting an array

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({
        message: "Please send a non-empty array of categories.",
        status: false,
      });
    }

    // Convert categoryCode to uppercase and filter out duplicates
    const dataToInsert = categories.map((cat) => ({
      categoryName: cat.categoryName,
      categoryCode: cat.categoryCode.toUpperCase(),
    }));

    const inserted = await Category.bulkCreate(dataToInsert, {
      ignoreDuplicates: true,
    });

    return res.status(201).json({
      message: "Bulk categories uploaded.",
      status: true,
      data: inserted,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Bulk insert failed.",
      status: false,
      error: error.message,
    });
  }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Category fetched.",
      status: true,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch category.",
      status: false,
      error: error.message,
    });
  }
};

// Get category by code
export const getCategoryByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const category = await Category.findOne({
      where: { categoryCode: code.toUpperCase() },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Category fetched.",
      status: true,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch category.",
      status: false,
      error: error.message,
    });
  }
};

// DELETE: Soft delete category by ID
export const deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
        status: false,
      });
    }

    await category.destroy(); // Soft deletes (sets deletedAt)

    return res.status(200).json({
      message: "Category deleted successfully (soft delete).",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete category.",
      status: false,
      error: error.message,
    });
  }
};
