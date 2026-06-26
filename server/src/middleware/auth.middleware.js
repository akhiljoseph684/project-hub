import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.js";

export const verifyUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        email: true,
        isVerified: true,
        planId: true,
        plan: {
          select: {
            slug: true,
            name: true
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error.message)
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
