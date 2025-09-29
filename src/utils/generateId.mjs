import { v4, v7 } from "uuid";

// Generate standard UUID IDs
const generateId = () => {
  return v4();
};

const generateGeneralId = () => {
  return v7();
};

export { generateId, generateGeneralId };
