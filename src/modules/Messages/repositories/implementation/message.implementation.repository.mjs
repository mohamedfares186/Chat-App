import prisma from "../../../../config/database.mjs";
import MessageRepository from "../contract/message.contract.repository.mjs";

class MessageRepositoryImpl extends MessageRepository {
  async sendMessage(message) {
    return await prisma.messages.create({
      data: message,
    });
  }
}
export default MessageRepositoryImpl;
