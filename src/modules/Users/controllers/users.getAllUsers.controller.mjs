import GetAllUsersService from "../services/users.getAllUsers.services.mjs";
import { logger } from "../../../middleware/logger.mjs";

const allUsers = new GetAllUsersService();

const getAllUsersController = async (req, res) => {
  try {
    const users = await allUsers.getAllUsers();
    if (!users)
      return res.status(404).json({ error: "No user has been found" });

    return res.status(200).json({ message: "Users", content: users });
  } catch (error) {
    logger.error("Get all users error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default getAllUsersController;
