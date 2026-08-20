import prisma from "../../config/prisma.js";

export const createTask = async ({ projectId, userId, body }) => {
  const {
    title,
    description,
    statusId,
    priority = "MEDIUM",
    type = "TASK",
    assigneeId,
    dueDate,
    labels = [],
  } = body;

  if (!title?.trim()) {
    throw new Error("Task title is required.");
  }

  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  if (!member) {
    throw new Error("You are not a member of this project.");
  }

  const status = await prisma.taskStatus.findFirst({
    where: {
      id: statusId,
      projectId,
    },
  });

  if (!status) {
    throw new Error("Invalid task status.");
  }

  const taskCount = await prisma.task.count({
    where: {
      projectId,
    },
  });

  const key = `PH-${taskCount + 1}`;

  const task = await prisma.task.create({
    data: {
      projectId,
      statusId,

      key,

      title: title.trim(),

      description: description?.trim() || null,

      priority,

      type,

      assigneeId: assigneeId || null,

      reporterId: userId,

      dueDate: dueDate ? new Date(dueDate) : null,

      position: Date.now(),

      labels: {
        create: labels.map((label) => ({
          name: label.name,
          color: label.color,
        })),
      },
    },

    include: {
      status: true,

      assignee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },

      labels: true,

      _count: {
        select: {
          comments: true,
          attachments: true,
          checklists: true,
        },
      },

      checklists: true,
    },
  });

  return formatBoardTask(task);
};

const formatBoardTask = (task) => {
  const completedChecklist = task.checklists.filter(
    (item) => item.isCompleted,
  ).length;

  return {
    id: task.id,

    columnId: task.statusId,

    key: task.key,

    title: task.title,

    description: task.description,

    priority: task.priority,

    dueDate: task.dueDate,

    assignee: task.assignee
      ? {
          id: task.assignee.id,
          name: `${task.assignee.firstName || ""} ${
            task.assignee.lastName || ""
          }`.trim(),
          avatar: task.assignee.avatar,
        }
      : null,

    labels: task.labels.map((label) => ({
      id: label.id,
      name: label.name,
      color: label.color,
    })),

    commentsCount: task._count.comments,

    attachmentsCount: task._count.attachments,

    checklist: {
      completed: completedChecklist,
      total: task._count.checklists,
    },
  };
};

export const getProjectBoard = async ({ projectId, userId }) => {
  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  if (!member) {
    throw new Error("You are not a member of this project.");
  }

  const statuses = await prisma.taskStatus.findMany({
    where: {
      projectId,
    },

    orderBy: {
      position: "asc",
    },

    include: {
      tasks: {
        orderBy: {
          position: "asc",
        },

        include: {
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },

          labels: true,

          checklists: true,

          _count: {
            select: {
              comments: true,
              attachments: true,
              checklists: true,
            },
          },
        },
      },
    },
  });

  return statuses.map((status) => ({
    id: status.id,

    title: status.name,

    color: status.color,

    tasks: status.tasks.map(formatBoardTask),
  }));
};

export async function updateTaskStatus(taskId, statusId) {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const status = await prisma.taskStatus.findUnique({
    where: {
      id: statusId,
    },
  });

  if (!status) {
    throw new Error("Status not found");
  }

  if (status.projectId !== task.projectId) {
    throw new Error("Task status does not belong to this project");
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      statusId,
    },
    include: {
      status: true,
    },
  });

  return updatedTask;
}

export async function getTasksByProject(projectId) {
  const tasks = await prisma.task.findMany({
    where: {
      projectId,
    },

    orderBy: [
      {
        statusId: "asc",
      },
      {
        position: "asc",
      },
      {
        createdAt: "desc",
      },
    ],

    include: {
      status: {
        select: {
          id: true,
          name: true,
          color: true,
          position: true,
        },
      },

      assignee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },

      labels: {
        include: {
          label: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      },

      _count: {
        select: {
          comments: true,
          attachments: true,
          checklists: true,
        },
      },
    },
  });

  return tasks.map((task) => ({
    id: task.id,

    key: task.key,

    title: task.title,

    description: task.description,

    priority: task.priority,

    dueDate: task.dueDate,

    position: task.position,

    status: {
      id: task.status.id,
      name: task.status.name,
      color: task.status.color,
      position: task.status.position,
    },

    assignee: task.assignee
      ? {
          id: task.assignee.id,

          name: [task.assignee.firstName, task.assignee.lastName]
            .filter(Boolean)
            .join(" "),

          avatar: task.assignee.avatar,
        }
      : null,

    labels: task.labels.map((item) => ({
      id: item.label.id,
      name: item.label.name,
      color: item.label.color,
    })),

    commentsCount: task._count.comments,

    attachmentsCount: task._count.attachments,

    checklistCount: task._count.checklists,

    createdAt: task.createdAt,

    updatedAt: task.updatedAt,
  }));
}

export async function getTaskById(taskId) {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },

    include: {
      status: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },

      assignee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },

      reporter: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },

      labels: {
        include: {
          label: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      },

      comments: {
        orderBy: {
          createdAt: "asc",
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
      },

      attachments: {
        orderBy: {
          createdAt: "desc",
        },

        include: {
          uploadedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      },

      checklists: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return {
    id: task.id,

    key: task.key,

    title: task.title,

    description: task.description,

    priority: task.priority,

    dueDate: task.dueDate,

    position: task.position,

    createdAt: task.createdAt,

    updatedAt: task.updatedAt,

    status: {
      id: task.status.id,
      name: task.status.name,
      color: task.status.color,
    },

    assignee: task.assignee
      ? {
          id: task.assignee.id,

          name: [
            task.assignee.firstName,
            task.assignee.lastName,
          ]
            .filter(Boolean)
            .join(" "),

          avatar: task.assignee.avatar,
        }
      : null,

    reporter: task.reporter
      ? {
          id: task.reporter.id,

          name: [
            task.reporter.firstName,
            task.reporter.lastName,
          ]
            .filter(Boolean)
            .join(" "),

          avatar: task.reporter.avatar,
        }
      : null,

    labels: task.labels.map((item) => ({
      id: item.label.id,
      name: item.label.name,
      color: item.label.color,
    })),

    comments: task.comments.map((comment) => ({
      id: comment.id,

      content: comment.content,

      createdAt: comment.createdAt,

      user: {
        id: comment.user.id,

        name: [
          comment.user.firstName,
          comment.user.lastName,
        ]
          .filter(Boolean)
          .join(" "),

        avatar: comment.user.avatar,
      },
    })),

    attachments: task.attachments.map(
      (attachment) => ({
        id: attachment.id,

        fileName: attachment.fileName,

        fileUrl: attachment.fileUrl,

        mimeType: attachment.mimeType,

        size: attachment.size,

        createdAt: attachment.createdAt,

        uploadedBy: {
          id: attachment.uploadedBy.id,

          name: [
            attachment.uploadedBy.firstName,
            attachment.uploadedBy.lastName,
          ]
            .filter(Boolean)
            .join(" "),

          avatar: attachment.uploadedBy.avatar,
        },
      }),
    ),

    checklists: task.checklists.map(
      (checklist) => ({
        id: checklist.id,

        title: checklist.title,

        isCompleted: checklist.isCompleted,

        position: checklist.position,
      }),
    ),
  };
}