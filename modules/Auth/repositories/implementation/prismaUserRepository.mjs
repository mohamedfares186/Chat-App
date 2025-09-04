import UserRepository from "../contract/userRepository.mjs";
import prisma from "../../../../config/database.mjs";

class PrismaUserRepository extends UserRepository {
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
  async update(user) {
    return prisma.Users.update({ where: { email: user.email }, data: user });
  }
}
export default PrismaUserRepository;
