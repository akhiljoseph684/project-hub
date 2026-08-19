import prisma from "../../config/prisma.js"

export async function createLabel({ projectId, name, color }) {
  
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const existingLabel = await prisma.ProjectLabel.findFirst({
    where: {
      projectId,
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (existingLabel) {
    throw new Error("A label with this name already exists");
  }

  const label = await prisma.ProjectLabel.create({
    data: {
      projectId,
      name,
      color,
    },
  });

  return label;
}

export async function getProjectLabels(projectId) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return prisma.ProjectLabel.findMany({
    where: {
      projectId,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function updateLabel(labelId, data) {
  const existingLabel = await prisma.ProjectLabel.findUnique({
    where: {
      id: labelId,
    },
  });

  if (!existingLabel) {
    throw new Error("Label not found");
  }

  if (data.name) {
    const duplicateLabel = await prisma.ProjectLabel.findFirst({
      where: {
        projectId: existingLabel.projectId,
        name: {
          equals: data.name,
          mode: "insensitive",
        },
        NOT: {
          id: labelId,
        },
      },
    });

    if (duplicateLabel) {
      throw new Error("A label with this name already exists");
    }
  }

  return prisma.projectLabel.update({
    where: {
      id: labelId,
    },
    data: {
      ...(data.name !== undefined && {
        name: data.name,
      }),

      ...(data.color !== undefined && {
        color: data.color,
      }),
    },
  });
}

export async function deleteLabel(labelId) {
  const existingLabel = await prisma.projectLabel.findUnique({
    where: {
      id: labelId,
    },
  });

  if (!existingLabel) {
    throw new Error("Label not found");
  }

  await prisma.projectLabel.delete({
    where: {
      id: labelId,
    },
  });

  return {
    id: labelId,
  };
}
