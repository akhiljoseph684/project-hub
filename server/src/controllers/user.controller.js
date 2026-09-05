import { uploadImage } from "../services/upload.service.js";
import {
  updateUserProfileService,
  getUserProfileService,
} from "../services/user.service.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { firstName, lastName, phone } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "First name and last name are required",
      });
    }


    let avatar = null;

    if (req.file) {
      const uploaded = await uploadImage(req.file);

      avatar = uploaded.secure_url;
    }

    
    const user = await updateUserProfileService(userId, {
      firstName,
      lastName,
      phone,
      avatar
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await getUserProfileService(userId);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

