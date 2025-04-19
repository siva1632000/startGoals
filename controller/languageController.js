import Language from "../model/language.js";

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

export const uploadLanguagesBulk = async (req, res) => {
  try {
    const languages = req.body;

    if (!Array.isArray(languages) || languages.length === 0) {
      return res.status(400).json({
        message: "Languages data should be a non-empty array",
        status: false,
      });
    }

    const validTypes = ["user_preference", "course_language", "both"];

    const invalidLanguages = languages.filter((lang) => {
      return (
        !lang.language ||
        !lang.languageCode ||
        !validTypes.includes(lang.languageType)
      );
    });

    if (invalidLanguages.length > 0) {
      return res.status(400).json({
        message: "Some languages have invalid fields",
        invalidLanguages,
        status: false,
      });
    }

    // Check for duplicates in DB
    const existing = await Language.findAll({
      where: {
        languageCode: languages.map((lang) => lang.languageCode),
      },
    });

    const existingCodes = existing.map((e) => e.languageCode);

    const filteredLanguages = languages.filter(
      (lang) => !existingCodes.includes(lang.languageCode)
    );

    if (filteredLanguages.length === 0) {
      return res.status(409).json({
        message: "All provided language codes already exist",
        status: false,
      });
    }

    const result = await Language.bulkCreate(filteredLanguages, {
      validate: true,
    });

    return res.status(201).json({
      message: `${result.length} languages uploaded successfully`,
      status: true,
      data: result,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    return res.status(500).json({
      message: "Server error while uploading languages",
      status: false,
      error: error.message,
    });
  }
};

export const getAllLanguages = async (req, res) => {
  try {
    const languages = await Language.findAll({
      attributes: ["languageId", "language", "languageCode", "languageType"],
      order: [["language", "ASC"]],
    });

    return res.status(200).json({
      message: "Languages fetched successfully",
      data: languages,
      status: true,
    });
  } catch (error) {
    console.error("Error fetching languages:", error);
    return res.status(500).json({
      message: "Failed to fetch languages",
      error: error.message,
      status: false,
    });
  }
};
