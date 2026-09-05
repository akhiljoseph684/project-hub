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

