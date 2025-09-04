import bcrypt from "bcryptjs";
import PrismaUserRepository from "../repositories/implementation/prismaUserRepository.mjs";
import { generateUserId } from "../../../utils/generateId.mjs";
import AuthUtils from "../utils/authUtils.mjs";

class RegisterUserService {
  constructor(userRepo = new PrismaUserRepository()) {
    this.userRepo = userRepo;
    this.authUtils = new AuthUtils();
  }

  validate(user) {
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      password: user.password,
      repeatPassword: user.repeatPassword,
      dateOfBirth: user.dateOfBirth,
    };

    for (const field in userData) {
      if (!userData[field]) {
        throw new Error(`${field} is required`);
      }
    }

    if (userData.password !== userData.repeatPassword) {
      throw new Error("Passwords do not match");
    }

    if (userData.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
  }

  async register(user) {
    this.validate(user);

    const exist = await this.userRepo.findByEmail(user.email);
    if (exist) {
      throw new Error("Invalid Credentials");
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userId = generateUserId();

    const createUser = await this.userRepo.create({
      userId: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      password: hashedPassword,
      dateOfBirth: new Date(user.dateOfBirth),
    });

    await this.authUtils.sendVerifyEmail(createUser);

    const tokens = await this.authUtils.generateTokens(createUser);
    return tokens;
  }
}

export default RegisterUserService;
