import Router from "express";
import passport from "passport";

import registerController from "../controllers/registerController.mjs";
import loginController from "../controllers/loginController.mjs";
import logoutController from "../controllers/logoutController.mjs";
import refreshController from "../controllers/refreshController.mjs";
import emailVerifyController from "../controllers/emailVerifyController.mjs";
import generateVerificationToken from "../controllers/emailTokenController.mjs";
import forgetPasswordController from "../controllers/forgetPasswordController.mjs";
import resetPasswordController from "../controllers/resetPasswordController.mjs";
import googleLoginController from "../controllers/googleLoginController.mjs";
import facebookLoginController from "../controllers/facebookLoginController.mjs";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/refresh", refreshController);
router.post("/verify-email/:token", emailVerifyController);
router.post("/verify-email", generateVerificationToken);
router.post("/forget-password", forgetPasswordController);
router.post("/reset-password", resetPasswordController);

// OAuth Routes
// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleLoginController
);

// Facebook OAuth
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  facebookLoginController
);

export default router;
