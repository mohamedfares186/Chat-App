import MediaService from "../services/media.service.mjs";
import { logger } from "../../../middleware/logger.mjs";

const mediaService = new MediaService();

/**
 * Upload profile picture
 * Expects file in req.file (handled by Multer middleware)
 */
const uploadProfilePictureController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { userId } = req.user;

    const result = await mediaService.uploadProfilePicture(req.file, userId);

    return res.status(200).json({
      message: "Profile picture uploaded successfully",
      data: result,
    });
  } catch (error) {
    logger.error(`Error in uploadProfilePictureController: ${error.message}`);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

/**
 * Upload message media (image/video)
 * Expects file in req.file and conversation details in body
 */
const uploadMessageMediaController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { userId } = req.user;
    const { conversationId, conversationType, receiverId } = req.body;

    if (!conversationId || !conversationType) {
      return res.status(400).json({
        error: "conversationId and conversationType are required",
      });
    }

    const result = await mediaService.uploadMessageMedia(
      req.file,
      userId,
      conversationId,
      conversationType,
      receiverId
    );

    return res.status(200).json({
      message: "Media uploaded successfully",
      data: result,
    });
  } catch (error) {
    logger.error(`Error in uploadMessageMediaController: ${error.message}`);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

/**
 * Get media by ID
 */
const getMediaController = async (req, res) => {
  try {
    const { mediaId } = req.params;

    const media = await mediaService.getMediaById(mediaId);

    return res.status(200).json({
      data: media,
    });
  } catch (error) {
    logger.error(`Error in getMediaController: ${error.message}`);
    return res.status(404).json({ error: error.message || "Media not found" });
  }
};

/**
 * Get all media for a conversation
 */
const getConversationMediaController = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const media = await mediaService.getConversationMedia(conversationId);

    return res.status(200).json({
      data: media,
    });
  } catch (error) {
    logger.error(`Error in getConversationMediaController: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Delete media
 */
const deleteMediaController = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const { userId } = req.user;

    await mediaService.deleteMedia(mediaId, userId);

    return res.status(200).json({
      message: "Media deleted successfully",
    });
  } catch (error) {
    logger.error(`Error in deleteMediaController: ${error.message}`);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export {
  uploadProfilePictureController,
  uploadMessageMediaController,
  getMediaController,
  getConversationMediaController,
  deleteMediaController,
};
