import UserRepository from "../contract/userRepository.mjs";
import prisma from "../../../../config/database.mjs";

class userRepositoryImpl extends UserRepository {
  async create(user) {
    return prisma.Users.create({ data: user });
  }
  async findById(userId) {
    return prisma.Users.findUnique({ where: { userId } });
  }
  async findByEmail(email) {
    return prisma.Users.findUnique({ where: { email } });
  }
  async findByUsername(username) {
    return prisma.Users.findUnique({ where: { username } });
  }
  async findByGoogleId(googleId) {
    return prisma.Users.findUnique({ where: { googleId } });
  }
  async findByFacebookId(facebookId) {
    return prisma.Users.findUnique({ where: { facebookId } });
  }
  async update(user) {
    return prisma.Users.update({ where: { userId: user.userId }, data: user });
  }
}
export default userRepositoryImpl;
