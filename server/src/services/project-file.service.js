import prisma from "../../config/prisma.js";


const checkProjectAccess = async (projectId, userId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
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
  });

  if (!project) {
    throw new Error("Project not found or access denied");
  }

  return project;
};

export const getProjectFiles = async ({ projectId, userId }) => {
  await checkProjectAccess(projectId, userId);

  const files = await prisma.taskAttachment.findMany({
    where: {
      task: {
        projectId,
      },
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
      task: {
        select: {
          id: true,
          key: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return files;
};

export const deleteProjectFile = async ({ fileId, userId }) => {
  const file = await prisma.taskAttachment.findUnique({
    where: {
      id: fileId,
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

  if (!file) {
    throw new Error("File not found");
  }

  await checkProjectAccess(file.task.projectId, userId);

  await prisma.$transaction(async (tx) => {
    await tx.taskAttachment.delete({
      where: {
        id: fileId,
      },
    });

    await tx.projectActivity.create({
      data: {
        projectId: file.task.projectId,
        userId,
        type: "FILE_DELETED",
        metadata: {
          fileId: file.id,
          fileName: file.fileName,
          taskId: file.task.id,
          taskKey: file.task.key,
          taskTitle: file.task.title,
        },
      },
    });
  });

  return file;
};
