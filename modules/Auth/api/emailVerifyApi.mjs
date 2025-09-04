import Router from "express";
import emailVerifyController from "../controllers/emailVerifyController.mjs";
import generateVerificationToken from "../controllers/emailTokenController.mjs";
import authenticate from "../../../middleware/authenticate.mjs";
import { validateCsrfToken } from "../../../middleware/csrf.mjs";

const router = Router();

router.post(
  "/verify-email",
  authenticate,
  validateCsrfToken,
  generateVerificationToken
);

router.post("/verify-email/:token", authenticate, emailVerifyController);

export default router;
