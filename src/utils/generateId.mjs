import { v4, v7 } from "uuid";

// Generate standard UUID IDs
const generateId = () => {
  return v4();
};

const generateMessageId = () => {
  return v7();
};

export { generateId, generateMessageId };
