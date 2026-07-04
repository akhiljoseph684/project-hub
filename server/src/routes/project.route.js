import express from "express";

import { createProject, searchUsers } from "../controllers/project.controller.js"
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/search-users", verifyUser, searchUsers);
router.post("/", verifyUser, createProject);

export default router;
