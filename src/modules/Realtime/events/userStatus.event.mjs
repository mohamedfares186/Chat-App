import redis from "../../../config/redis.mjs";

export async function handleUserStatus(io, socket) {
  // Mark user online in Redis
  await redis.sadd("onlineUsers", socket.user.userId);
  io.emit("userStatus", { userId: socket.user.userId, status: "online" });

  socket.on("disconnect", async () => {
    await redis.srem("onlineUsers", socket.user.userId);
    io.emit("userStatus", { userId: socket.user.userId, status: "offline" });
  });
}
