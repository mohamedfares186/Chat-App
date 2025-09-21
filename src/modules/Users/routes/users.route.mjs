import { Router } from "express";
import getUserController from "../controllers/users.getUser.controller.mjs";
import getAllUsersController from "../controllers/users.getAllUsers.controller.mjs";
import deleteUserController from "../controllers/users.deleteUser.controller.mjs";
import createUserController from "../controllers/users.createUser.controller.mjs";

const router = Router();

router.get("/find-user", getUserController);
router.get("/all-users", getAllUsersController);
router.delete("/delete-user", deleteUserController);
router.post("/create-user", createUserController);

export default router;
