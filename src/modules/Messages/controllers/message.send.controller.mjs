import MessageService from "../services/message.send.service.mjs";
import { logger } from "../../../middleware/logger.mjs";

const messageService = new MessageService();

const sendMessageController = async (req, res) => {
  try {
    const { senderId, receiverId, conversationId, content } = req.body;

    if (!senderId || !content) {
      return res
        .status(400)
        .json({ error: "senderId and content are required" });
    }

    const sender = req.user.userId;
    if (sender !== senderId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const messageData = {
      senderId,
      receiverId,
      conversationId,
      conversationType: receiverId ? "private" : "group",
      content,
    };

    const result = await messageService.sendMessage(messageData);
    res.status(200).json(result);
  } catch (error) {
    logger.error("Error in sendMessageController: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default sendMessageController;
