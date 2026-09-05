import prisma from "../../config/prisma.js";

export const getProjectOverview = async ({ projectId, userId }) => {
  if (!projectId) {
    throw new Error("Project ID is required.");
  }

  if (!userId) {
    throw new Error("User ID is required.");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: userId },
        {
          members: {
            some: {
              userId,
            },
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      key: true,
      slug: true,
      description: true,
      icon: true,
      color: true,
      type: true,
      visibility: true,
      features: true,
      startDate: true,
      endDate: true,
      ownerId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!project) {
    throw new Error("Project not found or you do not have access.");
  }

  const tasks = await prisma.task.findMany({
    where: {
      projectId,
    },
    select: {
      id: true,
      key: true,
      title: true,
      priority: true,
      dueDate: true,
      statusId: true,
      status: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      sprint: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
    },
  });

  // Get project members
  const members = await prisma.projectMember.findMany({
    where: {
      projectId,
    },
    select: {
      id: true,
      userId: true,
      role: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
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

  const sprints = await prisma.sprint.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      goal: true,
      startDate: true,
      endDate: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => {
    const status = task.status?.name?.toLowerCase() || "";

    return (
      status.includes("done") ||
      status.includes("complete")
    );
  }).length;

  const inProgressTasks = tasks.filter((task) => {
    const status = task.status?.name?.toLowerCase() || "";

    return status.includes("progress");
  }).length;

  const todoTasks = tasks.filter((task) => {
    const status = task.status?.name?.toLowerCase() || "";

    return (
      status.includes("todo") ||
      status.includes("to do") ||
      status.includes("backlog")
    );
  }).length;

  const now = new Date();

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) {
      return false;
    }

    const status = task.status?.name?.toLowerCase() || "";

    const completed =
      status.includes("done") ||
      status.includes("complete");

    return task.dueDate < now && !completed;
  }).length;

  const taskProgress =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const statusMap = new Map();

  tasks.forEach((task) => {
    if (!task.status) return;

    const existing = statusMap.get(task.status.id);

    if (existing) {
      existing.count += 1;
    } else {
      statusMap.set(task.status.id, {
        id: task.status.id,
        name: task.status.name,
        color: task.status.color,
        count: 1,
      });
    }
  });

  const taskStatus = Array.from(statusMap.values());

  const priorityMap = new Map();

  tasks.forEach((task) => {
    const priority = task.priority || "UNKNOWN";

    priorityMap.set(
      priority,
      (priorityMap.get(priority) || 0) + 1
    );
  });

  const taskPriority = Array.from(priorityMap.entries()).map(
    ([priority, count]) => ({
      priority,
      count,
    })
  );

  const activeSprints = sprints.filter(
    (sprint) => sprint.status === "ACTIVE"
  );

  const plannedSprints = sprints.filter(
    (sprint) => sprint.status === "PLANNED"
  );

  const completedSprints = sprints.filter(
    (sprint) => sprint.status === "COMPLETED"
  );

  const recentActivities =
    await prisma.projectActivity.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
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

  return {
    project,

    statistics: {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      taskProgress,
      totalMembers: members.length,
      totalSprints: sprints.length,
      activeSprints: activeSprints.length,
      plannedSprints: plannedSprints.length,
      completedSprints: completedSprints.length,
    },

    taskStatus,

    taskPriority,

    sprints: {
      active: activeSprints,
      planned: plannedSprints,
      completed: completedSprints,
      all: sprints,
    },

    members,

    recentActivities,
  };
};