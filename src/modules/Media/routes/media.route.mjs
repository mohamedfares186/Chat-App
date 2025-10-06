import { Router } from "express";
import {
  uploadProfilePictureController,
  uploadMessageMediaController,
  getMediaController,
  getConversationMediaController,
  deleteMediaController,
} from "../controllers/media.controller.mjs";
import {
  uploadProfilePic,
  uploadPostMedia,
} from "../../../config/cloudinary.mjs";

const router = Router();

// Upload profile picture
router.post(
  "/profile-picture",
  uploadProfilePic.single("profilePicture"), // Multer middleware
  uploadProfilePictureController
);

// Upload message media (image/video)
router.post(
  "/message",
  uploadPostMedia.single("media"), // Multer middleware
  uploadMessageMediaController
);

// Get specific media by ID
router.get("/:mediaId", getMediaController);

// Get all media for a conversation
router.get("/conversation/:conversationId", getConversationMediaController);

// Delete media
router.delete("/:mediaId", deleteMediaController);

export default router;
