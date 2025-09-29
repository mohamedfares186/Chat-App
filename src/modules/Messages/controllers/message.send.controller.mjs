import MessageService from "../services/message.send.service.mjs";
import { logger } from "../../../middleware/logger.mjs";

const messageService = new MessageService();

const sendMessageController = async (req, res) => {
  try {
    const messageData = req.body;
    const result = await messageService.sendMessage(messageData);
    res.status(200).json(result);
  } catch (error) {
    logger.error("Error in sendMessageController: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default sendMessageController;
