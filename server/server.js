import express from "express";
import dotenv from "dotenv";

dotenv.config();
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/auth.route.js";
import projectRoutes from "./src/routes/project.route.js";
import subscriptionRoutes from "./src/routes/subscription.route.js";
import userRoutes from "./src/routes/user.route.js";

import http from "http";
import { initializeSocket } from "./socket/index.js";
import { errorHandler } from "./src/middleware/error.middleware.js";

const prisma = new PrismaClient();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
  try {
    await prisma.$connect();

    res.json({
      success: true,
      message: "Database connected successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/user", userRoutes);

app.use(errorHandler);

const server = http.createServer(app);

initializeSocket(server);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
