import UserRepository from "../contract/users.contract.repository.mjs";
import prisma from "../../../../config/database.mjs";

class userRepositoryImpl extends UserRepository {
  async create(user) {
    return await prisma.users.create({ data: user });
  }
  async findAll() {
    return await prisma.users.findMany({
      select: {
        userId: true,
        displayName: true,
        email: true,
        username: true,
        userRoles: true,
        isBanned: true,
        isActive: true,
        isVerified: true,
      },
    });
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
  async findSafeId(userId) {
    return await prisma.users.findUnique({
      where: { userId },
      select: {
        userId: true,
        displayName: true,
        email: true,
        username: true,
        userRoles: true,
        isBanned: true,
        isActive: true,
        isVerified: true,
      },
    });
  }
  async findSafeUsername(username) {
    return await prisma.users.findUnique({
      where: { username },
      select: {
        userId: true,
        displayName: true,
        email: true,
        username: true,
        userRoles: true,
        isBanned: true,
        isActive: true,
        isVerified: true,
      },
    });
  }
  async findSafeEmail(email) {
    return await prisma.users.findUnique({
      where: { email },
      select: {
        userId: true,
        displayName: true,
        email: true,
        username: true,
        userRoles: true,
        isBanned: true,
        isActive: true,
        isVerified: true,
      },
    });
  }
  async findByGoogleId(googleId) {
    return await prisma.users.findUnique({ where: { googleId } });
  }
  async findByFacebookId(facebookId) {
    return await prisma.users.findUnique({ where: { facebookId } });
  }
  async update(user) {
    return await prisma.users.update({
      where: { userId: user.userId },
      data: user,
    });
  }

  async delete(userId) {
    return await prisma.users.delete({
      where: { userId },
    });
  }
}
export default userRepositoryImpl;
