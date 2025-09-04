import Router from "express";
import refreshController from "../controllers/refreshController.mjs";

const router = Router();

router.post("/refresh", refreshController);

export default router;
