import Router from "express";
import loginController from "../controllers/loginController.mjs";

const router = Router();

router.post("/login", loginController);

export default router;