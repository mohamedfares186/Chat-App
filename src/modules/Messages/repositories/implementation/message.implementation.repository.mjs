import prisma from "../../../../config/database.mjs";
import MessageRepository from "../contract/message.contract.repository.mjs";

class MessageRepositoryImpl extends MessageRepository {
  async sendMessage(message) {
    return await prisma.messages.create({
      data: message,
    });
  }

  async getMessagesByConversationId(conversationId) {
    return await prisma.messages.findMany({
      where: {
        conversationId: conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}
export default MessageRepositoryImpl;
