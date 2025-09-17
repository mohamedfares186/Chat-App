import sanitizeHtml from "sanitize-html";
import validator from "validator";

/**
 * Comprehensive input sanitization utility
 */
class InputSanitizer {
  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  static sanitizeHtml(input, options = {}) {
    if (typeof input !== "string") return input;

    const defaultOptions = {
      allowedTags: [],
      allowedAttributes: {},
      disallowedTagsMode: "discard",
      allowedSchemes: [],
      allowedSchemesByTag: {},
      allowedSchemesAppliedToAttributes: [],
      allowProtocolRelative: false,
      enforceHtmlBoundary: false,
    };

    return sanitizeHtml(input, { ...defaultOptions, ...options });
  }

  /**
   * Sanitize text input (remove HTML, trim, limit length)
   */
  static sanitizeText(input, maxLength = 1000) {
    if (typeof input !== "string") return "";

    return input
      .trim()
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/[\x00-\x1F\x7F]/g, "") // Remove control characters
      .substring(0, maxLength);
  }

  /**
   * Sanitize email input
   */
  static sanitizeEmail(email) {
    if (typeof email !== "string") return "";

    return email
      .toLowerCase()
      .trim()
      .replace(/[^\w@.-]/g, ""); // Keep only valid email characters
  }

  /**
   * Sanitize username input
   */
  static sanitizeUsername(username) {
    if (typeof username !== "string") return "";

    return username
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9_]/g, "") // Keep only alphanumeric and underscore
      .substring(0, 20);
  }

  /**
   * Sanitize display name
   */
  static sanitizeDisplayName(displayName) {
    if (typeof displayName !== "string") return "";

    return displayName
      .trim()
      .replace(/[<>]/g, "") // Remove HTML tags
      .replace(/[\x00-\x1F\x7F]/g, "") // Remove control characters
      .substring(0, 50);
  }

  /**
   * Sanitize password (basic sanitization, don't modify too much)
   */
  static sanitizePassword(password) {
    if (typeof password !== "string") return "";

    return password.trim();
  }

  /**
   * Sanitize URL input
   */
  static sanitizeUrl(url) {
    if (typeof url !== "string") return "";

    const sanitized = url.trim();

    // Only allow http/https URLs
    if (!validator.isURL(sanitized, { protocols: ["http", "https"] })) {
      return "";
    }

    return sanitized;
  }

  /**
   * Sanitize phone number
   */
  static sanitizePhone(phone) {
    if (typeof phone !== "string") return "";

    return phone
      .replace(/[^\d+()-]/g, "") // Keep only digits, +, (, ), -
      .substring(0, 20);
  }

  /**
   * Sanitize JSON input
   */
  static sanitizeJson(input) {
    if (typeof input !== "string") return null;

    try {
      const parsed = JSON.parse(input);
      return typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }

  /**
   * Remove SQL injection patterns
   */
  static sanitizeSql(input) {
    if (typeof input !== "string") return "";

    return input
      .replace(/['";\\]/g, "") // Remove SQL special characters
      .replace(
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
        ""
      ); // Remove SQL keywords
  }

  /**
   * Comprehensive sanitization for user input
   */
  static sanitizeUserInput(input, type = "text", options = {}) {
    switch (type) {
      case "email":
        return this.sanitizeEmail(input);
      case "username":
        return this.sanitizeUsername(input);
      case "displayName":
        return this.sanitizeDisplayName(input);
      case "password":
        return this.sanitizePassword(input);
      case "url":
        return this.sanitizeUrl(input);
      case "phone":
        return this.sanitizePhone(input);
      case "html":
        return this.sanitizeHtml(input, options);
      case "sql":
        return this.sanitizeSql(input);
      case "json":
        return this.sanitizeJson(input);
      default:
        return this.sanitizeText(input, options.maxLength);
    }
  }
}

export default InputSanitizer;
