// controllers/uploadController.js

export const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const fileData = req.files.map((file) => ({
      fieldName: file.fieldname,
      fileUrl: file.location,
      originalName: file.originalname,
      type: file.mimetype, // ← this gives you file type like 'image/jpeg', 'video/mp4', etc.
      size: file.size,
    }));

    return res.status(200).json({
      message: "File(s) uploaded successfully",
      files: fileData,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Upload failed" });
  }
};
