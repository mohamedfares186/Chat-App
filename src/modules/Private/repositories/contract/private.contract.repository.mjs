/**
 * Abstract class
 * @class
 */

class PrivateRepository {
  constructor() {
    if (this.constructor == PrivateRepository) {
      throw new Error("This class can not be instantiated");
    }
  }
  async createRoom() {
    throw new Error("Not Implemented");
  }
}

export default PrivateRepository;
