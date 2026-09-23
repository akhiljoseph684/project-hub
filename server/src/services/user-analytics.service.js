import prisma from "../../config/prisma.js";

export const getUserAnalytics = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const projectMembers = await prisma.projectMember.findMany({
    where: {
      userId,
    },
    select: {
      projectId: true,
      project: {
        select: {
          id: true,
          name: true,
          ownerId: true,
        },
      },
    },
  });

  const projectIds = projectMembers.map((member) => member.projectId);

  const ownedProjects = await prisma.project.findMany({
    where: {
      ownerId: userId,
    },
    select: {
      id: true,
      name: true,
      ownerId: true,
    },
  });

  const allProjectsMap = new Map();

  [...projectMembers.map((item) => item.project), ...ownedProjects].forEach(
    (project) => {
      allProjectsMap.set(project.id, project);
    },
  );

  const projects = Array.from(allProjectsMap.values());

  const allProjectIds = projects.map((project) => project.id);

  const tasks = await prisma.task.findMany({
    where: {
      assigneeId: userId,
      projectId: {
        in: allProjectIds.length ? allProjectIds : ["__none__"],
      },
    },
    select: {
      id: true,
      projectId: true,
      statusId: true,
      priority: true,
      dueDate: true,
      createdAt: true,
      updatedAt: true,
      status: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status?.name?.toLowerCase() === "done",
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status?.name?.toLowerCase() === "in progress",
  ).length;

  const todoTasks = tasks.filter(
    (task) =>
      task.status?.name?.toLowerCase() === "to do" ||
      task.status?.name?.toLowerCase() === "todo",
  ).length;

  const now = new Date();

  const overdueTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate) < now &&
      task.status?.name?.toLowerCase() !== "done",
  ).length;

  const taskProgress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const statusMap = new Map();

  tasks.forEach((task) => {
    const statusName = task.status?.name?.trim() || "Unknown";

    if (!statusMap.has(statusName)) {
      statusMap.set(statusName, {
        name: statusName,
        count: 0,
        color: task.status?.color || "#64748b",
      });
    }

    statusMap.get(statusName).count += 1;
  });

  const taskStatus = Array.from(statusMap.values());

  const priorityMap = new Map();

  tasks.forEach((task) => {
    const priority = task.priority || "MEDIUM";

    if (!priorityMap.has(priority)) {
      priorityMap.set(priority, {
        name: priority,
        count: 0,
      });
    }

    priorityMap.get(priority).count += 1;
  });

  const taskPriority = Array.from(priorityMap.values());

  const productivity = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const completed = tasks.filter((task) => {
      const updatedAt = new Date(task.updatedAt);

      return (
        task.status?.name?.toLowerCase() === "done" &&
        updatedAt >= date &&
        updatedAt < nextDate
      );
    }).length;

    const updated = tasks.filter((task) => {
      const updatedAt = new Date(task.updatedAt);

      return updatedAt >= date && updatedAt < nextDate;
    }).length;

    productivity.push({
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      completed,
      updated,
    });
  }

  const projectMap = new Map();

  tasks.forEach((task) => {
    const projectId = task.projectId;

    if (!projectMap.has(projectId)) {
      projectMap.set(projectId, {
        id: projectId,
        name: task.project?.name || "Unknown Project",
        taskCount: 0,
        completedTasks: 0,
      });
    }

    const project = projectMap.get(projectId);

    project.taskCount += 1;

    if (task.status?.name?.toLowerCase() === "done") {
      project.completedTasks += 1;
    }
  });

  const projectAnalytics = Array.from(projectMap.values()).map((project) => ({
    ...project,
    progress: project.taskCount
      ? Math.round((project.completedTasks / project.taskCount) * 100)
      : 0,
  }));

  const recentActivities = await prisma.projectActivity.findMany({
    where: {
      userId,
      projectId: {
        in: allProjectIds.length ? allProjectIds : ["__none__"],
      },
    },
    select: {
      id: true,
      projectId: true,
      type: true,
      metadata: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  return {
    statistics: {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      taskProgress,
    },

    taskStatus,

    taskPriority,

    productivity,

    projects: projectAnalytics,

    recentActivities,
  };
};
