import prisma from "../../../../config/database.mjs";
import GroupMembersRepository from "../contract/members.contract.repository.mjs";

class GroupMembersRepositoryImpl extends GroupMembersRepository {
  async addMember(memberData) {
    return prisma.GroupMembers.create(memberData);
  }
}

export default GroupMembersRepositoryImpl;
