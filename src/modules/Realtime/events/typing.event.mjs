export function handleTyping(io, socket) {
  socket.on("typing", ({ roomId, isTyping }) => {
    socket.to(roomId).emit("userTyping", {
      userId: socket.user.userId,
      isTyping,
    });
  });
}
