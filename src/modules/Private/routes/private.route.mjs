import { Router } from "express";

import createRoomController from "../controllers/private.createRoom.controller.mjs";

const router = Router();

router.post("/create-room", createRoomController);

export default router;