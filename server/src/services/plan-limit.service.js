import prisma from "../../config/prisma.js";

export const getUserPlan = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      plan: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.plan) {
    throw new Error("No subscription plan assigned to this user.");
  }

  return user.plan;
};

export const checkProjectLimit = async (userId) => {
  const plan = await getUserPlan(userId);

  if (plan.maxProjects === null) {
    return;
  }

  const projectCount = await prisma.project.count({
    where: {
      ownerId: userId,
    },
  });

  if (projectCount >= plan.maxProjects) {
    const error = new Error(
      `Your ${plan.name} plan allows a maximum of ${plan.maxProjects} projects.`,
    );

    error.code = "PLAN_LIMIT_REACHED";
    error.resource = "PROJECT";
    error.limit = plan.maxProjects;
    error.current = projectCount;

    throw error;
  }
};

export const checkTaskLimit = async (userId) => {
  const plan = await getUserPlan(userId);

  if (plan.maxTasks === null) {
    return;
  }

  const taskCount = await prisma.task.count({
    where: {
      project: {
        ownerId: userId,
      },
    },
  });

  if (taskCount >= plan.maxTasks) {
    const error = new Error(
      `Your ${plan.name} plan allows a maximum of ${plan.maxTasks} tasks.`,
    );

    error.code = "PLAN_LIMIT_REACHED";
    error.resource = "TASK";
    error.limit = plan.maxTasks;
    error.current = taskCount;

    throw error;
  }
};

export const checkMemberLimit = async (userId) => {
  const plan = await getUserPlan(userId);

  if (plan.maxMembers === null) {
    return;
  }

  const memberCount = await prisma.projectMember.count({
    where: {
      project: {
        ownerId: userId,
      },
    },
  });

  if (memberCount + 1 >= plan.maxMembers) {
    const error = new Error(
      `Your ${plan.name} plan allows a maximum of ${plan.maxMembers} members.`,
    );

    error.code = "PLAN_LIMIT_REACHED";
    error.resource = "MEMBER";
    error.limit = plan.maxMembers;
    error.current = memberCount;

    throw error;
  }
};
