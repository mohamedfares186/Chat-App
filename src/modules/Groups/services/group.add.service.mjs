import GroupMembersRepositoryImpl from "../repositories/implementation/members.implementation.repository.mjs";

class AddGroupService {
  constructor(groupMembers = new GroupMembersRepositoryImpl()) {
    this.groupMembers = groupMembers;
  }

  async addMemberToGroup(memberData) {
    return await this.groupMembers.addMember(memberData);
  }
}

export default AddGroupService;
