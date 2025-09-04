import Router from "express";
import registerController from "../controllers/registerController.mjs";

const router = Router();

router.post("/register", registerController);

export default router;
