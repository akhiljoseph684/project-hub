export const registerTaskEvents = (io, socket) => {
  socket.on("task-created", (task) => {
    console.log(task);
  });
};
