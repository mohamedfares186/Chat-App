import userRepositoryImpl from "../../Users/repositories/implementation/users.implementation.repository.mjs";
import { generateId } from "../../../utils/generateId.mjs";
import AuthUtils from "../utils/auth.util.mjs";
import PermissionService from "../../../services/permissionServices.mjs";

class RegisterUserService {
  constructor(userRepo = new userRepositoryImpl()) {
    this.userRepo = userRepo;
    this.authUtils = new AuthUtils();
  }

  async register(userData) {
    // Use AuthUtils for comprehensive validation
    this.authUtils.validateRegistrationData(userData);

    // Check if user already exists
    const existingUser = await this.userRepo.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const existingUsername = await this.userRepo.findByUsername(
      userData.username
    );
    if (existingUsername) {
      throw new Error("Username is already taken");
    }

    // Hash password using AuthUtils
    const hashedPassword = await this.authUtils.hashPassword(userData.password);
    const userId = generateId();

    // Create user with sanitized data
    const createUser = await this.userRepo.create({
      userId: userId,
      displayName: this.authUtils.sanitizeInput(userData.displayName),
      email: userData.email.toLowerCase().trim(),
      username: userData.username.toLowerCase().trim(),
      password: hashedPassword,
      dateOfBirth: new Date(userData.dateOfBirth),
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

export default RegisterUserService;
