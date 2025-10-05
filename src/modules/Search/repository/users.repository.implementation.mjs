import UserRepository from "../../Users/repositories/contract/users.contract.repository.mjs";
import prisma from "../../../config/database.mjs";

class SearchRepositoryImpl extends UserRepository {
  #safeUserData = {
    userId: true,
    displayName: true,
    username: true,
  };

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
}

export default SearchRepositoryImpl;
