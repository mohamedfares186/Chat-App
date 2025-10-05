import CreateGroupService from "../services/group.create.service.mjs";
import { logger } from "../../../middleware/logger.mjs";

const group = new CreateGroupService();

const createGroupController = async (req, res) => {
  try {
    const { name, description, isPrivate, maxMembers } = req.body;

    if (!name || !isPrivate) {
      return res
        .status(400)
        .json({ error: "Group name and privacy status are required" });
    }

    const { userId } = req.user;

    const groupData = {
      name,
      description,
      isPrivate,
      maxMembers,
      imageUrl: req.file ? req.file.path : null,
      createdById: userId,
    };

    const newGroup = await group.createGroup(groupData);
    return res
      .status(201)
      .json({ message: "Group created successfully", content: newGroup });
  } catch (error) {
    logger.error("Error creating group: ", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export default createGroupController;
