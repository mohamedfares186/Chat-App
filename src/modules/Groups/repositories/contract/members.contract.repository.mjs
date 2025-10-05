/* eslint-disable */

/**
 * Abstract class
 * @class
 */

class GroupMembersRepository {
  constructor() {
    if (this.constructor == GroupMembersRepository) {
      throw new Error("This class can not be instantiated");
    }
  }
  async addMember(memberData) {
    throw new Error("Not Implemented");
  }
}

export default GroupMembersRepository;
