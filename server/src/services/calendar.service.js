import prisma from "../../config/prisma.js";

export const getProjectCalendar = async (projectId) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
      name: true,
      key: true,
      startDate: true,
      endDate: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const tasks = await prisma.task.findMany({
    where: {
      projectId,
      dueDate: {
        not: null,
      },
    },

    select: {
      id: true,
      key: true,
      title: true,
      description: true,
      dueDate: true,
      priority: true,
      type: true,

      status: {
        select: {
          id: true,
          name: true,
        },
      },

      sprint: {
        select: {
          id: true,
          name: true,
          status: true,
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
    },

    orderBy: {
      dueDate: "asc",
    },
  });

  const sprints = await prisma.sprint.findMany({
    where: {
      projectId,
    },

    select: {
      id: true,
      name: true,
      goal: true,
      startDate: true,
      endDate: true,
      status: true,
    },

    orderBy: {
      startDate: "asc",
    },
  });

  return {
    project: {
      id: project.id,
      name: project.name,
      key: project.key,
      startDate: project.startDate,
      endDate: project.endDate,
    },

    tasks,

    sprints,
  };
};