import MessageRepositoryImpl from "../repositories/implementation/message.implementation.repository.mjs";
import { generateGeneralId } from "../../../utils/generateGeneralId.mjs";

class MessageService {
  constructor(messages = new MessageRepositoryImpl()) {
    this.messages = messages;
  }

  async sendMessage(message) {
    const messageId = generateGeneralId();
    message.messageId = messageId;
    return await this.messages.sendMessage(message);
  }
}

export default MessageService;
