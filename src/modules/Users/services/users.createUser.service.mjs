import userRepositoryImpl from "../repositories/implementation/users.implementation.repository.mjs";
import AuthUtils from "../../Auth/utils/auth.util.mjs";
import { generateId } from "../../../utils/generateId.mjs";
import PermissionService from "../../../services/permissionServices.mjs";

class CreateUserService {
  constructor(users = new userRepositoryImpl(), authUtils = new AuthUtils()) {
    this.users = users;
    this.authUtils = authUtils;
  }

  async createUser(userData) {
    this.authUtils.validateRegistrationData(userData);

    // Check if user already exists
    const existingUser = await this.users.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const existingUsername = await this.users.findByUsername(userData.username);
    if (existingUsername) {
      throw new Error("Username is already taken");
    }

    // Hash password using AuthUtils
    const hashedPassword = await this.authUtils.hashPassword(userData.password);
    const userId = generateId();

    // Create user with sanitized data
    const createUser = await this.users.create({
      userId: userId,
      displayName: this.authUtils.sanitizeInput(userData.displayName),
      email: userData.email.toLowerCase().trim(),
      username: userData.username.toLowerCase().trim(),
      password: hashedPassword,
      dateOfBirth: new Date(userData.dateOfBirth),
      isVerified: true, // Automatically verified when the admin create the account
    });

    // Assign default USER role to new user
    await PermissionService.assignDefaultUserRole(userId);

    // Send verification email using AuthUtils
    await this.authUtils.sendVerifyEmail(createUser);

    // Generate tokens using AuthUtils
    const tokens = await this.authUtils.generateTokens(createUser);
    return tokens;
  }
}

export default CreateUserService;
