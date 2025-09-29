import initSocket from "../../config/socket.mjs";
import { registerSocketEvents } from "./handlers/event.Handler.mjs";

export default async function setupRealtime(server) {
  const io = await initSocket(server); // Await the async function
  registerSocketEvents(io);
  return io;
}
