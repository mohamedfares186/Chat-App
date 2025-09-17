import { v4, v7 } from "uuid";

const generateUserId = () => {
  return v4();
};

const generateRoomId = () => {
  return v4();
};

const generateMessageId = () => {
  return v7();
};

export { generateUserId, generateRoomId, generateMessageId };
