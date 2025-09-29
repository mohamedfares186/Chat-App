import PrivateRepositoryImpl from "../repositories/implementation/private.implementation.repository.mjs";
import { generateGeneralId } from "../../../utils/generateId.mjs";
import UserRepoistoryImpl from "../../Users/repositories/implementation/users.implementation.repository.mjs";

class CreateRoomService {
  constructor(
    room = new PrivateRepositoryImpl(),
    user = new UserRepoistoryImpl()
  ) {
    this.room = room;
    this.user = user;
  }

  async createRoom(userOne, userTwo) {
    const roomId = generateGeneralId();
    const userOneId = await this.user.findSafeId(userOne);
    const userTwoId = await this.user.findSafeId(userTwo);

    if (!userOneId || !userTwoId) {
      throw new Error("User not found");
    }

    // check if room already exists
    const existingRoom = await this.room.findRoomById(roomId);
    if (existingRoom) {
      throw new Error("Room already exists");
    }

    const roomData = {
      conversationId: roomId,
      userOne: userOneId.userId,
      userTwo: userTwoId.userId,
    };

    return await this.room.createRoom(roomData);
  }
}

export default CreateRoomService;
