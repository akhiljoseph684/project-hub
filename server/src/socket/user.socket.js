import redisClient from "../../config/redis.js";
import prisma from "../../config/prisma.js";

export const registerUserEvents = (io, socket) => {
  socket.on("join", async (userId) => {
    try {
      if (!userId) return;

      socket.userId = userId;

      await redisClient.sAdd("online-users", userId);

      io.emit("user-online", userId);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("disconnect", async () => {
    try {
      const userId = socket.userId;

      if (!userId) return;

      await redisClient.sRem("online-users", userId);

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          lastSeen: new Date(),
        },
      });

      io.emit("user-offline", userId);
    } catch (error) {
      console.error(error);
    }
  });
};
