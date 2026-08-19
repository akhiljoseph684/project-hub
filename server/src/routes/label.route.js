import express from "express";

import {
  createLabelController,
  getProjectLabelsController,
  updateLabelController,
  deleteLabelController,
} from "../controllers/label.controller.js";

const router = express.Router();

router.post("/projects/:projectId/labels", createLabelController);

router.get("/projects/:projectId/labels", getProjectLabelsController);

router.patch("/:labelId", updateLabelController);

router.delete("/:labelId", deleteLabelController);

export default router;
