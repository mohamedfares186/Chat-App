import GroupRepositoryImpl from "../repositories/implementation/group.implementation.repository.mjs";
import { generateGeneralId } from "../../../utils/generateId.mjs";
import UserRepoistoryImpl from "../../Users/repositories/implementation/users.implementation.repository.mjs";

class CreateGroupService {
  constructor(
    group = new GroupRepositoryImpl(),
    users = new UserRepoistoryImpl()
  ) {
    this.group = group;
    this.users = users;
  }

  async createGroup(group) {
    const groupId = generateGeneralId();

    const exist = await this.group.findGroupById(groupId);
    if (exist) throw new Error("Group already exist");

    const groupData = {
      groupId: groupId,
      name: group.name,
      description: group.description,
      imageUrl: group.imageUrl,
      isPrivate: group.isPrivate,
      createdById: group.userId,
    };

    return await this.group.createGroup(groupData);
  }
}

export default CreateGroupService;
