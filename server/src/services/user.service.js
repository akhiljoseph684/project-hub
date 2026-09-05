import prisma from "../../config/prisma.js";

export const updateUserProfileService = async (userId, data) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      ...(data.avatar && {
        avatar: data.avatar,
      }),
    },

    include: {
      plan: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
};

export const getUserProfileService = async (userId) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
      phone: true,
      role: true,
      isVerified: true,
      createdAt: true,

      plan: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
        },
      },
    },
  });
};

export const getUserDashboard = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      avatar: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const projectMembers = await prisma.projectMember.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      projectId: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
          key: true,
          slug: true,
          icon: true,
          color: true,
        },
      },
    },
  });

  const projectIds = projectMembers.map((member) => member.projectId);

  const tasks = await prisma.task.findMany({
    where: {
      assigneeId: userId,
    },
    select: {
      id: true,
      key: true,
      title: true,
      priority: true,
      dueDate: true,
      createdAt: true,
      updatedAt: true,
      projectId: true,

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
          key: true,
          slug: true,
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

    orderBy: {
      updatedAt: "desc",
    },
  });

  const isCompleted = (task) => {
    const status = task.status?.name?.toLowerCase() || "";

    return status.includes("done") || status.includes("complete");
  };

  const isInProgress = (task) => {
    const status = task.status?.name?.toLowerCase() || "";

    return status.includes("progress");
  };

  const isTodo = (task) => {
    const status = task.status?.name?.toLowerCase() || "";

    return (
      status.includes("todo") ||
      status.includes("to do") ||
      status.includes("backlog")
    );
  };

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => isCompleted(task)).length;

  const inProgressTasks = tasks.filter((task) => isInProgress(task)).length;

  const todoTasks = tasks.filter((task) => isTodo(task)).length;

  const now = new Date();

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;

    return new Date(task.dueDate) < now && !isCompleted(task);
  });

  const overdueTaskCount = overdueTasks.length;

  const taskProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statusMap = new Map();

  tasks.forEach((task) => {
    if (!task.status) return;

    const statusName = task.status.name.trim();

    const existing = statusMap.get(statusName);

    if (existing) {
      existing.count += 1;
    } else {
      statusMap.set(statusName, {
        id: task.status.id,
        name: statusName,
        color: task.status.color,
        count: 1,
      });
    }
  });

  const taskStatus = Array.from(statusMap.values());

  const priorityMap = new Map();

  tasks.forEach((task) => {
    const priority = task.priority || "UNKNOWN";

    priorityMap.set(priority, (priorityMap.get(priority) || 0) + 1);
  });

  const taskPriority = Array.from(priorityMap.entries()).map(
    ([priority, count]) => ({
      priority,
      count,
    }),
  );

  const recentTasks = tasks.slice(0, 10);

  const projects = projectMembers.map((member) => {
    const projectTasks = tasks.filter(
      (task) => task.projectId === member.projectId,
    );

    const completed = projectTasks.filter((task) => isCompleted(task)).length;

    const total = projectTasks.length;

    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      id: member.project.id,
      name: member.project.name,
      key: member.project.key,
      slug: member.project.slug,
      icon: member.project.icon,
      color: member.project.color,
      role: member.role,
      totalTasks: total,
      completedTasks: completed,
      progress,
    };
  });

  const productivity = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const completedCount = tasks.filter((task) => {
      if (!isCompleted(task)) return false;

      const updatedAt = new Date(task.updatedAt);

      return updatedAt >= date && updatedAt < nextDate;
    }).length;

    productivity.push({
      date: date.toISOString().split("T")[0],
      completed: completedCount,
    });
  }

  const recentActivities = await prisma.projectActivity.findMany({
    where: {
      userId,
      projectId: {
        in: projectIds.length ? projectIds : ["__NO_PROJECT__"],
      },
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

      project: {
        select: {
          id: true,
          name: true,
          key: true,
          slug: true,
        },
      },
    },
  });

  const activeSprints = await prisma.sprint.findMany({
    where: {
      projectId: {
        in: projectIds.length ? projectIds : ["__NO_PROJECT__"],
      },
      status: "ACTIVE",
    },

    select: {
      id: true,
      name: true,
      goal: true,
      startDate: true,
      endDate: true,
      status: true,
      projectId: true,

      project: {
        select: {
          id: true,
          name: true,
          key: true,
          slug: true,
        },
      },

      _count: {
        select: {
          tasks: true,
        },
      },
    },

    orderBy: {
      startDate: "asc",
    },
  });

  return {
    user,

    statistics: {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks: overdueTaskCount,
      totalProjects: projectMembers.length,
      taskProgress,
    },

    taskStatus,

    taskPriority,

    productivity,

    recentTasks,

    overdueTasks,

    projects,

    activeSprints,

    recentActivities,
  };
};
