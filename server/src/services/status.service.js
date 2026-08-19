import prisma from "../../config/prisma.js";

export async function createProjectStatus({ projectId, name, color }) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const existingStatus = await prisma.taskStatus.findFirst({
    where: {
      projectId,
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (existingStatus) {
    throw new Error("A status with this name already exists in this project");
  }

  const lastStatus = await prisma.taskStatus.findFirst({
    where: {
      projectId,
    },
    orderBy: {
      position: "desc",
    },
  });

  const position = lastStatus ? lastStatus.position + 1 : 0;

  const status = await prisma.taskStatus.create({
    data: {
      projectId,
      name: name.trim(),
      color,
      position,
    },
  });

  return status;
}

export async function deleteProjectStatus(statusId) {
  const status = await prisma.taskStatus.findUnique({
    where: {
      id: statusId,
    },
    include: {
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });

  if (!status) {
    throw new Error("Status not found");
  }

  if (status._count.tasks > 0) {
    throw new Error(
      "Cannot delete a status that contains tasks. Move the tasks to another status first.",
    );
  }

  const statusCount = await prisma.taskStatus.count({
    where: {
      projectId: status.projectId,
    },
  });

  if (statusCount <= 1) {
    throw new Error("A project must have at least one status.");
  }

  await prisma.taskStatus.delete({
    where: {
      id: statusId,
    },
  });

  return true;
}
