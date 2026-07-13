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
  getProjectMembersController,
  updateProjectMemberRoleController,
  removeProjectMemberController,
  createProjectInvitationController,
  getProjectInvitationsController,
  acceptProjectInvitationController,
  declineProjectInvitationController,
  deleteProjectInvitationController,
  getMyProjectInvitationsController,
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

router.get("/:projectId/members", verifyUser, getProjectMembersController);
router.patch(
  "/:projectId/members/:memberId",
  verifyUser,
  updateProjectMemberRoleController,
);
router.delete(
  "/:projectId/members/:memberId",
  verifyUser,
  removeProjectMemberController,
);
router.post(
  "/:projectId/invitations",
  verifyUser,
  createProjectInvitationController,
);
router.get(
  "/:projectId/invitations",
  verifyUser,
  getProjectInvitationsController,
);

router.patch(
  "/invitations/:invitationId/accept",
  verifyUser,
  acceptProjectInvitationController,
);

router.patch(
  "/invitations/:invitationId/decline",
  verifyUser,
  declineProjectInvitationController,
);

router.delete(
  "/invitations/:invitationId",
  verifyUser,
  deleteProjectInvitationController,
);

router.get(
  "/invitations/me",
  verifyUser,
  getMyProjectInvitationsController,
);

export default router;
