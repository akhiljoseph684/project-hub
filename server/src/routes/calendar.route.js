import express from "express";

import { getProjectCalendarController } from "../controllers/calendar.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/projects/:projectId", verifyUser, getProjectCalendarController);

export default router;
