/* eslint-disable */

/**
 * Abstract Class
 * @class
 */

class MessageRepository {
  constructor() {
    if (this.constructor == MessageRepository) {
      throw new Error("This class can not be instantiated");
    }
  }
  async sendMessage(message) {
    throw new Error("Not Implemented");
  }
}

export default MessageRepository;
