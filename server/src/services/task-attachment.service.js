import cloudinary from "../../config/cloudinary.js";
import prisma from "../../config/prisma.js";
import { createProjectActivity } from "./project-activity.service.js";
import { uploadToCloudinary } from "./storage/cloudinary.service.js";

export async function createTaskAttachment({
  taskId,
  uploadedById,
  file,
  userId,
}) {
  if (!file) {
    throw new Error("File is required");
  }

  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },

    select: {
      id: true,
      projectId: true,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const cloudinaryFile = await uploadToCloudinary(file.buffer, {
    folder: `project-hub/tasks/${taskId}`,
  });

  const attachment = await prisma.taskAttachment.create({
    data: {
      taskId,

      uploadedById,

      fileName: file.originalname,

      fileUrl: cloudinaryFile.secure_url,

      mimeType: file.mimetype,

      size: file.size,

      storageKey: cloudinaryFile.public_id,
    },

    include: {
      uploadedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
  });

  await createProjectActivity({
    projectId: task.projectId,
    userId,
    type: "FILE_UPLOADED",
    metadata: {
      fileId: attachment.id,
      fileName: attachment.fileName,
    },
  });

  return {
    id: attachment.id,

    taskId: attachment.taskId,

    fileName: attachment.fileName,

    fileUrl: attachment.fileUrl,

    mimeType: attachment.mimeType,

    size: attachment.size,

    createdAt: attachment.createdAt,

    uploadedBy: {
      id: attachment.uploadedBy.id,

      name: [attachment.uploadedBy.firstName, attachment.uploadedBy.lastName]
        .filter(Boolean)
        .join(" "),

      avatar: attachment.uploadedBy.avatar,
    },
  };
}

export async function deleteTaskAttachment({ attachmentId, userId }) {
  const attachment = await prisma.taskAttachment.findUnique({
    where: {
      id: attachmentId,
    },
  });

  if (!attachment) {
    throw new Error("Attachment not found");
  }

  const task = await prisma.task.findUnique({
    where: {
      id: attachment.taskId,
    },

    select: {
      id: true,
      projectId: true,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (attachment.storageKey) {
    let resourceType = "raw";

    if (attachment.mimeType?.startsWith("image/")) {
      resourceType = "image";
    } else if (attachment.mimeType?.startsWith("video/")) {
      resourceType = "video";
    }

    await cloudinary.uploader.destroy(attachment.storageKey, {
      resource_type: resourceType,
    });
  }

  await prisma.taskAttachment.delete({
    where: {
      id: attachmentId,
    },
  });

  await createProjectActivity({
    projectId: task.projectId,
    userId,
    type: "FILE_DELETED",
    metadata: {
      fileId: attachment.id,
      fileName: attachment.fileName,
    },
  });

  return {
    id: attachmentId,
  };
}
