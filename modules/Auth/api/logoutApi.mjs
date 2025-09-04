import Router from "express";
import logoutController from "../controllers/logoutController.mjs";
import authenticate from "../../../middleware/authenticate.mjs";

const router = Router();

router.post("/logout", authenticate, logoutController);

export default router;
