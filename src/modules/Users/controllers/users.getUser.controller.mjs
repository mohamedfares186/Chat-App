import GetUserService from "../services/users.getUser.service.mjs";
import { logger } from "../../../middleware/logger.mjs";

const findUser = new GetUserService();

const getUserController = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username)
      return res.status(400).json({ error: "This field is required" });

    const user = await findUser.getUser(username);
    if (!user) return res.status(404).json({ error: "Not Found" });

    return res.status(200).json({ message: "User Found", content: user });
  } catch (error) {
    logger.error("Find user error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default getUserController;
