import {
  getTaskComments,
  createTaskComment,
  deleteTaskComment,
} from "../services/task-comment.service.js";

export const getTaskCommentsController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const comments = await getTaskComments({
      taskId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Task comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.error("Get task comments error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch task comments",
    });
  }
};

export const createTaskCommentController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;

    const userId = req.user.id;

    const comment = await createTaskComment({
      taskId,
      userId,
      content,
    });

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Create task comment error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create task comment",
    });
  }
};

export const deleteTaskCommentController = async (req, res) => {
  try {
    const { commentId } = req.params;

    const userId = req.user.id;

    await deleteTaskComment({
      commentId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete task comment error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete task comment",
    });
  }
};
