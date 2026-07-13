import { getIO } from "./socket.js";
import onlineUsers from "./online-users.js";

export const emitProjectInvitation = (userId, invitation) => {
  const io = getIO();

  const socketId = onlineUsers.get(userId);

  if (!socketId) return;

  io.to(socketId).emit("project:invitation:new", invitation);
};

export const emitProjectMemberAdded = (userId, member) => {
  const io = getIO();

  const socketId = onlineUsers.get(userId);

  if (!socketId) return;

  io.to(socketId).emit("project:member:added", member);
};

export const emitProjectMemberRemoved = (userId, memberId) => {
  const io = getIO();

  const socketId = onlineUsers.get(userId);

  if (!socketId) return;

  io.to(socketId).emit("project:member:removed", memberId);
};
