import Router from "express";
import resetPasswordController from "../controllers/resetPasswordController.mjs";

const router = Router();

router.post("/reset-password/:token", resetPasswordController);

export default router;
