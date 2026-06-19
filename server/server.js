import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors"
import authRoutes from "./src/routes/auth.route.js"
import cookieParser from "cookie-parser";


const prisma = new PrismaClient();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
  try {
    await prisma.$connect();

    res.json({
      success: true,
      message: "Database connected successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.use("/api/auth", authRoutes)

app.listen(5000, () => {
  console.log("Server running on port 5000");
});