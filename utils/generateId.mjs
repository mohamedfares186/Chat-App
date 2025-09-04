import { v4, v7 } from "uuid";

const generateUserId = () => {
  return `user_${v4()}`;
};

const generateRoomId = () => {
  return `room_${v4()}`;
};

const generateMessageId = () => {
  return `message_${v7()}`;
};

export { generateUserId, generateRoomId, generateMessageId };
