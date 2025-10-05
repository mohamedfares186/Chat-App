import { Router } from "express";

import createRoomController from "../controllers/private.create.controller.mjs";

const router = Router();

router.post("/create-room", createRoomController);

export default router;
