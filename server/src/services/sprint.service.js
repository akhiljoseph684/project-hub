import prisma from "../../config/prisma.js";

export const createSprint = async (projectId, data) => {
  const { name, goal, startDate, endDate } = data;

  if (!name?.trim()) {
    throw new Error("Sprint name is required");
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.type !== "SCRUM") {
    throw new Error("Sprints are only available for Scrum projects");
  }

  const existingSprint = await prisma.sprint.findFirst({
    where: {
      projectId,
      name: name.trim(),
    },
  });

  if (existingSprint) {
    throw new Error("A sprint with this name already exists");
  }

  if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
    throw new Error("End date must be after start date");
  }

  return await prisma.sprint.create({
    data: {
      projectId,
      name: name.trim(),
      goal: goal?.trim() || null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
  });
};

export const getProjectSprints = async (projectId) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
      type: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.type !== "SCRUM") {
    throw new Error("Sprints are only available for Scrum projects");
  }

  return await prisma.sprint.findMany({
    where: {
      projectId,
    },

    include: {
      tasks: {
        orderBy: {
          position: "asc",
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
        },
      },

      _count: {
        select: {
          tasks: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getSprintById = async (sprintId) => {
  const sprint = await prisma.sprint.findUnique({
    where: {
      id: sprintId,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
      tasks: {
        orderBy: {
          position: "asc",
        },
      },
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });

  if (!sprint) {
    throw new Error("Sprint not found");
  }

  return sprint;
};

export const updateSprint = async (sprintId, data) => {
  const sprint = await prisma.sprint.findUnique({
    where: {
      id: sprintId,
    },
  });

  if (!sprint) {
    throw new Error("Sprint not found");
  }

  const { name, goal, startDate, endDate } = data;

  if (name !== undefined && !name.trim()) {
    throw new Error("Sprint name cannot be empty");
  }

  if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
    throw new Error("End date must be after start date");
  }

  if (name && name.trim() !== sprint.name) {
    const existingSprint = await prisma.sprint.findFirst({
      where: {
        projectId: sprint.projectId,
        name: name.trim(),
        NOT: {
          id: sprintId,
        },
      },
    });

    if (existingSprint) {
      throw new Error("A sprint with this name already exists");
    }
  }

  return await prisma.sprint.update({
    where: {
      id: sprintId,
    },
    data: {
      ...(name !== undefined && {
        name: name.trim(),
      }),

      ...(goal !== undefined && {
        goal: goal?.trim() || null,
      }),

      ...(startDate !== undefined && {
        startDate: startDate ? new Date(startDate) : null,
      }),

      ...(endDate !== undefined && {
        endDate: endDate ? new Date(endDate) : null,
      }),
    },
  });
};

export const startSprint = async (sprintId) => {
  const sprint = await prisma.sprint.findUnique({
    where: {
      id: sprintId,
    },
  });

  if (!sprint) {
    throw new Error("Sprint not found");
  }

  if (sprint.status === "COMPLETED") {
    throw new Error("Completed sprint cannot be started");
  }

  const activeSprint = await prisma.sprint.findFirst({
    where: {
      projectId: sprint.projectId,
      status: "ACTIVE",
      NOT: {
        id: sprintId,
      },
    },
  });

  if (activeSprint) {
    throw new Error("Another sprint is already active");
  }

  return await prisma.sprint.update({
    where: {
      id: sprintId,
    },
    data: {
      status: "ACTIVE",
      startDate: sprint.startDate || new Date(),
    },
  });
};

export const completeSprint = async (sprintId) => {
  const sprint = await prisma.sprint.findUnique({
    where: {
      id: sprintId,
    },
    include: {
      tasks: {
        select: {
          id: true,
          status: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!sprint) {
    throw new Error("Sprint not found");
  }

  if (sprint.status !== "ACTIVE") {
    throw new Error("Only an active sprint can be completed");
  }

  const incompleteTaskIds = sprint.tasks
    .filter((task) => task.status.name !== "DONE")
    .map((task) => task.id);

  const result = await prisma.$transaction(async (tx) => {
    if (incompleteTaskIds.length > 0) {
      await tx.task.updateMany({
        where: {
          id: {
            in: incompleteTaskIds,
          },
        },
        data: {
          sprintId: null,
        },
      });
    }

    const completedSprint = await tx.sprint.update({
      where: {
        id: sprintId,
      },
      data: {
        status: "COMPLETED",
        endDate: sprint.endDate || new Date(),
      },
    });

    return completedSprint;
  });

  return result;
};

export const deleteSprint = async (sprintId) => {
  const sprint = await prisma.sprint.findUnique({
    where: {
      id: sprintId,
    },
    include: {
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });

  if (!sprint) {
    throw new Error("Sprint not found");
  }

  if (sprint.status === "ACTIVE") {
    throw new Error("Active sprint cannot be deleted");
  }

  return await prisma.sprint.delete({
    where: {
      id: sprintId,
    },
  });
};
