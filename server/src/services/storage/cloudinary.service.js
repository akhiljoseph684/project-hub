import streamifier from "streamifier";
import cloudinary from "../../../config/cloudinary.js";

export function uploadToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "project-hub/tasks",

        resource_type: "auto",

        public_id: options.publicId,
      },

      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}
