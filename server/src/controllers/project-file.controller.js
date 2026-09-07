import {
  getProjectFiles,
  deleteProjectFile,
} from "../services/project-file.service.js";

export const getProjectFilesController = async (req, res) => {
  try {
    const { projectId } = req.params;

    const files = await getProjectFiles({
      projectId,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Project files fetched successfully",
      data: files,
    });
  } catch (error) {
    console.error("Get project files error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch project files",
    });
  }
};

export const deleteProjectFileController = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await deleteProjectFile({
      fileId,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Project file deleted successfully",
      data: file,
    });
  } catch (error) {
    console.error("Delete project file error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete project file",
    });
  }
};
