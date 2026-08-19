import prisma from "../../config/prisma.js";


export function requireProjectPermission(permission) {
  return async (req, res, next) => {
    try {
      const { projectId } = req.params;

      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: "Project ID is required",
        });
      }

      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const membership = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId: req.user.id,
          },
        },
        include: {
          role: true,
        },
      });

      if (!membership) {
        return res.status(403).json({
          success: false,
          message: "You are not a member of this project",
        });
      }

      const permissions = membership.role?.permissions || {};

      const hasPermission = permissions[permission] === true;

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `You do not have permission: ${permission}`,
        });
      }

      // Make membership available to controller
      req.projectMembership = membership;
      req.projectRole = membership.role;

      next();
    } catch (error) {
      console.error("Project permission error:", error);

      return res.status(500).json({
        success: false,
        message: "Permission check failed",
      });
    }
  };
}
