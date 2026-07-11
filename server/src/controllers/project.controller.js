import redisClient from "../../config/redis.js";
import * as projectService from "../services/project.service.js";

export const searchUsers = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    const users = await projectService.searchUsersService(search);

    const multi = redisClient.multi();

    users.forEach((user) => {
      multi.sIsMember("online-users", user.id);
    });

    const results = await multi.exec();

    console.log(results);
    const usersWithStatus = users.map((user, index) => ({
      ...user,
      isOnline: results[index] === 1,
    }));

    return res.status(200).json({
      success: true,
      users: usersWithStatus,
    });
  } catch (error) {
    console.error("Search Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const createProject = async (req, res, next) => {
  try {
    console.log(req.file);
    const project = await projectService.createProject({
      ownerId: req.user.id,
      body: req.body,
      file: req.file,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const data = await projectService.getProjects({
      userId: req.user.id,
      page: req.query.page || 1,
      limit: req.query.limit || 12,
      search: req.query.search || "",
    });

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const project = await projectService.getProjectBySlug({
      slug,
      userId: req.user.id,
    });

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectRoles = async (req, res, next) => {
  try {
    const roles = await projectService.getProjectRoles({
      projectId: req.params.projectId,
    });

    res.status(200).json({
      success: true,
      message: "Roles fetched successfully.",
      roles,
    });
  } catch (error) {
    next(error);
  }
};

export const createRole = async (req, res, next) => {
  try {
    const role = await projectService.createProjectRole({
      projectId: req.params.projectId,
      body: req.body,
    });

    res.status(201).json({
      success: true,
      role,
    });
  } catch (err) {
    next(err);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const role = await projectService.updateProjectRole({
      roleId: req.params.roleId,
      body: req.body,
    });

    res.json({
      success: true,
      role,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const result = await projectService.deleteProjectRole({
      roleId: req.params.roleId,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectMembersController = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const members = await projectService.getProjectMembers(projectId);

    return res.status(200).json({
      success: true,
      members,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProjectMemberRoleController = async (req, res, next) => {
  try {
    const { projectId, memberId } = req.params;

    const { roleId } = req.body;

    const member = await projectService.updateProjectMemberRole({
      projectId,
      memberId,
      roleId,
    });

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully.",
      member,
    });
  } catch (error) {
    next(error);
  }
};

export const removeProjectMemberController = async (req, res, next) => {
  try {
    const { projectId, memberId } = req.params;

    const member = await projectService.removeProjectMember({
      projectId,
      memberId,
    });

    return res.status(200).json({
      success: true,
      message: "Project member removed successfully.",
      member,
    });
  } catch (error) {
    next(error);
  }
};

export const createProjectInvitationController = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const { userId, roleId } = req.body;

    const invitation = await projectService.createProjectInvitation({
      projectId,
      invitedById: req.user.id,
      userId,
      roleId,
    });

    return res.status(201).json({
      success: true,
      message: "Invitation sent successfully.",
      invitation,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectInvitationsController = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const { status } = req.query;

    const invitations = await projectService.getProjectInvitations({
      projectId,
      status,
    });

    return res.status(200).json({
      success: true,
      invitations,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptProjectInvitationController = async (req, res, next) => {
  try {
    const { invitationId } = req.params;

    const member = await projectService.acceptProjectInvitation({
      invitationId,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Invitation accepted successfully.",
      member,
    });
  } catch (error) {
    next(error);
  }
};

export const declineProjectInvitationController = async (req, res, next) => {
  try {
    const { invitationId } = req.params;

    await projectService.declineProjectInvitation({
      invitationId,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Invitation declined successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProjectInvitationController = async (
  req,
  res,
  next,
) => {
  try {
    const { invitationId } = req.params;

    await projectService.deleteProjectInvitation({
      invitationId,
    });

    return res.status(200).json({
      success: true,
      message: "Invitation cancelled successfully.",
    });
  } catch (error) {
    next(error);
  }
};