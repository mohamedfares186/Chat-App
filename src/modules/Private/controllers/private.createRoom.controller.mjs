import CreateRoomService from "../services/private.createRoom.service.mjs";
import { logger } from "../../../middleware/logger.mjs";

const room = new CreateRoomService();

const createRoomController = async (req, res) => {
  const { userOne, userTwo } = req.body;

  try {
    const newRoom = await room.createRoom(userOne, userTwo);
    return res
      .status(201)
      .json({ message: "Room has been created successfully", data: newRoom });
  } catch (error) {
    logger.error("Error creating room: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default createRoomController;
