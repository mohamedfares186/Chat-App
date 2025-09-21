import userRepositoryImpl from "../../Users/repositories/implementation/users.implementation.repository.mjs";
import AuthUtils from "../utils/auth.util.mjs";

class LoginService {
  constructor(userRepo = new userRepositoryImpl()) {
    this.userRepo = userRepo;
    this.authUtils = new AuthUtils();
  }

  async login(loginData) {
    // Use AuthUtils for validation
    this.authUtils.validateLoginData(loginData);

    // Find user by username or email
    const user =
      (await this.userRepo.findByUsername(loginData.username)) ||
      (await this.userRepo.findByEmail(loginData.email));

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check if account is active
    if (!this.authUtils.isAccountActive(user)) {
      throw new Error("Account is locked or suspended");
    }

    // Compare password using AuthUtils
    const isPasswordValid = await this.authUtils.comparePassword(
      loginData.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Generate tokens using AuthUtils
    const tokens = await this.authUtils.generateTokens(user);
    return tokens;
  }
}

export default LoginService;
