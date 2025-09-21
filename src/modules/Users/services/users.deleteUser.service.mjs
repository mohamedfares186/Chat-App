import userRepositoryImpl from "../repositories/implementation/users.implementation.repository.mjs";

class DeleteUserService {
  constructor(users = new userRepositoryImpl()) {
    this.users = users;
  }

  async deleteUser(userId) {
    const deleteUser = await this.users.delete(userId);
    if (!deleteUser) throw new Error("Can't delete user");

    return deleteUser;
  }
}

export default DeleteUserService;
