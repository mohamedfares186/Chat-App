import prisma from "../../../../config/database.mjs";
import GroupRepository from "../contract/group.contract.repository.mjs";

class GroupRepositoryImpl extends GroupRepository {
  async createGroup(groupData) {
    return await prisma.GroupConversations.create(groupData);
  }

  async findGroupById(grouptId) {
    return await prisma.GroupConversations.findUnique({
      where: { grouptId: grouptId },
    });
  }
}

export default GroupRepositoryImpl;
