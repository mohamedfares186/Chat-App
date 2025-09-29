import { handleTyping } from "../events/typing.event.mjs";
import { handleUserStatus } from "../events/userStatus.event.mjs";

export function onConnection(io, socket) {
  handleTyping(io, socket);
  handleUserStatus(io, socket);
}
