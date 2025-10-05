import AddGroupService from "../services/group.add.service.mjs";
import { logger } from "../../../middleware/logger.mjs";

const addGroupService = new AddGroupService();

const addGroupController = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    if (!groupId || !userId) {
      return res.status(400).json({ error: "groupId and userId are required" });
    }

    const memberData = {
      groupId,
      userId,
    };

    const newMember = await addGroupService.addMemberToGroup(memberData);
    return res
      .status(201)
      .json({ message: "Member added successfully", content: newMember });
  } catch (error) {
    logger.error("Error adding member to group:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default addGroupController;
