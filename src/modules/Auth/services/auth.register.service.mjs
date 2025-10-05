import AuthRepositoryImpl from "../repository/users.repository.implementation.mjs";
import { generateId } from "../../../utils/generateId.mjs";
import AuthUtils from "../utils/auth.util.mjs";
import PermissionService from "../../../services/permissionServices.mjs";

class RegisterUserService {
  constructor(users = new AuthRepositoryImpl(), utils = new AuthUtils()) {
    this.users = users;
    this.utils = utils;
  }

  async register(userData) {
    // Use AuthUtils for comprehensive validation
    this.utils.validateRegistrationData(userData);

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
    const hashedPassword = await this.utils.hashPassword(userData.password);
    const userId = generateId();

    // Create user with sanitized data
    const createUser = await this.users.create({
      userId: userId,
      displayName: this.utils.sanitizeInput(userData.displayName),
      email: userData.email.toLowerCase().trim(),
      username: userData.username.toLowerCase().trim(),
      password: hashedPassword,
      dateOfBirth: new Date(userData.dateOfBirth),
    });

    // Assign default USER role to new user
    await PermissionService.assignDefaultUserRole(userId);

    // Send verification email using AuthUtils
    await this.utils.sendVerifyEmail(createUser);

    // Generate tokens using AuthUtils
    const tokens = await this.utils.generateTokens(createUser);
    return tokens;
  }
}

export default RegisterUserService;
