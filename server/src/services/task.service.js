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
