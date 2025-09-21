import { Router } from "express";
import getUserController from "../controllers/users.getUser.controller.mjs";
import getAllUsersController from "../controllers/users.getAllUsers.controller.mjs";

const router = Router();

router.get("/find-user", getUserController);
router.get("/all-users", getAllUsersController);

export default router;
