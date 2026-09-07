import prisma from "../../config/prisma.js";
import { createProjectActivity } from "./project-activity.service.js";

const checkTaskAccess = async (taskId, userId) => {
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
    include: {
      project: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!task) {
    throw new Error("Task not found or access denied");
  }

  return task;
};

export const getTaskChecklists = async ({ taskId, userId }) => {
  await checkTaskAccess(taskId, userId);

  return prisma.taskChecklist.findMany({
    where: {
      taskId,
    },
    orderBy: {
      position: "asc",
    },
  });
};

export const createTaskChecklist = async ({
  taskId,
  userId,
  title,
  position,
}) => {
  if (!title?.trim()) {
    throw new Error("Checklist title is required");
  }

  const task = await checkTaskAccess(taskId, userId);

  const checklist = await prisma.taskChecklist.create({
    data: {
      taskId,
      title: title.trim(),
      position: position ?? 0,
      isCompleted: false,
    },
  });

  await createProjectActivity({
    projectId: task.projectId,
    userId,
    type: "TASK_CHECKLIST_CREATED",
    metadata: {
      checklistId: checklist.id,
      title: checklist.title,
      taskId: task.id,
      taskKey: task.key,
      taskTitle: task.title,
    },
  });

  return checklist;
};

export const updateTaskChecklist = async ({ checklistId, userId }) => {
  const checklist = await prisma.taskChecklist.findUnique({
    where: {
      id: checklistId,
    },
    include: {
      task: {
        select: {
          id: true,
          projectId: true,
          key: true,
          title: true,
        },
      },
    },
  });

  if (!checklist) {
    throw new Error("Checklist not found");
  }

  await checkTaskAccess(checklist.taskId, userId);

  const updatedChecklist = await prisma.taskChecklist.update({
    where: {
      id: checklistId,
    },
    data: {
      isCompleted: !checklist.isCompleted,
    },
  });

  await createProjectActivity({
    projectId: checklist.task.projectId,
    userId,
    type: "TASK_CHECKLIST_UPDATED",
    metadata: {
      checklistId: updatedChecklist.id,
      title: updatedChecklist.title,
      taskId: checklist.task.id,
      taskKey: checklist.task.key,
      taskTitle: checklist.task.title,
      isCompleted: updatedChecklist.isCompleted,
    },
  });

  return updatedChecklist;
};

export const deleteTaskChecklist = async ({ checklistId, userId }) => {
  const checklist = await prisma.taskChecklist.findUnique({
    where: {
      id: checklistId,
    },
    include: {
      task: {
        select: {
          id: true,
          projectId: true,
          key: true,
          title: true,
        },
      },
    },
  });

  if (!checklist) {
    throw new Error("Checklist not found");
  }

  await checkTaskAccess(checklist.taskId, userId);

  await prisma.taskChecklist.delete({
    where: {
      id: checklistId,
    },
  });

  await createProjectActivity({
    projectId: checklist.task.projectId,
    userId,
    type: "TASK_CHECKLIST_DELETED",
    metadata: {
      checklistId: checklist.id,
      title: checklist.title,
      taskId: checklist.task.id,
      taskKey: checklist.task.key,
      taskTitle: checklist.task.title,
      isCompleted: checklist.isCompleted,
    },
  });

  return {
    id: checklistId,
  };
};
