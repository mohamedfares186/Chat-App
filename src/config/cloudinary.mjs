import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import env from "./environment.mjs";
import { logger } from "../middleware/logger.mjs";

// Configure Cloudinary
if (
  env.cloudinaryCloudName &&
  env.cloudinaryApiKey &&
  env.cloudinaryApiSecret
) {
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
  });
  logger.info("Cloudinary configured successfully.");
} else {
  logger.error("Cloudinary configuration is missing in environment variables.");
}

// Storage for profile pictures
const profilePictureStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat-app/profile-pictures",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [
      { width: 250, height: 250, crop: "thumb", gravity: "face" },
    ],
  },
});

// Storage for post images/videos
const postMediaStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat-app/post-media",
    allowed_formats: ["jpg", "png", "jpeg", "mp4", "mov"],
    resource_type: "auto", // Automatically detect image/video
  },
});

// Multer instances
const uploadProfilePic = multer({
  storage: profilePictureStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const uploadPostMedia = multer({
  storage: postMediaStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

export { cloudinary, uploadProfilePic, uploadPostMedia };
