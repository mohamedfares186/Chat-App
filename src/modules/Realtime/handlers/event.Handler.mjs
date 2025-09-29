import { onConnection } from "./connection.Handler.mjs";

export function registerSocketEvents(io) {
  io.on("connection", (socket) => {
    onConnection(io, socket);
  });
}
