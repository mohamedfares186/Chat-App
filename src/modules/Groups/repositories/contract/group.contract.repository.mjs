/* eslint-disable */

/**
 * Abstract Class
 * @class
 */

class GroupRepository {
  constructor() {
    if (this.constructor == GroupRepository) {
      throw new Error("This class can not be instantiated");
    }
  }
  async createGroup(groupData) {
    throw new Error("Not Implemented");
  }

  async findGroupById(groupId) {
    throw new Error("Not Implemented");
  }
}

export default GroupRepository;
