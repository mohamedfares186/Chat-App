import MediaRepository from "../contract/media.repository.contract.mjs";
import prisma from "../../../../config/database.mjs";

class MediaRepositoryImpl extends MediaRepository {
  async createMedia(mediaData) {
    const media = await prisma.media.create({
      data: mediaData,
    });
    return media;
  }

  async findMediaById(mediaId) {
    const media = await prisma.media.findUnique({
      where: { mediaId }, // Using mediaId (Cloudinary ID) as unique identifier
      include: {
        user: {
          select: {
            userId: true,
            displayName: true,
            username: true,
          },
        },
        message: {
          select: {
            messageId: true,
            conversationId: true,
            createdAt: true,
          },
        },
      },
    });
    return media;
  }

  async findMediaByConversationId(conversationId) {
    // Get all messages in the conversation, then get their media
    const media = await prisma.media.findMany({
      where: {
        message: {
          conversationId,
        },
      },
      include: {
        user: {
          select: {
            userId: true,
            displayName: true,
            username: true,
          },
        },
        message: {
          select: {
            messageId: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return media;
  }

  async findMediaByMessageId(messageId) {
    const media = await prisma.media.findMany({
      where: { messageId },
    });
    return media;
  }

  async deleteMedia(mediaId) {
    const media = await prisma.media.delete({
      where: { mediaId },
    });
    return media;
  }

  async deleteMediaByMessageId(messageId) {
    const deletedMedia = await prisma.media.deleteMany({
      where: { messageId },
    });
    return deletedMedia;
  }
}

export default MediaRepositoryImpl;
