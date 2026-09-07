import prisma from "../../config/prisma.js";


export const getTaskComments = async ({ taskId, userId }) => {
  if (!taskId) {
    throw new Error("Task ID is required.");
  }

  if (!userId) {
    throw new Error("User ID is required.");
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        OR: [
          {
            ownerId: userId,
          },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
    },

    select: {
      id: true,
    },
  });

  if (!task) {
    throw new Error("Task not found or you do not have access.");
  }

  const comments = await prisma.taskComment.findMany({
    where: {
      taskId,
    },

    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  });

  return comments;
};

export const createTaskComment = async ({ taskId, userId, content }) => {
  if (!taskId) {
    throw new Error("Task ID is required.");
  }

  if (!userId) {
    throw new Error("User ID is required.");
  }

  const trimmedContent = content?.trim();

  if (!trimmedContent) {
    throw new Error("Comment cannot be empty.");
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        OR: [
          {
            ownerId: userId,
          },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
    },

    select: {
      id: true,
      projectId: true,
    },
  });

  if (!task) {
    throw new Error("Task not found or you do not have access.");
  }

  const comment = await prisma.taskComment.create({
    data: {
      taskId,
      userId,
      content: trimmedContent,
    },

    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
  });

  return comment;
};

export const deleteTaskComment = async ({ commentId, userId }) => {
  if (!commentId) {
    throw new Error("Comment ID is required.");
  }

  if (!userId) {
    throw new Error("User ID is required.");
  }

  const comment = await prisma.taskComment.findUnique({
    where: {
      id: commentId,
    },

    select: {
      id: true,
      userId: true,
    },
  });

  if (!comment) {
    throw new Error("Comment not found.");
  }

  if (comment.userId !== userId) {
    throw new Error("You can only delete your own comments.");
  }

  await prisma.taskComment.delete({
    where: {
      id: commentId,
    },
  });

  return {
    id: commentId,
  };
};
