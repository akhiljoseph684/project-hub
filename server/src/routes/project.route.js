import express from "express";

import { createProject, getProjects, searchUsers } from "../controllers/project.controller.js"
import { verifyUser } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/search-users", verifyUser, searchUsers);
router.post("/", verifyUser, upload.single("icon"), createProject);
router.get("/", verifyUser, getProjects);

export default router;
