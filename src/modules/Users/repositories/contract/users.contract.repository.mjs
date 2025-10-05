/* eslint-disable */

/**
 * Abstract class
 * @class
 */

class UserRepository {
  constructor() {
    if (this.constructor == UserRepository) {
      throw new Error("This class can not be instantiated");
    }
  }
  async create(user) {
    throw new Error("Not Implemented");
  }
  async findAll() {
    throw new Error("Not Implemented");
  }
  async findById(userId) {
    throw new Error("Not Implemented");
  }
  async findByEmail(email) {
    throw new Error("Not Implemented");
  }
  async findByUsername(username) {
    throw new Error("Not Implemented");
  }
  async findSafeId(userId) {
    throw new Error("Not Implemented");
  }
  async findSafeUsername(username) {
    throw new Error("Not Implemented");
  }
  async findSafeEmail(email) {
    throw new Error("Not Implemented");
  }
  async findByGoogleId(googleId) {
    throw new Error("Not Implemented");
  }
  async findByFacebookId(facebookId) {
    throw new Error("Not Implemented");
  }
  async update(user) {
    throw new Error("Not Implemented");
  }
  async delete(userId) {
    throw new Error("Not Implemented");
  }
}

export default UserRepository;
