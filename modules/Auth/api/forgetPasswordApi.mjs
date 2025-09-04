import Router from "express";
import forgetPasswordController from "../controllers/forgetPasswordController.mjs";

const router = Router();

router.post("/forget-password", forgetPasswordController);

export default router;
