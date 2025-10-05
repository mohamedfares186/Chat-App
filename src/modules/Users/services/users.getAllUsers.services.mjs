import UserRepositoryImpl from "../repositories/implementation/users.implementation.repository.mjs";
class GetAllUsersService {
  constructor(users = new UserRepositoryImpl()) {
    this.users = users;
  }

  async getAllUsers() {
    const allUsers = this.users.findAll();
    if (!allUsers) throw new Error("Users not found");

    return allUsers;
  }
}

export default GetAllUsersService;
