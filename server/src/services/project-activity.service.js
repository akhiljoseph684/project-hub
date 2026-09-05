import prisma from "../../config/prisma.js";

export const createProjectActivity = async ({
  prismaClient = prisma,
  projectId,
  userId,
  type,
  metadata = null,
}) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!type) {
    throw new Error("Activity type is required");
  }

  return await prismaClient.projectActivity.create({
    data: {
      projectId,
      userId,
      type,
      metadata,
    },
  });
};

export const getProjectActivities = async ({ projectId, userId }) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const activities = await prisma.projectActivity.findMany({
    where: {
      projectId,
      project: {
        members: {
          some: {
            userId,
          },
        },
      },
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
      createdAt: "desc",
    },
  });

  return activities;
};
