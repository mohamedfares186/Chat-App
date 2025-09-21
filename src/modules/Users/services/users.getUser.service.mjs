import userRepositoryImpl from "../repositories/implementation/users.implementation.repository.mjs";

class GetUserService {
  constructor(users = new userRepositoryImpl()) {
    this.users = users;
  }

  async getUser(user) {
    const findUser = this.users.findSafeUsername(user);
    if (!findUser) throw new Error("No user has been found");

    return findUser;
  }
}

export default GetUserService;
