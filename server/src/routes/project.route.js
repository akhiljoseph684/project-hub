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
  getProjectBoardController,
} from "../controllers/project.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { PERMISSIONS } from "../../constants/permissions.js";
import { requireProjectPermission } from "../middleware/project-permission.middleware.js";
import { getProjectActivitiesController } from "../controllers/project-activity.controller.js";
import { getProjectOverviewController } from "../controllers/project-overview.controller.js";

const router = express.Router();

router.get("/search-users", verifyUser, searchUsers);
router.post("/", verifyUser, upload.single("icon"), createProject);
router.get("/", verifyUser, getProjects);

router.post(
  "/:projectId/roles",
  verifyUser,
  requireProjectPermission(PERMISSIONS.ROLE_CREATE),
  createRole,
);
router.patch(
  "/:projectId/roles/:roleId",
  verifyUser,
  requireProjectPermission(PERMISSIONS.ROLE_UPDATE),
  updateRole,
);
router.delete(
  "/:projectId/roles/:roleId",
  verifyUser,
  requireProjectPermission(PERMISSIONS.ROLE_DELETE),
  deleteRole,
);
router.get("/:projectId/roles", verifyUser, getProjectRoles);

router.get("/:projectId/members", verifyUser, getProjectMembersController);
router.patch(
  "/:projectId/members/:memberId",
  verifyUser,
  requireProjectPermission(PERMISSIONS.MEMBER_UPDATE_ROLE),
  updateProjectMemberRoleController,
);
router.delete(
  "/:projectId/members/:memberId",
  verifyUser,
  requireProjectPermission(PERMISSIONS.MEMBER_REMOVE),
  removeProjectMemberController,
);
router.post(
  "/:projectId/invitations",
  verifyUser,
  requireProjectPermission(PERMISSIONS.MEMBER_INVITE),
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

router.get("/invitations/me", verifyUser, getMyProjectInvitationsController);

router.get("/:projectId/activity", verifyUser, getProjectActivitiesController);

router.get(
  "/:projectId/board",
  verifyUser,
  requireProjectPermission(PERMISSIONS.PROJECT_VIEW),
  getProjectBoardController,
);

router.get("/:projectId/overview", verifyUser, getProjectOverviewController);

router.get("/:slug", verifyUser, getProjectBySlug);

export default router;
