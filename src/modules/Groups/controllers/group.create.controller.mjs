import CreateGroupService from "../services/group.create.service.mjs";
import { logger } from "../../../middleware/logger.mjs";

const group = new CreateGroupService();

const createGroupController = async (req, res) => {
  try {
    const groupData = req.body;
    groupData.userId = req.user.userId;

    const newGroup = await group.createGroup(groupData);
    return res
      .status(201)
      .json({ message: "Group created successfully", content: newGroup });
  } catch (error) {
    logger.error("Error creating group:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export default createGroupController;
