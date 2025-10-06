import AuthRepositoryImpl from "../repositories/users.repository.implementation.mjs";
import AuthUtils from "../utils/auth.util.mjs";

class LoginService {
  constructor(users = new AuthRepositoryImpl(), utils = new AuthUtils()) {
    this.users = users;
    this.utils = utils;
  }

  async login(loginData) {
    // Use AuthUtils for validation
    this.utils.validateLoginData(loginData);

    // Find user by username or email
    const user =
      (await this.users.findByUsername(loginData.username)) ||
      (await this.users.findByEmail(loginData.email));

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check if account is active
    if (!this.utils.isAccountActive(user)) {
      throw new Error("Account is locked or suspended");
    }

    // Compare password using AuthUtils
    const isPasswordValid = await this.utils.comparePassword(
      loginData.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Generate tokens using AuthUtils
    const tokens = await this.utils.generateTokens(user);
    return tokens;
  }
}

export default LoginService;
