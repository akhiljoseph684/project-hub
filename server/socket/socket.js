import { Server } from "socket.io";
import onlineUsers from "./online-users.js";
import redisClient from "../config/redis.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    socket.on("user:online", async (userId) => {
      onlineUsers.set(userId, socket.id);

      await redisClient.sAdd("online-users", userId);

      io.emit("online-users", Object.fromEntries(onlineUsers));

      console.log("User Online:", userId);
    });

    socket.on("disconnect", async () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);

          await redisClient.sRem("online-users", userId);

          console.log("User Offline:", userId);

          break;
        }
      }

      io.emit("online-users", Object.fromEntries(onlineUsers));

      console.log("Socket Disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => io;
