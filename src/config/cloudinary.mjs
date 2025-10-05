import { v2 as cloudinary } from "cloudinary";
import { cloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL);

const profilePictures = new cloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat-app/profile-pictures",
    resource_type: "image",
    allowedFormats: ["jpg", "png", "jpeg"],
    transformation: [
      { width: 250, height: 250, crop: "thumb", gravity: "face" },
    ],
  },
});

const postImages = new cloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat-app/post-images",
    resource_type: "auto",
    allowedFormats: ["jpg", "png", "jpeg", "mp4"],
  },
});

export { cloudinary, profilePictures, postImages };
