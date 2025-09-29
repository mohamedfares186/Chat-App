import PrivateRepository from "../contract/private.contract.repository.mjs";
import prisma from "../../../../config/database.mjs";

class PrivateRepositoryImpl extends PrivateRepository {
  async createRoom(roomData) {
    return await prisma.PrivateConversations.create({ data: roomData });
  }

  async findRoomById(roomId) {
    return await prisma.PrivateConversations.findUnique({
      where: { conversationId: roomId },
    });
  }
}

export default PrivateRepositoryImpl;
