import { z } from "zod";
import { fileTypeFromBuffer } from "file-type";

/**
 * Comprehensive file validation utility
 */
class FileValidator {
  // Allowed file types with their MIME types and extensions
  static ALLOWED_TYPES = {
    image: {
      mimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
      maxSize: 5 * 1024 * 1024, // 5MB
    },
    document: {
      mimeTypes: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      extensions: [".pdf", ".doc", ".docx"],
      maxSize: 10 * 1024 * 1024, // 10MB
    },
    video: {
      mimeTypes: ["video/mp4", "video/webm", "video/ogg"],
      extensions: [".mp4", ".webm", ".ogg"],
      maxSize: 50 * 1024 * 1024, // 50MB
    },
    audio: {
      mimeTypes: ["audio/mpeg", "audio/wav", "audio/ogg"],
      extensions: [".mp3", ".wav", ".ogg"],
      maxSize: 20 * 1024 * 1024, // 20MB
    },
  };

  /**
   * Validate file buffer against allowed types
   */
  static async validateFileBuffer(buffer, allowedCategory = "image") {
    try {
      // Check file type from buffer
      const fileType = await fileTypeFromBuffer(buffer);

      if (!fileType) {
        throw new Error("Unable to determine file type");
      }

      const allowedConfig = this.ALLOWED_TYPES[allowedCategory];
      if (!allowedConfig) {
        throw new Error(`Invalid file category: ${allowedCategory}`);
      }

      // Check MIME type
      if (!allowedConfig.mimeTypes.includes(fileType.mime)) {
        throw new Error(`Invalid MIME type: ${fileType.mime}`);
      }

      // Check file size
      if (buffer.length > allowedConfig.maxSize) {
        throw new Error(
          `File too large. Max size: ${allowedConfig.maxSize} bytes`
        );
      }

      // Check for malicious patterns in file content
      await this.scanForMaliciousContent(buffer, fileType.mime);

      return {
        isValid: true,
        mimeType: fileType.mime,
        extension: fileType.ext,
        size: buffer.length,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message,
      };
    }
  }

  /**
   * Scan file content for malicious patterns
   */
  static async scanForMaliciousContent(buffer, mimeType) {
    const content = buffer.toString("utf8", 0, Math.min(buffer.length, 1024)); // Check first 1KB

    // Check for script tags in non-HTML files
    if (!mimeType.includes("html") && /<script/i.test(content)) {
      throw new Error("Potential malicious script content detected");
    }

    // Check for executable signatures
    const executableSignatures = [
      "MZ", // Windows executable
      "\x7fELF", // Linux executable
      "\xfe\xed\xfa", // macOS executable
    ];

    for (const signature of executableSignatures) {
      if (content.startsWith(signature)) {
        throw new Error("Executable file detected");
      }
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i,
      /eval\(/i,
      /document\.write/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        throw new Error("Suspicious content pattern detected");
      }
    }
  }

  /**
   * Validate file name
   */
  static validateFileName(fileName) {
    if (!fileName || typeof fileName !== "string") {
      throw new Error("Invalid file name");
    }

    // Check length
    if (fileName.length > 255) {
      throw new Error("File name too long");
    }

    // Check for invalid characters
    const invalidChars = /\p{Cc}/gu;
    if (invalidChars.test(fileName)) {
      throw new Error("File name contains invalid characters");
    }

    // Check for reserved names (Windows)
    const reservedNames = [
      "CON",
      "PRN",
      "AUX",
      "NUL",
      "COM1",
      "COM2",
      "COM3",
      "COM4",
      "COM5",
      "COM6",
      "COM7",
      "COM8",
      "COM9",
      "LPT1",
      "LPT2",
      "LPT3",
      "LPT4",
      "LPT5",
      "LPT6",
      "LPT7",
      "LPT8",
      "LPT9",
    ];
    const nameWithoutExt = fileName.split(".")[0].toUpperCase();
    if (reservedNames.includes(nameWithoutExt)) {
      throw new Error("File name is reserved");
    }

    // Check for path traversal attempts
    if (
      fileName.includes("..") ||
      fileName.includes("/") ||
      fileName.includes("\\")
    ) {
      throw new Error("Path traversal attempt detected");
    }

    return true;
  }

  /**
   * Generate safe file name
   */
  static generateSafeFileName(originalName, userId) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split(".").pop() || "";

    return `${userId}_${timestamp}_${random}${
      extension ? `.${extension}` : ""
    }`;
  }

  /**
   * Validate file upload request
   */
  static async validateFileUpload(file, allowedCategory = "image", userId) {
    try {
      // Validate file name
      this.validateFileName(file.originalname);

      // Convert file to buffer if needed
      const buffer = Buffer.isBuffer(file.buffer)
        ? file.buffer
        : Buffer.from(file.buffer);

      // Validate file buffer
      const validation = await this.validateFileBuffer(buffer, allowedCategory);

      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Generate safe file name
      const safeFileName = this.generateSafeFileName(file.originalname, userId);

      return {
        isValid: true,
        safeFileName,
        mimeType: validation.mimeType,
        extension: validation.extension,
        size: validation.size,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message,
      };
    }
  }
}

// Zod schemas for file validation
export const fileValidationSchemas = {
  imageUpload: z.object({
    file: z.any().refine((file) => file && file.buffer, "File is required"),
    category: z.enum(["image", "document", "video", "audio"]).default("image"),
  }),

  fileName: z
    .string()
    .min(1, "File name is required")
    .max(255, "File name too long")
    .regex(/\p{Cc}/gu, "File name contains invalid characters")
    .refine(
      (name) =>
        !name.includes("..") && !name.includes("/") && !name.includes("\\"),
      "Path traversal attempt detected"
    ),
};

export default FileValidator;
