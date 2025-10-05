import UserRepository from "../../Users/repositories/contract/users.contract.repository.mjs";
import prisma from "../../../config/database.mjs";

class AuthRepositoryImpl extends UserRepository {
  async create(user) {
    return await prisma.users.create({ data: user });
  }

  async findById(userId) {
    return await prisma.users.findUnique({ where: { userId } });
  }

  async findByEmail(email) {
    return await prisma.users.findUnique({ where: { email } });
  }

  async findByUsername(username) {
    return await prisma.users.findUnique({ where: { username } });
  }

  async update(user) {
    return await prisma.users.update({
      where: { userId: user.userId },
      data: user,
    });
  }
}

export default AuthRepositoryImpl;
