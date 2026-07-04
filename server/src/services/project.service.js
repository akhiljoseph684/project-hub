import slugify from "slugify";
import prisma from "../../config/prisma.js";

export const searchUsersService = async (search) => {
  const users = await prisma.user.findMany({
    where: {
      isVerified: true,
      isActive: true,

      OR: [
        {
          firstName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },

    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      avatar: true,
    },

    take: 10,
  });

  return users;
};


export const createProject = async ({ ownerId, body, file }) => {
  const {
    name,
    key,
    description,
    type,
    visibility,
    color,
    startDate,
    endDate,
  } = body;

  const existingProject = await prisma.project.findFirst({
    where: {
      ownerId,
      key,
    },
  });

  if (existingProject) {
    throw new Error("Project key already exists.");
  }

  let slug = slugify(name, {
    lower: true,
    strict: true,
  });

  const slugExists = await prisma.project.findUnique({
    where: {
      slug,
    },
  });

  if (slugExists) {
    slug = `${slug}-${Date.now()}`;
  }

  let icon = null;

  if (file) {
    const result = await uploadToCloudinary(file.path);
    icon = result.secure_url;
  }

  return await prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        ownerId,
        name,
        key,
        slug,
        description,
        icon,
        color,
        type,
        visibility,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    const roles = [
      {
        name: "Owner",
        description: "Full access to the project.",
        isSystem: true,
        permissions: {
          "project.view": true,
          "project.update": true,
          "project.delete": true,
          "member.invite": true,
          "member.remove": true,
          "member.updateRole": true,
          "role.create": true,
          "role.update": true,
          "role.delete": true,
          "task.create": true,
          "task.update": true,
          "task.delete": true,
        },
      },
      {
        name: "Admin",
        description: "Manage project and members.",
        isSystem: true,
        permissions: {
          "project.view": true,
          "project.update": true,
          "member.invite": true,
          "task.create": true,
          "task.update": true,
          "task.delete": true,
        },
      },
      {
        name: "Member",
        description: "Collaborate on project tasks.",
        isSystem: true,
        permissions: {
          "project.view": true,
          "task.create": true,
          "task.update": true,
        },
      },
      {
        name: "Viewer",
        description: "Read-only access.",
        isSystem: true,
        permissions: {
          "project.view": true,
        },
      },
    ];

    const createdRoles = [];

    for (const role of roles) {
      const createdRole = await tx.projectRole.create({
        data: {
          ...role,
          projectId: project.id,
        },
      });

      createdRoles.push(createdRole);
    }

    const ownerRole = createdRoles.find((role) => role.name === "Owner");

    await tx.projectMember.create({
      data: {
        projectId: project.id,
        userId: ownerId,
        roleId: ownerRole.id,
      },
    });

    return project;
  });
};
