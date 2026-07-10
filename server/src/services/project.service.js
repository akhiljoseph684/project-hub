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

  const features = body.features
    ? Array.isArray(body.features)
      ? body.features
      : [body.features]
    : [];

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
        features,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    const roles = [
      {
        name: "Owner",
        color: "#2563EB",
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
        color: "#7C3AED",
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
        color: "#22C55E",
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
        color: "#F97316",
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

export const getProjects = async ({
  userId,
  page = 1,
  limit = 12,
  search = "",
}) => {
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const where = {
    userId,

    project: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  };

  const [projects, totalProjects] = await prisma.$transaction([
    prisma.projectMember.findMany({
      where,

      skip,

      take: limit,

      orderBy: {
        project: {
          createdAt: "desc",
        },
      },

      include: {
        role: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },

        project: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },

            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
    }),

    prisma.projectMember.count({
      where,
    }),
  ]);

  return {
    projects: projects.map((member) => ({
      id: member.project.id,
      name: member.project.name,
      key: member.project.key,
      slug: member.project.slug,
      description: member.project.description,
      icon: member.project.icon,
      color: member.project.color,
      type: member.project.type,
      visibility: member.project.visibility,
      startDate: member.project.startDate,
      endDate: member.project.endDate,
      createdAt: member.project.createdAt,

      owner: member.project.owner,

      role: member.role,

      membersCount: member.project._count.members,
    })),

    pagination: {
      page,

      limit,

      totalProjects,

      totalPages: Math.ceil(totalProjects / limit),

      hasNextPage: page * limit < totalProjects,

      hasPreviousPage: page > 1,
    },
  };
};

export const getProjectBySlug = async ({ slug, userId }) => {
  const projectMember = await prisma.projectMember.findFirst({
    where: {
      userId,
      project: {
        slug,
      },
    },

    include: {
      role: {
        select: {
          id: true,
          name: true,
          permissions: true,
          color: true,
        },
      },

      project: {
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },

          _count: {
            select: {
              members: true,
            },
          },
        },
      },
    },
  });

  if (!projectMember) {
    throw new Error("Project not found.");
  }

  const project = projectMember.project;

  return {
    id: project.id,
    name: project.name,
    key: project.key,
    slug: project.slug,
    description: project.description,
    icon: project.icon,
    color: project.color,
    type: project.type,
    visibility: project.visibility,
    features: project.features,
    startDate: project.startDate,
    endDate: project.endDate,
    createdAt: project.createdAt,

    owner: project.owner,

    membersCount: project._count.members,

    currentUser: {
      role: projectMember.role,
    },
  };
};

export const getProjectRoles = async ({ projectId }) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  const roles = await prisma.projectRole.findMany({
    where: {
      projectId,
      isDeleted: false,
    },

    orderBy: {
      createdAt: "asc",
    },

    include: {
      _count: {
        select: {
          members: true,
        },
      },
    },
  });

  return roles;
};

export const createProjectRole = async ({ projectId, body }) => {
  const { name, description, color, permissions } = body;

  if(!name || !color){
    throw new Error("Fill The these fields");
  }

  const existingRole = await prisma.projectRole.findFirst({
    where: {
      projectId,
      name,
      isDeleted: false,
    },
  });

  if (existingRole) {
    throw new Error("Role already exists.");
  }

  const role = await prisma.projectRole.create({
    data: {
      projectId,
      name,
      description,
      color,
      permissions,
    },
  });

  return role;
};

export const updateProjectRole = async ({ roleId, body }) => {
  const role = await prisma.projectRole.findUnique({
    where: {
      id: roleId,
    },
  });

  if (!role) {
    throw new Error("Role not found.");
  }

  const updatedRole = await prisma.projectRole.update({
    where: {
      id: roleId,
      isDeleted: false,
    },

    data: {
      name: body.name,
      description: body.description,
      color: body.color,
      permissions: body.permissions,
      isSystem: role.isSystem,
    },
  });

  return updatedRole;
};

export const deleteProjectRole = async ({ roleId }) => {
  const role = await prisma.projectRole.findUnique({
    where: {
      id: roleId,
      isDeleted: false,
    },

    include: {
      members: true,
    },
  });

  if (!role) {
    throw new Error("Role not found.");
  }

  if (role.isSystem) {
    throw new Error("System roles cannot be deleted.");
  }

  if (role.members.length > 0) {
    throw new Error("Cannot delete a role assigned to members.");
  }

  await prisma.projectRole.update({
    where: {
      id: roleId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return {
    message: "Role deleted successfully.",
  };
};
