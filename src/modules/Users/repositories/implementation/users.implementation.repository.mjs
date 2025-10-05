import UserRepository from "../contract/users.contract.repository.mjs";
import prisma from "../../../../config/database.mjs";

class UserRepositoryImpl extends UserRepository {
  #safeUserData = {
    userId: true,
    displayName: true,
    email: true,
    username: true,
    userRoles: true,
    isBanned: true,
    isActive: true,
    isVerified: true,
  };

  async create(user) {
    return await prisma.users.create({ data: user });
  }
  async findAll() {
    return await prisma.users.findMany({
      select: this.#safeUserData,
    });
  }
  async findSafeId(userId) {
    return await prisma.users.findUnique({
      where: { userId },
      select: this.#safeUserData,
    });
  }
  async findSafeUsername(username) {
    return await prisma.users.findUnique({
      where: { username },
      select: this.#safeUserData,
    });
  }
  async findSafeEmail(email) {
    return await prisma.users.findUnique({
      where: { email },
      select: this.#safeUserData,
    });
  }
  async delete(userId) {
    return await prisma.users.delete({
      where: { userId },
    });
  }
}
export default UserRepositoryImpl;
