import { cloudinary } from "../../../config/cloudinary.mjs";
import MediaRepositoryImpl from "../repositories/implementation/media.repository.implementation.mjs";
import UserRepositoryImpl from "../../Users/repositories/implementation/users.implementation.repository.mjs";
import MessageRepositoryImpl from "../../Messages/repositories/implementation/message.implementation.repository.mjs";

class MediaService {
  constructor(
    media = new MediaRepositoryImpl(),
    user = new UserRepositoryImpl(),
    message = new MessageRepositoryImpl()
  ) {
    this.media = media;
    this.user = user;
    this.message = message;
  }

  /**
   * Upload profile picture and update user profile
   */
  async uploadProfilePicture(file, userId) {
    // Verify user exists
    const user = await this.user.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // File is already uploaded to Cloudinary by Multer middleware
    // The file object contains the Cloudinary response
    const { path: mediaUrl, filename: mediaId } = file;

    // If user has existing profile picture, delete it from Cloudinary
    if (user.profilePictureId) {
      try {
        await cloudinary.uploader.destroy(user.profilePictureId);
      } catch (error) {
        console.error("Error deleting old profile picture:", error);
        // Continue even if deletion fails
      }
    }

    // Update user with new profile picture URL and ID
    await this.user.updateUser(userId, {
      profilePictureUrl: mediaUrl,
      profilePictureId: mediaId,
    });

    return { mediaUrl, mediaId };
  }

  /**
   * Upload media (image/video) for a message
   */
  async uploadMessageMedia(
    file,
    userId,
    conversationId,
    conversationType,
    receiverId = null
  ) {
    // Verify user exists
    const user = await this.user.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // File is already uploaded to Cloudinary by Multer middleware
    const {
      path: mediaUrl,
      filename: mediaId,
      mimetype,
      size: fileSize,
      originalname: fileName,
    } = file;

    // Determine media type from mimetype
    let mediaType = "IMAGE";
    let messageType = "IMAGE";

    if (mimetype.startsWith("video/")) {
      mediaType = "VIDEO";
      messageType = "VIDEO";
    }

    // Create message first
    const messageData = {
      senderId: userId,
      receiverId,
      conversationId,
      conversationType,
      content: "", // Empty content for media messages
      messageType,
    };

    const newMessage = await this.message.createMessage(messageData);

    // Create media record
    const mediaData = {
      mediaId,
      userId,
      messageId: newMessage.messageId,
      mediaType,
      mediaUrl,
      fileName,
      fileSize,
      mimeType: mimetype,
    };

    const media = await this.media.createMedia(mediaData);

    return {
      message: newMessage,
      media,
    };
  }

  /**
   * Get media by mediaId (for retrieval)
   */
  async getMediaById(mediaId) {
    const media = await this.media.findMediaById(mediaId);
    if (!media) {
      throw new Error("Media not found");
    }
    return media;
  }

  /**
   * Get all media for a conversation
   */
  async getConversationMedia(conversationId) {
    return await this.media.findMediaByConversationId(conversationId);
  }

  /**
   * Delete media (from both database and Cloudinary)
   */
  async deleteMedia(mediaId, userId) {
    const media = await this.media.findMediaById(mediaId);

    if (!media) {
      throw new Error("Media not found");
    }

    // Check if user owns the media
    if (media.userId !== userId) {
      throw new Error("Unauthorized to delete this media");
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(media.mediaId, {
        resource_type: media.mediaType === "VIDEO" ? "video" : "image",
      });
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error);
      // Continue to delete from database even if Cloudinary deletion fails
    }

    // Delete from database
    await this.media.deleteMedia(mediaId);

    return { success: true };
  }
}

export default MediaService;
