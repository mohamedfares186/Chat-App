import { Router } from "express";
import createGroupController from "../controllers/group.create.controller.mjs";
import addGroupController from "../controllers/group.add.controller.mjs";

const router = Router();

router.post("/create-group", createGroupController);
router.post("/add-member", addGroupController);

export default router;
