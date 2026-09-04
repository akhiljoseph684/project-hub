import express from "express";
import {
  createSprintController,
  getProjectSprintsController,
  getSprintByIdController,
  updateSprintController,
  startSprintController,
  completeSprintController,
  deleteSprintController,
  getMySprintsController,
} from "../controllers/sprint.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/projects/:projectId/", verifyUser, createSprintController);

router.get(
  "/projects/:projectId/",
  verifyUser,
  getProjectSprintsController,
);

router.get("/me", verifyUser, getMySprintsController);

router.get("/:sprintId", verifyUser, getSprintByIdController);

router.patch("/:sprintId", verifyUser, updateSprintController);

router.post("/:sprintId/start", verifyUser, startSprintController);

router.post("/:sprintId/complete", verifyUser, completeSprintController);

router.delete("/:sprintId", verifyUser, deleteSprintController);


export default router;
