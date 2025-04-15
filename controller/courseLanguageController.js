import CourseLanguage from "../model/courseLanguage.js";

// 🚀 POST: Create a new language
export const createCourseLanguage = async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "Name and code are required." });
    }

    const exists = await CourseLanguage.findOne({ where: { name } });
    if (exists) {
      return res.status(409).json({ message: "Language already exists." });
    }

    const newLanguage = await CourseLanguage.create({ name, code });
    return res
      .status(201)
      .json({ message: "Language created.", data: newLanguage });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

// 🔍 GET: All languages
export const getAllCourseLanguages = async (req, res) => {
  try {
    const languages = await CourseLanguage.findAll();
    return res
      .status(200)
      .json({ message: "Languages fetched.", data: languages });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching languages.", error: error.message });
  }
};

// 🔍 GET: Single by ID
export const getCourseLanguageById = async (req, res) => {
  try {
    const { id } = req.params;
    const language = await CourseLanguage.findByPk(id);
    if (!language) {
      return res.status(404).json({ message: "Language not found." });
    }
    return res.status(200).json({ message: "Language found.", data: language });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching language.", error: error.message });
  }
};

// ✏️ PUT: Update language
export const updateCourseLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;

    const language = await CourseLanguage.findByPk(id);
    if (!language) {
      return res.status(404).json({ message: "Language not found." });
    }

    await language.update({
      name: name || language.name,
      code: code || language.code,
    });
    return res
      .status(200)
      .json({ message: "Language updated.", data: language });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating language.", error: error.message });
  }
};

// ❌ DELETE: Soft delete
export const deleteCourseLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    const language = await CourseLanguage.findByPk(id);
    if (!language) {
      return res.status(404).json({ message: "Language not found." });
    }

    await language.destroy(); // Soft delete via `paranoid: true`
    return res.status(200).json({ message: "Language deleted (soft)." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting language.", error: error.message });
  }
};
// 🚀 BULK POST: Create multiple course languages
export const bulkCreateCourseLanguages = async (req, res) => {
  try {
    const languages = req.body;

    if (!Array.isArray(languages) || languages.length === 0) {
      return res
        .status(400)
        .json({ message: "Input must be a non-empty array." });
    }

    // Validate each entry
    for (const lang of languages) {
      if (!lang.name || !lang.code) {
        return res.status(400).json({
          message: "Each language must include both 'name' and 'code'.",
        });
      }
    }

    const createdLanguages = await CourseLanguage.bulkCreate(languages, {
      ignoreDuplicates: true, // Prevents errors on unique constraints
    });

    return res.status(201).json({
      message: "Bulk languages inserted.",
      data: createdLanguages,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error inserting bulk languages.",
      error: error.message,
    });
  }
};

// 🔍 GET: CourseLanguage by code
export const getCourseLanguageByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const language = await CourseLanguage.findOne({
      where: { code },
    });

    if (!language) {
      return res
        .status(404)
        .json({ message: "Language not found for given code." });
    }

    return res.status(200).json({
      message: "Language found.",
      data: language,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching language by code.",
      error: error.message,
    });
  }
};
