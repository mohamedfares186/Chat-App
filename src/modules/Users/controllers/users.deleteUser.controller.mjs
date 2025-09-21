import DeleteUserService from "../services/users.deleteUser.service.mjs";
import { logger } from "../../../middleware/logger.mjs";

const deleteUserService = new DeleteUserService();

const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    await deleteUserService.deleteUser(userId);

    return res
      .status(200)
      .json({ message: "User has been deleted successfully" });
  } catch (error) {
    logger.error("Deleting user error: ", error.message);
    return res.status(500).json("Internal server error");
  }
};

export default deleteUserController;
