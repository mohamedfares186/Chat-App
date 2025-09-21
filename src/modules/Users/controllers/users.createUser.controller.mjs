import CreateUserService from "../services/users.createUser.service.mjs";
import { logger } from "../../../middleware/logger.mjs";

const createUserService = new CreateUserService();

const createUserController = async (req, res) => {
  try {
    const user = req.body;
    const createUser = await createUserService.createUser(user);
    if (!createUser)
      return res.status(400).json({ error: "Can't create user" });

    return res
      .status(201)
      .json({ message: "User has been created successfully" });
  } catch (error) {
    logger.error("Create user error: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default createUserController;
