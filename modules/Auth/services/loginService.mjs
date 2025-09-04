import PrismaUserRepository from "../repositories/implementation/prismaUserRepository.mjs";
import AuthUtils from "../utils/authUtils.mjs";
import bcrypt from "bcryptjs";

class LoginService {
  constructor(userRepo = new PrismaUserRepository()) {
    this.userRepo = userRepo;
    this.authUtils = new AuthUtils();
  }

  validate(user) {
    const userData = {
      username: user.username,
      password: user.password,
    };

    for (const field in userData) {
      if (!userData[field]) {
        throw new Error(`${field} is required`);
      }
    }

    if (userData.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
  }

  async login(user) {
    this.validate(user);

    const exist = await this.userRepo.findByUsername(user.username);
    if (!exist) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(user.password, exist.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const tokens = await this.authUtils.generateTokens(exist);
    return tokens;
  }
}

export default LoginService;
