import userRepositoryImpl from "../repositories/implementation/users.implementation.repository.mjs";

class GetAllUsersService {
  constructor(users = new userRepositoryImpl()) {
    this.users = users;
  }

  async getAllUsers() {
    const allUsers = this.users.findAll();
    if (!allUsers) throw new Error("Users not found");

    return allUsers;
  }
}

export default GetAllUsersService;
