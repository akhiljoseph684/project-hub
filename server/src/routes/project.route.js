import express from "express";

import {
  createProject,
  getProjects,
  searchUsers,
  getProjectBySlug,
  createRole,
  updateRole,
  deleteRole,
  getProjectRoles,
} from "../controllers/project.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/search-users", verifyUser, searchUsers);
router.post("/", verifyUser, upload.single("icon"), createProject);
router.get("/", verifyUser, getProjects);
router.get("/:slug", verifyUser, getProjectBySlug);
router.post("/:projectId/roles", verifyUser, createRole);
router.patch("/roles/:roleId", verifyUser, updateRole);
router.delete("/roles/:roleId", verifyUser, deleteRole);
router.get("/:projectId/roles", verifyUser, getProjectRoles);

export default router;
